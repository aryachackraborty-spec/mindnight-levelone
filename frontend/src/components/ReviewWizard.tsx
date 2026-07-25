import React, { useState } from 'react';
import { 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  DollarSign, 
  Lock,
  ShieldCheck
} from 'lucide-react';

interface ReviewWizardProps {
  onCancel: () => void;
  onSubmit: (formData: {
    reviewId: string;
    employeeId: string;
    rating: string;
    strengths: string;
    areas: string;
    comments: string;
    goals: string;
    promo: boolean;
    salary: string;
  }) => void;
}

export const ReviewWizard: React.FC<ReviewWizardProps> = ({ onCancel, onSubmit }) => {
  const [step, setStep] = useState(1);

  // Form State
  const [reviewId, setReviewId] = useState(`rev_${Math.floor(Math.random() * 899999 + 100000)}`);
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [reviewCycle, setReviewCycle] = useState('Q3 2026 Annual');

  const [rating, setRating] = useState('4');
  const [strengths, setStrengths] = useState('');
  const [areas, setAreas] = useState('');

  const [goals, setGoals] = useState('');
  const [promoLevel, setPromoLevel] = useState<'none' | 'rec' | 'strong'>('rec');
  const [salary, setSalary] = useState('125,000');

  const [comments, setComments] = useState('');

  // Rating option definitions
  const ratingOptions = [
    { value: '1', label: 'Needs Improvement', stars: 1, desc: 'Requires immediate goal alignment and coaching' },
    { value: '2', label: 'Developing', stars: 2, desc: 'Progressing towards role expectations' },
    { value: '3', label: 'Strong Contributor', stars: 3, desc: 'Consistently satisfies all core responsibilities' },
    { value: '4', label: 'Exceeds Expectations', stars: 4, desc: 'Frequently delivers high impact & leadership' },
    { value: '5', label: 'Outstanding', stars: 5, desc: 'Exceptional performance across all criteria' },
  ];

  const stepsList = [
    'Employee Info',
    'Evaluation',
    'Career & Comp',
    'Manager Feedback',
    'Summary'
  ];

  const handleNext = () => {
    if (step === 1 && !employeeId.trim()) return;
    if (step < 5) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      reviewId,
      employeeId,
      rating,
      strengths,
      areas,
      comments,
      goals,
      promo: promoLevel !== 'none',
      salary: salary.replace(/,/g, '')
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-3xl bg-[#121829]/90 backdrop-blur-2xl border border-indigo-500/30 shadow-2xl space-y-6">
      {/* Wizard Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Submit Confidential Performance Review
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Private evaluation data is encrypted and anchored via Midnight Zero-Knowledge proof commitment.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-medium transition"
        >
          Cancel
        </button>
      </div>

      {/* Progress Stepper */}
      <div className="grid grid-cols-5 gap-2">
        {stepsList.map((stLabel, idx) => {
          const stNum = idx + 1;
          const isActive = step === stNum;
          const isCompleted = step > stNum;
          return (
            <div key={idx} className="flex flex-col space-y-1.5">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 border border-indigo-400'
                      : 'bg-white/5 text-gray-500 border border-white/10'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stNum}
                </div>
                <div className={`h-1 flex-1 rounded-full ${isCompleted ? 'bg-emerald-500' : isActive ? 'bg-indigo-600' : 'bg-white/10'}`} />
              </div>
              <span className={`text-[11px] font-semibold truncate ${isActive ? 'text-indigo-400' : isCompleted ? 'text-emerald-400' : 'text-gray-500'}`}>
                {stLabel}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="py-4">
        {/* Step 1: Employee Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Review Reference ID</label>
                <input
                  type="text"
                  value={reviewId}
                  onChange={(e) => setReviewId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Employee ID / Email</label>
                <input
                  type="text"
                  placeholder="e.g. emp_bob or bob@company.com"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-indigo-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-indigo-500 outline-none"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product & Design">Product & Design</option>
                  <option value="Operations & HR">Operations & HR</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Review Cycle</label>
                <input
                  type="text"
                  value={reviewCycle}
                  onChange={(e) => setReviewCycle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Performance Evaluation (⭐ Rating Cards + Strengths + Areas) */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-3">Overall Performance Rating</label>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {ratingOptions.map((opt) => {
                  const isSelected = rating === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRating(opt.value)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-400 shadow-lg shadow-indigo-600/20 scale-[1.02]'
                          : 'bg-black/20 border-white/10 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-1 mb-1 text-amber-400">
                          {Array.from({ length: opt.stars }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <span className="font-bold text-xs text-white block">{opt.label}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-2 block">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-400 mb-1.5">Key Strengths & Highlights</label>
                <textarea
                  rows={4}
                  placeholder="e.g. Exceptional architectural leadership on Midnight ZK integration..."
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-emerald-500/30 text-white text-sm focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-400 mb-1.5">Areas for Growth & Improvement</label>
                <textarea
                  rows={4}
                  placeholder="e.g. Opportunities to increase automated test coverage..."
                  value={areas}
                  onChange={(e) => setAreas(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-amber-500/30 text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Career & Compensation */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Promotion Recommendation</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'none', label: '○ Not Recommended' },
                  { id: 'rec', label: '✓ Recommended' },
                  { id: 'strong', label: '★ Strongly Recommended' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPromoLevel(item.id as any)}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                      promoLevel === item.id
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                        : 'bg-black/30 text-gray-400 border-white/10 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Salary Recommendation (USD)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-semibold focus:border-indigo-500 outline-none"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Formatted currency input. Kept private in encrypted witness state.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Future Development Goals</label>
                <input
                  type="text"
                  placeholder="e.g. Lead smart contract auditing for Q4 release"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Manager Feedback Comments */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Comprehensive Manager Evaluation Notes</label>
              <textarea
                rows={6}
                placeholder="Detailed performance feedback, overall achievements, peer collaboration..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 5: Review Summary */}
        {step === 5 && (
          <div className="space-y-4 p-4 rounded-2xl bg-black/30 border border-white/10 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Review Witness Summary
              </span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                ID: {reviewId}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-gray-300">
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Employee</span>
                <span className="font-semibold text-white">{employeeId}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Rating</span>
                <span className="font-semibold text-amber-400">⭐ {rating} / 5.0</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Promotion</span>
                <span className="font-semibold text-emerald-400">{promoLevel !== 'none' ? 'Recommended' : 'No'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Salary</span>
                <span className="font-semibold text-white">${salary}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] flex items-center space-x-2">
              <Lock className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>
                Confidential content will be saved to the encrypted witness database, and a SHA-256 ZK commitment hash will be anchored to the Midnight blockchain.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={handlePrev}
          disabled={step === 1}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition disabled:opacity-30"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {step < 5 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinalSubmit}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/30 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate ZK Proof & Submit</span>
          </button>
        )}
      </div>
    </div>
  );
};
