// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import { Providers } from '@/app/provider';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '700'], // ✅ specify weights you want
});

export const metadata: Metadata = {
  title: 'E-Learning Platform',
  description: 'A modern platform for online learning',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={notoSans.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
