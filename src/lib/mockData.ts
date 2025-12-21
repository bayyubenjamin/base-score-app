// src/lib/mockData.ts
import { UserStats } from "./scoring";

export const MOCK_DATA: UserStats = {
  address: "0x1234...abcd",
  resolvedName: "superuser.base.eth", // PERBAIKAN: basename -> resolvedName
  ethBalance: "0.45", // String
  txCount: 128,
  nftCount: 12,
  joinDate: "2024-01-15",
  history: [
    {
      hash: "0xmockhash123",
      from: "0x1234...abcd",
      to: "0xotherside",
      value: "0.05",
      blockNum: "123456",
      asset: "ETH"
    },
  ],
  totalGasUsed: "0.15", // String
};

export const EMPTY_DATA: UserStats = {
  address: "",
  resolvedName: null,
  ethBalance: "0",
  txCount: 0,
  nftCount: 0,
  joinDate: "",
  history: [],
  totalGasUsed: "0",
};
