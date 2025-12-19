// src/app/page.tsx
'use client';

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from "@coinbase/onchainkit/wallet";
import { Address, Avatar, Name, Identity, EthBalance } from "@coinbase/onchainkit/identity";
import sdk from "@farcaster/frame-sdk"; // Import SDK
import ProfileCard from "@/components/ProfileCard";
import StatsGrid from "@/components/StatsGrid";
import SearchBar from "@/components/SearchBar";
import HistoryList from "@/components/HistoryList";
import { UserStats, calculateScore } from "@/lib/scoring";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [data, setData] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isFrameContext, setIsFrameContext] = useState(false);

  // --- CEK KONTEKS FRAME ---
  useEffect(() => {
    const checkContext = async () => {
      const context = await sdk.context;
      if (context) {
        setIsFrameContext(true);
        // Opsional: Jika Anda ingin auto-fetch berdasarkan user Farcaster
        // console.log("Farcaster User:", context.user); 
      }
    };
    checkContext();
  }, []);

  // --- FUNGSI FETCH DATA ---
  const fetchData = async (queryAddress: string) => {
    setLoading(true);
    setErrorMsg(""); 
    setData(null);
    
    try {
      const response = await fetch(`/api/user?address=${queryAddress}`);
      const result = await response.json();

      if (!response.ok) {
        setErrorMsg(result.error || "Gagal mengambil data wallet.");
      } else {
        setData({
          ...result,
          basename: result.basename || (queryAddress.includes('.') ? queryAddress : null)
        });
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Terjadi kesalahan jaringan/server.");
    } finally {
      setLoading(false);
    }
  };

  // --- AUTO DETECT WALLET ---
  useEffect(() => {
    if (isConnected && address) {
        if (data?.address.toLowerCase() !== address.toLowerCase()) {
            fetchData(address);
        }
    }
  }, [isConnected, address, data?.address]); // Menambahkan dependency yang tepat

  // --- SEARCH HANDLER ---
  const handleSearch = (query: string) => {
    fetchData(query);
  };

  // --- SHARE HANDLER ---
  const currentScore = data ? calculateScore(data).totalScore : 0;
  const shareText = `I checked my Onchain Score on Base! Score: ${currentScore}/100 🚀 Check yours here:`;
  const shareUrl = "https://warpcast.com/~/compose?text=" + encodeURIComponent(shareText);

  const handleShare = useCallback(() => {
    if (isFrameContext) {
      // Jika di dalam Frame, gunakan SDK untuk membuka URL
      sdk.actions.openUrl(shareUrl);
    } else {
      // Jika di browser biasa, buka tab baru
      window.open(shareUrl, '_blank');
    }
  }, [isFrameContext, shareUrl]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center p-4 pt-8 md:pt-12">
      
      {/* HEADER */}
      <div className="w-full max-w-md flex justify-between items-center mb-10">
        <div className="flex flex-col">
            <h1 className="font-black text-xl text-blue-500 tracking-tighter">BASE<span className="text-white">SCORE</span></h1>
            <span className="text-[10px] text-slate-500 font-mono">PROFILER</span>
        </div>
        
        <div className="flex justify-end">
          <Wallet>
            <ConnectWallet className="bg-slate-800 text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-slate-700 transition">
              <Avatar className="h-6 w-6" />
              <Name className="text-white" />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>
      </div>

      {/* HERO TEXT */}
      <div className="w-full max-w-md text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Check Your Cred</h2>
        <p className="text-slate-500 text-sm">Analyze your wallet activity & history on Base.</p>
      </div>

      {/* SEARCH BAR */}
      <SearchBar onSearch={handleSearch} isLoading={loading} />

      {/* RESULT AREA */}
      <div className="w-full max-w-md mt-6 min-h-[300px] flex flex-col items-center pb-20">
        
        {/* ERROR STATE */}
        {errorMsg && (
            <div className="w-full p-4 bg-red-900/20 border border-red-800 text-red-200 rounded-xl flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
                <p className="font-bold text-sm">❌ Oops!</p>
                <p className="text-xs text-center mt-1 opacity-80">{errorMsg}</p>
            </div>
        )}

        {/* LOADING STATE */}
        {loading && (
            <div className="w-full flex flex-col items-center animate-pulse mt-10">
                <div className="h-48 w-full bg-slate-900 rounded-2xl mb-4 border border-slate-800"></div>
                <div className="flex gap-2 items-center text-blue-400 font-mono text-xs">
                    <span className="animate-spin">Wait</span> Scanning blockchain history...
                </div>
            </div>
        )}

        {/* DATA SUCCESS */}
        {!loading && !errorMsg && data && (
            <div className="w-full animate-in zoom-in-95 duration-300">
                
                {/* 1. Main Profile */}
                <ProfileCard data={data} />
                
                {/* 2. Basic Stats Grid */}
                <StatsGrid data={data} />

                {/* 3. Deep Stats (Age & Gas) */}
                <div className="w-full grid grid-cols-2 gap-3 mt-3">
                     <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Wallet Age</p>
                        <p className="font-mono font-bold text-white text-lg">
                            {Math.floor((new Date().getTime() - new Date(data.joinDate).getTime()) / (1000 * 3600 * 24))} <span className="text-xs text-slate-500 font-normal">Days</span>
                        </p>
                     </div>
                     <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Gas Burned</p>
                        <p className="font-mono font-bold text-white text-lg">
                            {(data.totalGasUsed / 1e9).toFixed(5)} <span className="text-xs text-slate-500 font-normal">ETH</span>
                        </p>
                     </div>
                </div>

                {/* 4. Transaction History */}
                <HistoryList history={data.history} ownerAddress={data.address} />
            
                {/* 5. Share Button */}
                <button 
                    onClick={handleShare}
                    className="mt-8 w-full bg-[#855DCD] hover:bg-[#724BB7] text-white font-bold py-3 rounded-xl text-center transition shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Share on Farcaster
                </button>
            </div>
        )}
      </div>
    </main>
  );
}
