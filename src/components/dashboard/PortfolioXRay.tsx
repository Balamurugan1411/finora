import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useFinancialData } from '@/lib/financial-context';
import { SimulatorEngine } from '@/lib/simulator-engine';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldCheck, TrendingDown, Layers, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];

export const PortfolioXRay = () => {
  const { data } = useFinancialData();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Mock data for initial view or after upload
  const mockAssets = [
    { type: 'Equity', name: 'Nifty 50 Index', value: 300000, expenseRatio: 0.001 },
    { type: 'Equity', name: 'Midcap Fund', value: 150000, expenseRatio: 0.005 },
    { type: 'Debt', name: 'Liquid Fund', value: 100000, expenseRatio: 0.002 },
    { type: 'Gold', name: 'SGB', value: 50000, expenseRatio: 0 },
  ];

  const analysis = useMemo(() => {
    return SimulatorEngine.analyzePortfolio(mockAssets);
  }, []);

  const handleUpload = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
      toast.success("CAS Statement Analyzed! Found 4 funds.");
    }, 2500);
  };

  const chartData = useMemo(() => {
    if (!analysis) return [];
    return Object.entries(analysis.allocation).map(([name, value]) => ({ name, value }));
  }, [analysis]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-8 bg-slate-900/60 space-y-8 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
         <ShieldCheck className="w-12 h-12 text-primary" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Neural Portfolio X-Ray</h3>
        </div>
        <div className="px-3 py-1 rounded-full bg-slate-950/60 border border-white/5 text-[9px] text-slate-500 font-black uppercase tracking-widest">
           Logic Node V4.2
        </div>
      </div>

      {!showResults ? (
        <div 
          onClick={handleUpload}
          className="relative border-2 border-dashed border-white/5 rounded-[2rem] p-12 text-center hover:bg-white/[0.02] hover:border-primary/40 transition-all cursor-pointer group/upload overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover/upload:opacity-100 transition-opacity" />
          <div className="relative z-10 flex flex-col items-center">
             <div className="w-20 h-20 bg-slate-950/60 border border-white/5 rounded-3xl flex items-center justify-center mb-6 group-hover/upload:scale-110 group-hover/upload:border-primary/40 transition-all shadow-2xl">
               <FileUp className="w-10 h-10 text-primary/60 group-hover/upload:text-primary transition-colors" />
             </div>
             <p className="text-lg font-black text-white uppercase tracking-widest leading-none mb-3">
               Ingest CAS Statement
             </p>
             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">CAMS / KFintech PDF Protocol Supported</p>
             <Button disabled={isAnalyzing} className="mt-8 px-10 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20">
               {isAnalyzing ? "Computing Neural Map..." : "Initialize Analysis"}
             </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-2 gap-6">
            <div className="premium-card p-6 bg-slate-950/40 border-white/5 group/stat">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 group-hover/stat:text-white transition-colors">Portfolio Overlap</p>
              <p className="text-3xl font-black text-amber-500 tracking-tighter font-mono group-hover/stat:scale-105 transition-transform origin-left">{analysis?.overlap.toFixed(1)}%</p>
              <p className="text-[9px] text-slate-600 font-black uppercase tracking-tight mt-2 opacity-60">Neural Drag Indicator</p>
            </div>
            <div className="premium-card p-6 bg-slate-950/40 border-white/5 group/stat">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 group-hover/stat:text-white transition-colors">Expense Alpha Drag</p>
              <p className="text-3xl font-black text-rose-500 tracking-tighter font-mono group-hover/stat:scale-105 transition-transform origin-left">{analysis?.expenseDrag.toFixed(2)}%</p>
              <p className="text-[9px] text-slate-600 font-black uppercase tracking-tight mt-2 opacity-60">Net Wealth Leakage</p>
            </div>
          </div>

          <div className="h-[250px] w-full relative group/chart">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="text-center group-hover/chart:scale-110 transition-transform">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Total Assets</p>
                  <p className="text-xl font-black text-white uppercase tracking-tighter font-mono">₹6.00L</p>
               </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={80}
                  outerRadius={105}
                  paddingAngle={8}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))' }} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '1.2rem',
                    backdropFilter: 'blur(12px)',
                    padding: '1rem',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ color: 'white', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase' }}
                  labelStyle={{ display: 'none' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
             <div className="premium-card p-5 bg-primary/5 border-primary/20 flex items-center gap-5 group/advice">
                <div className="p-3 rounded-xl bg-primary/10 transition-all group-hover/advice:scale-110">
                   <TrendingDown className="w-5 h-5 text-primary" />
                </div>
                <p className="text-[11px] font-bold text-slate-200 leading-relaxed uppercase tracking-tight">
                  Neural Scan detects <span className="text-primary font-black">3 Regular Funds</span>. Transition to Direct Node to save <span className="text-primary font-black underline underline-offset-4 decoration-primary/40">₹1.2L</span> over T+10Y.
                </p>
             </div>
             <div className="premium-card p-5 bg-amber-500/5 border-amber-500/20 flex items-center gap-5 group/advice">
                <div className="p-3 rounded-xl bg-amber-500/10 transition-all group-hover/advice:scale-110">
                   <Layers className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-[11px] font-bold text-slate-200 leading-relaxed uppercase tracking-tight">
                  High Overlap in <span className="text-amber-500 font-black">Midcap Cluster</span>. Replace with Nifty-B Index to reduce structural overlap by <span className="text-amber-500 font-black">12.4%</span>.
                </p>
             </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-12 border-white/5 bg-slate-900/60 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary/20 hover:text-white hover:border-primary/40 transition-all rounded-xl" 
            onClick={() => setShowResults(false)}
          >
            Compute New Trajectory
          </Button>
        </div>
      )}
    </motion.div>
  );
};
