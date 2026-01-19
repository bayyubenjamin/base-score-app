'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import { base } from 'wagmi/chains'; 
import { type ReactNode, useState } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi'; 
import { coinbaseWallet } from 'wagmi/connectors';

// Setup Wagmi Config
const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'Base Score App',
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  // Setup React Query Client dengan state agar tidak re-init saat render ulang
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
