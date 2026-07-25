import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  Wallet, 
  RefreshCw, 
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onMobileMenuToggle: () => void;
  walletConnected: boolean;
  walletAddress: string;
  walletBalance: string;
  connectingWallet: boolean;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  role: 'guest' | 'manager' | 'employee' | 'hr';
  userId: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMobileMenuToggle,
  walletConnected,
  walletAddress,
  walletBalance,
  connectingWallet,
  onConnectWallet,
  onDisconnectWallet,
  userId
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);

  const notifications = [
    { id: '1', title: 'ZK Proof Verified', time: '2m ago', read: false },
    { id: '2', title: 'New Review Submitted', time: '1h ago', read: false },
    { id: '3', title: 'Contract State Synced', time: '3h ago', read: true }
  ];

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#121829]/80 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Midnight Local Devnet
          </span>
        </div>
      </div>

      {/* Right Navigation Utilities */}
      <div className="flex items-center space-x-3">
        {/* Wallet Connection Card / Button */}
        <div className="relative">
          {walletConnected ? (
            <button
              onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition text-xs"
            >
              <Wallet className="w-4 h-4 text-indigo-400" />
              <div className="flex flex-col text-left">
                <span className="font-mono-hash text-gray-200 font-semibold">{walletAddress.substring(0, 10)}...</span>
                <span className="text-[10px] text-indigo-300 font-medium">{walletBalance} tNIGHT</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
            </button>
          ) : (
            <button
              onClick={onConnectWallet}
              disabled={connectingWallet}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
            >
              {connectingWallet ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Connecting Lace...</span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 text-white" />
                  <span>Connect Midnight Wallet</span>
                </>
              )}
            </button>
          )}

          {/* Wallet Dropdown Details */}
          {walletDropdownOpen && walletConnected && (
            <div className="absolute right-0 mt-2 w-72 p-4 rounded-2xl bg-[#121829] border border-white/15 shadow-2xl z-50 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-semibold text-white">Midnight Wallet Info</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Lace Connected</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-gray-400">
                  <span>Network:</span>
                  <span className="text-gray-200 font-mono">undeployed (devnet)</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Address:</span>
                  <span className="text-indigo-300 font-mono-hash truncate max-w-[140px]">{walletAddress}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Balance:</span>
                  <span className="text-emerald-400 font-bold">{walletBalance} tNIGHT</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Proof Server:</span>
                  <span className="text-emerald-400 font-medium">Ready (6300)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onDisconnectWallet();
                  setWalletDropdownOpen(false);
                }}
                className="w-full mt-2 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium transition text-center"
              >
                Disconnect Wallet
              </button>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 p-3 rounded-2xl bg-[#121829] border border-white/15 shadow-2xl z-50 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5 px-1">
                <span className="font-semibold text-white">Notifications</span>
                <span className="text-[10px] text-indigo-400 font-medium">3 New</span>
              </div>
              <div className="divide-y divide-white/5 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 px-1 hover:bg-white/5 rounded-lg transition">
                    <div className="flex items-center justify-between font-medium text-gray-200">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-gray-500">{n.time}</span>
                    </div>
                    <span className="text-[11px] text-gray-400 block mt-0.5">Proof commitment confirmed on ledger.</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Identity Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
            {userId ? userId.substring(0, 2).toUpperCase() : 'US'}
          </div>
        </div>
      </div>
    </header>
  );
};
