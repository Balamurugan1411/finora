import { useFinancialData } from '@/lib/financial-context';
import { useAuth } from '@/lib/auth-context';
import { useSettings } from '@/lib/settings-context';
import { SimulatorEngine } from '@/lib/simulator-engine';
import HealthScoreRing from '@/components/dashboard/HealthScoreRing';
import FinancialInputForm from '@/components/dashboard/FinancialInputForm';
import InsightCards from '@/components/dashboard/InsightCards';
import RecommendationCards from '@/components/dashboard/RecommendationCards';
import PortfolioChart from '@/components/dashboard/PortfolioChart';
import TaxWizard from '@/components/dashboard/TaxWizard';
import DebtSnowball from '@/components/dashboard/DebtSnowball';
import { MoneyHealthScore } from '@/components/dashboard/MoneyHealthScore';
import { PortfolioXRay } from '@/components/dashboard/PortfolioXRay';
import { CouplesPlanner } from '@/components/dashboard/CouplesPlanner';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Zap, TrendingUp, Sparkles, Target, IndianRupee, HeartPulse, Search, Bell, Layers, Info } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
   const { data, hasData } = useFinancialData();
   const { user } = useAuth();
   const { mode } = useSettings();
   const [showWizard, setShowWizard] = useState(!hasData);
   const [searchQuery, setSearchQuery] = useState('');
   const navigate = useNavigate();

   const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
         navigate(`/chat?q=${encodeURIComponent(searchQuery.trim())}`);
      }
   };

   const healthData = useMemo(() => {
      return hasData ? SimulatorEngine.calculate6DHealthScore(data) : { composite: 0, dimensions: {} };
   }, [data, hasData]);

   const score = healthData.composite || 0;

   const formatCurrency = (val: number) =>
      new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

   const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Rahul Sharma';

   // Dynamic bar chart data based on current net worth trend
   const barChartData = [
      { month: 'Jan', value: data.currentSavings * 0.7 },
      { month: 'Feb', value: data.currentSavings * 0.75 },
      { month: 'Mar', value: data.currentSavings * 0.8 },
      { month: 'Apr', value: data.currentSavings * 0.82 },
      { month: 'May', value: data.currentSavings * 0.88 },
      { month: 'Jun', value: data.currentSavings * 0.92 },
      { month: 'Jul', value: data.currentSavings * 0.95 },
      { month: 'Aug', value: data.currentSavings * 0.98 },
      { month: 'Sep', value: data.currentSavings },
   ];

   const maxVal = Math.max(...barChartData.map(d => d.value), 1);

   if (showWizard && !hasData) {
      return (
         <div className="min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-start lg:justify-center p-8 bg-background overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-16">
               <div className="inline-flex p-6 rounded-[2.5rem] bg-primary/10 border border-primary/20 mb-8 shadow-2xl shadow-primary/20">
                  <Sparkles className="w-12 h-12 text-primary" />
               </div>
               <h1 className="text-6xl font-black text-foreground tracking-tighter mb-6">Initialize Your <span className="text-primary italic">Financial Identity</span></h1>
               <p className="text-muted-foreground text-xl max-w-xl mx-auto leading-relaxed font-medium">Finora's Neural Agent will compute your Money Health Score using 6-dimension structural analysis.</p>
            </motion.div>
            <div className="w-full max-w-lg">
               <MoneyHealthScore onComplete={() => setShowWizard(false)} />
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
         {/* Top Header */}
         <header className="h-20 border-b border-border px-8 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-3xl z-30">
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative group">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
               <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask Finora anything about your wealth..."
                  className="w-full h-12 bg-secondary/50 rounded-2xl pl-14 pr-6 text-sm font-bold text-foreground border border-border focus:border-primary/40 focus:bg-secondary outline-none transition-all placeholder:text-muted-foreground/60 shadow-inner"
               />
            </form>

            <div className="flex items-center gap-8">
               <div className="hidden md:flex flex-col items-end gap-1 px-4 border-r border-border">
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">Neural Engine v4.2</span>
                  </div>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Status: Synchronized</p>
               </div>

               <button className="relative p-2.5 hover:bg-secondary rounded-2xl transition-all group border border-transparent hover:border-border">
                  <Bell className="w-6 h-6 text-muted-foreground group-hover:text-foreground" />
                  <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-background" />
               </button>

               <div className="flex items-center gap-4 pl-4">
                  <div className="text-right">
                     <p className="text-sm font-black text-foreground leading-none mb-1">{userName.toUpperCase()}</p>
                     <div className="flex items-center gap-1.5 justify-end">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">{mode === 'advanced' ? 'Advanced Mode' : 'Beginner Mode'}</p>
                     </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent p-[1px] shadow-2xl shadow-primary/10 scale-95 hover:scale-100 transition-transform cursor-pointer">
                     <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center border border-border">
                        <span className="text-foreground font-black text-sm">{userName[0].toUpperCase()}</span>
                     </div>
                  </div>
               </div>
            </div>
         </header>

         <main className="p-10 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 max-w-[1920px] mx-auto">
            {/* Advanced Intelligence Layer: Full Portfolio X-Ray */}
            {mode === 'advanced' && (
               <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full"
               >
                  <PortfolioChart />
               </motion.div>
            )}

            {/* Primary Row: Net Worth & Secondary Analytics */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

               {/* Main Net Worth Visualizer */}
               <div className="xl:col-span-8 premium-card p-12 bg-card border-border group relative overflow-hidden">
                  <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                  <div className="flex items-start justify-between relative z-10 mb-12">
                     <div>
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] mb-3">Total Asset Inventory</p>
                        <div className="flex items-end gap-5">
                           <h2 className="text-6xl font-black text-foreground tracking-tighter leading-none">{formatCurrency(data.currentSavings)}</h2>
                           <div className="flex items-center gap-2 text-emerald-500 font-black text-base pb-1">
                              <TrendingUp className="w-5 h-5" />
                              <span>+12.4%</span>
                           </div>
                        </div>
                     </div>
                     <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-xl shadow-emerald-500/5 transition-transform group-hover:rotate-12">
                        <ShieldCheck className="w-8 h-8 text-emerald-500" />
                     </div>
                  </div>

                  {/* Neural Trend Bars */}
                  <div className="h-64 flex items-end justify-between gap-5 px-2 relative z-10">
                     {barChartData.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-5 group/bar h-full justify-end">
                           <motion.div
                              className={`w-full rounded-2xl transition-all duration-500 relative cursor-pointer ${i === barChartData.length - 1 ? 'bg-gradient-to-t from-primary/80 to-primary shadow-[0_0_30px_rgba(var(--primary),0.4)]' : 'bg-muted-foreground/10 hover:bg-muted-foreground/20'}`}
                              initial={{ height: 0 }}
                              animate={{ height: `${(d.value / maxVal) * 100}%` }}
                              transition={{ duration: 1, delay: i * 0.08, ease: "circOut" }}
                           >
                              <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all scale-75 group-hover/bar:scale-100 whitespace-nowrap bg-secondary border border-border px-3 py-1.5 rounded-xl text-[11px] font-black text-foreground shadow-2xl pointer-events-none">
                                 ₹{(d.value / 100000).toFixed(1)}L
                              </div>
                              {i === barChartData.length - 1 && (
                                 <div className="absolute inset-0 bg-white/20 animate-pulse rounded-2xl" />
                              )}
                           </motion.div>
                           <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{d.month}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Sidebar Cards: Cashflow & AI Advisor */}
               <div className="xl:col-span-4 flex flex-col gap-10">
                  {/* Dynamic Cashflow Node */}
                  <div className="premium-card p-10 bg-card border-border grow group overflow-hidden relative">
                     <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                     <div className="flex items-center justify-between mb-10 relative z-10">
                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em]">Monthly Liquidity</h3>
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                           <Activity className="w-5 h-5" />
                        </div>
                     </div>
                     <div className="mb-10 relative z-10">
                        <h2 className="text-5xl font-black text-foreground tracking-tighter mb-4">
                           +{formatCurrency(data.monthlyIncome - data.monthlyExpenses)}
                        </h2>
                        <div className="flex items-center justify-between gap-4">
                           <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                              <motion.div
                                 className="h-full bg-emerald-500"
                                 initial={{ width: 0 }}
                                 animate={{ width: `${(data.monthlyExpenses / data.monthlyIncome) * 100}%` }}
                                 transition={{ duration: 1.5, ease: "circOut" }}
                              />
                           </div>
                           <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{Math.round((data.monthlyExpenses / data.monthlyIncome) * 100)}% BURN</span>
                        </div>
                     </div>
                     <div className="space-y-6 relative z-10">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors">
                           <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Inflow</span>
                           </div>
                           <span className="text-sm font-black text-emerald-500 font-mono tracking-tight">{formatCurrency(data.monthlyIncome)}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors">
                           <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-rose-500" />
                              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Outflow</span>
                           </div>
                           <span className="text-sm font-black text-rose-500 font-mono tracking-tight">{formatCurrency(data.monthlyExpenses)}</span>
                        </div>
                     </div>
                  </div>

                  {/* Neural Advisory Node */}
                  <div className="premium-card p-10 bg-gradient-to-br from-emerald-500/10 to-primary/10 border-emerald-500/20 group relative overflow-hidden cursor-help">
                     <div className="absolute top-0 right-0 p-3 opacity-20">
                        <Sparkles className="w-8 h-8 text-emerald-400" />
                     </div>
                     <div className="flex gap-6 items-start">
                        <div className="w-14 h-14 rounded-2xl bg-background/40 flex items-center justify-center text-emerald-500 shadow-2xl shrink-0 group-hover:scale-110 transition-transform">
                           <IndianRupee className="w-7 h-7" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2">Neural Scan Summary</p>
                           <p className="text-xs font-bold text-foreground leading-relaxed tracking-tight group-hover:text-emerald-50 opacity-90 transition-colors">
                              Trajectory scan complete. You are conserving <span className="text-emerald-500 font-black decoration-emerald-500/40 underline underline-offset-4">₹{(data.monthlyIncome - data.monthlyExpenses) * 12 / 100000}L</span> annually. Neural optimization suggests ELSS reallocation to boost yield by 3.8%.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Secondary Row: Vital Signs & Strategic Planning */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
               {/* Composite Health Index */}
               <div className="xl:col-span-5 premium-card p-12 bg-card border-border flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-xs font-black text-foreground uppercase tracking-[0.4em] mb-16">Composite Health Index</h3>
                  <div className="relative mb-12">
                     <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full animate-pulse" />
                     <HealthScoreRing score={score} size={280} />
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-2">
                        <span className="text-8xl font-black text-foreground tracking-tighter drop-shadow-[0_10px_30px_rgba(255,255,255,0.2)]">{Math.round(score)}</span>
                        <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.6em] ml-1">VITALITY</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 w-full max-w-sm mt-8">
                     {Object.entries(healthData.dimensions).slice(0, 3).map(([dim, val]) => (
                        <div key={dim} className="text-center group/dim">
                           <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 group-hover/dim:text-primary transition-colors">{dim}</p>
                           <div className="text-lg font-black text-foreground font-mono">{Math.round(val as number)}</div>
                        </div>
                     ))}
                  </div>
                  <p className="mt-12 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-60">Neural wellness scan across 6 vectors</p>
               </div>

               {/* Strategic Simulation Engine */}
               <div className="xl:col-span-7 premium-card p-12 bg-card border-border group relative overflow-hidden">
                  <div className="flex items-center justify-between mb-12">
                     <div>
                        <h3 className="text-xs font-black text-foreground uppercase tracking-[0.3em] mb-2">Predictive simulation</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-0.5">Wealth Trajectory: Sovereign Independence</p>
                     </div>
                     <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5 transition-transform group-hover:scale-110">
                        <Zap className="w-6 h-6 text-primary" />
                     </div>
                  </div>

                  <div className="h-72 mt-12 relative flex items-end px-4">
                     <div className="absolute inset-0 border-l border-b border-border p-6 flex flex-col justify-between items-start opacity-20 pointer-events-none font-mono">
                        <p className="text-[9px] font-black text-muted-foreground tracking-tighter">SURPLUS (₹L)</p>
                        <p className="text-[9px] font-black text-muted-foreground/60">120.0</p>
                        <p className="text-[9px] font-black text-muted-foreground/60">80.0</p>
                        <p className="text-[9px] font-black text-muted-foreground/60">40.0</p>
                        <p className="text-[9px] font-black text-muted-foreground/60">0.0</p>
                     </div>

                     <svg className="w-full h-full relative z-10 px-8 py-4 drop-shadow-[0_0_20px_rgba(var(--primary),0.3)]" viewBox="0 0 400 200">
                        <defs>
                           <linearGradient id="lineGrad" x1="0" y1="1" x2="1" y2="0">
                              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                              <stop offset="50%" stopColor="#2563EB" stopOpacity="0.6" />
                              <stop offset="100%" stopColor="#10B981" />
                           </linearGradient>
                           <filter id="glow">
                              <feGaussianBlur stdDeviation="3" result="blur" />
                              <feComposite in="SourceGraphic" in2="blur" operator="over" />
                           </filter>
                        </defs>
                        <motion.path
                           initial={{ pathLength: 0 }}
                           animate={{ pathLength: 1 }}
                           transition={{ duration: 2, ease: "easeInOut" }}
                           d="M0,180 L40,175 L80,182 L120,150 L160,140 L200,120 L240,110 L280,70 L320,40 L360,10"
                           fill="none"
                           stroke="url(#lineGrad)"
                           strokeWidth="5"
                           strokeLinecap="round"
                           filter="url(#glow)"
                        />
                        <motion.circle
                           initial={{ opacity: 0, scale: 0 }}
                           animate={{ opacity: 1, scale: 1 }}
                           transition={{ delay: 1.8 }}
                           cx="360" cy="10" r="8" fill="#10B981" className="animate-pulse"
                        />
                        <circle cx="360" cy="10" r="16" fill="#10B981" fillOpacity="0.1" />
                     </svg>

                     <div className="absolute right-4 top-24 premium-card p-5 bg-background/60 border-primary/20 backdrop-blur-xl scale-[0.85] group-hover:scale-95 transition-transform shadow-2xl z-20">
                        <div className="flex items-center gap-3 mb-2">
                           <Target className="w-4 h-4 text-primary" />
                           <span className="text-[10px] font-black text-foreground uppercase tracking-widest">FIRE Target Vector</span>
                        </div>
                        <p className="text-xl font-black text-emerald-500 font-mono tracking-tighter">Age 48.4</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter mt-1">Confidence Interval: 94.2%</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Dynamic Tertiary Grid: Operational Tools */}
            <div className="space-y-12">
               <div className="flex items-center gap-8 px-4">
                  <div className="h-[1px] flex-grow bg-border/40" />
                  <div className="flex items-center gap-4">
                     <Layers className="w-5 h-5 text-muted-foreground/40" />
                     <span className="text-xs font-black text-muted-foreground/40 uppercase tracking-[0.5em] whitespace-nowrap">Operational Command Cluster</span>
                  </div>
                  <div className="h-[1px] flex-grow bg-border/40" />
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-4 space-y-10">
                     <FinancialInputForm />
                     <PortfolioXRay />
                  </div>
                  <div className="lg:col-span-8 space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <RecommendationCards />
                        <TaxWizard />
                     </div>

                     {/* Advanced Mode Intelligence Layers */}
                     {mode === 'advanced' && (
                        <motion.div
                           initial={{ opacity: 0, y: 30 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="grid grid-cols-1 md:grid-cols-2 gap-10"
                        >
                           <DebtSnowball />
                           <CouplesPlanner />
                        </motion.div>
                     )}

                     <InsightCards />
                  </div>
               </div>
            </div>
         </main>

         {/* Decorative Overlay */}
         <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] select-none">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
         </div>
      </div>
   );
};

export default Dashboard;
