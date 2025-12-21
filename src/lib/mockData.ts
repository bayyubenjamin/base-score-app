// src/lib/mockData.ts
import { UserStats } from "./scoring";

export const MOCK_DATA: UserStats = {
  address: "0x1234567890abcdef1234567890abcdef12345678",
  resolvedName: "superuser.base.eth", 
  ethBalance: "0.45",
  tokenCount: 15, // <--- TAMBAHKAN INI (Angka bebas)
  txCount: 1250,
  nftCount: 42,
  joinDate: "2023-08-09T10:00:00Z",
  totalGasUsed: "0.15",
  history: [
    {
      hash: "0xabc123...",
      from: "0x1234...",
      to: "0xabcd...",
      value: "0.05",
      asset: "ETH",
      blockNum: "1234567"
    },
    {
      hash: "0xdef456...",
      from: "0x1234...",
      to: "0xcafe...",
      value: "100",
      asset: "USDC",
      blockNum: "1234560"
    }
  ]
};
