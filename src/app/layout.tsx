import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Ini yang menghubungkan CSS tadi
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Base Score App",
  description: "Check your onchain reputation score on Base",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
