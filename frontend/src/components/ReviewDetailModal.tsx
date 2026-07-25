import React from 'react';
import { 
  X, 
  AlertTriangle, 
  Lock
} from 'lucide-react';
import type { Review } from './ReviewTable';

interface ReviewDetailModalProps {
  review: Review | null;
  onClose: () => void;
  role: 'guest' | 'manager' | 'employee' | 'hr';
  onAcknowledge: (review: Review) => void;
  onAppeal: (review: Review) => void;
}

export const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({
  review,
  onClose,
  role,
  onAcknowledge,
  onAppeal
}) => {
  if (!review) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 transition-all">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl bg-[#121829] border border-white/15 shadow-2xl space-y-6 text-xs text-gray-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center font-mono font-bold text-indigo-300">
              REV
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Review Reference #{review.reviewId}
              </h3>
              <span className="text-[11px] text-gray-400 font-mono-hash">
                Anchored: {new Date(Number(review.timestamp) * 1000).toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Identity Hashes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-black/30 border border-white/5 font-mono">
          <div>
            <span className="text-[10px] text-gray-500 uppercase font-bold block">Employee Witness Hash</span>
            <span className="text-indigo-300 font-semibold truncate block mt-0.5">{review.employeeHash}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase font-bold block">Reviewer Witness Hash</span>
            <span className="text-purple-300 font-semibold truncate block mt-0.5">{review.reviewerHash}</span>
          </div>
        </div>

        {/* Ratings & Key Metrics */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Performance Rating</span>
            <span className="text-lg font-bold text-amber-400 block mt-1">⭐ {review.rating || 4} / 5.0</span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Promotion Flag</span>
            <span className="text-sm font-bold text-emerald-400 block mt-1.5">
              {review.promotionRecommendation ? '✓ Recommended' : 'Standard Tier'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Salary Recommendation</span>
            <span className="text-sm font-bold text-purple-300 block mt-1.5">
              ${review.salaryRecommendation || '125,000'}
            </span>
          </div>
        </div>

        {/* Strengths & Areas */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
            <span className="font-bold text-emerald-400 text-xs block">Key Strengths</span>
            <p className="text-gray-200 leading-relaxed">{review.strengths || 'Demonstrates exceptional leadership and architecture skills.'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1">
            <span className="font-bold text-amber-400 text-xs block">Areas for Development</span>
            <p className="text-gray-200 leading-relaxed">{review.areasForImprovement || 'Focus on scaling automated test suites for smart contracts.'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
            <span className="font-bold text-white text-xs block">Manager Comments</span>
            <p className="text-gray-300 leading-relaxed">{review.comments || 'Outstanding contribution across all key quarterly objectives.'}</p>
          </div>
        </div>

        {/* Appeal Section if Appealed */}
        {Number(review.status) === 3 && review.appealMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-1">
            <span className="font-bold text-rose-400 text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Employee Appeal Statement
            </span>
            <p className="text-rose-200 leading-relaxed">{review.appealMessage}</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-[11px] text-gray-500 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-indigo-400" /> Witness verification active
          </span>

          <div className="flex items-center space-x-2">
            {role === 'employee' && Number(review.status) === 1 && (
              <button
                onClick={() => {
                  onClose();
                  onAcknowledge(review);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
              >
                Acknowledge Review
              </button>
            )}

            {role === 'employee' && Number(review.status) === 2 && (
              <button
                onClick={() => {
                  onClose();
                  onAppeal(review);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition"
              >
                File Appeal
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
