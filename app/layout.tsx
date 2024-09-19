import { ReactNode } from 'react';

export const metadata = {
  title: 'Sea Wave Animation',
  description: 'A 3D sea wave animation with floating objects',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
