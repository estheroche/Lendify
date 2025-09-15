import type { Metadata } from "next";
import { Web3Provider } from "@/components/providers/web3-provider";
import "./globals.css";
import "../styles/design-system.css";

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
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased bg-gray-50 text-gray-900"
      >
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
