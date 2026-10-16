-- =========================================================
-- JPAMA USLT Website Database Schema (Supabase PostgreSQL)
-- Tailored exclusively for BS Management Accounting (BSMA)
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------
-- 1. MEMBERS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_number VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    year_level VARCHAR(10) NOT NULL CHECK (year_level IN ('1st Year', '2nd Year', '3rd Year', '4th Year')),
    program VARCHAR(50) NOT NULL DEFAULT 'BSMA' CHECK (program = 'BSMA'),
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Active', 'Graduated')),
    payment_ref VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_members_student_number ON public.members(student_number);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);

-- ---------------------------------------------------------
-- 2. EVENTS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) DEFAULT 'Leadership',
    description TEXT NOT NULL,
    full_details TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(150) NOT NULL,
    max_capacity INTEGER NOT NULL DEFAULT 200,
    is_published BOOLEAN NOT NULL DEFAULT true,
    speaker VARCHAR(100),
    speaker_role VARCHAR(150),
    badge VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_events_published_date ON public.events(is_published, event_date);

-- ---------------------------------------------------------
-- 3. RSVPS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    student_number VARCHAR(20) NOT NULL,
    notes TEXT,
    attendance_status VARCHAR(20) NOT NULL DEFAULT 'Registered' CHECK (attendance_status IN ('Registered', 'Attended', 'Cancelled')),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_event_student_rsvp UNIQUE (event_id, student_number)
);

CREATE INDEX IF NOT EXISTS idx_rsvps_event_id ON public.rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_student ON public.rsvps(student_number);

-- ---------------------------------------------------------
-- 4. ANNOUNCEMENTS TABLE (For Live Content Editing)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    link VARCHAR(200) DEFAULT '/events',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ---------------------------------------------------------
-- 5. ACADEMIC RESOURCES TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Academic Reviewer',
    year_level VARCHAR(50) NOT NULL DEFAULT 'All Years',
    format VARCHAR(20) NOT NULL DEFAULT 'PDF',
    size VARCHAR(20) DEFAULT '2.5 MB',
    download_url TEXT NOT NULL DEFAULT '#',
    downloads_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ---------------------------------------------------------
-- Row Level Security (RLS)
-- ---------------------------------------------------------
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Public read resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Public read members" ON public.members FOR SELECT USING (true);

-- Allow public insert (registration & RSVP)
CREATE POLICY "Public register member" ON public.members FOR INSERT WITH CHECK (true);
CREATE POLICY "Public submit rsvp" ON public.rsvps FOR INSERT WITH CHECK (true);

-- ---------------------------------------------------------
-- Initial Seed Data (Sample BSMA Members & Events)
-- ---------------------------------------------------------
INSERT INTO public.members (student_number, full_name, email, year_level, program, status, payment_ref)
VALUES 
    ('2023-01042', 'Kirsten Joy Dela Cruz', 'kj.delacruz@uslt.edu.ph', '3rd Year', 'BSMA', 'Active', 'GCASH-891024881'),
    ('2024-00519', 'Marc Alistair Valenzuela', 'marc.valenzuela@uslt.edu.ph', '2nd Year', 'BSMA', 'Active', 'CASHIER-USLT-4019'),
    ('2025-00118', 'Sophia Reign Agcaoili', 'sophia.agcaoili@uslt.edu.ph', '1st Year', 'BSMA', 'Pending', 'GCASH-491023774')
ON CONFLICT (student_number) DO NOTHING;

INSERT INTO public.events (slug, title, category, description, event_date, location, max_capacity, is_published, badge)
VALUES 
    ('sihaya-induction-2026', 'Sihaya: The 2026 Grand Induction & Pinning Gala', 'Leadership', 'The official donning of pins and formal induction rites for newly registered JPAMA members.', '2026-10-24 08:30:00+00', 'USLT Bulwagang San Jacinto', 250, true, 'Flagship Event'),
    ('mastering-strategic-cost-management', 'Masterclass: Strategic Cost Management & Decision Modeling', 'Academic', 'Comprehensive intensive review on activity-based costing and corporate controllership analytics.', '2026-11-14 13:00:00+00', 'SABH Multimedia Hall 3', 120, true, 'Curricular Review')
ON CONFLICT (slug) DO NOTHING;
