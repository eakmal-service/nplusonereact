-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    is_visible BOOLEAN DEFAULT TRUE,
    level INTEGER DEFAULT 0, -- 0: Super, 1: Parent, 2: Child
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies (Adjust based on your auth setup)
-- Allow read access to everyone
CREATE POLICY "Allow public read access" ON public.categories FOR SELECT USING (true);

-- Allow write access to authenticated users (or admins only if you have admin role)
-- For now, allowing all authenticated users to manage categories (assuming this is an admin tool)
CREATE POLICY "Allow authenticated insert" ON public.categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON public.categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON public.categories FOR DELETE USING (auth.role() = 'authenticated');
