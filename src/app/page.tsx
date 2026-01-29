'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAccount, useDisconnect } from 'wagmi';
import { useProfile } from '@farcaster/auth-kit';
import ConnectModal from '@/components/ConnectModal';
import { ChartBarIcon, UserGroupIcon, ShieldCheckIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';

export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { profile, isAuthenticated } = useProfile();
  
  // Mencegah error hidrasi (layar putih)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLoggedIn = mounted && (isConnected || isAuthenticated);

  return (
    <main className="min-h-screen bg-dark-900 flex flex-col font-sans">
      
      {/* NAVBAR */}
      <nav className="border-b border-dark-700 bg-dark-800/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/20">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Base Score</span>
          </div>

          {/* Tombol Login/Profil */}
          <div>
            {!isLoggedIn ? (
              <button 
                onClick={() => setModalOpen(true)}
                className="bg-white text-dark-900 hover:bg-gray-200 font-bold py-2.5 px-6 rounded-full transition shadow-lg"
              >
                Connect ID
              </button>
            ) : (
              <div className="flex items-center gap-4 bg-dark-700/50 p-1.5 pr-2 rounded-full border border-dark-700">
                 <div className="flex items-center gap-2 px-3">
                    {isAuthenticated && profile?.pfpUrl && (
                      <Image 
                        src={profile.pfpUrl} 
                        width={24} height={24} 
                        alt="Profile" 
                        className="rounded-full border border-dark-700"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-200">
                      {isAuthenticated ? `@${profile?.username}` : address ? `${address.slice(0,6)}...${address.slice(-4)}` : 'User'}
                    </span>
                 </div>
                 <button 
                    onClick={() => disconnect()}
                    className="p-2 rounded-full bg-dark-800 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition"
                    title="Disconnect"
                 >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                 </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="flex-1 container mx-auto px-6 py-12 flex flex-col items-center justify-center text-center">
        
        <div className="max-w-3xl mb-12">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Check Your <br/>
            <span className="text-brand-500">Onchain Reputation</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Aggregate your wallet activity and Farcaster social graph into a single, unified trust score on Base.
          </p>
        </div>

        {/* SCORE CARD UTAMA */}
        <div className="w-full max-w-lg">
          <div className="bg-dark-800 border border-dark-700 rounded-3xl p-10 shadow-2xl relative overflow-hidden group hover:border-brand-500/50 transition duration-500">
            
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-brand-600/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center">
              <ShieldCheckIcon className="w-16 h-16 text-brand-500 mb-6" />
              
              <h2 className="text-2xl font-bold text-gray-300">Your Base Score</h2>
              
              <div className="my-8">
                {isLoggedIn ? (
                  <span className="text-8xl font-black text-white tracking-tighter animate-slide-up block">
                    850
                  </span>
                ) : (
                  <span className="text-8xl font-black text-dark-700 select-none">
                    ---
                  </span>
                )}
              </div>

              {!isLoggedIn && (
                <button 
                  onClick={() => setModalOpen(true)}
                  className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-brand-600/20"
                >
                  Reveal My Score
                </button>
              )}

              {isLoggedIn && (
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-sm font-bold border border-green-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Excellent Reputation
                 </div>
              )}
            </div>
          </div>
        </div>

        {/* GRID FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-12">
           <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 flex items-start gap-4 hover:bg-dark-700/50 transition">
              <div className="p-3 bg-brand-900/50 rounded-lg text-brand-500">
                <ChartBarIcon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-bold text-lg">Onchain Activity</h3>
                <p className="text-gray-400 text-sm mt-1">Transaction volume & history analysis.</p>
              </div>
           </div>
           
           <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 flex items-start gap-4 hover:bg-dark-700/50 transition">
              <div className="p-3 bg-purple-900/50 rounded-lg text-purple-400">
                <UserGroupIcon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-bold text-lg">Social Graph</h3>
                <p className="text-gray-400 text-sm mt-1">Farcaster connections & engagement.</p>
              </div>
           </div>
        </div>

      </section>

      {/* MODAL COMPONENT */}
      <ConnectModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

    </main>
  );
}
