import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
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
      <body className="min-h-screen flex flex-col bg-custom-black">
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <main className="flex-grow w-full max-w-[100vw] overflow-x-hidden">{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </body>
    </html>
  );
} 