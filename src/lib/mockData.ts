// src/lib/mockData.ts
import { UserStats } from "./scoring";

export const MOCK_DATA: UserStats = {
  address: "0x1234...abcd",
  basename: "superuser.base.eth",
  ethBalance: 0.45,
  txCount: 128,
  nftCount: 12,
  joinDate: "2024-01-15",
  // --- FIX: Tambahkan properti baru agar sesuai dengan UserStats ---
  history: [
    {
      hash: "0xmockhash123",
      from: "0x1234...abcd",
      to: "0xotherside",
      value: "0.05",
      timeStamp: (Math.floor(Date.now() / 1000) - 10000).toString(), // Contoh waktu
      isError: "0",
      gasUsed: "21000",
    },
  ],
  totalGasUsed: 0.15,
};

export const EMPTY_DATA: UserStats = {
  address: "",
  basename: null,
  ethBalance: 0,
  txCount: 0,
  nftCount: 0,
  joinDate: "",
  // --- FIX: Tambahkan properti default (kosong/0) ---
  history: [],
  totalGasUsed: 0,
};
