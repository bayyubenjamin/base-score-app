// Anda akan membutuhkan library: npm install alchemy-sdk
import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: "YOUR_ALCHEMY_KEY",
  network: Network.BASE_MAINNET,
};
const alchemy = new Alchemy(config);

// Di dalam API Route:
const balances = await alchemy.core.getTokenBalances(address);
const nfts = await alchemy.nft.getNftsForOwner(address);
const txCount = await alchemy.core.getTransactionCount(address);
// Lalu masukkan data ini ke fungsi calculateScore() kita.
