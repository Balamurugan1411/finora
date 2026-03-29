import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFinancialData } from '@/lib/financial-context';
import { ArrowRight, Wallet, TrendingUp, CreditCard, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Recommendation {
  title: string;
  explanation: string;
  reason: string;
  icon: typeof Wallet;
  priority: 'high' | 'medium' | 'low';
}

const RecommendationCards = () => {
  const { data } = useFinancialData();

  const recommendations = useMemo((): Recommendation[] => {
    const { monthlyIncome: inc, monthlyExpenses: exp, currentSavings: sav } = data;
    if (inc <= 0) return [];
    const recs: Recommendation[] = [];
    const savingsRate = (inc - exp) / inc;
    const emergencyMonths = exp > 0 ? sav / exp : Infinity;

    if (savingsRate < 0.2) {
      recs.push({
        title: 'Increase Your Savings Rate',
        explanation: `You're saving ${(savingsRate * 100).toFixed(0)}%. Aim for 20%+ by cutting ₹${Math.round((0.2 * inc - (inc - exp))).toLocaleString('en-IN')} in expenses.`,
        reason: 'A 20% savings rate is the foundation of financial independence.',
        icon: Wallet,
        priority: 'high',
      });
    }

    if (emergencyMonths < 6) {
      recs.push({
        title: 'Build Emergency Fund',
        explanation: `You have ${emergencyMonths.toFixed(1)} months of runway. Target ₹${(exp * 6).toLocaleString('en-IN')} (6 months).`,
        reason: 'Emergency funds protect against unexpected job loss or medical expenses.',
        icon: CreditCard,
        priority: 'high',
      });
    }

    if (inc - exp > 5000) {
      const sipAmount = Math.round((inc - exp) * 0.5);
      recs.push({
        title: 'Start a Monthly SIP',
        explanation: `Invest ₹${sipAmount.toLocaleString('en-IN')}/month in index funds. At 12% CAGR, this grows to ₹${(sipAmount * ((Math.pow(1.01, 120) - 1) / 0.01)).toLocaleString('en-IN', { maximumFractionDigits: 0 })} in 10 years.`,
        reason: 'Systematic investing harnesses compound interest for long-term wealth.',
        icon: TrendingUp,
        priority: 'medium',
      });
    }

    if (exp / inc > 0.7) {
      recs.push({
        title: 'Reduce Discretionary Spending',
        explanation: `Expenses are ${((exp / inc) * 100).toFixed(0)}% of income. Review subscriptions, dining out, and impulse purchases.`,
        reason: 'High spending ratios leave no buffer for savings or unexpected costs.',
        icon: Lightbulb,
        priority: 'high',
      });
    }

    if (data.totalLoans && data.totalLoans > 0) {
      const emiRatio = data.monthlyEMI ? (data.monthlyEMI / inc * 100).toFixed(1) : '0';
      recs.push({
        title: 'Aggressive Debt Repayment',
        explanation: `Your debt-to-income ratio is ${emiRatio}%. Use the ${Number(emiRatio) > 20 ? 'Avalanche' : 'Snowball'} method to clear ₹${data.totalLoans.toLocaleString('en-IN')} O/S.`,
        reason: 'High-interest debt destroys wealth. Prioritize clearing loans before luxury spends.',
        icon: CreditCard,
        priority: 'high',
      });
    }

    if (!data.npsContribution || data.npsContribution < 4166) {
      recs.push({
        title: 'Optimize Section 80CCD(1B)',
        explanation: `Increase NPS contribution to ₹4,166/mo (₹50k/yr) to save an additional ₹15k+ in tax under the Old Regime.`,
        reason: 'NPS Section 80CCD(1B) provides extra deduction beyond the 1.5L limit of 80C.',
        icon: TrendingUp,
        priority: 'medium',
      });
    }

    if (recs.length === 0) {
      recs.push({
        title: "You're Doing Great!",
        explanation: 'Your financial health is strong. Consider diversifying investments or setting stretch goals.',
        reason: 'Consistent good habits compound into exceptional results.',
        icon: TrendingUp,
        priority: 'low',
      });
    }

    return recs;
  }, [data]);

  if (recommendations.length === 0) return null;

  const priorityColor = (p: string) =>
    p === 'high' ? 'border-destructive/30 bg-destructive/5' : p === 'medium' ? 'border-warning/30 bg-warning/5' : 'border-accent/30 bg-accent/5';

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold gradient-text">AI Recommendations</h3>
      <div className="grid gap-3">
        {recommendations.map((rec, i) => (
          <motion.div
            key={rec.title}
            className={`glass-panel p-5 border ${priorityColor(rec.priority)}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-secondary">
                <rec.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{rec.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{rec.explanation}</p>
                <details className="mt-2">
                  <summary className="text-xs text-primary cursor-pointer hover:underline">Why this suggestion?</summary>
                  <p className="text-xs text-muted-foreground mt-1 pl-2 border-l-2 border-primary/30">{rec.reason}</p>
                </details>
              </div>
              <Button variant="ghost" size="sm" className="text-primary shrink-0">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground/60 text-center">⚠️ Not financial advice. Consult a certified financial planner.</p>
    </div>
  );
};

export default RecommendationCards;
