import { CouplesPlanner } from '@/components/dashboard/CouplesPlanner';
import { motion } from 'framer-motion';

const GoalsPage = () => {
  return (
    <div className="p-10 max-w-4xl mx-auto space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-5xl font-black text-foreground tracking-tighter mb-4">
          Goals & <span className="text-primary italic">Life Events</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
          Strategic planning for joint accounts, family growth, and major milestones.
        </p>
      </motion.div>
      <CouplesPlanner />
    </div>
  );
};

export default GoalsPage;
