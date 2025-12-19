// src/lib/mockData.ts
import { UserStats } from "./scoring";

export const MOCK_DATA: UserStats = {
  address: "0x1234...abcd",
  basename: "superuser.base.eth",
  ethBalance: 0.45,
  txCount: 128,
  nftCount: 12,
  joinDate: "2024-01-15",
};

export const EMPTY_DATA: UserStats = {
  address: "",
  basename: null,
  ethBalance: 0,
  txCount: 0,
  nftCount: 0,
  joinDate: "",
};
