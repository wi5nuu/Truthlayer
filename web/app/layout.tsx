import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TruthLayer — Reveal Every Website\'s Hidden Intent',
  description: 'Every website wants something from you. Now you know what it is. Analyze trust scores, dark patterns, and hidden intents of any website.',
  icons: {
    icon: '/truthlayer.png',
    shortcut: '/truthlayer.png',
    apple: '/truthlayer.png',
  },
  openGraph: {
    title: 'TruthLayer',
    description: 'Every website wants something from you. Now you know what it is.',
    type: 'website',
    images: [{ url: '/truthlayer.png', width: 120, height: 120 }],
  },
  twitter: {
    card: 'summary',
    title: 'TruthLayer',
    description: 'Every website wants something from you. Now you know what it is.',
    images: ['/truthlayer.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-[#080F0F] text-[#E8F5F2] antialiased">{children}</body>
    </html>
  );
}
