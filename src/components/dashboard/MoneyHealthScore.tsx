import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  HeartPulse, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Wallet, 
  Sprout, 
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { useFinancialData } from '@/lib/financial-context';
import { toast } from 'sonner';

type ScoreDimension = {
    title: string;
    score: number;
    color: string;
    description: string;
};

const STEPS = [
  { id: 'basics', title: 'The Blueprint', sub: 'Let’s start with your current stats.', icon: Wallet },
  { id: 'expenses', title: 'The Burn Rate', sub: 'How much maintains your lifestyle?', icon: TrendingUp },
  { id: 'fortress', title: 'The Fortress', sub: 'Are you shielded from life events?', icon: ShieldCheck },
  { id: 'leverage', title: 'The Leverage', sub: 'How healthy is your debt load?', icon: HeartPulse },
  { id: 'alpha', title: 'The Alpha', sub: 'How diversified is your portfolio?', icon: Sprout },
  { id: 'vision', title: 'The Vision', sub: 'What is your retirement target?', icon: Clock },
];

export const MoneyHealthScore = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    expenses: '',
    savings: '',
    insurance: 'no',
    emergencyFund: 'no',
    emi: '',
    portfolioCount: '1',
    retirementGoal: '',
  });
  const { updateData } = useFinancialData();

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else calculateScore();
  };

  const calculateScore = () => {
    const inc = Number(formData.income);
    const exp = Number(formData.expenses);
    const emi = Number(formData.emi);
    
    updateData({
      monthlyIncome: inc,
      monthlyExpenses: exp,
      currentSavings: Number(formData.savings),
      monthlyEMI: emi,
      hasInsurance: formData.insurance === 'yes',
      hasEmergencyFund: formData.emergencyFund === 'yes',
    });

    toast.success("6-Dimension Health Analysis Complete!");
    onComplete();
  };

  const currentStep = STEPS[step];

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-12">
        <div className="flex gap-2">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 w-10 rounded-full transition-all duration-500 ${i <= step ? 'bg-primary shadow-[0_0_10px_rgba(100,200,255,0.5)]' : 'bg-secondary/50'}`} 
            />
          ))}
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1">Step {step + 1} of {STEPS.length}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={step}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           className="glass-panel p-12 relative overflow-hidden"
        >
          {/* Decorative icons */}
          <currentStep.icon className="absolute top-[-20px] right-[-20px] w-48 h-48 text-primary/5 rotate-12" />
          
          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold text-foreground mb-3 tracking-tighter">{currentStep.title}</h2>
            <p className="text-muted-foreground mb-10">{currentStep.sub}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {step === 0 && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-primary tracking-widest">Your Age</label>
                    <Input 
                      type="number" placeholder="e.g. 28" value={formData.age}
                      onChange={e => setFormData({...formData, age: e.target.value})}
                      className="h-14 text-lg bg-secondary/30 border-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold text-primary tracking-widest">Monthly Income (₹)</label>
                     <Input 
                       type="number" placeholder="75000" value={formData.income}
                       onChange={e => setFormData({...formData, income: e.target.value})}
                       className="h-14 text-lg bg-secondary/30 border-primary/20"
                     />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-primary tracking-widest">Monthly Expenses (₹)</label>
                    <Input 
                      type="number" placeholder="e.g. 35000" value={formData.expenses}
                      onChange={e => setFormData({...formData, expenses: e.target.value})}
                      className="h-14 text-lg bg-secondary/30 border-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold text-primary tracking-widest">Current Savings (₹)</label>
                     <Input 
                       type="number" placeholder="5,00,000" value={formData.savings}
                       onChange={e => setFormData({...formData, savings: e.target.value})}
                       className="h-14 text-lg bg-secondary/30 border-primary/20"
                     />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-bold text-primary tracking-widest block">Term/Health Insurance?</label>
                    <div className="flex gap-4">
                        <Button 
                            variant={formData.insurance === 'yes' ? 'default' : 'secondary'}
                            onClick={() => setFormData({...formData, insurance: 'yes'})}
                            className="flex-1 h-12 rounded-xl"
                        >YES</Button>
                        <Button 
                            variant={formData.insurance === 'no' ? 'destructive' : 'secondary'}
                            onClick={() => setFormData({...formData, insurance: 'no'})}
                            className="flex-1 h-12 rounded-xl"
                        >NO</Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] uppercase font-bold text-primary tracking-widest block">6-Month Emergency Fund?</label>
                     <div className="flex gap-4">
                        <Button 
                            variant={formData.emergencyFund === 'yes' ? 'default' : 'secondary'}
                            onClick={() => setFormData({...formData, emergencyFund: 'yes'})}
                            className="flex-1 h-12 rounded-xl"
                        >YES</Button>
                        <Button 
                            variant={formData.emergencyFund === 'no' ? 'destructive' : 'secondary'}
                            onClick={() => setFormData({...formData, emergencyFund: 'no'})}
                            className="flex-1 h-12 rounded-xl"
                        >NO</Button>
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <div className="col-span-full space-y-4 text-center">
                    <label className="text-[10px] uppercase font-bold text-primary tracking-widest">Monthly Loan EMIs (₹)</label>
                    <Input 
                      type="number" placeholder="e.g. 15000" value={formData.emi}
                      onChange={e => setFormData({...formData, emi: e.target.value})}
                      className="h-16 text-3xl font-black bg-secondary/30 border-primary/20 text-center"
                    />
                    <p className="text-[10px] text-muted-foreground mt-2 italic">Low EMI to Income ratio increases your health score.</p>
                </div>
              )}

              {step === 4 && (
                <div className="col-span-full space-y-6">
                    <label className="text-[10px] uppercase font-bold text-primary tracking-widest block text-center">Number of asset classes held</label>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {['1', '2', '3', '4', '5+'].map((num) => (
                            <Button
                                key={num}
                                variant={formData.portfolioCount === num ? 'default' : 'secondary'}
                                onClick={() => setFormData({...formData, portfolioCount: num})}
                                className="w-16 h-16 text-xl font-bold rounded-2xl"
                            >
                                {num}
                            </Button>
                        ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center italic">Equity, Debt, Gold, Real Estate, Crypto.</p>
                </div>
              )}

              {step === 5 && (
                <div className="col-span-full space-y-2">
                    <label className="text-[10px] uppercase font-bold text-primary tracking-widest">Retirement Wealth Goal (₹)</label>
                    <Input 
                      type="number" placeholder="e.g. 5,00,00,000" value={formData.retirementGoal}
                      onChange={e => setFormData({...formData, retirementGoal: e.target.value})}
                      className="h-16 text-3xl font-black bg-secondary/30 border-primary/20 text-center"
                    />
                </div>
              )}
            </div>

            <div className="flex justify-between items-center gap-4 pt-8 border-t border-white/5">
              <Button 
                variant="ghost" 
                onClick={() => setStep(s => s - 1)} 
                disabled={step === 0}
                className="h-12 px-8 rounded-xl"
              >
                <ChevronLeft className="w-5 h-5 mr-2" /> Back
              </Button>
              <Button 
                onClick={handleNext} 
                className="h-12 px-10 rounded-xl bg-primary text-primary-foreground font-black group transition-all"
              >
                {step === STEPS.length - 1 ? "CALCULATE PULSE" : "NEXT DIMENSION"} 
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Compliance Disclaimer */}
      <p className="text-[9px] text-muted-foreground/50 text-center mt-12 tracking-tight uppercase leading-relaxed font-mono">
        System Guardrail: No financial advice provided. FINORA uses mathematical models to score your financial velocity. 
        <br/>Always consult a licensed financial advisor (RIA) for investment execution.
      </p>
    </div>
  );
};
