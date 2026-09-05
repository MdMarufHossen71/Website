/*
  # Contact Leads + Newsletter for Portfolio

  ## 1. New Tables
  - `contact_leads`: backup of every contact-form submission
    (name, email, service, message, source, page_url, created_at)
  - `newsletter_subscribers`: footer newsletter emails (email unique, status, created_at)

  ## 2. Security (RLS)
  - Public (anon) can INSERT only — no SELECT/UPDATE/DELETE for anon.
  - Authenticated / service_role can read (dashboard).
  - This keeps Formspree as primary sender, Supabase as private backup.
*/

-- Contact leads backup
CREATE TABLE IF NOT EXISTS contact_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  service text DEFAULT '',
  message text DEFAULT '',
  source text DEFAULT 'portfolio-contact',
  page_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_leads_created_at ON contact_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_leads_email ON contact_leads(email);

ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit contact leads" ON contact_leads;
CREATE POLICY "Anyone can submit contact leads"
  ON contact_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  status text DEFAULT 'active',
  source text DEFAULT 'footer-newsletter',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_created_at ON newsletter_subscribers(created_at DESC);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can subscribe newsletter" ON newsletter_subscribers;
CREATE POLICY "Anyone can subscribe newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
