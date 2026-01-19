// src/lib/scoring.ts
import { formatEther } from "viem";

export type Transaction = {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNum: string;
  asset?: string;
};

export type UserStats = {
  address: string;
  resolvedName?: string | null;
  ethBalance: string;
  txCount: number;
  tokenCount: number;
  nftCount: number;
  joinDate: string;
  history: Transaction[]; 
  totalGasUsed: string;
};

export type ScoreResult = {
  totalScore: number;
  level: string;
  badges: string[];
  breakdown: {
    identity: number;
    activity: number;
    wealth: number;
    loyalty: number;
  }
};

export function calculateScore(stats: UserStats): ScoreResult {
  let score = 0;
  const badges: string[] = [];
  const breakdown = { identity: 0, activity: 0, wealth: 0, loyalty: 0 };

  // 1. Identity (Basename) - Max 25
  if (stats.resolvedName) {
    const points = 25;
    score += points;
    breakdown.identity = points;
    badges.push("🏷️ Base OG");
  }

  // 2. Activity (Tx Count) - Max 35
  let activityPoints = 0;
  if (stats.txCount >= 1000) {
    activityPoints = 35;
    badges.push("⚡ Power User");
  } else if (stats.txCount >= 100) {
    activityPoints = 20;
    badges.push("🔥 Active");
  } else if (stats.txCount >= 10) {
    activityPoints = 10;
  }
  score += activityPoints;
  breakdown.activity = activityPoints;

  // 3. Wealth (ETH Balance + Token Bonus) - Max 25
  let wealthPoints = 0;
  const ethBal = parseFloat(stats.ethBalance);
  
  if (ethBal >= 1.0) {
    wealthPoints = 25;
    badges.push("🐳 Whale");
  } else if (ethBal >= 0.1) {
    wealthPoints = 15;
    badges.push("💰 Holder");
  } else if (ethBal >= 0.01) {
    wealthPoints = 5;
  }

  // Bonus poin kecil jika punya banyak token
  if (stats.tokenCount > 5 && wealthPoints < 25) {
      wealthPoints = Math.min(wealthPoints + 5, 25);
      badges.push("🎒 Collector");
  }

  score += wealthPoints;
  breakdown.wealth = wealthPoints;

  // 4. Loyalty (Wallet Age) - Max 15
  let loyaltyPoints = 0;
  const joinDate = stats.joinDate ? new Date(stats.joinDate) : new Date();
  const daysOld = (new Date().getTime() - joinDate.getTime()) / (1000 * 3600 * 24);
  
  if (daysOld > 365) { 
      loyaltyPoints = 15; 
      badges.push("🏛️ Founding Father");
  } else if (daysOld > 180) {
      loyaltyPoints = 10;
      badges.push("👴 Veteran");
  } else if (daysOld > 30) {
      loyaltyPoints = 5;
  }
  score += loyaltyPoints;
  breakdown.loyalty = loyaltyPoints;

  // 5. Gas Usage Badge (UPDATE BARU)
  // Logika baru: Memberikan badge jika user telah membakar cukup banyak gas
  const gasUsed = parseFloat(stats.totalGasUsed || "0");
  if (gasUsed >= 0.02) {
      badges.push("⛽ Gas Guzzler");
  }

  // Level Logic
  let level = "Newbie";
  if (score >= 90) level = "Based God";
  else if (score >= 70) level = "Crypto Native";
  else if (score >= 40) level = "Explorer";

  return { totalScore: Math.min(score, 100), level, badges, breakdown };
}
