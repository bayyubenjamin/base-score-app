'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useUserStats } from '@/hooks/useUserStats';
import { StatsGrid } from '@/components/StatsGrid';
import { ProfileCard } from '@/components/ProfileCard';
import HistoryList from '@/components/HistoryList';
import { Loader2, LogOut, Wallet } from 'lucide-react';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  
  const { data: stats, isLoading: loading } = useUserStats(address, isConnected);
  const [score, setScore] = useState(0);

  // Animasi Score
  useEffect(() => {
    const targetScore = (stats as any)?.score || (stats as any)?.totalScore || 0;
    if (targetScore) {
      let start = 0;
      const end = targetScore;
      const duration = 1200;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setScore(end);
          clearInterval(timer);
        } else {
          setScore(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [stats]);

  // Handle WalletConnect Connection
  const handleConnect = () => {
    const walletConnectConnector = connectors.find((c) => c.id === 'walletConnect');
    if (walletConnectConnector) {
      connect({ connector: walletConnectConnector });
    } else {
      // Fallback jika tidak ditemukan (ambil connector pertama)
      const first = connectors[0];
      if(first) connect({ connector: first });
    }
  };

  const getScoreColor = (s: number) => {
    if (s >= 800) return 'text-purple-400 stroke-purple-500';
    if (s >= 500) return 'text-blue-400 stroke-blue-500';
    return 'text-gray-400 stroke-gray-500';
  };

  const getScoreTier = (s: number) => {
    if (s >= 800) return 'ELITE';
    if (s >= 500) return 'PROFESSIONAL';
    return 'NOVICE';
  };

  // --- VIEW: NOT CONNECTED ---
  if (!isConnected || !address) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-[#0B0E14]">
        <div className="pro-card max-w-md w-full p-10 rounded-2xl text-center shadow-2xl border-t-4 border-t-blue-600">
          <div className="w-20 h-20 bg-blue-600/10 rounded-2xl mx-auto flex items-center justify-center mb-8 border border-blue-500/20">
             <Wallet className="w-10 h-10 text-blue-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-3">Onchain Analytics</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Connect your wallet via <span className="text-blue-400 font-semibold">WalletConnect</span> to generate your professional onchain credit score and activity report.
          </p>
          
          <button
            onClick={handleConnect}
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? <Loader2 className="animate-spin" /> : <Wallet size={20} />}
            {isPending ? 'Connecting...' : 'Connect Wallet'}
          </button>
          
          <p className="mt-6 text-xs text-gray-600">
            Powered by Base & Coinbase OnchainKit
          </p>
        </div>
      </main>
    );
  }

  // --- VIEW: DASHBOARD ---
  // Semi-circle gauge calculation
  const radius = 80;
  const circumference = Math.PI * radius; // Only half circle
  const progress = (score / 1000) * circumference;
  
  return (
    <main className="min-h-screen bg-[#0B0E14] pb-20">
      {/* Header Navigation */}
      <nav className="border-b border-gray-800 bg-[#0B0E14]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">B</div>
            <span className="font-bold text-lg tracking-tight">Base<span className="text-blue-500">Score</span></span>
          </div>
          <button 
            onClick={() => disconnect()}
            className="text-sm font-medium text-gray-400 hover:text-white flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <LogOut size={16} />
            Disconnect
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Score & Identity */}
          <div className="md:col-span-4 space-y-6">
            <ProfileCard address={address} loading={loading} />
            
            {/* Score Card */}
            <div className="pro-card rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
              <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-6">Credit Score</h3>
              
              <div className="relative w-64 h-32 overflow-hidden mb-4">
                 {/* Gauge Background */}
                 <div className="absolute top-0 left-0 w-full h-64 rounded-full border-[12px] border-gray-800 box-border"></div>
                 {/* Gauge Progress */}
                 <div 
                    className={`absolute top-0 left-0 w-full h-64 rounded-full border-[12px] ${getScoreColor(score).split(' ')[1]} border-b-0 border-l-0 border-r-0 transition-transform duration-1000 ease-out box-border origin-center`}
                    style={{ 
                        clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
                        transform: `rotate(${(score / 1000) * 180 - 180}deg)`
                    }}
                 ></div>
                 
                 <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
                    <span className={`text-6xl font-black ${getScoreColor(score).split(' ')[0]}`}>
                        {score}
                    </span>
                 </div>
              </div>
              
              <div className="text-center mt-2">
                 <span className={`text-xs font-bold px-3 py-1 rounded border ${getScoreColor(score).replace('text', 'bg').replace('400', '400/10').replace('stroke', 'border')}`}>
                    {getScoreTier(score)} TIER
                 </span>
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                <h4 className="text-yellow-500 font-bold text-sm mb-2">Optimization Tip</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                    Minting a <strong>Basename</strong> can significantly improve your onchain credibility score.
                </p>
            </div>
          </div>

          {/* Right Column: Statistics & History */}
          <div className="md:col-span-8">
             <StatsGrid stats={stats || null} loading={loading} />
             <HistoryList history={stats?.history || []} currentAddress={address} />
          </div>
        </div>
      </div>
    </main>
  );
}
