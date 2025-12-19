// src/app/layout.tsx
import './globals.css';
import '@coinbase/onchainkit/styles.css'; 
import { Providers } from '@/components/Providers'; // Import dari file yang baru dibuat
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
        {/* Gunakan wrapper Providers di sini */}
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}
