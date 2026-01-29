'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useUserStats } from '@/hooks/useUserStats';
import { StatsGrid } from '@/components/StatsGrid';
import { ProfileCard } from '@/components/ProfileCard';
import { HistoryList } from '@/components/HistoryList';
import { ConnectModal } from '@/components/ConnectModal';
import { Loader2, LogOut, Wallet, Sparkles, ChevronRight } from 'lucide-react';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  
  const { data: stats, isLoading: loading } = useUserStats(address, isConnected);
  const [score, setScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Animasi Score
  useEffect(() => {
    const targetScore = (stats as any)?.score || (stats as any)?.totalScore || 0;
    if (targetScore) {
      let start = 0;
      const end = targetScore;
      const duration = 1500; // Lebih lambat biar dramatis
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

  const getScoreColor = (s: number) => {
    if (s >= 800) return 'from-purple-400 to-pink-600';
    if (s >= 500) return 'from-blue-400 to-cyan-500';
    return 'from-gray-400 to-slate-500';
  };

  // --- VIEW: LANDING PAGE (Animatis) ---
  if (!isConnected || !address) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full mix-blend-screen animate-float -z-10" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen animate-float delay-200 -z-10" />

        <div className="relative z-10 text-center space-y-8 max-w-2xl">
           {/* Badge */}
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-slide-up">
              <Sparkles size={14} className="text-yellow-400" />
              <span className="text-xs font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 uppercase">
                Next Gen Analytics
              </span>
           </div>

           {/* Title */}
           <h1 className="text-6xl md:text-7xl font-black text-white leading-tight animate-slide-up delay-100 drop-shadow-2xl">
             Base
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Score</span>
           </h1>

           <p className="text-lg text-gray-400 leading-relaxed animate-slide-up delay-200">
             Discover your onchain reputation with immersive 3D analytics.
             <br/>Connect your wallet to reveal your true power.
           </p>

           {/* 3D Button */}
           <div className="animate-slide-up delay-300 pt-6">
             <button
                onClick={() => setIsModalOpen(true)}
                className="btn-3d-primary px-10 py-5 rounded-xl flex items-center gap-3 mx-auto text-xl font-bold text-white tracking-wide"
              >
                <Wallet size={24} />
                Connect Wallet
              </button>
           </div>
        </div>

        {/* Modal Logic */}
        <ConnectModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          connectors={connectors}
          connect={connect}
        />
      </main>
    );
  }

  // --- VIEW: DASHBOARD (Emboss Style) ---
  const radius = 80;
  const circumference = Math.PI * radius; // Half circle
  
  return (
    <main className="min-h-screen pb-20 relative">
      <nav className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
             <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3B82F6]"></div>
             BaseScore
          </div>
          <button onClick={() => disconnect()} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium">
            Disconnect
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left: Score Card (Hero) */}
          <div className="md:col-span-4 space-y-6 animate-slide-up">
            <ProfileCard address={address} loading={loading} />
            
            <div className="glass-emboss rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-8 z-10">Onchain Credit Score</h3>
              
              <div className="relative w-64 h-32 overflow-hidden mb-4 z-10 hover:scale-105 transition-transform duration-500">
                 {/* Gauge Track */}
                 <div className="absolute top-0 left-0 w-full h-64 rounded-full border-[16px] border-white/5 box-border"></div>
                 {/* Gauge Active */}
                 <div 
                    className={`absolute top-0 left-0 w-full h-64 rounded-full border-[16px] border-b-0 border-l-0 border-r-0 transition-all duration-1000 ease-out box-border origin-center`}
                    style={{ 
                        borderColor: 'transparent',
                        background: `conic-gradient(from 180deg at 50% 100%, #0052FF 0deg, #7C3AED ${(score/1000)*180}deg, transparent 0deg)`,
                        maskImage: 'radial-gradient(transparent 58%, black 60%)',
                        WebkitMaskImage: 'radial-gradient(transparent 58%, black 60%)'
                    }}
                 ></div>
                 
                 <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
                    <span className={`text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r ${getScoreColor(score)} drop-shadow-lg`}>
                        {score}
                    </span>
                 </div>
              </div>
              
              <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                 <div className={`h-full bg-gradient-to-r ${getScoreColor(score)} transition-all duration-1000`} style={{ width: `${score/10}%` }}></div>
              </div>
            </div>
          </div>

          {/* Right: Stats Grid */}
          <div className="md:col-span-8 space-y-8 animate-slide-up delay-100">
             <StatsGrid stats={stats || null} loading={loading} />
             <HistoryList history={stats?.history || []} currentAddress={address} />
          </div>
        </div>
      </div>
    </main>
  );
}
