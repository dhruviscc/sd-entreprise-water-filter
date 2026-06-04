-- ==========================================
-- CONTACTS/ENQUIRIES TABLE SETUP (Migration 8)
-- ==========================================

-- 1. CREATE CONTACTS TABLE
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email_address TEXT,
    mobile_number TEXT NOT NULL,
    service_interest TEXT DEFAULT 'General Enquiry',
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
    notes TEXT, -- Admin notes
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ENABLE RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- 3. RLS POLICIES

-- Allow public to insert enquiries (from contact form)
DROP POLICY IF EXISTS "Anyone can insert contacts" ON public.contacts;
CREATE POLICY "Anyone can insert contacts" ON public.contacts 
    FOR INSERT WITH CHECK (true);

-- Allow authenticated admins full access
DROP POLICY IF EXISTS "Admins have full access to contacts" ON public.contacts;
CREATE POLICY "Admins have full access to contacts" ON public.contacts 
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 4. UPDATE UPDATED_AT TRIGGER
DROP TRIGGER IF EXISTS update_contacts_updated_at ON public.contacts;
CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON public.contacts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. INDEXING FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);

-- 6. RELOAD SCHEMA
NOTIFY pgrst, 'reload schema';
