// Supabase backup for contact leads + newsletter (static site, no bundler).
// Uses plain fetch with return=minimal (no supabase-js needed), so it works
// even if CDNs are blocked, and never trips RLS representation errors.
// SETUP: anon public key only below. NEVER put service_role here.

const SUPABASE_URL = "https://vzlloostgzaooambzyde.supabase.co"; // project base URL (no /rest/v1)
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6bGxvb3N0Z3phb29hbWJ6eWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MzIzOTcsImV4cCI6MjEwNDIwODM5N30.49pezj8OZWH_Aqk67LWm8z_uB93LcRWPM3PIEt0FOkg"; // anon public key only

async function sbInsert(table, row) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify(row)
  });
  if (res.status === 409) {
    const err = new Error('duplicate');
    err.code = 409;
    throw err;
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`DB ${res.status}: ${text.slice(0, 200)}`);
  }
  return true;
}

// Fire-and-forget: never blocks the Formspree redirect.
async function saveLeadBackup({ name, email, service, message }) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return false;
    await sbInsert('contact_leads', {
      name: (name || '').slice(0, 200),
      email: (email || '').slice(0, 320),
      service: (service || '').slice(0, 100),
      message: (message || '').slice(0, 5000),
      source: 'portfolio-contact',
      page_url: location.href.slice(0, 500)
    });
    return true;
  } catch (e) {
    console.warn('Lead backup failed (Formspree still sent).', e);
    return false;
  }
}

async function subscribeNewsletter(email) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // No Supabase configured yet — open mail client as fallback.
    location.href = 'mailto:maruf.112005@gmail.com?subject=Newsletter%20Subscribe&body=Please%20add%20me:%20' + encodeURIComponent(email);
    return { ok: false, reason: 'no-supabase' };
  }
  try {
    await sbInsert('newsletter_subscribers', {
      email: email.slice(0, 320),
      source: 'footer-newsletter'
    });
    return { ok: true };
  } catch (e) {
    if (e && e.code === 409) return { ok: false, reason: 'duplicate' };
    throw e;
  }
}

window.PortfolioDB = { saveLeadBackup, subscribeNewsletter };
