import { Shield, IndianRupee, Cpu } from 'lucide-react';

export const Logo = ({ size = "md", className = "" }: { size?: "sm" | "md" | "lg", className?: string }) => {
  const dimensions = {
    sm: { container: "w-8 h-8", shield: "w-8 h-8", rupee: "w-4 h-4", circuit: "w-6 h-6" },
    md: { container: "w-10 h-10", shield: "w-10 h-10", rupee: "w-5 h-5", circuit: "w-8 h-8" },
    lg: { container: "w-14 h-14", shield: "w-14 h-14", rupee: "w-7 h-7", circuit: "w-11 h-11" },
  }[size];

  return (
    <div className={`relative flex items-center justify-center ${dimensions.container} ${className}`}>
      {/* Background Glow */}
      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-50 pulse-slow" />
      
      {/* Outer Shield Layer */}
      <Shield className={`${dimensions.shield} text-primary opacity-30 absolute transition-all duration-700 hover:scale-110`} strokeWidth={1} />
      
      {/* Inner Circuit/Tech Layer */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 rotate-45">
         <Cpu className={`${dimensions.circuit} text-primary animate-pulse`} strokeWidth={0.5} />
      </div>

      {/* Core Rupee Symbol */}
      <div className="relative z-10 flex items-center justify-center bg-background/40 backdrop-blur-sm rounded-lg p-1.5 border border-white/5 shadow-2xl">
        <IndianRupee className={`${dimensions.rupee} text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]`} strokeWidth={3} />
      </div>
      
      {/* Decorative Dots */}
      <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-75" />
      <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-150" />
    </div>
  );
};
