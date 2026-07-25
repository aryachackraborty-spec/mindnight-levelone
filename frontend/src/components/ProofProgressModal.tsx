import React from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  Lock
} from 'lucide-react';

interface ZkStep {
  label: string;
  status: 'pending' | 'loading' | 'success' | 'failed';
}

interface ProofProgressModalProps {
  isOpen: boolean;
  steps: ZkStep[];
  stepIndex: number;
}

export const ProofProgressModal: React.FC<ProofProgressModalProps> = ({
  isOpen,
  steps,
  stepIndex
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 transition-all">
      <div className="w-full max-w-md p-6 rounded-3xl bg-[#121829] border border-indigo-500/30 shadow-2xl space-y-6 text-center">
        {/* Animated ZK Icon Header */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-xl shadow-indigo-500/30">
          <ShieldCheck className="w-10 h-10 text-white animate-pulse" />
          <div className="absolute -inset-1 rounded-3xl border border-indigo-400/40 animate-ping" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
            Generating Zero-Knowledge Proof
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Computing cryptographic witness circuits locally on Midnight Proof Server (Port 6300)...
          </p>
        </div>

        {/* Step List */}
        <div className="space-y-3 text-left bg-black/30 p-4 rounded-2xl border border-white/10">
          {steps.map((step, idx) => {
            const isCurrent = idx === stepIndex;
            const isPassed = idx < stepIndex || step.status === 'success';

            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                  isCurrent
                    ? 'bg-indigo-600/20 border-indigo-400 text-white font-semibold'
                    : isPassed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-white/5 border-transparent text-gray-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {isPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : isCurrent ? (
                    <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-600 flex-shrink-0" />
                  )}
                  <span>{step.label}</span>
                </div>

                {isCurrent && (
                  <span className="text-[10px] uppercase font-bold text-indigo-400 animate-pulse">Computing</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-[11px] text-gray-400 flex items-center justify-center space-x-2">
          <Lock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Private review details never leave your client browser.</span>
        </div>
      </div>
    </div>
  );
};
