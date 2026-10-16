-- =========================================================
-- JPAMA USLT Website Database Schema (Supabase PostgreSQL)
-- Tailored exclusively for BS Management Accounting (BSMA)
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------
-- ---------------------------------------------------------
-- 1. MEMBERS TABLE (With Birthdate & Residence)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_number VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    year_level VARCHAR(10) NOT NULL CHECK (year_level IN ('1st Year', '2nd Year', '3rd Year', '4th Year')),
    program VARCHAR(50) NOT NULL DEFAULT 'BSMA' CHECK (program = 'BSMA'),
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Active', 'Graduated')),
    birthdate DATE,
    residence VARCHAR(150),
    payment_ref VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_members_student_number ON public.members(student_number);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);

-- ---------------------------------------------------------
-- 2. EVENTS TABLE (With Time, Speaker, and Agenda JSON)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) DEFAULT 'Leadership',
    description TEXT NOT NULL,
    full_details TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    event_time VARCHAR(50) DEFAULT '08:30 AM',
    location VARCHAR(150) NOT NULL,
    max_capacity INTEGER NOT NULL DEFAULT 200,
    is_published BOOLEAN NOT NULL DEFAULT true,
    speaker VARCHAR(100),
    speaker_role VARCHAR(150),
    badge VARCHAR(50),
    agenda JSONB DEFAULT '[]'::jsonb,
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
-- 4. LEADERSHIP & FACULTY TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.officers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    role VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Executive Board',
    committee VARCHAR(100) DEFAULT 'Executive Council',
    term VARCHAR(50) DEFAULT 'A.Y. 2026–2027',
    yearProgram VARCHAR(50) DEFAULT '4th Year • BSMA',
    quote TEXT,
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ---------------------------------------------------------
-- 5. PORTAL SETTINGS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'global-settings',
    portal_title VARCHAR(200) NOT NULL DEFAULT 'Junior Philippine Association of Management Accountants',
    academic_year VARCHAR(50) NOT NULL DEFAULT 'A.Y. 2026–2027',
    advisory_notice TEXT NOT NULL DEFAULT 'Welcome BS Management Accounting scholars to A.Y. 2026–2027.',
    official_email VARCHAR(100) NOT NULL DEFAULT 'jpama@uslt.edu.ph',
    facebook_url VARCHAR(200) NOT NULL DEFAULT 'https://facebook.com/jpama.uslt',
    office_location VARCHAR(200) NOT NULL DEFAULT 'Bulwagang San Jacinto, USLT Mabini Campus, Tuguegarao City',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ---------------------------------------------------------
-- 6. ACADEMIC RESOURCES TABLE (With Cloud Links)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Academic Reviewer',
    year_level VARCHAR(50) NOT NULL DEFAULT 'All Years',
    format VARCHAR(20) NOT NULL DEFAULT 'PDF',
    size VARCHAR(20) DEFAULT '2.5 MB',
    download_url TEXT NOT NULL DEFAULT 'https://drive.google.com',
    downloads_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Allow public read & writes
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read all" ON public.members FOR SELECT USING (true);
CREATE POLICY "Public insert members" ON public.members FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Public read officers" ON public.officers FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON public.settings FOR SELECT USING (true);

