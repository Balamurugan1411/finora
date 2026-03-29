import { useMemo } from 'react';
import { useFinancialData } from '@/lib/financial-context';
import { SimulatorEngine } from '@/lib/simulator-engine';
import HealthScoreRing from '@/components/dashboard/HealthScoreRing';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Activity, HeartPulse } from 'lucide-react';

const HealthScorePage = () => {
  const { data, hasData } = useFinancialData();
  
  const healthData = useMemo(() => {
    return hasData ? SimulatorEngine.calculate6DHealthScore(data) : { composite: 0, dimensions: {} };
  }, [data, hasData]);

  const score = healthData.composite;

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl font-black text-foreground tracking-tighter mb-4">
          Composite <span className="text-primary italic">Health Index</span>
        </h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium leading-relaxed">
          Your financial vitality scanned across 6 neural vectors.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 premium-card p-12 bg-card border-border flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full animate-pulse" />
            <HealthScoreRing score={score} size={320} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-2">
              <span className="text-9xl font-black text-foreground tracking-tighter drop-shadow-2xl">{Math.round(score)}</span>
              <span className="text-sm font-black text-muted-foreground uppercase tracking-[0.6em] ml-1">VITALITY</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(healthData.dimensions).map(([dim, val]) => (
              <motion.div 
                key={dim}
                whileHover={{ scale: 1.02 }}
                className="premium-card p-8 bg-secondary/30 border-border group/dim"
              >
                <div className="flex justify-between items-start mb-4">
                   <p className="text-xs font-black text-muted-foreground uppercase tracking-widest group-hover/dim:text-primary transition-colors">{dim}</p>
                   <div className="text-2xl font-black text-foreground font-mono">{Math.round(val as number)}</div>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${val}%` }}
                     className="h-full bg-primary"
                   />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="premium-card p-8 bg-primary/5 border-primary/20 flex gap-6 items-start">
             <div className="p-4 rounded-2xl bg-primary/10 text-primary shrink-0">
                <ShieldCheck className="w-8 h-8" />
             </div>
             <div>
                <h4 className="text-lg font-black text-white uppercase tracking-tighter mb-2">Neural Recommendation</h4>
                <p className="text-sm text-slate-400 font-bold leading-relaxed uppercase tracking-tight">
                  Your Liquidity vector matches the target profile, but structural debt is leaking alpha. Optimization required in the <span className="text-primary font-black underline decoration-primary/40 underline-offset-4">DEBT CLUSTER</span>.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthScorePage;
