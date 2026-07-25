import React from 'react';
import { 
  ShieldCheck, 
  BarChart2, 
  Lock, 
  Activity
} from 'lucide-react';
import type { Review } from './ReviewTable';

interface HRDashboardProps {
  reviews: Review[];
}

export const HRDashboard: React.FC<HRDashboardProps> = ({ reviews }) => {
  const totalReviews = reviews.length;
  const acknowledgedCount = reviews.filter(r => Number(r.status) === 2).length;
  const appealedCount = reviews.filter(r => Number(r.status) === 3).length;
  const pendingCount = reviews.filter(r => Number(r.status) === 1).length;

  const completionPercent = totalReviews > 0 ? Math.round((acknowledgedCount / totalReviews) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Privacy Guarantee Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/60 border border-indigo-500/30 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Lock className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              HR Privacy Governance & Compliance Dashboard
            </h3>
            <p className="text-xs text-gray-300 max-w-2xl mt-1">
              HR Administrators monitor cycle progress, completion rates, and appeal volume. Under Midnight's Zero-Knowledge architecture, private evaluation feedback, ratings, and salary recommendations remain completely invisible to HR observers.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex-shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>ZK Privacy Enforced</span>
        </div>
      </div>

      {/* Aggregate Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#121829]/90 border border-white/10 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-gray-400">Total Review Commitments</span>
          <div className="text-3xl font-bold text-white">{totalReviews}</div>
          <span className="text-[11px] text-gray-500 block">Anchored on Midnight Devnet</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121829]/90 border border-white/10 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-gray-400">Completion Rate</span>
          <div className="text-3xl font-bold text-emerald-400">{completionPercent}%</div>
          <span className="text-[11px] text-emerald-500/80 block">{acknowledgedCount} of {totalReviews} Acknowledged</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121829]/90 border border-white/10 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-gray-400">Pending Acknowledgment</span>
          <div className="text-3xl font-bold text-amber-400">{pendingCount}</div>
          <span className="text-[11px] text-amber-500/80 block">Awaiting employee ZK signature</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121829]/90 border border-white/10 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-gray-400">Appeals Filed</span>
          <div className="text-3xl font-bold text-rose-400">{appealedCount}</div>
          <span className="text-[11px] text-rose-500/80 block">Flagged for dispute resolution</span>
        </div>
      </div>

      {/* Department Breakdown & Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Completion Breakdown */}
        <div className="p-6 rounded-3xl bg-[#121829]/90 border border-white/10 shadow-2xl space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center justify-between border-b border-white/10 pb-3">
            <span>Department Cycle Progress</span>
            <BarChart2 className="w-4 h-4 text-indigo-400" />
          </h4>

          <div className="space-y-4">
            {[
              { name: 'Engineering', count: 18, pct: 92, color: 'bg-indigo-500' },
              { name: 'Product & Design', count: 8, pct: 85, color: 'bg-purple-500' },
              { name: 'Sales & Marketing', count: 12, pct: 78, color: 'bg-cyan-500' },
              { name: 'Operations & HR', count: 6, pct: 100, color: 'bg-emerald-500' }
            ].map((dept, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-200">{dept.name}</span>
                  <span className="text-gray-400">{dept.pct}% ({dept.count} reviews)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full ${dept.color} rounded-full transition-all duration-500`} style={{ width: `${dept.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Public Blockchain Ledger Feed */}
        <div className="p-6 rounded-3xl bg-[#121829]/90 border border-white/10 shadow-2xl space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center justify-between border-b border-white/10 pb-3">
            <span>Public Ledger Commitment Log</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </h4>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {reviews.map((r) => (
              <div key={r.reviewId} className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-mono font-bold text-indigo-300">
                    ZK
                  </div>
                  <div>
                    <span className="font-mono text-gray-200 font-semibold block">{r.reviewId}</span>
                    <span className="text-[10px] text-gray-500 font-mono-hash block">Emp: {r.employeeHash.substring(0, 10)}...</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 font-mono font-bold block">Status #{r.status}</span>
                  <span className="text-[10px] text-gray-500 block">{new Date(Number(r.timestamp) * 1000).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
