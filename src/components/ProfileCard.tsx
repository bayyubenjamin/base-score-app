import { UserStats, calculateScore } from "@/lib/scoring";
import { Avatar, Name, Identity, Address } from "@coinbase/onchainkit/identity";
import { Trophy, Medal, Sparkles, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfileCard({ data }: { data: UserStats }) {
  const { totalScore, level, badges } = calculateScore(data);

  // Helper untuk menentukan tema visual berdasarkan Level
  const getLevelTheme = (lvl: string) => {
    switch (lvl) {
      case "Based God":
        return {
          wrapper: "from-blue-600 via-indigo-500 to-cyan-400",
          glow: "shadow-blue-500/50",
          text: "text-blue-100",
          icon: <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />,
          badgeBg: "bg-blue-500/20 border-blue-500/30",
          scoreGradient: "from-white via-blue-100 to-cyan-200"
        };
      case "Crypto Native":
        return {
          wrapper: "from-fuchsia-600 via-purple-600 to-pink-500",
          glow: "shadow-purple-500/50",
          text: "text-purple-100",
          icon: <Sparkles className="w-4 h-4 text-fuchsia-300" />,
          badgeBg: "bg-fuchsia-500/20 border-fuchsia-500/30",
          scoreGradient: "from-white via-fuchsia-100 to-pink-200"
        };
      default: // Explorer
        return {
          wrapper: "from-emerald-500 via-green-500 to-teal-400",
          glow: "shadow-emerald-500/50",
          text: "text-emerald-100",
          icon: <Trophy className="w-4 h-4 text-emerald-300" />,
          badgeBg: "bg-emerald-500/20 border-emerald-500/30",
          scoreGradient: "from-white via-emerald-100 to-teal-200"
        };
    }
  };

  const theme = getLevelTheme(level);

  return (
    <div className="relative w-full max-w-md group">
      
      {/* 1. LAYER: Animated Ambient Glow (Backdrop) */}
      <div 
        className={cn(
          "absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r blur-xl opacity-40 transition-all duration-500 group-hover:opacity-75 group-hover:blur-2xl",
          theme.wrapper
        )}
      />

      {/* 2. LAYER: Main Card Content */}
      <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-1">
        
        {/* Inner Container with slight transparency */}
        <div className="flex h-full flex-col justify-between rounded-[1.8rem] bg-neutral-900/50 p-6 backdrop-blur-3xl md:p-8">
            
            {/* Dekorasi: Background Noise/Gradient Spot */}
            <div className={cn("absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-br opacity-20 blur-[80px]", theme.wrapper)} />

            {/* HEADER: Identity & Rank */}
            <div className="z-10 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    {/* OnchainKit Avatar Wrapper */}
                    <div className={cn("relative rounded-full p-[2px] bg-gradient-to-tr", theme.wrapper)}>
                        <Identity 
                            address={data.address as `0x${string}`} 
                            schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                        >
                            <Avatar className="h-16 w-16 rounded-full border-4 border-[#0a0a0a] bg-black" />
                        </Identity>
                        {/* Status Dot */}
                        <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-black bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
                    </div>
                    
                    <div className="flex flex-col">
                         <div className="text-xl font-bold text-white truncate max-w-[150px]">
                            {data.resolvedName ? (
                              <span>{data.resolvedName}</span>
                            ) : (
                              <Name address={data.address as `0x${string}`} className="text-white" />
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 opacity-60">
                             <Address address={data.address as `0x${string}`} className="text-xs font-mono text-neutral-300" />
                        </div>
                    </div>
                </div>

                {/* Level Badge */}
                <div className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-1.5 border backdrop-blur-md shadow-lg",
                    theme.badgeBg
                )}>
                    {theme.icon}
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                        {level}
                    </span>
                </div>
            </div>

            {/* BODY: The Big Score */}
            <div className="z-10 mt-10 text-center">
                <div className="text-sm font-medium uppercase tracking-widest text-neutral-500 mb-2">
                    Onchain Reputation Score
                </div>
                <div className={cn(
                    "text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b drop-shadow-2xl",
                    theme.scoreGradient
                )}>
                    {totalScore}
                </div>
            </div>

            {/* FOOTER: Badges / Achievements */}
            <div className="z-10 mt-10">
                <div className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
                <div className="flex flex-wrap justify-center gap-2">
                    {badges.length > 0 ? (
                        badges.map((badge, i) => (
                            <span 
                                key={i} 
                                className="inline-flex items-center rounded-md border border-white/5 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-neutral-400 transition-colors hover:border-white/20 hover:text-white"
                            >
                                <Medal className="mr-1.5 h-3 w-3 opacity-50" />
                                {badge}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-neutral-600 font-mono">No badges earned yet.</span>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
