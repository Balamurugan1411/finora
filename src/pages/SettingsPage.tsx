import { ModeToggle } from '@/components/layout/ModeToggle';
import { motion } from 'framer-motion';
import { Settings, Shield, Bell, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SettingsPage = () => {
  return (
    <div className="p-10 max-w-4xl mx-auto space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-5xl font-black text-foreground tracking-tighter mb-4">
          Personal <span className="text-primary italic">Node Config</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
          Configure your financial intelligence layout and system preferences.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="premium-card p-10 bg-slate-900/60 border-border group overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
             <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all group-hover:scale-110">
                <Settings className="w-6 h-6" />
             </div>
             <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Interface Mode</h3>
          </div>
          <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-6">Select between streamlined or comprehensive layout</p>
          <ModeToggle />
        </section>

        <section className="premium-card p-10 bg-slate-900/60 border-border group overflow-hidden opacity-50 cursor-not-allowed">
           <div className="flex items-center gap-4 mb-8">
             <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 transition-all">
                <Shield className="w-6 h-6" />
             </div>
             <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Security Protocol</h3>
          </div>
          <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-6 italic">2FA and Hardware Key support coming soon</p>
          <Button variant="outline" disabled className="w-full rounded-xl border-white/5 bg-slate-950/40 text-[10px] uppercase font-black tracking-widest">
            Configure Guardrails
          </Button>
        </section>

        <section className="premium-card p-10 bg-slate-900/60 border-border group overflow-hidden opacity-50 cursor-not-allowed">
           <div className="flex items-center gap-4 mb-8">
             <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 transition-all">
                <Bell className="w-6 h-6" />
             </div>
             <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Neural Alerts</h3>
          </div>
          <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-6 italic">Smart notifications for wealth leakage</p>
          <Button variant="outline" disabled className="w-full rounded-xl border-white/5 bg-slate-950/40 text-[10px] uppercase font-black tracking-widest">
            Manage Streams
          </Button>
        </section>

        <section className="premium-card p-10 bg-slate-900/60 border-border group overflow-hidden">
           <div className="flex items-center gap-4 mb-8">
             <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 transition-all group-hover:scale-110">
                <Database className="w-6 h-6" />
             </div>
             <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Session Reset</h3>
          </div>
          <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-6">Clear all local financial data caches</p>
          <Button 
            variant="destructive" 
            className="w-full rounded-xl h-12 text-[10px] uppercase font-black tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
            onClick={() => {
               localStorage.clear();
               window.location.reload();
            }}
          >
            Purge Data Store
          </Button>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
