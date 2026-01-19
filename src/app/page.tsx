'use client';

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from "@coinbase/onchainkit/wallet";
import { Address, Avatar, Name, Identity, EthBalance } from "@coinbase/onchainkit/identity";
import sdk from "@farcaster/frame-sdk"; 
import ProfileCard from "@/components/ProfileCard";
import StatsGrid from "@/components/StatsGrid";
import SearchBar from "@/components/SearchBar";
import HistoryList from "@/components/HistoryList";
import { calculateScore } from "@/lib/scoring";
import { useUserStats } from "@/hooks/useUserStats"; // Import Hook Baru

export default function Home() {
  const { address, isConnected } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFrameContext, setIsFrameContext] = useState(false);

  // LOGIC BARU: Menggunakan React Query Hook
  // Otomatis fetch jika address connect, atau jika user search manual
  const targetAddress = searchQuery || (isConnected ? address : undefined);
  const { data, isLoading, error, refetch } = useUserStats(targetAddress, true);

  useEffect(() => {
    const checkContext = async () => {
      const context = await sdk.context;
      if (context) setIsFrameContext(true);
    };
    checkContext();
  }, []);

  // Handle search hanya perlu mengubah state query, React Query yang urus sisanya
  const handleSearch = (query: string) => { 
    setSearchQuery(query);
  };

  const scoreResult = data ? calculateScore(data) : null;
  const currentScore = scoreResult ? scoreResult.totalScore : 0;
  const currentLevel = scoreResult ? scoreResult.level : "Newbie";
  
  const shareText = `I'm a ${currentLevel} on Base! Score: ${currentScore}/100 🚀 Check your onchain profile:`;
  const shareUrl = "https://warpcast.com/~/compose?text=" + encodeURIComponent(shareText);

  const handleShare = useCallback(() => {
    if (isFrameContext) sdk.actions.openUrl(shareUrl);
    else window.open(shareUrl, '_blank');
  }, [isFrameContext, shareUrl]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center p-4 pt-8 md:pt-12">
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

      <div className="w-full max-w-md text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Check Your Cred</h2>
        <p className="text-slate-500 text-sm">Analyze your wallet activity & history on Base.</p>
      </div>

      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      <div className="w-full max-w-md mt-6 min-h-[300px] flex flex-col items-center pb-20">
        {error && (
            <div className="w-full p-4 bg-red-900/20 border border-red-800 text-red-200 rounded-xl flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
                <p className="font-bold text-sm">❌ Oops!</p>
                <p className="text-xs text-center mt-1 opacity-80">{(error as Error).message}</p>
                <button onClick={() => refetch()} className="mt-2 text-xs underline hover:text-white">Try Again</button>
            </div>
        )}

        {isLoading && (
            <div className="w-full flex flex-col items-center animate-pulse mt-10">
                <div className="h-48 w-full bg-slate-900 rounded-2xl mb-4 border border-slate-800"></div>
                <div className="flex gap-2 items-center text-blue-400 font-mono text-xs">
                    <span className="animate-spin">Wait</span> Scanning blockchain history...
                </div>
            </div>
        )}

        {!isLoading && !error && data && (
            <div className="w-full animate-in zoom-in-95 duration-300">
                <ProfileCard data={data} />
                <StatsGrid data={data} />

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
                            {parseFloat(data.totalGasUsed).toFixed(5)} <span className="text-xs text-slate-500 font-normal">ETH</span>
                        </p>
                     </div>
                </div>

                <HistoryList history={data.history} currentAddress={data.address} />
            
                <button 
                    onClick={handleShare}
                    className="mt-8 w-full bg-[#855DCD] hover:bg-[#724BB7] text-white font-bold py-3 rounded-xl text-center transition shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                    Share Result
                </button>
            </div>
        )}
      </div>
    </main>
  );
}
