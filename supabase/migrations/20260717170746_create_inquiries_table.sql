/*
# Create inquiries table for WhatsApp-based ordering

## Overview
Single-tenant (no auth) platform. Users browse templates, fill a form,
and their order details are saved and sent via WhatsApp to the business owner.

## New Tables

### inquiries
- `id` (uuid, PK)
- `customer_name` (text) — full name
- `customer_phone` (text) — phone number
- `event_type` (text) — wedding | engagement | birthday | corporate | graduation | other
- `event_date` (date) — date of event
- `event_time` (text) — time of event
- `venue` (text) — venue / location
- `template_id` (text) — which template was selected
- `package_type` (text) — basic | standard | luxury
- `guest_count` (int) — estimated number of guests
- `notes` (text) — additional notes / custom requests
- `status` (text) — new | contacted | confirmed | completed | cancelled
- `created_at` (timestamptz)

## Security
- RLS enabled. anon + authenticated can INSERT (public form submission).
- No SELECT/UPDATE/DELETE for anon — only the owner sees inquiries via Supabase dashboard.
*/

CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  event_type text NOT NULL DEFAULT 'wedding',
  event_date date,
  event_time text DEFAULT '',
  venue text DEFAULT '',
  template_id text DEFAULT '',
  package_type text NOT NULL DEFAULT 'standard',
  guest_count int DEFAULT 0,
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_inquiries" ON inquiries;
CREATE POLICY "anon_insert_inquiries" ON inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);