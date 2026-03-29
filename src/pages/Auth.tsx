import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Chrome, ArrowRight, ShieldCheck, Sparkles, TrendingUp, Target, Loader2 } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { toast } from 'sonner';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signInAsGuest } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: fullName } },
        });
        if (error) throw error;
        toast.success('Check your email for confirmation!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Welcome back!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) {
        if (error.message.includes('OAuth secret')) {
          toast.error('Configuration Required: Please add Google OAuth Secrets in your Supabase Dashboard.');
        } else {
          toast.error(error.message);
        }
      }
    } catch (err: any) {
      toast.error('Provider Connection Failed');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#020617] relative overflow-y-auto overflow-x-hidden selection:bg-primary/30 pb-20">
      {/* Premium Background Layer */}
      <div className="bg-noise opacity-[0.05]" />
      <div className="absolute inset-0 bg-grid-white pointer-events-none opacity-[0.03]" />
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Left Side: Branding & Value Prop */}
      <div className="hidden lg:flex flex-col justify-center px-12 xl:px-20 w-1/2 relative z-10">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <div className="flex items-center gap-4 mb-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative w-20 h-20 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/10 shadow-2xl">
                <Logo size="lg" />
              </div>
            </div>
            <div>
               <h1 className="text-4xl font-black tracking-[0.2em] text-white">FINORA</h1>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Sovereign Wealth Protocol</p>
            </div>
          </div>
          
          <h2 className="text-6xl xl:text-7xl font-black text-white leading-[1.05] mb-8 tracking-tighter">
            Eliminate <br />
            <span className="gradient-text italic pb-2 block underline decoration-primary/20 underline-offset-8">Financial Friction.</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-lg mb-16 leading-relaxed font-medium">
            The AI Money Mentor designed for the Indian market. Track health, optimize taxes, and build sovereign wealth autonomously with neural precision.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-xl">
            {[
              { icon: Sparkles, text: "Neural Score Hub", sub: "6D analysis of your net worth" },
              { icon: ShieldCheck, text: "SEBI Compliance", sub: "Safety first financial logic" },
              { icon: TrendingUp, text: "Live AI Mentor", sub: "Instant financial intelligence" },
              { icon: Target, text: "FIRE Roadmap", sub: "Interactive wealth projection" }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 + 0.4 }}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-colors"
              >
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10 group-hover:border-primary/40 transition-colors">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-white font-black text-xs uppercase tracking-widest mb-1">{item.text}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "circOut" }}
          className="w-full max-w-[420px] p-2"
        >
          <div className="mb-8 text-center">
            <h3 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase">
              {isSignUp ? 'Initialize Terminal' : 'Access Cluster'}
            </h3>
            <div className="flex items-center gap-3 justify-center">
               <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] font-mono">
                 {isSignUp ? 'PROTOCOL: IDENTITY-GEN' : 'AUTH_BUFFER: READY'}
               </p>
            </div>
          </div>

          <div className="space-y-6">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full h-12 gap-5 border-white/5 bg-slate-900/40 hover:bg-slate-900/60 text-white transition-all font-black text-xs uppercase tracking-[0.2em] rounded-2xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Chrome className="w-4 h-4 group-hover:rotate-[360deg] transition-transform duration-700 relative z-10" />
              <span className="relative z-10">Continue with Google Account</span>
            </Button>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-white/5" />
              <div className="px-8 py-2 rounded-full border border-white/10 bg-black/40 text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] font-mono">Secure Node Auth</div>
              <div className="flex-grow border-t border-white/5" />
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-6">
              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-2 block ml-2">Identity Name</label>
                    <Input
                      type="text" placeholder="FULL NAME" value={fullName} onChange={e => setFullName(e.target.value)}
                      className="h-12 bg-slate-950/40 border-white/10 focus:border-cyan-500/50 text-white rounded-2xl font-black text-sm uppercase placeholder:text-slate-800 px-6 transition-all" required
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-2 block ml-2">Protocol Email</label>
                <Input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="alias@domain.com"
                  className="h-12 bg-slate-950/40 border-white/10 focus:border-cyan-500/50 text-white rounded-2xl px-6 font-black text-sm placeholder:text-slate-800 transition-all" required
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-2 block ml-2">Access Cipher</label>
                <div className="relative">
                   <Input
                     type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                     className="h-12 bg-slate-950/40 border-white/10 focus:border-cyan-500/50 text-white rounded-2xl px-6 font-bold placeholder:text-slate-800 transition-all pr-12" required minLength={6}
                   />
                   <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800 group-focus-within:text-cyan-500 transition-colors" />
                </div>
              </div>

              <Button
                type="submit" disabled={loading}
                className="w-full h-14 rounded-2xl bg-[#00BCD4] hover:bg-[#00ACC1] text-white font-black text-sm uppercase tracking-[0.3em] shadow-[0_15px_30px_-10px_rgba(0,188,212,0.3)] group transition-all hover:scale-[1.01] active:scale-[0.98]"
              >
                 {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isSignUp ? 'Initialize Profile' : 'Restore Session')}
              </Button>
            </form>

            <div className="flex flex-col gap-6 pt-2">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-center group transition-all"
              >
                <p className="text-xs text-slate-500 font-bold mb-2 opacity-80 group-hover:opacity-100">{isSignUp ? 'Already have an existing link?' : "New terminal access required?"}</p>
                <p className="text-[#00BCD4] uppercase font-black tracking-widest text-[11px] group-hover:underline underline-offset-8">
                  {isSignUp ? 'Proceed to Login Cluster' : 'Register New Identity'}
                </p>
              </button>

              <div className="flex items-center gap-4">
                 <div className="h-[1px] flex-grow bg-white/5" />
                 <span className="text-[10px] font-black text-slate-800 tracking-[0.5em] uppercase">Security Cluster active</span>
                 <div className="h-[1px] flex-grow bg-white/5" />
              </div>

              <div className="grid grid-cols-1">
                <Button
                  onClick={signInAsGuest}
                  variant="ghost"
                  className="w-full h-14 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 text-slate-600 hover:text-cyan-400 transition-all duration-500 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em]"
                >
                  <Sparkles className="w-4 h-4 mr-3 animate-pulse text-cyan-500" />
                  Bypass Protocol (Neural Demo Access)
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center opacity-20 group-hover:opacity-40 transition-opacity">
             <p className="text-[10px] text-slate-600 uppercase font-black tracking-[0.4em]">
               Neural Shield Encryption Active
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
