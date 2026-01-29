'use client';

import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { coinbaseWallet, walletConnect, injected } from 'wagmi/connectors';
import '@coinbase/onchainkit/styles.css';
import '@farcaster/auth-kit/styles.css';

const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    injected(), 
    coinbaseWallet({ appName: 'Base Score App' }),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || '' }),
  ],
  ssr: true,
});

const queryClient = new QueryClient();

const farcasterConfig = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'basescore.app',
  siweUri: 'https://basescore.app/login',
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY} chain={base}>
          <AuthKitProvider config={farcasterConfig}>
            {children}
          </AuthKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
