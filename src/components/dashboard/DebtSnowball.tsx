import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFinancialData } from '@/lib/financial-context';
import { CreditCard, ArrowBigRightDash, Flame, ShieldAlert } from 'lucide-react';

const DebtSnowball = () => {
  const { data } = useFinancialData();
  
  const debtStats = useMemo(() => {
    if (!data.totalLoans || data.totalLoans <= 0) return null;
    
    const monthlySurplus = data.monthlyIncome - data.monthlyExpenses;
    const payoffMonths = monthlySurplus > 0 ? Math.ceil(data.totalLoans / monthlySurplus) : Infinity;
    const strategy = (data.monthlyEMI || 0) / data.monthlyIncome > 0.3 ? 'Avalanche (Focus on HIGH Ratio)' : 'Snowball (Focus on Small Wins)';

    return { payoffMonths, strategy, monthlySurplus };
  }, [data]);

  if (!debtStats) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="premium-card p-8 bg-[#141416] border-rose-500/10 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
         <Flame className="w-16 h-16 text-rose-500" />
      </div>

      <div className="flex items-center gap-4 mb-10 relative z-10">
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 shadow-lg shadow-rose-500/10">
          <ShieldAlert className="w-6 h-6 text-rose-500" />
        </div>
        <div>
           <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-1">Debt Liquidation Hub</h3>
           <p className="text-[10px] text-rose-500/60 font-black uppercase tracking-widest leading-none">Status: Critical Surplus Identified</p>
        </div>
      </div>

      <div className="space-y-8 relative z-10">
        <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group/strat">
          <div>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2 group-hover/strat:text-slate-400">Tactical Strategy</p>
            <p className="text-sm font-black text-primary tracking-widest uppercase">{debtStats.strategy}</p>
          </div>
          <div className="p-3 rounded-xl bg-primary/5 text-primary/40 group-hover/strat:text-primary transition-colors">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10 hover:border-orange-500/30 transition-all group/val">
            <p className="text-[9px] text-orange-500/70 font-black uppercase tracking-widest mb-3">Temporal Closure</p>
            <p className="text-3xl font-black text-white font-mono tracking-tighter group-hover/val:scale-110 transition-transform origin-left">
              {debtStats.payoffMonths === Infinity ? 'N/A' : `${debtStats.payoffMonths}`} <span className="text-[10px]">MO</span>
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all group/val">
            <p className="text-[9px] text-primary/70 font-black uppercase tracking-widest mb-3">Surplus Injection</p>
            <p className="text-3xl font-black text-white font-mono tracking-tighter group-hover/val:scale-110 transition-transform origin-left">₹{Math.max(0, debtStats.monthlySurplus / 1000).toFixed(1)}k<span className="text-[10px]">/MO</span></p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-5 rounded-2xl bg-black/40 border border-white/5 group/advice">
          <div className="p-2 rounded-lg bg-rose-500/10 shrink-0 mt-0.5">
             <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
            By channeling <span className="text-white font-black underline underline-offset-4 decoration-rose-500/30">₹{Math.max(0, debtStats.monthlySurplus).toLocaleString('en-IN')}</span> of neural surplus into liquidation, 
            zero-debt state achieved by <span className="text-rose-500 font-black">{new Date(Date.now() + (debtStats.payoffMonths * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }).toUpperCase()}</span>.
          </p>
        </div>
        
        <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Structural Liability Intensity</span>
               <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{debtStats.payoffMonths < 12 ? 'CRITICAL' : 'MODERATE'}</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: debtStats.payoffMonths < 12 ? '80%' : '30%' }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                />
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DebtSnowball;
