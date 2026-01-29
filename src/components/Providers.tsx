'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import { base } from 'wagmi/chains'; 
import { type ReactNode, useState } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi'; 
import { walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { AuthKitProvider } from '@farcaster/auth-kit'; // IMPORT INI
import '@farcaster/auth-kit/styles.css'; // JANGAN LUPA CSS INI

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

const config = createConfig({
  chains: [base],
  connectors: [
    walletConnect({ 
      projectId, 
      showQrModal: true, 
      metadata: {
        name: 'Base Score Pro',
        description: 'Professional Onchain Analytics',
        url: 'https://base-score-app.vercel.app',
        icons: ['https://avatars.githubusercontent.com/u/37784886']
      }
    }),
    coinbaseWallet({
      appName: 'Base Score Pro',
      preference: 'smartWalletOnly',
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

// Konfigurasi Farcaster
const farcasterConfig = {
  rpcUrl: 'https://mainnet.optimism.io', // Mainnet Optimism RPC (Farcaster ada di OP)
  domain: 'base-score-app.vercel.app', // Ganti dengan domain Anda nanti
  siweUri: 'https://base-score-app.vercel.app/login',
};

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AuthKitProvider config={farcasterConfig}>
          <OnchainKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
            chain={base}
          >
            {children}
          </OnchainKitProvider>
        </AuthKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
