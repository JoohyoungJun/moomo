import type { Metadata } from 'next';
import { Providers } from './providers';
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
