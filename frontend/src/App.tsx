import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  User, 
  Briefcase, 
  Users, 
  PlusCircle, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Lock, 
  Unlock, 
  Send, 
  ExternalLink, 
  RefreshCw, 
  TrendingUp, 
  DollarSign, 
  ArrowRight,
  LogOut,
  FileText
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000/api';

// Helper to hash string to SHA-256 hex in browser
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

interface Review {
  reviewId: string;
  employeeHash: string;
  reviewerHash: string;
  rating?: number;
  strengths?: string;
  areasForImprovement?: string;
  comments?: string;
  goals?: string;
  promotionRecommendation?: boolean;
  salaryRecommendation?: string;
  timestamp: string;
  status: number; // 1 = Submitted, 2 = Acknowledged, 3 = Appealed
  appealMessage?: string;
}

function getStatusString(status: bigint | number): string {
  switch (Number(status)) {
    case 0: return 'Pending';
    case 1: return 'Submitted';
    case 2: return 'Acknowledged';
    case 3: return 'Appealed';
    default: return `Unknown (${status})`;
  }
}

export default function App() {
  // Navigation / Auth States
  const [role, setRole] = useState<'guest' | 'manager' | 'employee' | 'hr'>('guest');
  const [loginRole, setLoginRole] = useState<'manager' | 'employee' | 'hr'>('manager');
  const [userId, setUserId] = useState('');
  const [userHash, setUserHash] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Active review detail modal/view state
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');
  
  // Form States
  const [newReviewId, setNewReviewId] = useState('');
  const [newEmployeeId, setNewEmployeeId] = useState('');
  const [newRating, setNewRating] = useState('3');
  const [newStrengths, setNewStrengths] = useState('');
  const [newAreas, setNewAreas] = useState('');
  const [newComments, setNewComments] = useState('');
  const [newGoals, setNewGoals] = useState('');
  const [newPromo, setNewPromo] = useState(false);
  const [newSalary, setNewSalary] = useState('80000');
  
  const [appealText, setAppealText] = useState('');

  // Wallet Connection Simulation
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('1,250.00');
  const [connectingWallet, setConnectingWallet] = useState(false);

  // ZK-Proof Generation Modal Simulation
  const [zkModalOpen, setZkModalOpen] = useState(false);
  const [zkSteps, setZkSteps] = useState<{ label: string; status: 'pending' | 'loading' | 'success' | 'failed' }[]>([]);
  const [zkStepIndex, setZkStepIndex] = useState(0);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

  // Reset success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handle Login / Identity hashing
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const hash = await sha256(userId.trim().toLowerCase());
      setUserHash(hash);
      setRole(loginRole);
      
      // Auto connect simulated wallet matching this identity
      setWalletAddress(`mn_addr_preprod_${hash.substring(0, 16)}...`);
      setWalletConnected(true);
      setWalletBalance('1,250.00');
      
      fetchReviews(hash, loginRole);
    } catch (err: any) {
      setError(err?.message || 'Failed to initialize identity');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setRole('guest');
    setUserId('');
    setUserHash('');
    setReviews([]);
    setSelectedReview(null);
    setWalletConnected(false);
  };

  // Fetch reviews from Express API
  const fetchReviews = async (hash: string, userRole: string) => {
    setLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = {
        'x-user-hash': hash,
        'x-user-role': userRole
      };
      const response = await fetch(`${BACKEND_URL}/reviews`, { headers });
      if (!response.ok) {
        throw new Error('Failed to retrieve performance reviews.');
      }
      const data = await response.json();
      setReviews(data);
    } catch (err: any) {
      setError(err?.message || 'Backend connection error. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Lace Wallet connect/disconnect
  const connectWallet = async () => {
    setConnectingWallet(true);
    try {
      if ((window as any).midnight?.lace) {
        const lace = await (window as any).midnight.lace.enable();
        const state = await lace.state();
        setWalletAddress(state.address || 'mn_addr_preprod_lace_wallet');
        setWalletConnected(true);
      } else {
        await new Promise((r) => setTimeout(r, 1000));
        setWalletAddress(userHash ? `mn_addr_preprod_${userHash.substring(0, 16)}...` : 'mn_addr_preprod_mock_wallet');
        setWalletConnected(true);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to connect Midnight Lace Wallet');
    } finally {
      setConnectingWallet(false);
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
  };

  // Trigger ZK Flow before sending transaction
  const triggerZkFlow = (steps: string[], finalAction: () => Promise<void>) => {
    setZkSteps(steps.map(label => ({ label, status: 'pending' })));
    setZkStepIndex(0);
    setZkModalOpen(true);
    setPendingAction(() => finalAction);
  };

  // Run through ZK simulation steps
  useEffect(() => {
    if (!zkModalOpen || zkSteps.length === 0 || zkStepIndex >= zkSteps.length) return;

    const currentStep = zkSteps[zkStepIndex];
    if (currentStep.status === 'pending') {
      // Transition to loading
      const updated = [...zkSteps];
      updated[zkStepIndex].status = 'loading';
      setZkSteps(updated);

      // Simulate step duration
      const duration = zkStepIndex === 1 ? 2500 : 1500; // Proof generation takes longer
      const timer = setTimeout(() => {
        const completed = [...zkSteps];
        completed[zkStepIndex].status = 'success';
        setZkSteps(completed);
        setZkStepIndex(prev => prev + 1);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [zkModalOpen, zkSteps, zkStepIndex]);

  // Execute actual database + blockchain updates once ZK proofs are generated
  useEffect(() => {
    if (zkModalOpen && zkStepIndex === zkSteps.length && pendingAction) {
      const runAction = async () => {
        try {
          await pendingAction();
          setSuccessMessage('Transaction successfully submitted to Midnight blockchain!');
        } catch (err: any) {
          setError(err?.message || 'Transaction submission failed');
        } finally {
          setZkModalOpen(false);
          setPendingAction(null);
          fetchReviews(userHash, role);
        }
      };
      runAction();
    }
  }, [zkModalOpen, zkStepIndex, zkSteps.length, pendingAction, userHash, role]);

  // Submit Review Action
  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewId.trim() || !newEmployeeId.trim()) return;

    const empHash = await sha256(newEmployeeId.trim().toLowerCase());
    const reviewData = {
      reviewId: newReviewId.trim(),
      employeeHash: empHash,
      reviewerHash: userHash,
      rating: Number(newRating),
      strengths: newStrengths,
      areasForImprovement: newAreas,
      comments: newComments,
      goals: newGoals,
      promotionRecommendation: newPromo,
      salaryRecommendation: newSalary,
      timestamp: Math.floor(Date.now() / 1000).toString(),
    };

    const action = async () => {
      // 1. Save to Express database
      const response = await fetch(`${BACKEND_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Failed to submit review');
      }

      // Reset form fields
      setNewReviewId('');
      setNewEmployeeId('');
      setNewRating('3');
      setNewStrengths('');
      setNewAreas('');
      setNewComments('');
      setNewGoals('');
      setNewPromo(false);
      setNewSalary('80000');
    };

    // Trigger ZK proof presentation
    triggerZkFlow([
      'Acquiring private witness inputs locally',
      'Generating local zero-knowledge proof of performance ratings (submitReview circuit)',
      'Constructing & balancing gas/dust transaction',
      'Submitting proof commitment to Midnight ledger'
    ], action);
  };

  // Acknowledge Review Action
  const acknowledgeReview = async (reviewId: string) => {
    const action = async () => {
      const response = await fetch(`${BACKEND_URL}/reviews/${reviewId}/acknowledge`, {
        method: 'POST',
        headers: { 'x-user-hash': userHash }
      });
      if (!response.ok) {
        throw new Error('Failed to acknowledge review on backend');
      }
      setSelectedReview(null);
    };

    triggerZkFlow([
      'Loading private review witness locally',
      'Generating local proof of matching commitment (acknowledgeReview circuit)',
      'Submitting status change transaction to Midnight blockchain'
    ], action);
  };

  // Appeal Review Action
  const submitAppeal = async (reviewId: string) => {
    if (!appealText.trim()) return;

    const action = async () => {
      const response = await fetch(`${BACKEND_URL}/reviews/${reviewId}/appeal`, {
        method: 'POST',
        headers: { 
          'x-user-hash': userHash,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ appealMessage: appealText.trim() })
      });
      if (!response.ok) {
        throw new Error('Failed to submit appeal to backend');
      }
      setAppealText('');
      setSelectedReview(null);
    };

    triggerZkFlow([
      'Hashing appeal comments to 32-byte witness commitment',
      'Generating local ZK proof (submitAppeal circuit)',
      'Broadcasting status change transaction to Midnight network'
    ], action);
  };

  // Filter reviews by tab
  const filteredReviews = reviews.filter(r => {
    if (activeTab === 'pending') return r.status === 1;
    if (activeTab === 'completed') return r.status === 2 || r.status === 3;
    return true;
  });

  return (
    <div className="min-h-screen text-slate-100 flex flex-col animate-fadeIn">
      
      {/* HEADER NAVBAR */}
      <header className="border-b border-indigo-950/40 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl glow-effect-primary">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                Midnight Review
              </span>
              <span className="ml-2 text-xs bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 px-2 py-0.5 rounded-full font-semibold">
                Confidential
              </span>
            </div>
          </div>

          {role !== 'guest' && (
            <div className="flex items-center space-x-4">
              {/* Wallet connection banner */}
              {walletConnected ? (
                <div className="hidden md:flex items-center space-x-2 bg-indigo-950/30 border border-indigo-900/40 rounded-xl px-3.5 py-1.5 text-xs text-indigo-200">
                  <Unlock className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="font-mono text-indigo-300">{walletAddress}</span>
                  <span className="text-slate-600">|</span>
                  <span className="font-semibold text-emerald-400">{walletBalance} tNIGHT</span>
                  <button 
                    onClick={disconnectWallet}
                    className="ml-2 text-[10px] text-red-400 hover:text-red-300 underline"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button 
                  onClick={connectWallet}
                  disabled={connectingWallet}
                  className="hidden md:flex items-center space-x-2 bg-indigo-900/40 border border-indigo-700/50 text-indigo-200 hover:text-white px-3 py-1.5 rounded-xl text-xs transition"
                >
                  <Lock className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
                  <span>{connectingWallet ? 'Connecting...' : 'Connect Lace Wallet'}</span>
                </button>
              )}

              {/* User badge */}
              <div className="flex items-center space-x-2.5 bg-slate-900 border border-indigo-950 px-3 py-1.5 rounded-xl">
                <div className="h-6 w-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-indigo-400" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold leading-none capitalize">{userId}</p>
                  <p className="text-[10px] text-indigo-400 font-medium capitalize mt-0.5">{role} Role</p>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-900 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* SYSTEM STATUS BANNER */}
      {error && (
        <div className="bg-red-950/40 border-b border-red-900/40 text-red-200 px-4 py-2.5 text-center text-xs flex items-center justify-center space-x-2 fade-in">
          <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => fetchReviews(userHash, role)} className="underline hover:text-red-100 flex items-center space-x-0.5">
            <RefreshCw className="h-3 w-3 inline" /> <span>Retry</span>
          </button>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-950/40 border-b border-emerald-900/40 text-emerald-200 px-4 py-2.5 text-center text-xs flex items-center justify-center space-x-2 fade-in">
          <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 1. GUEST / LANDING / LOGIN SCREEN */}
        {role === 'guest' && (
          <div className="max-w-4xl mx-auto py-12 flex flex-col md:flex-row items-center gap-12 fade-in">
            <div className="flex-1 space-y-6 text-left">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Confidential <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Performance Review
                </span>
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed">
                A privacy-preserving employee evaluation portal built on the Midnight blockchain. Separation of public workflow state from private rating & feedback data.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-indigo-950/20 border border-indigo-900/30 rounded-2xl">
                  <Lock className="h-6 w-6 text-indigo-400 mb-2" />
                  <h3 className="font-bold text-white text-sm">Zero-Knowledge</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Ratings, goals, comments are never stored on public ledger.</p>
                </div>
                <div className="p-4 bg-purple-950/20 border border-purple-900/30 rounded-2xl">
                  <CheckCircle className="h-6 w-6 text-purple-400 mb-2" />
                  <h3 className="font-bold text-white text-sm">On-chain Workflow</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Reviews exist as hashed states, ensuring tracking without content leaks.</p>
                </div>
              </div>
            </div>

            {/* Login Glass Panel */}
            <div className="w-full md:w-[380px] glass-panel p-6 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
              
              <div className="text-left">
                <h2 className="text-2xl font-extrabold text-white">Sign In</h2>
                <p className="text-xs text-slate-400 mt-1">Select your portal role & enter identity.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2 text-left">
                  <label className="text-xs font-semibold text-indigo-300">Select Portal Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setLoginRole('manager')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition flex flex-col items-center justify-center gap-1.5 ${
                        loginRole === 'manager' 
                        ? 'bg-indigo-900/50 border-indigo-500 text-white' 
                        : 'bg-slate-900 border-indigo-950/60 text-slate-400 hover:border-indigo-900/40'
                      }`}
                    >
                      <Briefcase className="h-4 w-4" />
                      <span>Manager</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginRole('employee')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition flex flex-col items-center justify-center gap-1.5 ${
                        loginRole === 'employee' 
                        ? 'bg-indigo-900/50 border-indigo-500 text-white' 
                        : 'bg-slate-900 border-indigo-950/60 text-slate-400 hover:border-indigo-900/40'
                      }`}
                    >
                      <User className="h-4 w-4" />
                      <span>Employee</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginRole('hr')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition flex flex-col items-center justify-center gap-1.5 ${
                        loginRole === 'hr' 
                        ? 'bg-indigo-900/50 border-indigo-500 text-white' 
                        : 'bg-slate-900 border-indigo-950/60 text-slate-400 hover:border-indigo-900/40'
                      }`}
                    >
                      <Users className="h-4 w-4" />
                      <span>HR Admin</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-left fade-in">
                  <label className="text-xs font-semibold text-indigo-300">
                    {loginRole === 'manager' && 'Manager ID (Email or username)'}
                    {loginRole === 'employee' && 'Employee ID (Email or username)'}
                    {loginRole === 'hr' && 'Admin Account Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. alice@company.com"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full bg-slate-950 border border-indigo-950/60 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                  />
                  <p className="text-[10px] text-slate-500 italic mt-1 leading-normal">
                    ℹ This ID will be hashed locally into a ZK identity commitment. Your plain text ID never goes to the public blockchain.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!userId.trim() || loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-xs flex items-center justify-center space-x-2"
                >
                  {loading ? 'Hashing...' : 'Enter Secure Portal'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 2. MANAGER DASHBOARD & SUBMISSION */}
        {role === 'manager' && (
          <div className="space-y-8 fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-left">
                <h1 className="text-3xl font-black text-white">Manager Portal</h1>
                <p className="text-xs text-slate-400 mt-1">Submit employee evaluations privately to the Midnight blockchain.</p>
              </div>
              <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-2xl px-5 py-3 flex items-center space-x-4">
                <Briefcase className="h-8 w-8 text-indigo-400" />
                <div className="text-left">
                  <p className="text-[10px] text-indigo-300 font-semibold tracking-wider uppercase leading-none">Reviewer Identity Hash</p>
                  <p className="font-mono text-xs font-bold text-slate-400 mt-1 leading-none">{userHash.substring(0, 16)}...</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Form Side */}
              <div className="lg:col-span-2 glass-panel p-6 shadow-xl relative space-y-6">
                <div className="flex items-center space-x-2.5 pb-4 border-b border-indigo-950/40">
                  <PlusCircle className="h-5 w-5 text-indigo-400" />
                  <h2 className="text-lg font-bold text-white">Submit New Confidential Review</h2>
                </div>

                <form onSubmit={submitReview} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Unique Review ID</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. rev-2026-q2-01"
                        value={newReviewId}
                        onChange={(e) => setNewReviewId(e.target.value)}
                        className="w-full bg-slate-950 border border-indigo-950/60 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Employee ID</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. bob@company.com"
                        value={newEmployeeId}
                        onChange={(e) => setNewEmployeeId(e.target.value)}
                        className="w-full bg-slate-950 border border-indigo-950/60 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Confidential Performance Rating</label>
                      <select
                        value={newRating}
                        onChange={(e) => setNewRating(e.target.value)}
                        className="w-full bg-slate-950 border border-indigo-950/60 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                      >
                        <option value="5">5 ★ Excellent Performance</option>
                        <option value="4">4 ★ High Performance</option>
                        <option value="3">3 ★ Strong Contributor</option>
                        <option value="2">2 ★ Needs Improvement</option>
                        <option value="1">1 ★ Unsatisfactory</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Promotion recommendation?</label>
                      <div className="flex h-[38px] items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={newPromo} 
                            onChange={(e) => setNewPromo(e.target.checked)} 
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-slate-950 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          <span className="ml-3 text-xs font-medium text-slate-300">{newPromo ? 'Recommended' : 'Not Recommended'}</span>
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Salary recommendation ($)</label>
                      <input
                        type="number"
                        required
                        value={newSalary}
                        onChange={(e) => setNewSalary(e.target.value)}
                        className="w-full bg-slate-950 border border-indigo-950/60 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-xs font-semibold text-slate-300">Key Strengths</label>
                    <input
                      type="text"
                      required
                      placeholder="List 2-3 key strengths"
                      value={newStrengths}
                      onChange={(e) => setNewStrengths(e.target.value)}
                      className="w-full bg-slate-950 border border-indigo-950/60 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-xs font-semibold text-slate-300">Areas for Improvement</label>
                    <input
                      type="text"
                      required
                      placeholder="Areas to address"
                      value={newAreas}
                      onChange={(e) => setNewAreas(e.target.value)}
                      className="w-full bg-slate-950 border border-indigo-950/60 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-xs font-semibold text-slate-300">Manager Comments / Feedback Details</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Detailed feedback comments..."
                      value={newComments}
                      onChange={(e) => setNewComments(e.target.value)}
                      className="w-full bg-slate-950 border border-indigo-950/60 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-xs font-semibold text-slate-300">Goal Tracking / Core OKRs</label>
                    <input
                      type="text"
                      required
                      placeholder="Agreed goals for next quarter"
                      value={newGoals}
                      onChange={(e) => setNewGoals(e.target.value)}
                      className="w-full bg-slate-950 border border-indigo-950/60 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary text-xs flex items-center justify-center space-x-2 mt-4"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Generate ZK Proof & Submit Review</span>
                  </button>
                </form>
              </div>

              {/* History List Side */}
              <div className="glass-panel p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-indigo-950/40">
                  <h2 className="text-base font-bold text-white">Review History</h2>
                  <button onClick={() => fetchReviews(userHash, role)} className="p-1 hover:bg-slate-900 rounded text-slate-400">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {reviews.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs">No reviews submitted yet.</div>
                  ) : (
                    reviews.map((rev) => (
                      <div 
                        key={rev.reviewId}
                        onClick={() => setSelectedReview(rev)}
                        className="p-3 bg-indigo-950/10 hover:bg-indigo-950/20 border border-indigo-950/60 hover:border-indigo-800/40 rounded-xl cursor-pointer transition text-left space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-indigo-300">{rev.reviewId}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            rev.status === 1 ? 'bg-indigo-950 text-indigo-300 border border-indigo-900/50' :
                            rev.status === 2 ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' :
                            'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                          }`}>
                            {getStatusString(rev.status)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono">Emp: {rev.employeeHash.substring(0, 16)}...</p>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                          <span>Rating: {rev.rating} ★</span>
                          <span>{new Date(Number(rev.timestamp) * 1000).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Manager View Detail Modal */}
            {selectedReview && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="glass-panel max-w-xl w-full p-6 shadow-2xl space-y-6 fade-in text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-indigo-950/40">
                    <h3 className="text-lg font-bold text-white">Review: {selectedReview.reviewId}</h3>
                    <button 
                      onClick={() => setSelectedReview(null)}
                      className="text-slate-400 hover:text-white font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-950/60 p-3 border border-indigo-950 rounded-xl">
                      <p className="text-slate-500 uppercase tracking-wider font-semibold text-[9px]">Rating</p>
                      <p className="text-lg font-extrabold text-white mt-1">{selectedReview.rating} / 5</p>
                    </div>
                    <div className="bg-slate-950/60 p-3 border border-indigo-950 rounded-xl">
                      <p className="text-slate-500 uppercase tracking-wider font-semibold text-[9px]">Promotion</p>
                      <p className="text-xs font-bold text-indigo-300 mt-1.5">{selectedReview.promotionRecommendation ? 'Recommended' : 'None'}</p>
                    </div>
                    <div className="bg-slate-950/60 p-3 border border-indigo-950 rounded-xl">
                      <p className="text-slate-500 uppercase tracking-wider font-semibold text-[9px]">Salary</p>
                      <p className="text-xs font-bold text-white mt-1.5">${Number(selectedReview.salaryRecommendation).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-3 bg-slate-950/40 p-4 border border-indigo-950/30 rounded-xl text-xs">
                    <div>
                      <h4 className="font-bold text-indigo-300">Strengths</h4>
                      <p className="text-slate-300 mt-1">{selectedReview.strengths}</p>
                    </div>
                    <hr className="border-indigo-950/40" />
                    <div>
                      <h4 className="font-bold text-indigo-300">Improvement Areas</h4>
                      <p className="text-slate-300 mt-1">{selectedReview.areasForImprovement}</p>
                    </div>
                    <hr className="border-indigo-950/40" />
                    <div>
                      <h4 className="font-bold text-indigo-300">Manager Comments</h4>
                      <p className="text-slate-300 mt-1 leading-normal">{selectedReview.comments}</p>
                    </div>
                    <hr className="border-indigo-950/40" />
                    <div>
                      <h4 className="font-bold text-indigo-300">Goals</h4>
                      <p className="text-slate-300 mt-1">{selectedReview.goals}</p>
                    </div>
                  </div>

                  {selectedReview.appealMessage && (
                    <div className="p-3 bg-amber-950/20 border border-amber-900/30 rounded-xl text-xs">
                      <h4 className="font-bold text-amber-400">Employee Appeal Message</h4>
                      <p className="text-slate-300 mt-1 italic font-medium">"{selectedReview.appealMessage}"</p>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedReview(null)}
                    className="w-full btn-secondary text-xs font-bold"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. EMPLOYEE PORTAL */}
        {role === 'employee' && (
          <div className="space-y-8 fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-left">
                <h1 className="text-3xl font-black text-white">Employee Portal</h1>
                <p className="text-xs text-slate-400 mt-1">Access your confidential performance evaluations and submit signatures/appeals.</p>
              </div>
              <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-2xl px-5 py-3 flex items-center space-x-4">
                <User className="h-8 w-8 text-indigo-400" />
                <div className="text-left">
                  <p className="text-[10px] text-indigo-300 font-semibold tracking-wider uppercase leading-none">Employee Identity Hash</p>
                  <p className="font-mono text-xs font-bold text-slate-400 mt-1 leading-none">{userHash.substring(0, 16)}...</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* List of Reviews */}
              <div className="lg:col-span-1 glass-panel p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-indigo-950/40">
                  <h2 className="text-base font-bold text-white">Your Appraisals</h2>
                  <button onClick={() => fetchReviews(userHash, role)} className="p-1 hover:bg-slate-900 rounded text-slate-400">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {reviews.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs">No reviews found for your identity hash.</div>
                  ) : (
                    reviews.map((rev) => (
                      <div 
                        key={rev.reviewId}
                        onClick={() => setSelectedReview(rev)}
                        className={`p-4 rounded-xl text-left cursor-pointer border transition space-y-2 ${
                          selectedReview?.reviewId === rev.reviewId
                          ? 'bg-indigo-900/20 border-indigo-500'
                          : 'bg-indigo-950/10 hover:bg-indigo-950/20 border-indigo-950/60 hover:border-indigo-800/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-indigo-300">{rev.reviewId}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            rev.status === 1 ? 'bg-indigo-950 text-indigo-300 border border-indigo-900/50' :
                            rev.status === 2 ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' :
                            'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                          }`}>
                            {getStatusString(rev.status)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span className="font-semibold text-slate-300">Rating: {rev.rating} ★</span>
                          <span>{new Date(Number(rev.timestamp) * 1000).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Review Details View & Actions */}
              <div className="lg:col-span-2 glass-panel p-6 shadow-xl relative min-h-[400px]">
                {selectedReview ? (
                  <div className="space-y-6 fade-in text-left">
                    <div className="flex items-center justify-between pb-4 border-b border-indigo-950/40">
                      <div>
                        <h2 className="text-xl font-bold text-white">{selectedReview.reviewId} Details</h2>
                        <p className="text-[10px] text-slate-500 mt-1">Created: {new Date(Number(selectedReview.timestamp) * 1000).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                          selectedReview.status === 1 ? 'bg-indigo-950 text-indigo-300 border border-indigo-900/50' :
                          selectedReview.status === 2 ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' :
                          'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                        }`}>
                          {getStatusString(selectedReview.status)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-slate-950/60 p-4 border border-indigo-950 rounded-2xl flex flex-col justify-center">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Evaluation Rating</p>
                        <p className="text-3xl font-extrabold text-white mt-1">{selectedReview.rating} <span className="text-lg text-indigo-400">/ 5</span></p>
                      </div>
                      <div className="bg-slate-950/60 p-4 border border-indigo-950 rounded-2xl flex flex-col justify-center">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Promotion Recommendation</p>
                        <p className={`text-sm font-bold mt-2 flex items-center space-x-1.5 ${selectedReview.promotionRecommendation ? 'text-emerald-400' : 'text-slate-400'}`}>
                          <TrendingUp className="h-4 w-4" />
                          <span>{selectedReview.promotionRecommendation ? 'Recommended' : 'None'}</span>
                        </p>
                      </div>
                      <div className="bg-slate-950/60 p-4 border border-indigo-950 rounded-2xl flex flex-col justify-center">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Salary Recommendation</p>
                        <p className="text-base font-bold text-white mt-1.5 flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-emerald-500" />
                          <span>${Number(selectedReview.salaryRecommendation).toLocaleString()}</span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 bg-slate-950/30 border border-indigo-950/40 p-5 rounded-2xl">
                      <div>
                        <h4 className="text-xs font-bold text-indigo-300">Core Strengths</h4>
                        <p className="text-xs text-slate-300 mt-1">{selectedReview.strengths}</p>
                      </div>
                      <hr className="border-indigo-950/40" />
                      <div>
                        <h4 className="text-xs font-bold text-indigo-300">Areas for Improvement</h4>
                        <p className="text-xs text-slate-300 mt-1">{selectedReview.areasForImprovement}</p>
                      </div>
                      <hr className="border-indigo-950/40" />
                      <div>
                        <h4 className="text-xs font-bold text-indigo-300">Manager Comments</h4>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedReview.comments}</p>
                      </div>
                      <hr className="border-indigo-950/40" />
                      <div>
                        <h4 className="text-xs font-bold text-indigo-300">Future Goals</h4>
                        <p className="text-xs text-slate-300 mt-1">{selectedReview.goals}</p>
                      </div>
                    </div>

                    {selectedReview.appealMessage && (
                      <div className="p-4 bg-amber-950/20 border border-amber-900/30 rounded-2xl">
                        <h4 className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>Submitted Appeal Comments</span>
                        </h4>
                        <p className="text-xs text-slate-300 mt-1.5 italic leading-relaxed">
                          "{selectedReview.appealMessage}"
                        </p>
                      </div>
                    )}

                    {/* Actions panel */}
                    {selectedReview.status === 1 && (
                      <div className="pt-4 border-t border-indigo-950/40 flex space-x-4">
                        <button
                          onClick={() => acknowledgeReview(selectedReview.reviewId)}
                          className="flex-grow btn-primary text-xs flex items-center justify-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Acknowledge Review (Sign ZK Circuit)</span>
                        </button>
                      </div>
                    )}

                    {selectedReview.status === 2 && (
                      <div className="pt-4 border-t border-indigo-950/40 space-y-3">
                        <h4 className="text-xs font-bold text-slate-300">Submit an Appeal</h4>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Enter your appeal comments..."
                            value={appealText}
                            onChange={(e) => setAppealText(e.target.value)}
                            className="flex-grow bg-slate-950 border border-indigo-950/60 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                          />
                          <button
                            onClick={() => submitAppeal(selectedReview.reviewId)}
                            className="bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs px-4 rounded-xl flex items-center space-x-1.5 transition"
                          >
                            <Send className="h-3.5 w-3.5" />
                            <span>Appeal</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-24">
                    <FileText className="h-10 w-10 text-slate-600 mb-3" />
                    <span>Select an evaluation from the list to view secure details.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. HR ADMIN MONITOR VIEW */}
        {role === 'hr' && (
          <div className="space-y-8 fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-left">
                <h1 className="text-3xl font-black text-white">HR Workflow Dashboard</h1>
                <p className="text-xs text-slate-400 mt-1">Monitor workflow progress. Public metadata is visible, but private feedback remains locked on the ledger.</p>
              </div>
              <div className="bg-slate-900 border border-indigo-950 rounded-2xl px-5 py-3 flex items-center space-x-4">
                <Users className="h-8 w-8 text-indigo-400" />
                <div className="text-left">
                  <p className="text-[10px] text-indigo-300 font-semibold tracking-wider uppercase leading-none">Security Access</p>
                  <p className="text-xs font-bold text-emerald-400 mt-1 leading-none">Zero-Knowledge Monitor Mode</p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-950/40">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-bold text-white">Workflow Index ({reviews.length})</h2>
                  <div className="flex bg-slate-950 border border-indigo-950 p-0.5 rounded-lg text-[10px]">
                    <button 
                      onClick={() => setActiveTab('all')} 
                      className={`px-3 py-1 rounded-md font-semibold ${activeTab === 'all' ? 'bg-indigo-950 text-indigo-300' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setActiveTab('pending')} 
                      className={`px-3 py-1 rounded-md font-semibold ${activeTab === 'pending' ? 'bg-indigo-950 text-indigo-300' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      Pending
                    </button>
                    <button 
                      onClick={() => setActiveTab('completed')} 
                      className={`px-3 py-1 rounded-md font-semibold ${activeTab === 'completed' ? 'bg-indigo-950 text-indigo-300' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      Completed
                    </button>
                  </div>
                </div>
                <button onClick={() => fetchReviews(userHash, role)} className="p-1 hover:bg-slate-900 rounded text-slate-400">
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>

              {filteredReviews.length === 0 ? (
                <div className="text-center py-24 text-slate-500 text-xs">No reviews match the current workflow filter.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-indigo-950 text-indigo-300 font-semibold">
                        <th className="py-3 px-4">Review ID (Public Key)</th>
                        <th className="py-3 px-4">Employee Hash</th>
                        <th className="py-3 px-4">Reviewer Hash</th>
                        <th className="py-3 px-4">Workflow Status</th>
                        <th className="py-3 px-4">Created Time</th>
                        <th className="py-3 px-4 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-950/30">
                      {filteredReviews.map((rev) => (
                        <tr key={rev.reviewId} className="hover:bg-indigo-950/5 transition">
                          <td className="py-3.5 px-4 font-bold text-slate-300">{rev.reviewId}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-500 text-[10px]">{rev.employeeHash.substring(0, 24)}...</td>
                          <td className="py-3.5 px-4 font-mono text-slate-500 text-[10px]">{rev.reviewerHash.substring(0, 24)}...</td>
                          <td className="py-3.5 px-4">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              rev.status === 1 ? 'bg-indigo-950 text-indigo-300 border border-indigo-900/50' :
                              rev.status === 2 ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' :
                              'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                            }`}>
                              {getStatusString(rev.status)}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">{new Date(Number(rev.timestamp) * 1000).toLocaleString()}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button 
                              onClick={() => setSelectedReview(rev)}
                              className="p-1.5 text-indigo-400 hover:bg-indigo-950/30 rounded-lg transition"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* HR Public View Modal */}
            {selectedReview && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="glass-panel max-w-xl w-full p-6 shadow-2xl space-y-6 fade-in text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-indigo-950/40">
                    <h3 className="text-lg font-bold text-white">Review ID: {selectedReview.reviewId}</h3>
                    <button 
                      onClick={() => setSelectedReview(null)}
                      className="text-slate-400 hover:text-white font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="bg-red-950/10 border border-red-950 text-xs p-4 rounded-xl flex items-start space-x-3">
                    <Lock className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-red-300">Privacy Enabled (Zero-Knowledge)</h4>
                      <p className="text-slate-400 mt-1 leading-relaxed">
                        Ratings, comments, recommendations, and goals are stored as a local cryptographic commitment. They are encrypted and cannot be viewed by HR or Admins on the ledger.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Public Ledger State</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-slate-500">Employee Hash</p>
                        <p className="font-mono text-slate-300 mt-1 text-[10px] break-all bg-slate-950 p-2 border border-indigo-950 rounded-lg">{selectedReview.employeeHash}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Reviewer/Manager Hash</p>
                        <p className="font-mono text-slate-300 mt-1 text-[10px] break-all bg-slate-950 p-2 border border-indigo-950 rounded-lg">{selectedReview.reviewerHash}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Workflow Status</p>
                        <p className="font-bold text-slate-300 mt-1">{getStatusString(selectedReview.status)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Timestamp</p>
                        <p className="font-bold text-slate-300 mt-1">{new Date(Number(selectedReview.timestamp) * 1000).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedReview(null)}
                    className="w-full btn-secondary text-xs"
                  >
                    Close Monitor
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-indigo-950/40 bg-slate-950/20 py-8 text-center text-xs text-slate-600 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 Confidential Performance Review dApp. All rights reserved.</p>
          <div className="flex items-center space-x-1.5 text-indigo-500/60">
            <Shield className="h-4 w-4" />
            <span className="font-semibold">Midnight Zero-Knowledge Protocol</span>
          </div>
        </div>
      </footer>

      {/* ZERO-KNOWLEDGE PROOF STEP MODAL */}
      {zkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 shadow-2xl text-center space-y-6 glow-effect-primary border-indigo-500/30">
            <div className="flex justify-center">
              <div className="p-4 bg-indigo-950/40 border border-indigo-500/20 rounded-full animate-pulse">
                <Shield className="h-10 w-10 text-indigo-400" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white">Generating ZK Transaction</h3>
              <p className="text-xs text-slate-400 mt-1">Midnight network is compiling witnesses and proving statements locally.</p>
            </div>

            <div className="space-y-3 text-left">
              {zkSteps.map((step, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-xs">
                  {step.status === 'success' && <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />}
                  {step.status === 'loading' && <RefreshCw className="h-4 w-4 text-indigo-400 animate-spin flex-shrink-0" />}
                  {step.status === 'pending' && <Clock className="h-4 w-4 text-slate-700 flex-shrink-0" />}
                  <span className={`${
                    step.status === 'success' ? 'text-slate-300 font-medium' :
                    step.status === 'loading' ? 'text-indigo-300 font-bold' :
                    'text-slate-600'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full transition-all duration-300"
                style={{ width: `${(zkSteps.filter(s => s.status === 'success').length / zkSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
