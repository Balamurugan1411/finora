import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFinancialData } from '@/lib/financial-context';
import { useSettings } from '@/lib/settings-context';
import { TrendingUp, TrendingDown, Shield, AlertTriangle, Info } from 'lucide-react';
import { SimulatorEngine } from '@/lib/simulator-engine';

const InsightCards = () => {
  const { data } = useFinancialData();
  const { mode } = useSettings();

  const insights = useMemo(() => {
    const { monthlyIncome: inc, monthlyExpenses: exp, currentSavings: sav } = data;
    if (inc <= 0) return [];

    const savingsRate = ((inc - exp) / inc * 100).toFixed(1);
    const risk = SimulatorEngine.getRiskLevel(inc, exp, sav);
    const emergencyMonths = exp > 0 ? (sav / exp).toFixed(1) : '∞';
    const surplus = inc - exp;
    const annualTax = SimulatorEngine.processTaxNewRegime(inc * 12);

    const items = [
      {
        icon: TrendingUp,
        title: 'Savings Rate',
        value: `${savingsRate}%`,
        desc: Number(savingsRate) >= 20 ? 'Great! You\'re saving well.' : 'Try to save at least 20% of income.',
        advancedDesc: `${savingsRate}% of gross income. Benchmark: 20-30% for wealth building. At this rate, you save ₹${(surplus * 12).toLocaleString('en-IN')}/year.`,
        color: Number(savingsRate) >= 20 ? 'text-accent' : 'text-warning',
      },
      {
        icon: risk === 'High' ? AlertTriangle : Shield,
        title: 'Risk Level',
        value: risk,
        desc: risk === 'Low' ? 'Your finances are stable.' : risk === 'Medium' ? 'Room for improvement.' : 'High spending relative to income.',
        advancedDesc: `Expense ratio: ${((exp / inc) * 100).toFixed(1)}%. Runway: ${emergencyMonths} months. ${risk === 'Low' ? 'Well within safe limits.' : 'Reduce expense ratio below 60% for safety.'}`,
        color: risk === 'Low' ? 'text-accent' : risk === 'Medium' ? 'text-warning' : 'text-destructive',
      },
      {
        icon: Shield,
        title: 'Emergency Fund',
        value: `${emergencyMonths} mo`,
        desc: Number(emergencyMonths) >= 6 ? 'Solid safety net!' : 'Aim for 6 months of expenses.',
        advancedDesc: `₹${sav.toLocaleString('en-IN')} covers ${emergencyMonths} months. Target: ₹${(exp * 6).toLocaleString('en-IN')} (6 months). ${Number(emergencyMonths) >= 6 ? 'Consider investing excess.' : `Need ₹${(exp * 6 - sav).toLocaleString('en-IN')} more.`}`,
        color: Number(emergencyMonths) >= 6 ? 'text-accent' : 'text-warning',
      },
      {
        icon: TrendingDown,
        title: 'Monthly Surplus',
        value: `₹${surplus.toLocaleString('en-IN')}`,
        desc: surplus > 0 ? 'Investable surplus available.' : 'You\'re spending more than earning!',
        advancedDesc: surplus > 0
          ? `₹${surplus.toLocaleString('en-IN')}/mo investable. At 12% CAGR, 10yr SIP → ₹${Math.round(surplus * 0.5 * ((Math.pow(1.01, 120) - 1) / 0.01)).toLocaleString('en-IN')}. Est. annual tax: ₹${annualTax.toLocaleString('en-IN')}.`
          : 'Negative cash flow — review expenses urgently.',
        color: surplus > 0 ? 'text-primary' : 'text-destructive',
      },
    ];
    return items;
  }, [data]);

  if (insights.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {insights.map((item, i) => (
        <motion.div
          key={item.title}
          className="glass-panel-hover p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg bg-secondary ${item.color}`}>
              <item.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{item.title}</p>
              <p className={`stat-value text-xl ${item.color}`}>{item.value}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {mode === 'advanced' ? item.advancedDesc : item.desc}
              </p>
              {mode === 'advanced' && (
                <div className="flex items-center gap-1 mt-1.5">
                  <Info className="w-3 h-3 text-primary/50" />
                  <span className="text-[10px] text-primary/50">Advanced view</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default InsightCards;
