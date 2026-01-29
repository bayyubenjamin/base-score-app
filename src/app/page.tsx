'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useUserStats } from '@/hooks/useUserStats';
import { StatsGrid } from '@/components/StatsGrid';
import { ProfileCard } from '@/components/ProfileCard';
import { HistoryList } from '@/components/HistoryList';

export default function Home() {
  const { address } = useAccount();
  const { stats, loading, error } = useUserStats(address);
  const [score, setScore] = useState(0);

  // Animate score on load
  useEffect(() => {
    if (stats?.score) {
      let start = 0;
      const end = stats.score;
      const duration = 1000;
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
  }, [stats?.score]);

  // Determine Rank Color
  const getRankColor = (s: number) => {
    if (s >= 800) return 'text-purple-400 border-purple-500';
    if (s >= 500) return 'text-blue-400 border-blue-500';
    return 'text-gray-400 border-gray-500';
  };

  const getRankName = (s: number) => {
    if (s >= 800) return 'Onchain Legend';
    if (s >= 500) return 'Based User';
    return 'Newcomer';
  };

  if (!address) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-[url('/grid.svg')] bg-center">
        <div className="glass-card max-w-md w-full p-8 rounded-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-blue-600/50">
             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Connect Wallet</h1>
          <p className="text-gray-400">Connect your wallet to reveal your Base Onchain Score and stats.</p>
          <div className="pt-4">
            <appkit-button />
          </div>
        </div>
      </main>
    );
  }

  // Calculate percentage for circular progress (assuming max score is 1000)
  const maxScore = 1000;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / maxScore) * circumference;

  return (
    <main className="min-h-screen p-4 pb-20 md:p-8 max-w-lg mx-auto relative">
      <ProfileCard address={address} loading={loading} />

      {/* Hero Score Gauge */}
      <div className="glass-card rounded-3xl p-8 mb-6 flex flex-col items-center justify-center relative shadow-2xl overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute inset-0 bg-blue-500/5 radial-gradient" />
        
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* SVG Ring */}
          <svg className="w-full h-full transform -rotate-90">
             {/* Track */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-gray-800"
            />
            {/* Progress */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`${getRankColor(score).split(' ')[0]} transition-all duration-1000 ease-out`}
            />
          </svg>
          
          {/* Central Score Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-sm text-gray-500 font-medium uppercase tracking-widest mb-1">Total Score</span>
            <span className={`text-6xl font-black ${getRankColor(score).split(' ')[0]}`}>
              {score}
            </span>
            <span className={`text-xs font-bold px-3 py-1 mt-2 rounded-full border bg-black/50 ${getRankColor(score)}`}>
              {getRankName(score)}
            </span>
          </div>
        </div>
      </div>

      <StatsGrid stats={stats} loading={loading} />
      
      <div className="mt-8">
        <h3 className="text-white font-bold text-lg mb-4">Activity History</h3>
        <HistoryList address={address} />
      </div>
    </main>
  );
}
