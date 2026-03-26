import { TrendingUp } from 'lucide-react';

export default function StatCard({ icon: Icon, label, value, trend, color = 'orange' }) {
  const colorClasses = {
    orange: 'border-cyber-orange/30 bg-cyber-orange/10',
    blue: 'border-cyber-blue/30 bg-cyber-blue/10',
    green: 'border-green-500/30 bg-green-500/10',
  };

  return (
    <div className={`border rounded-lg p-6 backdrop-blur-md ${colorClasses[color] || colorClasses.orange}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {Icon && <Icon size={24} className="text-cyber-orange" />}
          <p className="text-cyber-gray-dark text-sm">{label}</p>
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <TrendingUp size={16} />
            {trend}%
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-cyber-gray-light">{value}</p>
    </div>
  );
}
