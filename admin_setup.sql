-- ==========================================
-- ADMIN PANEL SETUP (FIXES)
-- Run this to enable Content Management & Coupons
-- ==========================================

-- 1. Create 'website_content' table (Required for Banners, Hero Slider, Favorites)
CREATE TABLE IF NOT EXISTS public.website_content (
  section_id TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'website_content' AND policyname = 'Public view content') THEN
    CREATE POLICY "Public view content" ON public.website_content FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'website_content' AND policyname = 'Admins manage content') THEN
    CREATE POLICY "Admins manage content" ON public.website_content FOR ALL USING (
      auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true)
    );
  END IF;
END $$;


-- 2. Fix 'coupons' table (Add status column expected by Admin Panel)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='coupons' AND column_name='status') THEN
        ALTER TABLE public.coupons ADD COLUMN status TEXT DEFAULT 'active';
    END IF;
END $$;

-- 3. Fix 'products' table (Just in case user missed previous fix)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='alt_text') THEN
        ALTER TABLE public.products ADD COLUMN alt_text TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_admin_uploaded') THEN
        ALTER TABLE public.products ADD COLUMN is_admin_uploaded BOOLEAN DEFAULT false;
    END IF;
END $$;
