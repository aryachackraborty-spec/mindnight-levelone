import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Star, 
  Activity,
  ArrowUpRight
} from 'lucide-react';

interface Review {
  status: number; // 1 = Submitted, 2 = Acknowledged, 3 = Appealed
  rating?: number;
}

interface DashboardStatsProps {
  reviews: Review[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ reviews }) => {
  const pendingCount = reviews.filter(r => Number(r.status) === 1).length;
  const completedCount = reviews.filter(r => Number(r.status) === 2).length;
  const appealedCount = reviews.filter(r => Number(r.status) === 3).length;
  const totalCount = reviews.length;

  const completionRate = totalCount > 0 
    ? Math.round((completedCount / totalCount) * 100) 
    : 0;

  const validRatings = reviews.map(r => Number(r.rating || 0)).filter(r => r > 0);
  const avgRating = validRatings.length > 0 
    ? (validRatings.reduce((a, b) => a + b, 0) / validRatings.length).toFixed(1) 
    : '4.5';

  const stats = [
    {
      title: 'Pending Reviews',
      value: pendingCount,
      change: '+2 this week',
      isPositive: true,
      icon: Clock,
      color: 'text-amber-400',
      bgGlow: 'from-amber-500/10 to-transparent',
      borderColor: 'border-amber-500/20'
    },
    {
      title: 'Completed Reviews',
      value: completedCount,
      change: '+14% month',
      isPositive: true,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgGlow: 'from-emerald-500/10 to-transparent',
      borderColor: 'border-emerald-500/20'
    },
    {
      title: 'Appealed Reviews',
      value: appealedCount,
      change: '-50% vs last cycle',
      isPositive: true,
      icon: AlertCircle,
      color: 'text-rose-400',
      bgGlow: 'from-rose-500/10 to-transparent',
      borderColor: 'border-rose-500/20'
    },
    {
      title: 'Avg Completion Time',
      value: '2.4 Days',
      change: '-0.8 days faster',
      isPositive: true,
      icon: Activity,
      color: 'text-cyan-400',
      bgGlow: 'from-cyan-500/10 to-transparent',
      borderColor: 'border-cyan-500/20'
    },
    {
      title: 'Average Rating',
      value: `${avgRating} / 5.0`,
      change: 'Confidential aggregate',
      isPositive: true,
      icon: Star,
      color: 'text-purple-400',
      bgGlow: 'from-purple-500/10 to-transparent',
      borderColor: 'border-purple-500/20'
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      change: 'Target: 85%',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-indigo-400',
      bgGlow: 'from-indigo-500/10 to-transparent',
      borderColor: 'border-indigo-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl bg-gradient-to-b ${stat.bgGlow} bg-[#121829]/70 backdrop-blur-xl border ${stat.borderColor} hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1 shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 truncate">{stat.title}</span>
              <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <span className="text-2xl font-bold text-white tracking-tight">{stat.value}</span>
            </div>

            <div className="mt-2 flex items-center text-[11px] text-gray-400 space-x-1">
              <ArrowUpRight className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">{stat.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
