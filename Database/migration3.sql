-- ==========================================
-- PRODUCT SETUP (Migration 3)
-- ==========================================

-- Create product_categories table
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.product_categories(id),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    long_description TEXT,
    specifications JSONB DEFAULT '{}'::jsonb,
    features TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create product_variants table
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Default',
    color_hex TEXT NOT NULL DEFAULT '#ffffff',
    images TEXT[] DEFAULT '{}',
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);


-- Create product_enquiries table
CREATE TABLE IF NOT EXISTS public.product_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL, -- Stored as text in case product is deleted
    name TEXT NOT NULL,
    email TEXT,
    mobile TEXT,
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_enquiries ENABLE ROW LEVEL SECURITY;

-- Policies: Allow public read access to active items
CREATE POLICY "Allow public read access to active categories" ON public.product_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read access to active products" ON public.products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read access to active variants" ON public.product_variants
    FOR SELECT USING (is_active = true);


-- Policies: Allow public to insert enquiries
CREATE POLICY "Allow public to insert enquiries" ON public.product_enquiries
    FOR INSERT WITH CHECK (true);

-- Policies: Full access for service_role (Admin)
CREATE POLICY "Service role has full access to categories" ON public.product_categories FOR ALL USING (true);
CREATE POLICY "Service role has full access to products" ON public.products FOR ALL USING (true);
CREATE POLICY "Service role has full access to variants" ON public.product_variants FOR ALL USING (true);
CREATE POLICY "Service role has full access to enquiries" ON public.product_enquiries FOR ALL USING (true);

-- Insert default categories
INSERT INTO public.product_categories (name, slug, sort_order)
VALUES 
    ('Domestic Filter', 'domestic-filter', 1),
    ('Industrial Filter', 'industrial-filter', 2),
    ('RO Systems', 'ro-systems', 3),
    ('Water Softener', 'water-softener', 4),
    ('Gas Geyser', 'gas-geyser', 5),
    ('Kangan Water', 'kangan-water', 6),
    ('RO + Water Cooler', 'ro-water-cooler', 7),
    ('Accessories', 'accessories', 8)
ON CONFLICT (slug) DO NOTHING;

-- Add indexing for common queries
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_variants_product ON public.product_variants(product_id);
CREATE INDEX idx_enquiries_status ON public.product_enquiries(status);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_categories_slug ON public.product_categories(slug);

-- ==========================================
-- STORAGE SETUP FOR PRODUCTS
-- ==========================================

-- 1. Create Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies
-- PUBLIC READ ACCESS
DROP POLICY IF EXISTS "Public Read Access Products" ON storage.objects;
CREATE POLICY "Public Read Access Products" ON storage.objects
    FOR SELECT USING (bucket_id = 'products');

-- ADMIN FULL ACCESS
DROP POLICY IF EXISTS "Admin Full Access Products" ON storage.objects;
CREATE POLICY "Admin Full Access Products" ON storage.objects
    FOR ALL TO authenticated
    USING (
        bucket_id = 'products' AND
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        bucket_id = 'products' AND
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );


