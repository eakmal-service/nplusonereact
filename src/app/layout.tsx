import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { ProductProvider } from '@/contexts/ProductContext';

export const metadata: Metadata = {
  title: 'NPlusOne Fashion',
  description: 'Contemporary fashion for everyone',
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
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