"use client";

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-400 py-10 border-t border-gray-800 font-sans">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand & Address */}
          <div className="space-y-4">
            <h3 className="text-silver font-bold text-lg tracking-wider uppercase">NPLUSONE FASHION</h3>
            <p className="text-sm leading-relaxed text-gray-500">
              First Floor, Plot No. 17,<br />
              Hariichcha Ind Co-Op Hou Soc Ltd,<br />
              Opp Patco Ceramic Road No. 24,<br />
              Udhana Magdalla Road, SURAT,<br />
              GUJARAT, IN, 394210
            </p>
            <p className="text-xs text-gray-600 font-mono">GST: 24JMPPS6289M1ZQ</p>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold uppercase tracking-wide text-sm">Contact Us</h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="block text-xs uppercase text-gray-600 mb-1">Customer Care</span>
                <a href="tel:+918329208323" className="hover:text-silver transition-colors">+91 8329208323</a>
              </p>
              <p>
                <span className="block text-xs uppercase text-gray-600 mb-1">Email</span>
                <a href="mailto:support@nplusonefashion.com" className="hover:text-silver transition-colors">support@nplusonefashion.com</a>
              </p>
            </div>

            <div className="pt-2 flex gap-4">
              <a href="https://www.instagram.com/nplusonefashion?utm_source=qr&igsh=MW4xNndrYmcyMG4waA==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#E4405F] transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.072 4.354-.2 6.782-2.618 6.979-6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
              <a href="https://www.facebook.com/share/16uAAFPwpd/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1877F2] transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold uppercase tracking-wide text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-silver transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-silver transition-colors">Products</Link></li>
              <li><Link href="/about" className="hover:text-silver transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-silver transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Policies & Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold uppercase tracking-wide text-sm">Policy & Help</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/refund-policy" className="hover:text-silver transition-colors">Return & Refund Policy</Link></li>
              <li><Link href="/shipping" className="hover:text-silver transition-colors">Shipping Policy</Link></li>
              <li><Link href="/terms" className="hover:text-silver transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-silver transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-900 mt-10 pt-6 text-center text-xs text-gray-600">
          <p>&copy; {currentYear} NPLUSONE FASHION. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;