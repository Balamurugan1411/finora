import { useSettings } from '@/lib/settings-context';
import { Button } from '@/components/ui/button';
import { GraduationCap, Zap, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export const ModeToggle = () => {
  const { mode, setMode } = useSettings();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => 
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (next === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', next);
  };

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark';
    if (saved) {
      setTheme(saved);
      if (saved === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl group/mode relative">
        <div className="absolute inset-0 bg-primary/5 blur-xl group-hover/mode:opacity-100 opacity-0 transition-opacity pointer-events-none" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMode('beginner')}
          className={`relative z-10 h-10 px-5 text-[10px] font-black uppercase tracking-[0.2em] gap-2 rounded-xl transition-all ${mode === 'beginner' ? 'bg-primary text-white shadow-[0_0_20px_rgba(var(--primary),0.3)]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
        >
          <GraduationCap className="w-4 h-4" />
          Beginner
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMode('advanced')}
          className={`relative z-10 h-10 px-5 text-[10px] font-black uppercase tracking-[0.2em] gap-2 rounded-xl transition-all ${mode === 'advanced' ? 'bg-accent text-slate-950 shadow-[0_0_20px_rgba(var(--accent),0.3)]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
        >
          <Zap className="w-4 h-4" />
          Advanced
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="relative w-12 h-12 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-primary/40 hover:bg-primary/10 transition-all group shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-slate-400 group-hover:text-primary group-hover:-rotate-12 transition-all duration-300" />
        ) : (
          <Sun className="w-5 h-5 text-amber-400 group-hover:text-primary group-hover:rotate-45 transition-all duration-300" />
        )}
      </Button>
    </div>
  );
};
