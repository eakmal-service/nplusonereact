# NPlusOne Fashion E-commerce

A modern, high-performance fashion e-commerce application built with Next.js 13 (App Router), Supabase, and Stripe.

## 🚀 Recent Major Updates (Jan 2026)
- **Server-Side Rendering (SSR)**: Product Listing and Detail pages now fetch data on the server for superior SEO and initial load performance.
- **Image Optimization**: Fully migrated to `next/image` with `remotePatterns` for secure and optimized serving of assets from Supabase.
- **Admin Panel Isolation**: Separated Admin data fetching logic to ensure the public storefront remains fast while the Admin Panel loads heavy data independently.
- **Security**: Row Level Security (RLS) policies configured for secure database access.

## 📊 Project Status & Feature Audit

### 🛍️ Categories & Data
Currently, the application runs on a **Hybrid Data Model** (Supabase DB + Local Fallback).

| Category | Product Count | Status | Notes |
|----------|:-------------:|:------:|-------|
| **Suit Set** | ~18 | ✅ Active | Fully populated with images, descriptions, and variants. |
| **Western Wear** | 0 | 🚧 Empty | Placeholder category. |
| **Co-ord Set** | 0 | 🚧 Empty | Placeholder category. |
| **Kid's Wear** | 0 | 🚧 Empty | Placeholder category. |
| **Indo-Western** | 0 | 🚧 Empty | Placeholder category. |
| **Men's Wear** | 0 | 🚧 Empty | Placeholder category. |

> **Note**: Products are managed via the Admin Panel and stored in Supabase. Local fallbacks (`additionalProducts.ts`) exist for development but are being phased out in favor of real DB data.

### 🛠️ Features Functionality (Zara/H&M Style Analysis)

| Feature | Status | Implementation Details |
|---------|:------:|------------------------|
| **User Auth** | ✅ Working | Supabase Auth (Email/Video OTP login flow). |
| **Payments** | ✅ Working | **Stripe** integration is fully set up in `/api/payment`. |
| **Order Tracking** | ✅ Working | Custom tracking APIs (`/api/order/[id]/tracking`) implementing detailed courier status. |
| **Admin Panel** | ✅ Working | comprehensive dashboard for Product Management, Order Processing, and Content Management (Hero Slider, banners). |
| **Search & Filter** | ✅ Working | Fast filtering by Category, Price, and Search terms. |
| **Wishlist & Cart** | ✅ Working | Persistent state management for shopping bag and favorites. |
| **Product Zoom** | ✅ Working | High-quality image zoom on hover (Desktop) and modal view. |
| **Mobile UX** | ✅ Working | Fully responsive design with mobile-optimized Hero Slider and Navigation. |

## 💻 Tech Stack
- **Framework**: Next.js 13.5 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **State**: React Context + SWR
- **Deployment**: VPS (Hostinger) with Docker

## 🔧 Setup & Installation

1. **Environment Config**:
   Ensure your `.env.local` has:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
   STRIPE_SECRET_KEY=...
   ```

2. **Run Development Server**:
   ```bash
   npm install
   npx next dev -p 3001
   ```

3. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

## 📂 Key Directory Structure
- `src/app`: App Router pages (Server Components).
- `src/components`: Reusable UI components.
- `src/contexts`: Global state (Cart, Wishlist).
- `src/lib`: Supabase and Stripe clients.
- `src/types`: TypeScript interfaces (`Product`, `Order`, etc.).

---
*Documentation updated on Jan 5, 2026.*