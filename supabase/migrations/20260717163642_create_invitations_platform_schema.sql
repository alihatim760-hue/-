/*
# Luxury Digital Invitations Platform - Schema

## Overview
Creates the full schema for a multi-user luxury digital invitations platform where
authenticated hosts create events, design invitations from templates, manage guest
lists, and track RSVPs. Guests view invitations and submit RSVPs via public links
without authentication.

## New Tables

### profiles
- `id` (uuid, PK, references auth.users) — one-to-one with the auth user
- `full_name` (text) — display name of the host
- `company_name` (text) — optional organization name
- `phone` (text) — optional contact phone
- `avatar_url` (text) — optional avatar image URL
- `created_at` (timestamptz)

### events
- `id` (uuid, PK) — also serves as the public invitation token in the URL
- `user_id` (uuid, NOT NULL, DEFAULT auth.uid(), FK to auth.users) — owner
- `title` (text) — event title (e.g. "Sarah & Ahmed's Wedding")
- `event_type` (text) — wedding | birthday | corporate | engagement | graduation | other
- `event_date` (date) — date of the event
- `event_time` (time) — start time
- `end_time` (time, nullable) — optional end time
- `venue` (text) — venue name
- `address` (text) — full address
- `city` (text) — city name
- `description` (text) — invitation message / details
- `host_name` (text) — name of the host(s)
- `template_id` (text) — template slug used for the invitation design
- `theme_color` (text) — hex accent color for the invitation
- `cover_image_url` (text) — optional cover image
- `status` (text) — draft | active | archived
- `max_guests` (int) — 0 = unlimited
- `allow_plus_ones` (boolean) — whether guests can bring +1s
- `rsvp_deadline` (date, nullable) — optional RSVP deadline
- `created_at` / `updated_at` (timestamptz)

### guests
- `id` (uuid, PK)
- `event_id` (uuid, NOT NULL, FK to events ON DELETE CASCADE)
- `name` (text) — guest name
- `email` (text) — guest email (optional for RSVP)
- `phone` (text) — guest phone (optional)
- `plus_ones` (int, default 0) — number of additional guests
- `rsvp_status` (text) — pending | attending | declined | maybe
- `rsvp_message` (text) — optional message from guest
- `rsvp_at` (timestamptz, nullable) — when RSVP was submitted
- `created_at` (timestamptz)

## Security
- RLS enabled on all tables.
- profiles: authenticated users can CRUD their own profile row.
- events: authenticated owners can CRUD their events; anon can SELECT active events
  (needed for public invitation links — UUIDs are unguessable).
- guests: authenticated event owners can SELECT/UPDATE/DELETE guests on their events;
  anon can INSERT RSVP submissions (public RSVP form) and can SELECT guests only via
  event ownership (no anon SELECT — RSVP submissions don't need to read other guests).
*/

-- ===================== PROFILES =====================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  company_name text DEFAULT '',
  phone text DEFAULT '',
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles
  FOR DELETE TO authenticated USING (auth.uid() = id);

-- ===================== EVENTS =====================
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  event_type text NOT NULL DEFAULT 'wedding',
  event_date date NOT NULL DEFAULT CURRENT_DATE,
  event_time time NOT NULL DEFAULT '18:00',
  end_time time,
  venue text DEFAULT '',
  address text DEFAULT '',
  city text DEFAULT '',
  description text DEFAULT '',
  host_name text NOT NULL DEFAULT '',
  template_id text NOT NULL DEFAULT 'royal-gold',
  theme_color text DEFAULT '#c5a55a',
  cover_image_url text DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  max_guests int NOT NULL DEFAULT 0,
  allow_plus_ones boolean NOT NULL DEFAULT true,
  rsvp_deadline date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Owners can read their own events
DROP POLICY IF EXISTS "select_own_events" ON events;
CREATE POLICY "select_own_events" ON events
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Public can read active events (for invitation links)
DROP POLICY IF EXISTS "anon_select_active_events" ON events;
CREATE POLICY "anon_select_active_events" ON events
  FOR SELECT TO anon, authenticated USING (status = 'active');

DROP POLICY IF EXISTS "insert_own_events" ON events;
CREATE POLICY "insert_own_events" ON events
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_events" ON events;
CREATE POLICY "update_own_events" ON events
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_events" ON events;
CREATE POLICY "delete_own_events" ON events
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ===================== GUESTS =====================
CREATE TABLE IF NOT EXISTS guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text DEFAULT '',
  phone text DEFAULT '',
  plus_ones int NOT NULL DEFAULT 0,
  rsvp_status text NOT NULL DEFAULT 'pending',
  rsvp_message text DEFAULT '',
  rsvp_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Event owners can read guests on their events
DROP POLICY IF EXISTS "select_own_event_guests" ON guests;
CREATE POLICY "select_own_event_guests" ON guests
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = guests.event_id AND events.user_id = auth.uid()));

-- Event owners can update guests on their events
DROP POLICY IF EXISTS "update_own_event_guests" ON guests;
CREATE POLICY "update_own_event_guests" ON guests
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = guests.event_id AND events.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM events WHERE events.id = guests.event_id AND events.user_id = auth.uid()));

-- Event owners can delete guests on their events
DROP POLICY IF EXISTS "delete_own_event_guests" ON guests;
CREATE POLICY "delete_own_event_guests" ON guests
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = guests.event_id AND events.user_id = auth.uid()));

-- Anon can insert RSVP submissions (public RSVP form)
DROP POLICY IF EXISTS "anon_insert_rsvps" ON guests;
CREATE POLICY "anon_insert_rsvps" ON guests
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ===================== INDEXES =====================
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_guests_event_id ON guests(event_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- ===================== TRIGGER: updated_at =====================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS events_updated_at ON events;
CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();