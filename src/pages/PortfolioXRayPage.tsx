import { PortfolioXRay } from '@/components/dashboard/PortfolioXRay';
import { motion } from 'framer-motion';

const PortfolioXRayPage = () => {
  return (
    <div className="p-10 max-w-4xl mx-auto space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-5xl font-black text-foreground tracking-tighter mb-4">
          Portfolio <span className="text-primary italic">X-Ray</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
          Neural analysis of your asset allocation, expense drag, and risk clusters.
        </p>
      </motion.div>
      <PortfolioXRay />
    </div>
  );
};

export default PortfolioXRayPage;
