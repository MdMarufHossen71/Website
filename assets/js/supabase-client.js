// Supabase backup for contact leads + newsletter (static site, no bundler).
// SETUP: paste your project URL + anon key below, then run the SQL in
// supabase/migrations/20260906000000_create_leads_and_newsletter.sql
// If left empty, the site keeps working on Formspree only — no errors.

const SUPABASE_URL = "https://vzlloostgzaooambzyde.supabase.co"; // project base URL (no /rest/v1)
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6bGxvb3N0Z3phb29hbWJ6eWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MzIzOTcsImV4cCI6MjEwNDIwODM5N30.49pezj8OZWH_Aqk67LWm8z_uB93LcRWPM3PIEt0FOkg"; // anon public key only

let _supabase = null;

async function getSupabase() {
  if (_supabase) return _supabase;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  try {
    const mod = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
    _supabase = mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return _supabase;
  } catch (e) {
    console.warn("Supabase CDN failed, continuing with Formspree only.", e);
    return null;
  }
}

// Fire-and-forget: never blocks the Formspree redirect.
async function saveLeadBackup({ name, email, service, message }) {
  try {
    const sb = await getSupabase();
    if (!sb) return false;
    const { error } = await sb.from("contact_leads").insert([{
      name: (name || "").slice(0, 200),
      email: (email || "").slice(0, 320),
      service: (service || "").slice(0, 100),
      message: (message || "").slice(0, 5000),
      source: "portfolio-contact",
      page_url: location.href.slice(0, 500)
    }]);
    if (error) throw error;
    return true;
  } catch (e) {
    console.warn("Lead backup failed (Formspree still sent).", e);
    return false;
  }
}

async function subscribeNewsletter(email) {
  const sb = await getSupabase();
  if (!sb) {
    // No Supabase configured yet — open mail client as fallback.
    location.href = "mailto:maruf.112005@gmail.com?subject=Newsletter%20Subscribe&body=Please%20add%20me:%20" + encodeURIComponent(email);
    return { ok: false, reason: "no-supabase" };
  }
  const { error } = await sb.from("newsletter_subscribers").insert([{
    email: email.slice(0, 320),
    source: "footer-newsletter"
  }]);
  if (error) {
    // 23505 = duplicate email
    if (error.code === "23505") return { ok: false, reason: "duplicate" };
    throw error;
  }
  return { ok: true };
}

window.PortfolioDB = { getSupabase, saveLeadBackup, subscribeNewsletter };
