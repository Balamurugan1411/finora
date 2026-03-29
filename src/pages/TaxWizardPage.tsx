import TaxWizard from '@/components/dashboard/TaxWizard';
import { motion } from 'framer-motion';

const TaxWizardPage = () => {
  return (
    <div className="p-10 max-w-4xl mx-auto space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-5xl font-black text-foreground tracking-tighter mb-4">
          Tax <span className="text-primary italic">Optimizer</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
          Multi-regime calculation engine with AI PDF parsing capability.
        </p>
      </motion.div>
      <TaxWizard />
    </div>
  );
};

export default TaxWizardPage;
