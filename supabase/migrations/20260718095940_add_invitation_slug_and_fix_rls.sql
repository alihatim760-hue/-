/*
# Add invitation_slug and package_type to events, fix RLS policies

## Overview
The events and guests tables already exist. This migration:
1. Adds `invitation_slug` (unique, for public invitation URL) to events.
2. Adds `package_type` to events (basic | standard | luxury).
3. Adds `notes` to events.
4. Replaces RLS policies so:
   - Published events are publicly readable (anon) for the invitation page.
   - Owners can CRUD their own events.
   - Guests (RSVPs) can be inserted publicly for published events.
   - Guests can be read publicly for published events (to show counts/list).
   - Owners can CRUD guests of their own events.
5. Adds indexes for performance.
6. Adds updated_at trigger.
*/

-- =========================
-- Add missing columns to events (idempotent)
-- =========================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'invitation_slug') THEN
    ALTER TABLE events ADD COLUMN invitation_slug text UNIQUE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'package_type') THEN
    ALTER TABLE events ADD COLUMN package_type text NOT NULL DEFAULT 'standard';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'notes') THEN
    ALTER TABLE events ADD COLUMN notes text NOT NULL DEFAULT '';
  END IF;
END $$;

-- =========================
-- events RLS policies
-- =========================
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_events" ON events;
CREATE POLICY "select_own_events" ON events FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "anon_select_published_events" ON events;
CREATE POLICY "anon_select_published_events" ON events FOR SELECT
  TO anon USING (status = 'published');

DROP POLICY IF EXISTS "insert_own_events" ON events;
CREATE POLICY "insert_own_events" ON events FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_events" ON events;
CREATE POLICY "update_own_events" ON events FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_events" ON events;
CREATE POLICY "delete_own_events" ON events FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =========================
-- guests RLS policies
-- =========================
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_guests" ON guests;
CREATE POLICY "anon_select_guests" ON guests FOR SELECT
  TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = guests.event_id AND events.status = 'published')
  );

DROP POLICY IF EXISTS "owner_select_guests" ON guests;
CREATE POLICY "owner_select_guests" ON guests FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = guests.event_id AND events.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "anon_insert_guests" ON guests;
CREATE POLICY "anon_insert_guests" ON guests FOR INSERT
  TO anon, authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM events WHERE events.id = guests.event_id AND events.status = 'published')
  );

DROP POLICY IF EXISTS "owner_update_guests" ON guests;
CREATE POLICY "owner_update_guests" ON guests FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = guests.event_id AND events.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM events WHERE events.id = guests.event_id AND events.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "owner_delete_guests" ON guests;
CREATE POLICY "owner_delete_guests" ON guests FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = guests.event_id AND events.user_id = auth.uid())
  );

-- =========================
-- Indexes
-- =========================
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_invitation_slug ON events(invitation_slug);
CREATE INDEX IF NOT EXISTS idx_guests_event_id ON guests(event_id);
CREATE INDEX IF NOT EXISTS idx_guests_rsvp_status ON guests(rsvp_status);

-- =========================
-- updated_at trigger for events
-- =========================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS events_updated_at ON events;
CREATE TRIGGER events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();