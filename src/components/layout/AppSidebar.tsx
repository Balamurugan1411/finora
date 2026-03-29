import { 
  LayoutDashboard, 
  Target, 
  Sparkles, 
  Gift, 
  PieChart, 
  Wallet, 
  HeartPulse, 
  Settings, 
  LogOut,
  Bell,
  Search,
  ChevronRight,
  Shield,
  IndianRupee
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Target, label: 'FIRE Planner', path: '/simulation' },
  { icon: Sparkles, label: 'AI Insights', path: '/chat' },
  { icon: Gift, label: 'Tax Wizard', path: '/tax-wizard' },
  { icon: PieChart, label: 'Portfolio X-Ray', path: '/portfolio-xray' },
  { icon: Wallet, label: 'Goals & Life Events', path: '/goals' },
  { icon: HeartPulse, label: 'Health Score', path: '/health-score' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar-background w-72">
      <SidebarHeader className="p-8 pb-10">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Logo size="lg" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-tight leading-none mb-1">Finora</h2>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-80 dark:opacity-60">AI Money Mentor</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-5">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`
                        h-14 px-6 rounded-2xl transition-all duration-500 group relative overflow-hidden border
                        ${isActive 
                          ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(var(--primary),0.3)]' 
                          : 'bg-transparent border-transparent dark:bg-white/[0.02] dark:border-white/5 text-sidebar-foreground/70 hover:text-primary hover:bg-primary/5 hover:border-primary/20'}
                      `}
                    >
                      <Link to={item.path} className="flex items-center gap-5">
                        <item.icon className={`w-5 h-5 shrink-0 transition-all ${isActive ? 'text-white scale-110' : 'text-primary/60 group-hover:text-primary group-hover:drop-shadow-[0_0_5px_rgba(var(--primary),0.4)]'}`} />
                        <span className={`text-[13px] tracking-widest uppercase ${isActive ? 'font-black' : 'font-bold opacity-100 group-hover:opacity-100'}`}>
                          {item.label}
                        </span>
                        {isActive && (
                           <div className="absolute right-0 top-1/4 bottom-1/4 w-1 bg-white/40 rounded-full" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 mt-auto">
        {user ? (
          <div className="flex items-center justify-between p-4 rounded-3xl bg-secondary/50 border border-sidebar-border backdrop-blur-md group-user transition-all hover:bg-secondary/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border border-sidebar-border shadow-lg">
                <span className="text-foreground font-black text-xs">
                  {user.email?.[0].toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-black text-foreground uppercase tracking-tighter truncate leading-none mb-1">
                  {user.email?.split('@')[0].toUpperCase()}
                </span>
                <span className="text-[9px] font-black text-primary uppercase tracking-widest opacity-80">Active Node</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut} className="h-9 w-9 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-xl transition-colors">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button asChild variant="outline" className="w-full border-sidebar-border hover:bg-sidebar-accent text-foreground font-black rounded-2xl h-12 uppercase tracking-widest text-[10px]">
             <Link to="/auth">Authenticate Node</Link>
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
