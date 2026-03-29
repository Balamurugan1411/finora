import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid } from 'recharts';
import { SimulatorEngine } from '@/lib/simulator-engine';
import { useFinancialData } from '@/lib/financial-context';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, Calculator, Clock, Sparkles, ShieldCheck, Target } from 'lucide-react';

const Simulation = () => {
  const { data, updateData } = useFinancialData();
  const [sipAmount, setSipAmount] = useState(data.monthlyIncome > 0 ? Math.round((data.monthlyIncome - data.monthlyExpenses) * 0.5) : 10000);
  const [years, setYears] = useState(20);
  const [returnRate, setReturnRate] = useState(12);

  const principal = data.currentSavings || 0;

  const roadmap = useMemo(() => {
    return SimulatorEngine.generateRoadmap(principal, Math.max(sipAmount, 0), returnRate / 100, years, data.lifeEvents || []);
  }, [principal, sipAmount, returnRate, years, data.lifeEvents]);

  const finalWealth = roadmap[roadmap.length - 1]?.wealth || 0;
  const totalInvested = principal + (sipAmount * 12 * years);
  const wealthGain = finalWealth - totalInvested;

  const fireTarget = data.monthlyExpenses > 0 ? data.monthlyExpenses * 12 * 25 : 30000000;
  const fireYear = roadmap.find(p => p.wealth >= fireTarget)?.year;

  const formatCurrency = (v: number) => {
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
    if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`;
    return `₹${v.toLocaleString('en-IN')}`;
  };

  return (
    <div className="p-8 lg:p-12 max-w-[1800px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-20 h-20 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/10 shadow-2xl">
              <Calculator className="w-10 h-10 text-primary animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest">Projection Engine</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">Node: {Math.random().toString(16).slice(2, 8).toUpperCase()}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white uppercase">Wealth <span className="gradient-text">Simulator</span></h1>
            <p className="text-sm font-medium text-slate-400 mt-2">Neural trajectory computation for sovereign wealth goals.</p>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-6">
           <div className="hidden xl:flex flex-col items-end gap-1">
              <p className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">Computation Precision</p>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                 <span className="text-xs font-bold text-white uppercase tracking-tight">Real-Time Sync</span>
              </div>
           </div>
           <div className="h-10 w-[1px] bg-white/10 mx-2 hidden md:block" />
           <div className="premium-card px-8 py-4 bg-slate-900/40 border border-white/10 flex items-center gap-4">
             <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Compute Load</p>
                <span className="text-xs font-black text-white uppercase tracking-widest">Optimized Pulse</span>
             </div>
           </div>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Monthly SIP Allocation', val: sipAmount, set: setSipAmount, min: 1000, max: 200000, step: 1000, unit: '₹' },
          { label: 'Temporal Horizon', val: years, set: setYears, min: 1, max: 40, step: 1, unit: 'Years' },
          { label: 'Assumed Return Velocity', val: returnRate, set: setReturnRate, min: 1, max: 30, step: 0.5, unit: '%' }
        ].map((ctrl, i) => (
          <motion.div key={i} className="premium-card p-8 bg-slate-900/40 group hover:border-primary/20 transition-all duration-500" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{ctrl.label}</p>
              <div className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-black text-primary font-mono group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                {ctrl.unit === '₹' ? `₹${ctrl.val.toLocaleString()}` : `${ctrl.val}${ctrl.unit === '%' ? '%' : 'Y'}`}
              </div>
            </div>
            <Input
              type="number"
              value={ctrl.val}
              onChange={e => ctrl.set(Number(e.target.value))}
              className="bg-slate-950/50 border-white/5 font-black text-2xl h-16 rounded-2xl mb-6 focus:border-primary/40 focus:ring-primary/20 transition-all font-mono"
            />
            <Slider
              value={[ctrl.val]}
              onValueChange={v => ctrl.set(v[0])}
              min={ctrl.min}
              max={ctrl.max}
              step={ctrl.step}
              className="mt-2"
            />
          </motion.div>
        ))}
      </div>

      {/* Primary Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Analytics Main Column */}
        <div className="lg:col-span-8 space-y-12">
          {/* Main Stat Hub */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Final Corpus', value: formatCurrency(finalWealth), col: 'text-primary', icon: TrendingUp },
              { label: 'Capital Outflow', value: formatCurrency(totalInvested), col: 'text-slate-400', icon: Calculator },
              { label: 'Net Alpha', value: formatCurrency(wealthGain), col: 'text-accent', icon: Sparkles },
              { label: 'FIRE Window', value: fireYear ? `${fireYear} Years` : '40+ Years', col: fireYear ? 'text-accent' : 'text-rose-500', icon: Clock },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="premium-card p-6 bg-slate-900/60 transition-all duration-500 group overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                   <stat.icon className={`w-8 h-8 ${stat.col}`} />
                </div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
                <p className={`text-2xl font-black ${stat.col} tracking-tighter font-mono group-hover:scale-[1.05] transition-transform origin-left`}>{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Chart Core */}
          <motion.div className="premium-card p-10 bg-slate-900/60 group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Compound Trajectory</h3>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mt-1 tracking-tighter">Inflation Adjusted Simulation Mode</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-primary" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase">Wealth Cluster</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-slate-700" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase">Linear Baseline</span>
                  </div>
               </div>
            </div>
            
            <div className="h-[450px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={roadmap}>
                  <defs>
                    <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0.6} />
                      <stop offset="50%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0} />
                    </linearGradient>
                    <filter id="shadow" height="200%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="12" result="blur" />
                      <feOffset in="blur" dx="0" dy="15" result="offsetBlur" />
                      <feFlood floodColor="hsl(190, 100%, 50%)" floodOpacity="0.5" result="offsetFlood" />
                      <feComposite in="offsetFlood" in2="offsetBlur" operator="in" result="offsetBlur" />
                      <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis 
                    dataKey="year" 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={11} 
                    tickFormatter={v => `Y${v}`} 
                    axisLine={false}
                    tickLine={false}
                    dy={15}
                    fontFamily="monospace"
                    fontWeight="bold"
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={11} 
                    tickFormatter={v => formatCurrency(v)} 
                    axisLine={false}
                    tickLine={false}
                    width={100}
                    fontFamily="monospace"
                    fontWeight="bold"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(2, 6, 23, 0.95)',
                      border: '2px solid rgba(0, 188, 212, 0.2)',
                      borderRadius: '2rem',
                      backdropFilter: 'blur(20px)',
                      padding: '2rem',
                      boxShadow: '0 30px 60px -12px rgba(0,0,0,0.8)'
                    }}
                    cursor={{ stroke: '#00BCD4', strokeWidth: 2, strokeDasharray: '4 4' }}
                    itemStyle={{ fontSize: '14px', fontWeight: '900' }}
                    labelStyle={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '900', marginBottom: '12px', letterSpacing: '0.2em' }}
                    formatter={(value: number, name: string, props: any) => [
                      <span className="text-white text-2xl font-black tracking-tighter drop-shadow-md">{formatCurrency(value)}</span>, 
                      props.payload.event ? <span className="text-cyan-400 uppercase text-[10px] font-black tracking-[0.2em]">{props.payload.event}</span> : <span className="text-primary uppercase text-[10px] font-black tracking-[0.2em]">Neural Projection</span>
                    ]}
                    labelFormatter={v => `Temporal Horizon Point ${v}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="wealth" 
                    stroke="#00BCD4" 
                    fill="url(#wealthGrad)" 
                    strokeWidth={6} 
                    filter="url(#shadow)"
                    animationDuration={2500}
                    dot={(props: any) => {
                      if (props.payload.event) {
                        return (
                          <g key={props.index}>
                            <circle cx={props.cx} cy={props.cy} r={10} fill="#00BCD4" className="animate-ping opacity-50" />
                            <circle cx={props.cx} cy={props.cy} r={7} fill="white" stroke="#00BCD4" strokeWidth={4} />
                          </g>
                        );
                      }
                      return <></>;
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Action/Scenario Column */}
        <div className="lg:col-span-4 space-y-8">
           <div className="premium-card p-10 bg-slate-900/60 space-y-8 h-full flex flex-col group">
              <div className="shrink-0">
                <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                      <Sparkles className="w-5 h-5 text-primary" />
                   </div>
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Event Simulation Hub</h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Inject major life events into your fiscal timeline to observe trajectory shifts.</p>
              </div>
              
              <div className="flex-grow space-y-4 overflow-y-auto scrollbar-thin pr-2">
                 {[
                   { name: 'Marriage', year: 5, cost: 1500000, icon: '婚' },
                   { name: 'Buy Luxury Car', year: 3, cost: 1200000, icon: '车' },
                   { name: 'Global Expedition', year: 10, cost: 1000000, icon: '旅' },
                   { name: 'Investment Exit', year: 15, cost: -5000000, icon: '出' }
                 ].map((event, i) => {
                   const isActive = data.lifeEvents?.some(e => e.name === event.name);
                   return (
                     <motion.button
                       key={event.name}
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: 0.7 + i * 0.1 }}
                       onClick={() => {
                          const existing = data.lifeEvents || [];
                          const next = isActive 
                            ? existing.filter(e => e.name !== event.name)
                            : [...existing, { ...event, id: Math.random().toString() }];
                          updateData({ lifeEvents: next });
                       }}
                       className={`w-full p-6 rounded-2xl border-2 transition-all group/event relative flex items-center justify-between overflow-hidden ${
                         isActive ? 'bg-primary border-primary shadow-primary/20' : 'bg-slate-950/40 border-white/5 hover:border-white/20'
                       }`}
                     >
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                        )}
                        <div className="text-left relative z-10">
                           <p className={`text-sm font-black tracking-tight ${isActive ? 'text-white' : 'text-slate-200 group-hover/event:text-white'}`}>{event.name.toUpperCase()}</p>
                           <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isActive ? 'text-white/70' : 'text-slate-500'}`}>T+{event.year} YEARS • {formatCurrency(Math.abs(event.cost))}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all relative z-10 ${
                          isActive ? 'bg-white shadow-xl shadow-black/20 text-primary scale-110' : 'bg-slate-800 border border-white/10 text-slate-500 group-hover/event:border-primary/50 group-hover/event:text-primary'
                        }`}>
                           {isActive ? <ShieldCheck className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                        </div>
                     </motion.button>
                   );
                 })}
              </div>
              
              <div className="shrink-0 p-6 rounded-2xl bg-slate-950/60 border border-white/5">
                 <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-accent" />
                    <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Alpha Strategy</p>
                 </div>
                 <div className="grid grid-cols-3 gap-2">
                    {[8, 12, 15].map(rate => (
                      <button 
                        key={rate} 
                        onClick={() => setReturnRate(rate)}
                        className={`py-3 rounded-lg border text-xs font-black transition-all ${
                           returnRate === rate ? 'bg-primary border-primary text-white shadow-lg' : 'bg-slate-900 border-white/5 text-slate-500 hover:text-white hover:border-white/20'
                        }`}
                      >
                         {rate}%
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="p-10 premium-card bg-slate-900/60">
         <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
               <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20">
                  <Target className="w-8 h-8 text-accent animate-float" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Sovereign Wealth Status</h3>
                  <p className="text-sm font-medium text-slate-400 mt-1">Computation indicates you are {fireYear ? `${fireYear} years` : 'currently not on track'} from total fiscal autonomy.</p>
               </div>
            </div>
            <button className="px-10 py-5 bg-accent text-slate-950 font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_30px_rgba(var(--accent),0.3)] hover:scale-105 transition-all text-xs">
               Initialize Recovery Plan
            </button>
         </div>
      </div>

      <p className="text-[10px] text-slate-600 font-bold text-center uppercase tracking-widest opacity-40">Projections are neural estimates • Protocol: STOCHASTIC-TRAJECTORY-V4</p>
    </div>
  );
};

export default Simulation;
