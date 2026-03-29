import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { FinancialProvider } from "@/lib/financial-context";
import { SettingsProvider } from "@/lib/settings-context";
import { ModeToggle } from "@/components/layout/ModeToggle";
import Dashboard from "./pages/Dashboard";
import Simulation from "./pages/Simulation";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import TaxWizardPage from "./pages/TaxWizardPage";
import PortfolioXRayPage from "./pages/PortfolioXRayPage";
import GoalsPage from "./pages/GoalsPage";
import HealthScorePage from "./pages/HealthScorePage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { LiveKitVoiceAssistant } from "@/components/dashboard/LiveKitVoiceAssistant";
import { Logo } from "@/components/layout/Logo";
import { Shield, IndianRupee } from 'lucide-react';

const queryClient = new QueryClient();

const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <FinancialProvider>
      <SettingsProvider>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background relative selection:bg-primary/30">
            {/* Premium Background Elements */}
            <div className="bg-noise opacity-[0.03] dark:opacity-[0.05]" />
            <div className="absolute inset-0 bg-grid-white pointer-events-none opacity-[0.02]" />
            
            <AppSidebar />
            <div className="flex-1 flex flex-col min-w-0 relative z-10">
              <header className="h-16 flex items-center justify-between border-b border-white/5 bg-background/60 backdrop-blur-xl sticky top-0 z-50 px-6">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="hover:bg-primary/10 transition-colors" />
                  <div className="flex items-center gap-3">
                    <Logo size="sm" />
                    <span className="text-sm font-black tracking-[0.2em] text-foreground/70 font-mono">FINORA.AI</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-6 mr-4">
                     <span className="text-[10px] font-bold text-muted-foreground/80 dark:text-muted-foreground uppercase tracking-widest">System Online</span>
                     <div className="h-4 w-[1px] bg-border/50" />
                  </div>
                  <ModeToggle />
                </div>
              </header>
              <main className="flex-1 overflow-auto scrollbar-thin">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/simulation" element={<Simulation />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/tax-wizard" element={<TaxWizardPage />} />
                  <Route path="/portfolio-xray" element={<PortfolioXRayPage />} />
                  <Route path="/goals" element={<GoalsPage />} />
                  <Route path="/health-score" element={<HealthScorePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
          <LiveKitVoiceAssistant />
        </SidebarProvider>
      </SettingsProvider>
    </FinancialProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/*" element={<ProtectedLayout />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
