import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  PlusCircle, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles
} from 'lucide-react';

import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { ReviewWizard } from './components/ReviewWizard';
import { ReviewTable } from './components/ReviewTable';
import type { Review } from './components/ReviewTable';
import { HRDashboard } from './components/HRDashboard';
import { ProofProgressModal } from './components/ProofProgressModal';
import { ToastContainer } from './components/ToastContainer';
import type { ToastMessage } from './components/ToastContainer';
import { ReviewDetailModal } from './components/ReviewDetailModal';

const BACKEND_URL = 'http://localhost:5000/api';

// Helper to hash string to SHA-256 hex in browser
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function App() {
  // Navigation & Role States
  const [role, setRole] = useState<'guest' | 'manager' | 'employee' | 'hr'>('guest');
  const [loginRole, setLoginRole] = useState<'manager' | 'employee' | 'hr'>('manager');
  const [userId, setUserId] = useState('');
  const [userHash, setUserHash] = useState('');
  const [activeNavTab, setActiveNavTab] = useState('dashboard');

  // UI Layout States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Review Data & Detail States
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealReviewId, setAppealReviewId] = useState('');
  const [appealText, setAppealText] = useState('');

  // Wallet States
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('1,250.00');
  const [connectingWallet, setConnectingWallet] = useState(false);

  // ZK-Proof Modal States
  const [zkModalOpen, setZkModalOpen] = useState(false);
  const [zkSteps, setZkSteps] = useState<{ label: string; status: 'pending' | 'loading' | 'success' | 'failed' }[]>([]);
  const [zkStepIndex, setZkStepIndex] = useState(0);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Handle Login & Cryptographic Hash Identity
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;
    setLoading(true);
    try {
      const hash = await sha256(userId.trim().toLowerCase());
      setUserHash(hash);
      setRole(loginRole);
      
      // Auto-connect wallet
      setWalletAddress(`mn_addr_preprod_${hash.substring(0, 16)}...`);
      setWalletConnected(true);
      setWalletBalance('1,250.00');
      
      fetchReviews(hash, loginRole);
      addToast('success', 'Identity Verified', `Logged in as ${loginRole.toUpperCase()} (${userId})`);
    } catch (err: any) {
      addToast('error', 'Login Failed', err?.message || 'Identity initialization error');
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
    addToast('info', 'Logged Out', 'Returned to landing portal');
  };

  // Fetch reviews from Express API
  const fetchReviews = async (hash: string, userRole: string) => {
    setLoading(true);
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
      addToast('error', 'Backend Error', err?.message || 'Ensure Express server is running on port 5000');
    } finally {
      setLoading(false);
    }
  };

  // Lace Wallet connection
  const connectWallet = async () => {
    setConnectingWallet(true);
    try {
      if ((window as any).midnight?.lace) {
        const lace = await (window as any).midnight.lace.enable();
        const state = await lace.state();
        setWalletAddress(state.address || 'mn_addr_preprod_lace_wallet');
        setWalletConnected(true);
        addToast('success', 'Midnight Lace Connected', 'Connected via Lace browser extension');
      } else {
        await new Promise((r) => setTimeout(r, 1000));
        setWalletAddress(userHash ? `mn_addr_preprod_${userHash.substring(0, 16)}...` : 'mn_addr_preprod_mock_wallet');
        setWalletConnected(true);
        addToast('info', 'Devnet Wallet Connected', 'Simulated Midnight Lace Wallet active');
      }
    } catch (err: any) {
      addToast('error', 'Wallet Error', err?.message || 'Failed to connect Midnight Lace Wallet');
    } finally {
      setConnectingWallet(false);
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    addToast('info', 'Wallet Disconnected', 'Disconnected from Midnight Network');
  };

  // Trigger ZK Flow Modal
  const triggerZkFlow = (steps: string[], finalAction: () => Promise<void>) => {
    setZkSteps(steps.map(label => ({ label, status: 'pending' })));
    setZkStepIndex(0);
    setZkModalOpen(true);
    setPendingAction(() => finalAction);
  };

  // Step progress effect
  useEffect(() => {
    if (!zkModalOpen || zkSteps.length === 0 || zkStepIndex >= zkSteps.length) return;

    const currentStep = zkSteps[zkStepIndex];
    if (currentStep.status === 'pending') {
      const updated = [...zkSteps];
      updated[zkStepIndex].status = 'loading';
      setZkSteps(updated);

      const duration = zkStepIndex === 1 ? 2200 : 1200;
      const timer = setTimeout(() => {
        const completed = [...zkSteps];
        completed[zkStepIndex].status = 'success';
        setZkSteps(completed);
        setZkStepIndex(prev => prev + 1);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [zkModalOpen, zkSteps, zkStepIndex]);

  // Execute action after ZK proof completion
  useEffect(() => {
    if (zkModalOpen && zkStepIndex === zkSteps.length && pendingAction) {
      const runAction = async () => {
        try {
          await pendingAction();
          addToast('success', 'Transaction Confirmed', 'ZK proof verified and committed on Midnight ledger!');
        } catch (err: any) {
          addToast('error', 'Transaction Failed', err?.message || 'Failed to submit transaction');
        } finally {
          setZkModalOpen(false);
          setPendingAction(null);
          fetchReviews(userHash, role);
        }
      };
      runAction();
    }
  }, [zkModalOpen, zkStepIndex, zkSteps.length, pendingAction, userHash, role]);

  // Submit Review Handler from Wizard
  const handleWizardSubmit = async (formData: {
    reviewId: string;
    employeeId: string;
    rating: string;
    strengths: string;
    areas: string;
    comments: string;
    goals: string;
    promo: boolean;
    salary: string;
  }) => {
    setShowWizardModal(false);
    const empHash = await sha256(formData.employeeId.trim().toLowerCase());
    const reviewData = {
      reviewId: formData.reviewId,
      employeeHash: empHash,
      reviewerHash: userHash,
      rating: Number(formData.rating),
      strengths: formData.strengths,
      areasForImprovement: formData.areas,
      comments: formData.comments,
      goals: formData.goals,
      promotionRecommendation: formData.promo,
      salaryRecommendation: formData.salary,
      timestamp: Math.floor(Date.now() / 1000).toString()
    };

    const action = async () => {
      const response = await fetch(`${BACKEND_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to submit review');
      }
    };

    triggerZkFlow([
      'Preparing Witness Circuit Inputs',
      'Generating ZK Proof on Proof Server',
      'Validating State Transition Rules',
      'Broadcasting Transaction to Midnight Network'
    ], action);
  };

  // Acknowledge Review Handler
  const handleAcknowledgeReview = (rev: Review) => {
    const action = async () => {
      const response = await fetch(`${BACKEND_URL}/reviews/${rev.reviewId}/acknowledge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-hash': userHash
        },
        body: JSON.stringify({
          rating: rev.rating || 4,
          strengths: rev.strengths || '',
          areasForImprovement: rev.areasForImprovement || '',
          comments: rev.comments || '',
          goals: rev.goals || '',
          promotionRecommendation: rev.promotionRecommendation || false,
          salaryRecommendation: rev.salaryRecommendation || '0'
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to acknowledge review');
      }
    };

    triggerZkFlow([
      'Verifying Private Review Commitment Match',
      'Generating ZK Proof for Acknowledgment Circuit',
      'Submitting Acknowledged State to Midnight Ledger'
    ], action);
  };

  // Appeal Handler
  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealReviewId || !appealText.trim()) return;
    setShowAppealModal(false);

    const action = async () => {
      const response = await fetch(`${BACKEND_URL}/reviews/${appealReviewId}/appeal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-hash': userHash
        },
        body: JSON.stringify({ appealMessage: appealText.trim() })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to submit appeal');
      }
    };

    triggerZkFlow([
      'Validating Employee Identity Witness',
      'Generating ZK Proof for Appeal Circuit',
      'Broadcasting Appealed State to Midnight Blockchain'
    ], action);
  };

  // Landing Page for Guest Mode
  if (role === 'guest') {
    return (
      <div className="min-h-screen bg-[#0B0E17] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <ToastContainer toasts={toasts} onDismiss={(id) => setToasts(t => t.filter(x => x.id !== id))} />

        <div className="w-full max-w-md p-8 rounded-3xl bg-[#121829]/90 border border-white/15 shadow-2xl backdrop-blur-2xl space-y-6 relative z-10">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
              <Shield className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Confidential Performance Review</h1>
            <p className="text-xs text-gray-400">
              Privacy-Preserving Employee Evaluations powered by Midnight Zero-Knowledge Smart Contracts.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Select Role</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'manager', label: 'Manager' },
                  { id: 'employee', label: 'Employee' },
                  { id: 'hr', label: 'HR Admin' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLoginRole(item.id as any)}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      loginRole === item.id
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">User Identity ID</label>
              <input
                type="text"
                placeholder={loginRole === 'manager' ? 'e.g. mgr_alice' : loginRole === 'employee' ? 'e.g. emp_bob' : 'e.g. hr_admin'}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-indigo-500 outline-none"
                required
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Hashed to SHA-256 witness identity in your browser.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Identity...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Enter Enterprise Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center text-[11px] text-gray-400 space-y-1">
            <span className="block font-semibold text-gray-300">Midnight Privacy Model</span>
            <span className="block">Public On-Chain Commitments • Private Witness Storage</span>
          </div>
        </div>
      </div>
    );
  }

  // Main Enterprise Dashboard Layout
  return (
    <div className="min-h-screen bg-[#0B0E17] text-white flex flex-col md:flex-row">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts(t => t.filter(x => x.id !== id))} />

      {/* Sidebar */}
      <Sidebar
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        role={role}
        userHash={userHash}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <Navbar
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          walletConnected={walletConnected}
          walletAddress={walletAddress}
          walletBalance={walletBalance}
          connectingWallet={connectingWallet}
          onConnectWallet={connectWallet}
          onDisconnectWallet={disconnectWallet}
          role={role}
          userId={userId}
        />

        <main className="p-4 md:p-8 space-y-6 flex-1 max-w-7xl w-full mx-auto">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                {activeNavTab === 'dashboard' && 'Dashboard Overview'}
                {activeNavTab === 'reviews' && 'Performance Reviews'}
                {activeNavTab === 'analytics' && 'HR Privacy Analytics'}
                {activeNavTab === 'employees' && 'Employee Directory'}
                {activeNavTab === 'profile' && 'User Profile & Identity'}
                {activeNavTab === 'settings' && 'System Settings'}
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Zero-Knowledge confidential state anchored on Midnight Network.
              </p>
            </div>

            {role === 'manager' && (
              <button
                onClick={() => setShowWizardModal(true)}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Confidential Review</span>
              </button>
            )}
          </div>

          {/* Top Stat Cards */}
          <DashboardStats reviews={reviews} />

          {/* Role Views & Tab Content */}
          {role === 'hr' ? (
            <HRDashboard reviews={reviews} />
          ) : (
            <ReviewTable
              reviews={reviews}
              role={role}
              onSelectReview={(rev) => setSelectedReview(rev)}
              onAcknowledge={handleAcknowledgeReview}
              onAppeal={(rev) => {
                setAppealReviewId(rev.reviewId);
                setShowAppealModal(true);
              }}
            />
          )}
        </main>
      </div>

      {/* Review Creation Wizard Modal */}
      {showWizardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 overflow-y-auto">
          <ReviewWizard
            onCancel={() => setShowWizardModal(false)}
            onSubmit={handleWizardSubmit}
          />
        </div>
      )}

      {/* Review Detail Modal */}
      <ReviewDetailModal
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
        role={role}
        onAcknowledge={handleAcknowledgeReview}
        onAppeal={(rev) => {
          setAppealReviewId(rev.reviewId);
          setShowAppealModal(true);
        }}
      />

      {/* Appeal Form Modal */}
      {showAppealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#121829] border border-rose-500/40 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              File Confidential Review Appeal
            </h3>
            <p className="text-xs text-gray-400">
              Submit your formal appeal message. A ZK proof will transition the review status to Appealed on the Midnight ledger.
            </p>

            <form onSubmit={handleAppealSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Appeal Reason / Message</label>
                <textarea
                  rows={5}
                  placeholder="State your reasons for appealing this performance evaluation..."
                  value={appealText}
                  onChange={(e) => setAppealText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-rose-500 outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAppealModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-xs font-semibold hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition"
                >
                  Submit ZK Appeal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ZK Proof Progress Simulation Modal */}
      <ProofProgressModal
        isOpen={zkModalOpen}
        steps={zkSteps}
        stepIndex={zkStepIndex}
      />
    </div>
  );
}
