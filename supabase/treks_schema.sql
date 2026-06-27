-- SQL script to create treks and gallery_reels tables for Maharashtra Trekking Co.

-- ==========================================
-- TREKS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.treks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    img TEXT,
    difficulty TEXT DEFAULT 'Moderate',
    duration TEXT DEFAULT '2D / 1N',
    price INTEGER DEFAULT 0,
    city TEXT DEFAULT 'Bangalore',
    next_batch TEXT,
    next_batch_date TIMESTAMPTZ,
    seats_left INTEGER DEFAULT 10,
    tag TEXT DEFAULT '',
    altitude TEXT DEFAULT '',
    basecamp TEXT DEFAULT '',
    region TEXT DEFAULT '',
    best_season TEXT DEFAULT '',
    group_size TEXT DEFAULT '',
    pickup_points TEXT[] DEFAULT '{}',
    highlights TEXT[] DEFAULT '{}',
    itinerary JSONB DEFAULT '[]'::jsonb,
    inclusions TEXT[] DEFAULT '{}',
    exclusions TEXT[] DEFAULT '{}',
    things_to_carry TEXT[] DEFAULT '{}',
    itinerary_note TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.treks ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read from treks" ON public.treks
    FOR SELECT TO anon, authenticated
    USING (true);

-- Allow authenticated (admin) modifications
CREATE POLICY "Allow authenticated manage treks" ON public.treks
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- ==========================================
-- GALLERY & REELS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.gallery_reels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('gallery', 'reel')),
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.gallery_reels ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read from gallery_reels" ON public.gallery_reels
    FOR SELECT TO anon, authenticated
    USING (true);

-- Allow authenticated (admin) modifications
CREATE POLICY "Allow authenticated manage gallery_reels" ON public.gallery_reels
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);
