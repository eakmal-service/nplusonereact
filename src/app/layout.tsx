import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '../components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import GlobalErrorObserver from '@/components/GlobalErrorObserver';

export const metadata: Metadata = {
  title: 'NPlusOne Fashion',
  description: 'Contemporary fashion for everyone',
  other: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <GlobalErrorObserver />
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <WishlistProvider>
                <Header />
                <main>{children}</main>
                <Footer />
              </WishlistProvider>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}