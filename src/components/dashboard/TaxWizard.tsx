import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useFinancialData } from '@/lib/financial-context';
import { SimulatorEngine } from '@/lib/simulator-engine';
import { Calculator, Info, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const TaxWizard = () => {
  const { data } = useFinancialData();
  const [deductions, setDeductions] = useState(150000); // Default 80C
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileUpload = () => {
    setIsUploading(true);
    // Simulate AI Parsing of Form 16
    setTimeout(() => {
      setDeductions(225000); // Found 80C (1.5L) + 80D (50k) + NPS (25k)
      setIsUploading(false);
      toast.success("Form 16 parsed! Found ₹2,25,000 in deductions.");
    }, 2000);
  };

  const taxComparison = useMemo(() => {
    const annualIncome = data.monthlyIncome * 12;
    if (annualIncome <= 0) return null;

    const newTax = SimulatorEngine.processTaxNewRegime(annualIncome);
    const oldTax = SimulatorEngine.processTaxOldRegime(annualIncome, deductions);
    const savings = Math.abs(newTax - oldTax);
    const winner = newTax < oldTax ? 'New' : 'Old';

    return { newTax, oldTax, savings, winner, annualIncome };
  }, [data.monthlyIncome, deductions]);

  if (!taxComparison) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-10 bg-slate-900/60 space-y-8 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
         <Calculator className="w-12 h-12 text-primary" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Tax Optimizer Node</h3>
        </div>
        <div className="px-3 py-1 rounded-full bg-slate-950/60 border border-white/5 text-[9px] text-slate-500 font-black uppercase tracking-widest">
           Logic Hub Beta
        </div>
      </div>

      {/* Upload Zone */}
      <div 
        onClick={handleFileUpload}
        className="relative border-2 border-dashed border-white/5 rounded-[2rem] p-10 text-center hover:bg-white/[0.02] hover:border-primary/40 transition-all cursor-pointer group/upload overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover/upload:opacity-100 transition-opacity" />
        <div className="relative z-10">
           <div className="w-14 h-14 bg-slate-950/60 border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover/upload:scale-110 group-hover/upload:border-primary/40 transition-all">
             <Info className="w-6 h-6 text-primary" />
           </div>
           <p className="text-sm font-black text-white uppercase tracking-widest leading-none mb-2">
             {isUploading ? "Neural Engine Parsing..." : "Ingest Form 16 PDF"}
           </p>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Automatic ID of 80C, 80D, and HRA blocks</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="premium-card p-6 bg-slate-950/40 border-white/5 group/stat">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 group-hover/stat:text-white transition-colors">New Regime (FY25)</p>
          <p className="text-2xl font-black text-white tracking-tighter font-mono group-hover/stat:scale-105 transition-transform origin-left">₹{taxComparison.newTax.toLocaleString('en-IN')}</p>
        </div>
        <div className="premium-card p-6 bg-slate-950/40 border-white/5 group/stat">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 group-hover/stat:text-white transition-colors">Old Regime (EST)</p>
          <p className="text-2xl font-black text-white tracking-tighter font-mono group-hover/stat:scale-105 transition-transform origin-left">₹{taxComparison.oldTax.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="premium-card p-8 bg-accent/5 border-accent/20 flex items-center gap-6 group/impact">
        <div className="p-4 rounded-2xl bg-accent/20 transition-all group-hover/impact:scale-110">
          <Zap className="w-8 h-8 text-accent animate-pulse" />
        </div>
        <div>
          <p className="text-xs font-black text-accent uppercase tracking-[0.2em] mb-1">
            Core Recommendation
          </p>
          <h4 className="text-xl font-black text-white uppercase tracking-tighter">
             {taxComparison.winner === 'New' ? 'Switch to New Regime' : 'Stick to Old Regime'}
          </h4>
          <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-tight">
            Potential Alpha: <span className="text-accent">₹{taxComparison.savings.toLocaleString('en-IN')} / Year</span>
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between px-1">
          <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2">
            <Info className="w-3 h-3 text-primary" /> Total Deduction Overrides (Old Regime Only)
          </label>
        </div>
        <div className="flex gap-4">
          <Input 
            type="number" 
            value={deductions}
            onChange={(e) => setDeductions(Number(e.target.value))}
            className="h-14 bg-slate-950/60 border-white/5 text-white font-black text-lg px-6 rounded-2xl placeholder:text-slate-700 focus:border-primary/40 transition-all font-mono"
            placeholder="e.g. 150000"
          />
          <Button 
            variant="outline" 
            onClick={() => setDeductions(150000)} 
            className="h-14 px-8 border-white/5 bg-slate-900/60 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all rounded-2xl"
          >
            Reset 80C
          </Button>
        </div>
      </div>

      <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.1em] text-center opacity-40">
        Estimates based on neural income slabs • Dynamic Tax Logic Node V4.2
      </div>
    </motion.div>
  );
};

export default TaxWizard;
