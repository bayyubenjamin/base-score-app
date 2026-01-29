'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import { base } from 'wagmi/chains'; 
import { type ReactNode, useState } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi'; 
import { walletConnect } from 'wagmi/connectors';

// Ganti dengan Project ID Anda dari cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID_HERE';

const config = createConfig({
  chains: [base],
  connectors: [
    walletConnect({ 
      projectId, 
      showQrModal: true, // Memunculkan modal QR bawaan WalletConnect
      metadata: {
        name: 'Base Onchain Profile',
        description: 'Professional Onchain Score Analyzer',
        url: 'https://base-score-app.vercel.app',
        icons: ['https://avatars.githubusercontent.com/u/37784886']
      }
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
