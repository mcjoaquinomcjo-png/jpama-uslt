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

-- =========================================================
-- 7. CONTACT INQUIRIES TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Unread' CHECK (status IN ('Unread', 'Read', 'Resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) & FULL PERMISSIONS
-- To allow smooth CRUD interaction from both public portal & admin:
-- Option A: Drop existing restrictive policies and create full access policies
-- =========================================================

-- Members Table Policies
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read all" ON public.members;
DROP POLICY IF EXISTS "Public insert members" ON public.members;
DROP POLICY IF EXISTS "Public update members" ON public.members;
DROP POLICY IF EXISTS "Public delete members" ON public.members;
DROP POLICY IF EXISTS "Allow all on members" ON public.members;
CREATE POLICY "Allow all on members" ON public.members FOR ALL USING (true) WITH CHECK (true);

-- Events Table Policies
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read events" ON public.events;
DROP POLICY IF EXISTS "Allow all on events" ON public.events;
CREATE POLICY "Allow all on events" ON public.events FOR ALL USING (true) WITH CHECK (true);

-- RSVPs Table Policies
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on rsvps" ON public.rsvps;
CREATE POLICY "Allow all on rsvps" ON public.rsvps FOR ALL USING (true) WITH CHECK (true);

-- Resources Table Policies
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read resources" ON public.resources;
DROP POLICY IF EXISTS "Allow all on resources" ON public.resources;
CREATE POLICY "Allow all on resources" ON public.resources FOR ALL USING (true) WITH CHECK (true);

-- Officers Table Policies
ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read officers" ON public.officers;
DROP POLICY IF EXISTS "Allow all on officers" ON public.officers;
CREATE POLICY "Allow all on officers" ON public.officers FOR ALL USING (true) WITH CHECK (true);

-- Settings Table Policies
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read settings" ON public.settings;
DROP POLICY IF EXISTS "Allow all on settings" ON public.settings;
CREATE POLICY "Allow all on settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);

-- Contact Inquiries Table Policies
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on contact_inquiries" ON public.contact_inquiries;
CREATE POLICY "Allow all on contact_inquiries" ON public.contact_inquiries FOR ALL USING (true) WITH CHECK (true);

-- (Optional) If you prefer completely open access without RLS filtering:
-- ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.rsvps DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.resources DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.officers DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.contact_inquiries DISABLE ROW LEVEL SECURITY;

