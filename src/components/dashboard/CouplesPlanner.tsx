import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useFinancialData } from '@/lib/financial-context';
import { User, Users, Heart, Calculator, Zap, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const CouplesPlanner = () => {
  const { data, updateData } = useFinancialData();
  const [partnerIncome, setPartnerIncome] = useState(data.partnerIncome || 0);
  const [partnerExpenses, setPartnerExpenses] = useState(data.partnerExpenses || 0);

  const optimization = useMemo(() => {
    const totalIncome = data.monthlyIncome + partnerIncome;
    const totalExpenses = data.monthlyExpenses + partnerExpenses;
    const jointSavings = totalIncome - totalExpenses;
    
    // Joint Optimization logic (SIMULATED)
    // Rule 1: Who should claim HRA? Maximize at the higher bracket
    const higherIncome = data.monthlyIncome > partnerIncome ? 'Self' : 'Partner';
    const hraWinner = higherIncome;

    // Rule 2: NPS Matching
    const npsMatching = (partnerIncome * 0.1) > 50000 ? 50000 : (partnerIncome * 0.1);

    return { 
      totalIncome, 
      jointSavings, 
      hraWinner, 
      npsMatching,
      taxReduction:hraWinner === 'Self' ? 24000 : 36000
    };
  }, [data.monthlyIncome, data.monthlyExpenses, partnerIncome, partnerExpenses]);

  const handleUpdate = () => {
    updateData({ 
        partnerIncome, 
        partnerExpenses,
        isJointAccount: true 
    });
    toast.success("Joint Financial Data Synced!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-10 bg-[#141416] border-white/5 space-y-8 relative overflow-hidden group shadow-2xl"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
         <Heart className="w-16 h-16 text-primary" />
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-lg">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-1">Joint Wealth Optimizer</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Neural Coupling V2.4</p>
          </div>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] text-primary font-black uppercase tracking-widest">
           Sovereign Sync
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 relative z-10">
        <div className="space-y-4">
           <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 px-1">
              <User className="w-3.5 h-3.5 text-primary" /> Self Vector
           </div>
           <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md group/val transition-all hover:bg-white/[0.05]">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1 group-hover/val:text-slate-300 transition-colors">Current Liquidity</p>
              <p className="font-mono text-xl font-black text-white tracking-tighter">₹{data.monthlyIncome.toLocaleString('en-IN')}</p>
           </div>
        </div>
        <div className="space-y-4">
           <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 px-1">
              <Users className="w-3.5 h-3.5 text-accent" /> Partner Node
           </div>
           <div className="relative group/input">
              <Input 
                type="number" 
                value={partnerIncome}
                onChange={(e) => setPartnerIncome(Number(e.target.value))}
                className="h-16 font-mono text-xl font-black bg-white/[0.03] border-white/5 focus:border-primary/40 rounded-2xl pl-6 transition-all shadow-inner placeholder:text-slate-700"
                placeholder="0"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600 uppercase tracking-widest group-focus-within/input:text-primary transition-colors">INR/MO</div>
           </div>
        </div>
      </div>

      <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary/10 via-primary/5 to-accent/5 border border-white/5 relative group/advice overflow-hidden transition-all hover:border-primary/20">
         <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
         
         <div className="flex items-center justify-between mb-8 relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Combined Inventory Surplus</p>
            <p className="text-3xl font-black text-white tracking-tighter font-mono">₹{optimization.totalIncome.toLocaleString('en-IN')}</p>
         </div>
         
         <div className="space-y-6 relative z-10">
            <div className="flex gap-4 items-start p-4 rounded-2xl bg-black/40 border border-white/5 hover:bg-black/60 transition-colors group/item">
               <div className="p-3 rounded-xl bg-primary/10 shrink-0 group-hover/item:scale-110 transition-transform">
                  <Zap className="w-5 h-5 text-primary" />
               </div>
               <div>
                  <p className="text-[11px] font-black text-white uppercase tracking-widest mb-1.5">HRA Gradient Alpha</p>
                  <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">Maximize benefit by anchoring HRA under <span className="text-primary font-black underline underline-offset-4 decoration-primary/30">{optimization.hraWinner.toUpperCase()}</span> vector.</p>
               </div>
            </div>
            <div className="flex gap-4 items-start p-4 rounded-2xl bg-black/40 border border-white/5 hover:bg-black/60 transition-colors group/item">
               <div className="p-3 rounded-xl bg-accent/10 shrink-0 group-hover/item:scale-110 transition-transform">
                  <Calculator className="w-5 h-5 text-accent" />
               </div>
               <div>
                  <p className="text-[11px] font-black text-white uppercase tracking-widest mb-1.5">Neural NPS Synthesis</p>
                  <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">Claim additional <span className="text-accent font-black underline underline-offset-4 decoration-accent/30">₹{optimization.npsMatching.toLocaleString('en-IN')}</span> deduction for partner node.</p>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex items-center justify-between group/total overflow-hidden relative">
         <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-emerald-500/5 to-transparent skew-x-12 translate-x-12" />
         <div className="flex items-center gap-3 relative z-10">
            <div className="p-2 rounded-lg bg-emerald-500/10">
               <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">Predicted Joint Alpha Leakage Repair</p>
         </div>
         <p className="text-2xl font-black text-emerald-500 font-mono tracking-tighter relative z-10 group-hover/total:scale-110 transition-transform">₹{optimization.taxReduction.toLocaleString('en-IN')}</p>
      </div>

      <Button className="w-full h-14 rounded-2xl bg-white text-black hover:bg-slate-100 font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 group/btn overflow-hidden relative" onClick={handleUpdate}>
         <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
         <span className="relative z-10">Initialize Joint Sync</span>
      </Button>
    </motion.div>
  );
};
