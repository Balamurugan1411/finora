import { useState, useEffect } from 'react';
import { useFinancialData } from '@/lib/financial-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Wallet, TrendingDown, PiggyBank, Target, Landmark, IndianRupee } from 'lucide-react';

const FinancialInputForm = () => {
  const { data, updateData } = useFinancialData();
  const [form, setForm] = useState({
    monthlyIncome: data.monthlyIncome || '',
    monthlyExpenses: data.monthlyExpenses || '',
    currentSavings: data.currentSavings || '',
    financialGoals: data.financialGoals || '',
    npsContribution: data.npsContribution || '',
    epfContribution: data.epfContribution || '',
    totalLoans: data.totalLoans || '',
    monthlyEMI: data.monthlyEMI || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm({
      monthlyIncome: data.monthlyIncome || '',
      monthlyExpenses: data.monthlyExpenses || '',
      currentSavings: data.currentSavings || '',
      financialGoals: data.financialGoals || '',
      npsContribution: data.npsContribution || '',
      epfContribution: data.epfContribution || '',
      totalLoans: data.totalLoans || '',
      monthlyEMI: data.monthlyEMI || '',
    });
  }, [data]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.monthlyIncome || Number(form.monthlyIncome) <= 0) e.monthlyIncome = 'Enter a valid income';
    if (!form.monthlyExpenses || Number(form.monthlyExpenses) < 0) e.monthlyExpenses = 'Enter valid expenses';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    updateData({
      monthlyIncome: Number(form.monthlyIncome),
      monthlyExpenses: Number(form.monthlyExpenses),
      currentSavings: Number(form.currentSavings),
      financialGoals: String(form.financialGoals),
      npsContribution: Number(form.npsContribution),
      epfContribution: Number(form.epfContribution),
      totalLoans: Number(form.totalLoans),
      monthlyEMI: Number(form.monthlyEMI),
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="glass-panel p-8 space-y-8 bg-white/5 border border-white/10 rounded-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
           <Wallet className="w-5 h-5 text-primary" />
        </div>
        <div>
           <h3 className="text-xl font-bold text-white tracking-tight">Your Financial Profile</h3>
           <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Reality Check</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
           <div>
              <label className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                 <IndianRupee className="w-3 h-3 text-primary" /> Monthly Income (Inflow)
              </label>
              <Input
                type="number"
                placeholder="₹ 80,000"
                value={form.monthlyIncome}
                onChange={e => setForm(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                className="h-12 bg-white/5 border-white/10 focus:border-primary text-white text-lg font-bold rounded-2xl"
              />
              {errors.monthlyIncome && <p className="text-[10px] text-destructive mt-1 font-bold">{errors.monthlyIncome}</p>}
           </div>

           <div>
              <label className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                 <TrendingDown className="w-3 h-3 text-destructive" /> Monthly Expenses (Outflow)
              </label>
              <Input
                type="number"
                placeholder="₹ 45,000"
                value={form.monthlyExpenses}
                onChange={e => setForm(prev => ({ ...prev, monthlyExpenses: e.target.value }))}
                className="h-12 bg-white/5 border-white/10 focus:border-primary text-white text-lg font-bold rounded-2xl"
              />
           </div>

           <div>
              <label className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                 <PiggyBank className="w-3 h-3 text-accent" /> Current Savings (Liquidity)
              </label>
              <Input
                type="number"
                placeholder="₹ 5,00,000"
                value={form.currentSavings}
                onChange={e => setForm(prev => ({ ...prev, currentSavings: e.target.value }))}
                className="h-12 bg-white/5 border-white/10 focus:border-primary text-white text-lg font-bold rounded-2xl"
              />
           </div>
        </div>

        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 mb-4">
             <Landmark className="w-3 h-3 text-primary" />
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Institutional Context</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white uppercase tracking-tight ml-1">NPS Contrib.</label>
              <Input
                type="number" value={form.npsContribution} onChange={e => setForm(prev => ({ ...prev, npsContribution: e.target.value }))}
                className="h-10 bg-white/5 border-white/10 text-white text-sm rounded-xl" placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white uppercase tracking-tight ml-1">EPF Monthly</label>
              <Input
                type="number" value={form.epfContribution} onChange={e => setForm(prev => ({ ...prev, epfContribution: e.target.value }))}
                className="h-10 bg-white/5 border-white/10 text-white text-sm rounded-xl" placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white uppercase tracking-tight ml-1">Total Loans</label>
              <Input
                type="number" value={form.totalLoans} onChange={e => setForm(prev => ({ ...prev, totalLoans: e.target.value }))}
                className="h-10 bg-white/5 border-white/10 text-white text-sm rounded-xl" placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white uppercase tracking-tight ml-1">EMI Totals</label>
              <Input
                type="number" value={form.monthlyEMI} onChange={e => setForm(prev => ({ ...prev, monthlyEMI: e.target.value }))}
                className="h-10 bg-white/5 border-white/10 text-white text-sm rounded-xl" placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-white mb-2 flex items-center gap-2">
            <Target className="w-3 h-3 text-primary" /> Primary Wealth Goal
          </label>
          <Textarea
            placeholder="Buy a house in Mumbai, Retire by 45, Sovereign Wealth..."
            value={form.financialGoals}
            onChange={e => setForm(prev => ({ ...prev, financialGoals: e.target.value }))}
            className="bg-white/5 border-white/10 focus:border-primary min-h-[80px] text-white rounded-2xl"
          />
        </div>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black h-14 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
        PROCESS INTELLIGENCE
      </Button>
    </motion.form>
  );
};

export default FinancialInputForm;
