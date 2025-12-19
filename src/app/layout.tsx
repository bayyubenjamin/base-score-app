// src/app/layout.tsx
import './globals.css';
import '@coinbase/onchainkit/styles.css'; 
import { Providers } from '@/components/Providers';
import FarcasterProvider from '@/components/FarcasterProvider'; // Import Provider Baru
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OnChain Score Checker',
  description: 'Analyze your Base wallet activity',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950">
        {/* Bungkus dengan Providers (OnchainKit) dan FarcasterProvider */}
        <Providers>
          <FarcasterProvider>
            {children}
          </FarcasterProvider>
        </Providers>
      </body>
    </html>
  );
}
