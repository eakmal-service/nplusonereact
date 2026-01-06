
# Technical Audit Report: nplusonefashion

## 1. Project Identity & Architecture
- **Framework:** Next.js 13.5.4 (App Router enabled).
- **Runtime Environment:** Node.js (v22.x+ recommended based on devDependencies).
- **Language:** TypeScript (v5.8.3) & JavaScript mixed.
- **Styling:** Tailwind CSS (v3.4.1) with PostCSS and Autoprefixer.
- **UI Libraries:** Headless UI (`@headlessui/react`), Heroicons.
- **State Management:** React Context (`AuthContext`, `ProductContext`, `CartContext`), SWR (`swr`) for data fetching.

### **Configuration Analysis (`next.config.js`)**
- **Output Mode:** `standalone` (Optimized for Docker/VPS deployment).
- **Image Optimization:** 
  - `remotePatterns` allow images from `**.supabase.co`, `localhost`, and **`res.cloudinary.com`**.
  - **Security Warning:** `dangerouslyAllowSVG: true` is enabled.
  - **CSP:** Strict Content Security Policy configured for images (`default-src 'self'`).

---

## 2. Frontend Structure (`src/app`)
 The project follows the **Next.js App Router** convention.

### **Main Routes**
- `/` - **Home Page** (Client Component, contains `HeroSlider`, `CategoryCards`).
- `/products/[id]` - **Product Details** (Dynamic Route).
- `/cart` - **Shopping Cart**.
- `/checkout` - **Checkout Flow**.
- `/account` - **User Profile/Orders** (Protected).
- `/admin` - **Admin Dashboard** (Protected).
- **Category Pages:** `/suit-set`, `/western-dress`, `/co-ord-sets`, `/kids`, `/indi-western`, `/mens`, `/night-bottoms`, `/tshirt-top`.

### **Component Architecture**
- **Client vs Server:** Heavy reliance on `"use client"` directives (e.g., `ProductContext`, `AuthContext`). Most data fetching happens client-side via `useEffect` in Contexts or SWR, rather than Server Components fetching data directly.
- **Images:** Uses `next/image` extensively. 
  - **Migration Note:** Migration to **Cloudinary** is complete. `next.config.js` is correctly configured to optimize these images.

---

## 3. Backend & Database Schema
**Database Provider:** Supabase (PostgreSQL).
**Schema Definition:** Based on `supabase_schema.sql` and `admin_setup.sql`.

### **Core Tables**
1. **`profiles`**
   - Links to `auth.users` (1:1).
   - Stores: `full_name`, `email`, `phone_number`, `is_admin`, `address` details.
2. **`products`**
   - **Rich Schema:** `title`, `price`, `sale_price`, `stock_quantity`.
   - **Categories:** `category` (ENUM), `subcategory`.
   - **Details:** `fabric`, `neck_design`, `fit_type`, `hsn_code`, `gst_percentage`.
   - **Media:** `image_url` (thumbnail), `image_urls` (gallery), `video_url`.
   - **Logic:** `is_admin_uploaded`, `status` ('active'/'draft').
3. **`orders` & `order_items`**
   - Tracks `subtotal`, `tax`, `shipping`, `total_amount`, `status`, `payment_status`.
   - Links to `profiles` and `products`.
4. **`cart_items`**
   - Server-side cart storage linking `user_id` and `product_id`.
5. **`content_banners` (CMS)**
   - Manages dynamic sliders/banners (`image_url_desktop`, `image_url_mobile`).
6. **`coupons`**
   - Discount logic (`PERCENTAGE`, `FIXED_AMOUNT`), `min_order_value`, `usage_limit`.

---

## 4. Auth & Security
**Authentication Provider:** Supabase Auth (GoTrue).

### **Implementation Details**
- **Context:** `src/contexts/AuthContext.tsx` manages global auth state (`user`, `session`).
- **Methods:** Supports Password Login (`signInWithPassword`) and OTP Login (`signInWithOtp`).
- **Middleware:** **PRESENT (`src/middleware.ts`).**
  - **Protection:** Protects `/admin` and `/account` routes server-side using `@supabase/ssr`.
  - **Logic:** Intercepts requests, checks for valid session cookie, verifies admin status for `/admin` routes, and redirects unauthorized users before page load.
- **RLS (Row Level Security):** Enabled on all tables.
  - **Profiles:** Users view/edit own. Admins view all.
  - **Products:** Public read. Admins write.
  - **Orders:** Users view own. Admins view all.

---

## 5. Storage Logic
**Migration Status:** Transitioned from Supabase Storage -> **Cloudinary**.

### **Current Implementation**
- **Upload Utility:** `src/utils/uploadService.ts` handles uploads cleanly via internal API proxy or direct SDK (scripts).
- **Refactoring:** The legacy "patched" `supabaseUpload.ts` has been removed. All admin components now import the dedicated `uploadService`.
- **Batch Script:** `scripts/upload_assets.js` exists to sync local `public/` assets to Cloudinary.
- **Frontend Display:** `ProductContext.tsx` contains logic to transform legacy DB paths (e.g., `products/D3P_1/1.webp`) into absolute Cloudinary URLs on the fly (`https://res.cloudinary.com/...`).

---

## 6. Integrations & External Services
- **Stripe:** Payment processing (`@stripe/stripe-js`).
- **Nodemailer:** Email services (likely for order confirmation/OTP).
- **Cloudinary:** Media asset management and optimization.
- **Hostinger:** Deployment target (VPS).

## 7. Critical Action Items (Status Update)
1.  **Next Config Update:** **[RESOLVED]** `res.cloudinary.com` added to `next.config.js`.
2.  **Middleware:** **[RESOLVED]** `src/middleware.ts` created and active.
3.  **Refactoring:** **[RESOLVED]** Upload service refactored and cleaned.
