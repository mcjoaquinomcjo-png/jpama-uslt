-- =========================================================
-- JPAMA USLT Website Database Schema (Supabase PostgreSQL)
-- As specified in: Section 3. Database Schema Design
-- =========================================================

-- Enable UUID extension if not already enabled
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
    program VARCHAR(50) NOT NULL CHECK (program IN ('BSMA', 'BSA')),
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Active', 'Graduated')),
    payment_ref VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for speedy lookups
CREATE INDEX IF NOT EXISTS idx_members_student_number ON public.members(student_number);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);

-- ---------------------------------------------------------
-- 2. EVENTS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) DEFAULT 'Academic',
    description TEXT NOT NULL,
    full_details TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(150) NOT NULL,
    max_capacity INTEGER NOT NULL DEFAULT 100,
    is_published BOOLEAN NOT NULL DEFAULT false,
    speaker VARCHAR(100),
    speaker_role VARCHAR(150),
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
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    attendance_status VARCHAR(20) NOT NULL DEFAULT 'Registered' CHECK (attendance_status IN ('Registered', 'Attended', 'Cancelled')),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_event_member_rsvp UNIQUE (event_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_rsvps_event_id ON public.rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_member_id ON public.rsvps(member_id);

-- ---------------------------------------------------------
-- Row Level Security (RLS) policies for Supabase
-- ---------------------------------------------------------
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Public can view published events
CREATE POLICY "Public can view published events"
    ON public.events FOR SELECT
    USING (is_published = true);

-- Anyone can submit member registration
CREATE POLICY "Public can register membership"
    ON public.members FOR INSERT
    WITH CHECK (true);

-- Members can query their own status via student number
CREATE POLICY "Members can query status"
    ON public.members FOR SELECT
    USING (true);

-- Anyone can create RSVP with valid member
CREATE POLICY "Members can submit RSVP"
    ON public.rsvps FOR INSERT
    WITH CHECK (true);
