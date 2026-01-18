# NPlusOne Fashion E-commerce

A modern, high-performance fashion e-commerce application built with Next.js 13 (App Router), Supabase, and Stripe.

## 🚀 Recent Major Updates (Jan 18, 2026)

- **Kid's Wear Module**:
    - **Separate Categories**: Explicit "Boy's Wear" and "Girl's Wear" subcategories.
    - **Logic Separation**: "Girl's Wear" now uses sizes **1-9**, while others use StandardXS-3XL.
    - **Custom Size Charts**: Implemented a dark-themed (Black/Silver) size chart specifically for Girl's Wear with updated dimensions.
- **Infrastructure & Reliability**:
    - **Server Recovery**: Fixed critical crash loop caused by port conflicts (`EADDRINUSE`) and missing build artifacts.
    - **Asset Synchronization**: Implemented robust deployment scripts (`manual_server_fix.exp`) to ensure static assets (icons, images) are correctly served in Next.js Standalone mode.
    - **DNS Restoration**: Restored missing A Records to bring the site back online.

## 📊 Project Status & Feature Audit

### 🛍️ Categories & Data
Currently, the application runs on a **Hybrid Data Model** (Supabase DB + Local Fallback).

| Category | Product Count | Status | Notes |
|----------|:-------------:|:------:|-------|
| **Suit Set** | ~39 | ✅ Active | Fully populated with images, descriptions, and variants. |
| **Kid's Wear** | ~10 | ✅ Active | **New!** Split into Boy's/Girl's. Size logic (1-9) active. |
| **Co-ord Set** | ~8 | ✅ Active | **New!** Active category with initial products. |
| **Western Wear** | 0 | 🚧 Empty | Placeholder category. |
| **Indo-Western** | 0 | 🚧 Empty | Placeholder category. |
| **Men's Wear** | 0 | 🚧 Empty | Placeholder category. |

> **Note**: Products are managed via the Admin Panel. existing `Girl's Wear` products may need to be re-saved in the Admin Panel to reflect the new Size (1-9) options on the frontend.

### 🛠️ Features Functionality (Zara/H&M Style Analysis)

| Feature | Status | Implementation Details |
|---------|:------:|------------------------|
| **User Auth** | ✅ Working | Supabase Auth (Email/Video OTP login flow). |
| **Payments** | ✅ Working | **Stripe** & **PhonePe** integration is fully set up. |
| **Order Tracking** | ✅ Working | Custom tracking APIs (`/api/order/[id]/tracking`) implementing detailed courier status. |
| **Admin Panel** | ✅ Working | Dashboard for Product Management, Order Processing, and Content Management. |
| **Search & Filter** | ✅ Working | Fast filtering by Category, Price, and Search terms. |
| **Wishlist & Cart** | ✅ Working | Persistent state management. Fixed broken icons issue (Jan 18). |
| **Product Zoom** | ✅ Working | High-quality image zoom on hover (Desktop) and modal view. |
| **Mobile UX** | ✅ Working | Fully responsive design with mobile-optimized Hero Slider and Navigation. |

## 💻 Tech Stack
- **Framework**: Next.js 13.5 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Logistics**: iThinkLogistics Integration
- **Deployment**: VPS (Hostinger) with PM2 & Nginx (Standalone Build)

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
*Documentation updated on Jan 18, 2026.*