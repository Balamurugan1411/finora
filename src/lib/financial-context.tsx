import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './auth-context';
import { toast } from 'sonner';

export interface PortfolioAsset {
  type: 'Equity' | 'Debt' | 'Gold' | 'Real Estate';
  name: string;
  value: number;
  expenseRatio?: number;
  annualReturn?: number;
}

export interface LifeEvent {
  id: string;
  year: number;
  name: string;
  cost: number;
  isRecurring?: boolean;
}

export interface FinancialData {
  monthlyIncome: number;
  monthlyExpenses: number;
  currentSavings: number;
  financialGoals: string;
  npsContribution?: number;
  epfContribution?: number;
  totalLoans?: number;
  monthlyEMI?: number;
  // New Fields for AI Money Mentor
  partnerIncome?: number;
  partnerExpenses?: number;
  isJointAccount?: boolean;
  hasInsurance?: boolean;
  hasEmergencyFund?: boolean;
  portfolio: PortfolioAsset[];
  lifeEvents: LifeEvent[];
  retirementAge: number;
  taxRegime: 'Old' | 'New';
}

interface FinancialContextType {
  data: FinancialData;
  updateData: (data: Partial<FinancialData>) => void;
  hasData: boolean;
  saving: boolean;
}

const defaultData: FinancialData = {
  monthlyIncome: 0,
  monthlyExpenses: 0,
  currentSavings: 0,
  financialGoals: '',
  npsContribution: 0,
  epfContribution: 0,
  totalLoans: 0,
  monthlyEMI: 0,
  partnerIncome: 0,
  partnerExpenses: 0,
  isJointAccount: false,
  hasInsurance: false,
  hasEmergencyFund: false,
  portfolio: [],
  lifeEvents: [],
  retirementAge: 60,
  taxRegime: 'New',
};

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<FinancialData>(defaultData);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  // Load from DB or LocalStorage
  useEffect(() => {
    if (!user) {
      setData(defaultData);
      return;
    }

    if (user.id.startsWith('guest-')) {
      const stored = localStorage.getItem(`finora_data_${user.id}`);
      if (stored) setData({ ...defaultData, ...JSON.parse(stored) });
      return;
    }

    const load = async () => {
      const { data: row } = await supabase
        .from('financial_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle() as any;

      if (row) {
        setData({
          ...defaultData,
          monthlyIncome: Number(row.monthly_income),
          monthlyExpenses: Number(row.monthly_expenses),
          currentSavings: Number(row.current_savings),
          financialGoals: row.financial_goals || '',
          npsContribution: Number(row.nps_contribution || 0),
          epfContribution: Number(row.epf_contribution || 0),
          totalLoans: Number(row.total_loans || 0),
          monthlyEMI: Number(row.monthly_emi || 0),
          // Fallbacks for existing DB rows missing new columns
          taxRegime: (row.tax_regime as 'Old' | 'New') || 'New',
          retirementAge: Number(row.retirement_age || 60),
        });
      }
    };
    load();
  }, [user]);

  const updateData = useCallback(async (partial: Partial<FinancialData>) => {
    const next = { ...data, ...partial };
    setData(next);

    if (!user) return;

    if (user.id.startsWith('guest-')) {
      localStorage.setItem(`finora_data_${user.id}`, JSON.stringify(next));
      toast.success('Local session updated!');
      return;
    }

    setSaving(true);
    const payload = {
      user_id: user.id,
      monthly_income: next.monthlyIncome,
      monthly_expenses: next.monthlyExpenses,
      current_savings: next.currentSavings,
      financial_goals: next.financialGoals,
      nps_contribution: next.npsContribution,
      epf_contribution: next.epfContribution,
      total_loans: next.totalLoans,
      monthly_emi: next.monthlyEMI,
    };

    const { error } = await supabase
      .from('financial_data')
      .upsert(payload, { onConflict: 'user_id' });

    setSaving(false);
    if (error) {
      toast.error('Failed to save data. Ensure DB schema is updated.');
      console.error(error);
    } else {
      toast.success('Cloud sync complete!');
    }
  }, [data, user]);

  const hasData = data.monthlyIncome > 0;

  return (
    <FinancialContext.Provider value={{ data, updateData, hasData, saving }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancialData = () => {
  const ctx = useContext(FinancialContext);
  if (!ctx) throw new Error('useFinancialData must be used within FinancialProvider');
  return ctx;
};
