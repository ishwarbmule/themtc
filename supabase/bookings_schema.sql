-- Drop existing policies if they exist to prevent "already exists" errors
DROP POLICY IF EXISTS "Allow public insert to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated select to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated update to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated delete to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public upload to booking_screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read from booking_screenshots" ON storage.objects;

-- Create bookings table with status column
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trek_name TEXT NOT NULL,
    seats INTEGER DEFAULT 1,
    pickup_point TEXT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    age INTEGER,
    gender TEXT,
    emergency_contact TEXT,
    screenshot_url TEXT,
    status TEXT DEFAULT 'Pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert a booking (public bookings)
CREATE POLICY "Allow public insert to bookings" ON public.bookings
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Create policy to allow authenticated users (admin/staff) to view bookings
CREATE POLICY "Allow authenticated select to bookings" ON public.bookings
    FOR SELECT TO authenticated
    USING (true);

-- Create policy to allow authenticated users (admin/staff) to update booking status
CREATE POLICY "Allow authenticated update to bookings" ON public.bookings
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policy to allow authenticated users (admin/staff) to delete bookings
CREATE POLICY "Allow authenticated delete to bookings" ON public.bookings
    FOR DELETE TO authenticated
    USING (true);

-- ==========================================
-- STORAGE BUCKET FOR PAYMENT SCREENSHOTS
-- ==========================================

-- Create the bucket for screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('booking_screenshots', 'booking_screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow anonymous uploads to the bucket
CREATE POLICY "Allow public upload to booking_screenshots" ON storage.objects
    FOR INSERT TO anon, authenticated
    WITH CHECK (bucket_id = 'booking_screenshots');

-- Policy to allow public access to see the screenshot files
CREATE POLICY "Allow public read from booking_screenshots" ON storage.objects
    FOR SELECT TO anon, authenticated
    USING (bucket_id = 'booking_screenshots');
