-- ==========================================
-- SUPER SQL SCHEMA FOR NPLUSONE (FINAL MERGED)
-- Structure: Optimized by User
-- Details: Comprehensive Product Fields included
-- ==========================================

-- 1. ENUMS
-- 1. ENUMS (Idempotent)
DO $$ BEGIN
    CREATE TYPE app_category AS ENUM ('SUIT SET', 'WESTERN WEAR', 'CO-ORD SET', 'KIDS WEAR', 'INDO-WESTERN', 'MENS WEAR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE discount_type AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone_number TEXT,
  email TEXT,
  avatar_url TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  country TEXT DEFAULT 'India',
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. PRODUCTS
-- (Merged: Optimized Fields + Requested Detailed Specs)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Info
  title TEXT NOT NULL,
  brand_name TEXT DEFAULT 'NPlusOne', -- Added field
  style_code TEXT, -- Added field
  short_description TEXT, -- Added field
  description TEXT,
  
  -- Pricing (Explicit MRP/Selling logic)
  mrp NUMERIC NOT NULL, 
  selling_price NUMERIC NOT NULL,
  price NUMERIC GENERATED ALWAYS AS (selling_price) STORED, -- Backward compat alias
  sale_price NUMERIC GENERATED ALWAYS AS (selling_price) STORED, -- Backward compat alias

  -- Categorization
  category app_category NOT NULL,
  subcategory TEXT,

  -- Media
  image_url TEXT, -- Main thumb
  image_urls TEXT[], -- Gallery
  video_url TEXT,
  
  -- Inventory
  stock_quantity INTEGER DEFAULT 0,
  in_stock BOOLEAN GENERATED ALWAYS AS (stock_quantity > 0) STORED,
  
  -- SKUs
  sku_map JSONB DEFAULT '{}'::jsonb, -- Map for {"S": "SKU1", "M": "SKU2"}
  default_sku TEXT, -- General SKU if no map

  -- Variants
  color_options JSONB DEFAULT '[]'::jsonb,
  main_color TEXT,
  sizes TEXT[] DEFAULT '{S,M,L,XL,XXL}',
  
  -- Detailed Specifications (Requested Fields)
  fabric TEXT,
  work_type TEXT,
  neck_design TEXT,
  sleeve_length TEXT,
  fit_type TEXT,
  bottom_type TEXT,
  set_contains TEXT,
  product_weight NUMERIC, -- grams/kg
  wash_care TEXT,
  
  -- SEO & Metadata
  search_keywords TEXT[], 
  slug TEXT UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  alt_text TEXT, -- Added missing field
  
  -- Tax
  hsn_code TEXT,
  gst_percentage NUMERIC DEFAULT 0,
  
  -- Stats
  view_count INTEGER DEFAULT 0,
  average_rating NUMERIC DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'active',
  is_admin_uploaded BOOLEAN DEFAULT false, -- Added missing field
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. CART ITEMS
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  selected_size TEXT,
  selected_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. COUPONS
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type discount_type NOT NULL,
  value NUMERIC NOT NULL,
  min_order_value NUMERIC DEFAULT 0,
  max_discount_amount NUMERIC,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- 6. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  subtotal NUMERIC NOT NULL,
  tax_total NUMERIC DEFAULT 0,
  shipping_cost NUMERIC DEFAULT 0,
  discount_total NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  coupon_code TEXT,
  status order_status DEFAULT 'PENDING',
  payment_status TEXT DEFAULT 'UNPAID',
  payment_method TEXT,
  payment_id TEXT,
  shipping_address JSONB NOT NULL,
  tracking_id TEXT,
  carrier TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  selected_size TEXT,
  selected_color TEXT,
  quantity INTEGER NOT NULL,
  price_per_unit NUMERIC NOT NULL,
  inventory_sku TEXT,
  gst_percentage NUMERIC DEFAULT 0,
  hsn_code TEXT
);

-- 8. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[],
  is_verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9. CMS (BANNERS)
CREATE TABLE IF NOT EXISTS public.content_banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  image_url_desktop TEXT NOT NULL,
  image_url_mobile TEXT,
  link_url TEXT,
  section TEXT DEFAULT 'HOME_SLIDER',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 10. WISHLIST
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, product_id)
);

-- 11. SYSTEM LOGS (ERROR TRACKING)
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL, -- 'PINCODE_CHECK', 'ORDER_HOOK', 'CLIENT_ERROR', 'SHIPMENT_TRACKING', 'SHIPMENT_CANCEL', 'SHIPMENT_RETURN', 'INVOICE_GENERATION', 'MANIFEST_GENERATION'
    status TEXT NOT NULL, -- 'SUCCESS', 'FAILURE'
    message TEXT,
    request_data JSONB,
    response_data JSONB,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    url TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ================= FUNCTIONS & TRIGGERS =================

-- Secure Admin Check Function (Prevents Recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Auto Create Profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DO $$ BEGIN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Auto Update Timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql' SET search_path = public;

DO $$ BEGIN
    CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
    CREATE TRIGGER update_products_modtime BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ================= RLS POLICIES (SECURE) =================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- Profiles
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins view all profiles" ON public.profiles;
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT USING (is_admin());

-- Products
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage products" ON public.products;
CREATE POLICY "Admins manage products" ON public.products FOR ALL USING (is_admin());

-- Cart
DROP POLICY IF EXISTS "Users manage own cart" ON public.cart_items;
CREATE POLICY "Users manage own cart" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- Orders
DROP POLICY IF EXISTS "Users view own orders" ON public.orders;
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users create own orders" ON public.orders;
CREATE POLICY "Users create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins view all orders" ON public.orders;
CREATE POLICY "Admins view all orders" ON public.orders FOR SELECT USING (is_admin());
DROP POLICY IF EXISTS "Admins update orders" ON public.orders;
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE USING (is_admin());

-- Order Items
DROP POLICY IF EXISTS "Users view order items" ON public.order_items;
CREATE POLICY "Users view order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid())
);
DROP POLICY IF EXISTS "Admins view order items" ON public.order_items;
CREATE POLICY "Admins view order items" ON public.order_items FOR SELECT USING (is_admin());

-- Reviews
DROP POLICY IF EXISTS "Public view reviews" ON public.reviews;
CREATE POLICY "Public view reviews" ON public.reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users create reviews" ON public.reviews;
CREATE POLICY "Users create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users edit own reviews" ON public.reviews;
CREATE POLICY "Users edit own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- Wishlist
DROP POLICY IF EXISTS "Users manage wishlist" ON public.wishlist;
CREATE POLICY "Users manage wishlist" ON public.wishlist FOR ALL USING (auth.uid() = user_id);

-- CMS
DROP POLICY IF EXISTS "Public view banners" ON public.content_banners;
CREATE POLICY "Public view banners" ON public.content_banners FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admins manage banners" ON public.content_banners;
CREATE POLICY "Admins manage banners" ON public.content_banners FOR ALL USING (is_admin());

-- Coupons
DROP POLICY IF EXISTS "Public view active coupons" ON public.coupons;
CREATE POLICY "Public view active coupons" ON public.coupons FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admins manage coupons" ON public.coupons;
CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL USING (is_admin());

-- System Logs (Secure)
DROP POLICY IF EXISTS "Admins manage system logs" ON public.system_logs;
CREATE POLICY "Admins manage system logs" ON public.system_logs FOR ALL USING (is_admin());

-- ================= PERFORMANCE INDEXES (POLISH) =================

-- Products: Faster search & filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(selling_price);

-- Orders: Faster lookup by user & status
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- Cart: Faster cart loading
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON public.cart_items(user_id);

-- Profiles: Faster admin checks
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);


-- ================= DATA INTEGRITY CHECKS (POLISH) =================

-- Ensure Selling Price is never greater than MRP
-- Ensure Selling Price is never greater than MRP
DO $$ BEGIN
    ALTER TABLE public.products ADD CONSTRAINT check_price_logic CHECK (selling_price <= mrp);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Ensure Stock is non-negative
DO $$ BEGIN
    ALTER TABLE public.products ADD CONSTRAINT check_stock_non_negative CHECK (stock_quantity >= 0);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Final Note: Schema is ready for production use.

-- ================= SECURITY PATCHES FOR EXISTING FUNCTIONS =================
-- Fix "Function Search Path Mutable" for functions that might exist in the DB
DO $$ BEGIN
    ALTER FUNCTION public.generate_order_number() SET search_path = public;
EXCEPTION
    WHEN undefined_function THEN null;
END $$;

DO $$ BEGIN
    ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
EXCEPTION
    WHEN undefined_function THEN null;
END $$;

