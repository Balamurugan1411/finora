import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

const mockPortfolio = [
  { name: 'Equity (Index Funds)', value: 45, color: 'hsl(190, 100%, 50%)' },
  { name: 'Debt (FDs/Bonds)', value: 25, color: 'hsl(155, 100%, 50%)' },
  { name: 'Gold', value: 10, color: 'hsl(38, 100%, 50%)' },
  { name: 'Cash/Savings', value: 15, color: 'hsl(215, 20%, 55%)' },
  { name: 'Real Estate', value: 5, color: 'hsl(280, 60%, 55%)' },
];

const suggestions = [
  'Consider increasing equity allocation for long-term growth.',
  'Rebalance quarterly to maintain target allocation.',
  'Gold acts as a hedge — hold 5-10% of portfolio.',
];

const PortfolioChart = () => {
  return (
    <motion.div
      className="glass-panel p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-semibold gradient-text mb-4">Portfolio Allocation</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mockPortfolio}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {mockPortfolio.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 40%, 10%)',
                border: '1px solid hsl(222, 30%, 20%)',
                borderRadius: '8px',
                color: 'hsl(210, 40%, 92%)',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value}%`, '']}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', color: 'hsl(215, 20%, 55%)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Suggestions</p>
        {suggestions.map((s, i) => (
          <p key={i} className="text-xs text-muted-foreground flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span> {s}
          </p>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground/50 mt-3">Mock allocation for demonstration</p>
    </motion.div>
  );
};

export default PortfolioChart;
