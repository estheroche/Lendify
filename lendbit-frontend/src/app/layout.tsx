import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Web3Provider } from "@/components/providers/web3-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lendify - Ultra-Fast RWA Lending on Somnia",
  description: "The first ultra-high-performance RWA lending protocol on Somnia. Experience 1M+ TPS, sub-second finality, and instant asset tokenization with community-driven verification.",
  keywords: ["DeFi", "RWA", "Real World Assets", "Lending", "Somnia", "Ultra-Fast", "1M TPS", "Sub-second finality", "Blockchain", "Web3"],
  authors: [{ name: "Lendify Team" }],
  openGraph: {
    title: "Lendify - Ultra-Fast RWA Lending",
    description: "Experience the future of RWA lending on Somnia's lightning-fast blockchain",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lendify - Ultra-Fast RWA Lending",
    description: "1M+ TPS RWA lending protocol on Somnia",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3B82F6',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-slate-900 text-white`}
      >
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
