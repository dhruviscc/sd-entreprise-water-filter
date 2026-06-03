-- ==========================================
-- SERVICES TABLE SETUP (Migration 3)
-- ==========================================

-- 1. CREATE SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    short_description TEXT,
    description TEXT,
    image TEXT,
    icon TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    faqs JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ENSURE COLUMNS EXIST (if table was already there)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='short_description') THEN
     
        ALTER TABLE public.services ADD COLUMN short_description TEXT;
    END IF;
END $$;



-- 3. ENABLE RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins have full access to services" ON public.services;
CREATE POLICY "Admins have full access to services" ON public.services FOR ALL TO authenticated 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 5. UPDATE UPDATED_AT TRIGGER
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. RELOAD SCHEMA
NOTIFY pgrst, 'reload schema';