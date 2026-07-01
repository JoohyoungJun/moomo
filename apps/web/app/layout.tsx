import type { Metadata } from 'next';
import { Providers } from './providers';
import { Header } from '@/components/header/header';
import '@/styles/global.css';

export const metadata: Metadata = {
  title: 'Moomo',
  description: 'Moomo 커뮤니티',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
