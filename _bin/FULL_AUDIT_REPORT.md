# Technical Audit Report: NPlusOne Fashion

## 1. Project Identity & Architecture
- **Framework:** Next.js 13.5.4 (App Router enabled).
- **Runtime Environment:** Node.js v20 (VPS).
- **Language:** TypeScript (v5.x) & JavaScript.
- **Styling:** Tailwind CSS (v3.4.1) with PostCSS and Autoprefixer.
- **State Management:** React Context (`AuthContext`, `CartContext`), SWR (`swr`) for data fetching.

### **Configuration Analysis (`next.config.js`)**
- **Output Mode:** `standalone` (Optimized for Docker/VPS micro-server deployment).
- **Image Optimization:** 
  - `sharp` installed for production optimization.
  - Cloudinary `f_auto,q_auto` used for all remote assets.
  - Remote patterns configured for Supabase and Cloudinary.
- **Security:** Strict CSP headers configured in `next.config.js`.

---

## 2. Infrastructure & Deployment (VPS)
**Target:** Hostinger VPS (Ubuntu 24.04).
**Domain:** `nplusonefashion.com`.

### **Deployment Pipeline (`scripts/deploy-ssh.js`)**
A custom Node.js script handles the entire CI/CD process via SSH:
1.  **Transport:** Connects to VPS via `ssh2`.
2.  **Environment:** Automatically parses local `.env.local` and injects it into the server environment.
3.  **Build Process:**
    - Pulls latest code from GitHub (`eakmal-service/Nplus-final-`).
    - Installs dependencies (including `sharp`).
    - Runs `npm run build`.
    - **Crucial Step:** Copies `.env.local` to `.next/standalone/.env.local` for runtime access.
4.  **Process Management:** Uses **PM2** (`nplusone`) to manage the `node server.js` process on port 3000.
5.  **Reverse Proxy:** **Caddy** handles SSL (HTTPS) and proxies port 443 -> 3000.

---

## 3. Frontend Structure (`src/app`)
The project follows the **Next.js App Router** convention.

### **Key Routes**
- `/` - **Home Page** (HeroSlider, CategoryCards, NewArrivals).
- `/products/[id]` - **Product Details** (Dynamic, SEO optimized).
- `/cart` - **Shopping Cart** (Local storage persistence).
- `/checkout` - **Checkout Flow** (Guest/Login modes, COD & Razorpay).
- `/account` - **User Dashboard** (Orders, Tracking, Profile).
- `/admin` - **Admin Panel** (Protected, Force-Dynamic Rendering).
  - `/admin/dashboard`: Stats & Quick Actions.
  - `/admin/products`: CRUD operations.
  - `/admin/orders`: Order management.

### **Component Architecture**
- **Interactive Layers:** Heavy usage of Client Components (`"use client"`) for UI interactivity (Filtering, Search, Modals).
- **Admin Fixes:** Admin pages implemented with `export const dynamic = 'force-dynamic'` to bypass static generation build errors on the VPS.

---

## 4. Backend & Database Schema
**Database Provider:** Supabase (PostgreSQL).
**Admin Access:** `src/lib/supabaseAdmin.ts` uses `SUPABASE_SERVICE_ROLE_KEY` for privileged operations (Order creation, user management).

### **Core Tables**
1.  **`profiles`**: User data linked to Auth ID.
2.  **`products`**: Rich product catalog with categories, deep details, and Cloudinary image URLs.
3.  **`orders`**: 
    - Statuses: `PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`.
    - Payment Methods: `COD`, `RAZORPAY`.
4.  **`order_items`**: Line items linked to orders.
5.  **`coupons`**: Discount engine (`FIXED` or `PERCENTAGE`).

---

## 5. Payments & Checkout
**Primary Provider:** **Razorpay** & **PhonePe**.

### **Implementation Details**
- **Checkout Flow (`/checkout`):**
  - **COD:** Direct order creation with status `PENDING`.
  - **PhonePe (Primary):**
    1.  Calls `/api/payment/phonepe/initiate` to generate payload + checksum.
    2.  Redirects user to PhonePe S2S payment page.
    3.  Handles S2S callback at `/api/payment/phonepe/callback`.
  - **Razorpay (Legacy/Backup):** Standard modal flow.
- **Validation:** Robust form validation includes phone number checks and required fields.
- **Debugging:** Detailed error logging implemented in `handlePlaceOrder` to catch payment initialization failures.

---

## 6. Features & Enhancements (New)
### **Order History 2.0 (`/account/orders`)**
- **Search:** Filter orders by Order ID or Product Name.
- **Time Filters:** Last 30 days, 3 months, 6 months, 2024, etc.
- **Tracking:** "Track Order" button opens a simplified tracking modal (Integration ready).

### **Recently Viewed Products**
- **Logic:** Persisted in `localStorage`.
- **UI:** Horizontal scroll layout, fixed alignment issue (now `justify-start`) to ensure proper rendering for low item counts.

---


---

## 7. Latest Feature Audits (Jan 2026)

### **A. Payments Integration (PhonePe)**
- **Status:** **LIVE (Production Mode)**.
- **Provider:** PhonePe (via `/api/payment/phonepe`).
- **Flow:**
  1.  Initiate Payment -> Redirect to PhonePe Gateway.
  2.  Callback Handling -> `/api/payment/phonepe/callback` (Server-to-Server).
  3.  Status Check -> `/api/payment/phonepe/check-status` (Client Verification).
- **Environment:** Production credentials (`SU260123...`) securely injected via deployment script.

### **B. Frontend Redesign**
- **Product Cards:** 
  - **Visuals:** Added "Discount Badge" (e.g., 42% OFF), Bold Sale Price, Strikethrough MRP.
  - **Buttons:** Wishlist & QuickView moved to right-side vertical stack.
  - **Data Integrity:** Fixed `originalPrice` mapping issue; Strikethrough now visible on "Similar Products" and "Recently Viewed".
- **Mobile Header:**
  - **UX Improvement:** Profile, Wishlist, and Cart icons moved *outside* the hamburger menu for direct accessibility on mobile/tablet.
  - **Layout:** Positioned adjacent to the hamburger button.

### **C. Deployment & Infrastructure**
- **Current State:** Fully automated via `manual_deploy.sh` wrapper.
- **Challenge:** Outbound SSH/Git ports (22/443) blocked in dev environment.
- **Solution:** Deployment script now authenticates via `deploy_key` and uses `manual_deploy.sh` to orchestrate push + VPS trigger.
- **Stability:** Excellent. Application rebuilds and restarts via PM2 successfully.

## 8. Critical Status Log
| Component | Issue | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Deployment** | Network Block | **WORKAROUND** | `manual_deploy.sh` + `deploy_key` used. |
| **Payments** | PhonePe Prod | **ACTIVE** | Production keys configured and verified. |
| **UI** | Product Cards | **POLISHED** | Strikethrough price fixed across all sections. |
| **Mobile** | Header Icons | **OPTIMIZED** | Icons accessible outside hamburger menu. |
| **SEO** | Meta Tags | **ACTIVE** | Dynamic metadata generating correctly for products. |

