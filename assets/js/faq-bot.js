// FAQ chat bot — 100% rule-based, works offline, no API keys, EN + BN.
// Open/close, quick chips, keyword Q&A, links to contact/booking/work.

const FAQ_DATA = [
  {
    keys: ['price', 'cost', 'charge', 'rate', 'দাম', 'খরচ', 'টাকা', 'প্রাইস', 'ফি'],
    a: 'My pricing starts at: Marketing $299 (৳35k) • Brand identity $499 (৳58k) • Web design $799 (৳93k) • Print $199 (৳23k). For an exact quote, describe your project in the <a href="#contact">contact form</a>.'
  },
  {
    keys: ['book', 'call', 'meet', 'appointment', 'কল', 'মিটিং', 'বুক', 'কথা বলতে'],
    a: 'You can book a free 30-minute video call here: <a href="https://calendly.com/maruf-112005/30min" target="_blank" rel="noopener">📅 Book on Calendly ↗</a> — or message me instantly on <a href="https://wa.me/8801606096409">WhatsApp</a>.'
  },
  {
    keys: ['contact', 'email', 'phone', 'number', 'whatsapp', 'যোগাযোগ', 'ইমেইল', 'ফোন', 'নম্বর', 'মোবাইল'],
    a: 'Reach me at: Email <a href="mailto:maruf.112005@gmail.com">maruf.112005@gmail.com</a> • Phone/WhatsApp <a href="https://wa.me/8801606096409">+880 160 609 6409</a> • or the <a href="#contact">contact section ↗</a>'
  },
  {
    keys: ['service', 'offer', 'সার্ভিস', 'কি কি করো', 'কাজ করো'],
    a: 'I offer: 1) Digital marketing 2) Brand identity & logo design 3) Web design 4) Print design. See details in <a href="#services">services ↗</a>.'
  },
  {
    keys: ['logo', 'লোগো', 'brand', 'ব্র্যান্ড'],
    a: 'Logo & brand identity packages start at $499 (৳58k) — custom vector logo, colors and guidelines included. Example: <a href="https://www.behance.net/gallery/249038509/LOGO-Design-Squid-Cove-Pottery" target="_blank" rel="noopener">Squid Cove logo ↗</a>'
  },
  {
    keys: ['website', 'web', 'ওয়েবসাইট', 'সাইট বান'],
    a: 'SEO-friendly responsive websites start at $799 (৳93k). <a href="#contact">Request a quote ↗</a>'
  },
  {
    keys: ['portfolio', 'work', 'sample', 'পোর্টফোলিও', 'কাজ দেখ', 'স্যাম্পল'],
    a: 'See my real work in the <a href="#portfolio">portfolio ↗</a>, full case studies on <a href="https://www.behance.net/mdmarufhossen71" target="_blank" rel="noopener">Behance ↗</a>, and licensable assets on <a href="https://stock.adobe.com/contributor/213399341/maruf" target="_blank" rel="noopener">Adobe Stock ↗</a>.'
  },
  {
    keys: ['experience', 'অভিজ্ঞতা', 'বছর', 'how long', 'client'],
    a: 'I have 6+ months of professional experience, 25+ completed projects and 15+ happy clients. See <a href="#experience">my journey ↗</a>.'
  },
  {
    keys: ['location', 'where', 'address', 'kothay', 'thako', 'thaken', 'bari', 'কোথায়', 'ঠিকানা', 'বাড়ি', 'থাকো'],
    a: 'I am based in Gazipur, Dhaka, Bangladesh and work remotely with clients worldwide.'
  },
  {
    keys: ['time', 'delivery', 'long', 'সময়', 'ডেলিভারি', 'কতদিন', 'দিন লাগ'],
    a: 'It depends on scope — roughly: logo 3–5 days, full brand 1–2 weeks, website 2–4 weeks. You will get an exact timeline with your quote in <a href="#contact">contact ↗</a>.'
  },
  {
    keys: ['behance', 'বিহ্যান্স'],
    a: 'Here is my <a href="https://www.behance.net/mdmarufhossen71" target="_blank" rel="noopener">Behance profile ↗</a> with logo, poster and apparel case studies.'
  },
  {
    keys: ['fiverr', 'freelancer', 'marketplace', 'ফাইভার'],
    a: 'Hire me securely with reviews and escrow on <a href="https://www.fiverr.com/mdmarufhossen71" target="_blank" rel="noopener">Fiverr ↗</a> or <a href="https://www.freelancer.com/MdMarufHossen71" target="_blank" rel="noopener">Freelancer ↗</a>.'
  },
  {
    keys: ['cv', 'resume', 'সিভি'],
    a: 'You can <a href="PDF/CV%20of%20Md%20Maruf%20Hossen.pdf" download>download my CV here ↗</a>.'
  },
  {
    keys: ['hi', 'hello', 'hey', 'salam', 'আসসালামু', 'সালাম', 'হ্যালো', 'আদাব', 'namaskar', 'নমস্কার'],
    a: 'Hello and welcome! 👋 Ask me about pricing, services, booking or my work — or tap a shortcut below.'
  },
  {
    keys: ['thank', 'dhonno', 'shukriya', 'ধন্যবাদ', 'thanks', 'শুকরিয়া'],
    a: 'You are welcome! 😊 If you need anything else, just ask — or write to me directly in <a href="#contact">contact ↗</a>.'
  }
];

const FAQ_FALLBACK = 'Sorry, I did not understand that 😅 — try: price / services / booking / work. Or reach Maruf directly on <a href="https://wa.me/8801606096409">WhatsApp ↗</a> or the <a href="#contact">contact form ↗</a>.';

const FAQ_CHIPS = ['💰 What are your prices?', '📅 Book a call', '🎨 Show your work', '📞 Contact details'];

function faqFindAnswer(text) {
  const t = (text || '').toLowerCase();
  let best = null;
  let bestHits = 0;
  for (const item of FAQ_DATA) {
    let hits = 0;
    for (const k of item.keys) {
      if (k && t.includes(k.toLowerCase())) hits++;
    }
    if (hits > bestHits) {
      bestHits = hits;
      best = item;
    }
  }
  return best ? best.a : FAQ_FALLBACK;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('faq-float')) return; // avoid doubles

  const hello = "Hi there! 👋 I'm Maruf's assistant. Ask me about pricing, services, booking, or my work.";

  const btn = document.createElement('button');
  btn.id = 'faq-float';
  btn.className = 'faq-float';
  btn.setAttribute('aria-label', 'Chat with FAQ assistant');
  btn.innerHTML = '💬<span class="faq-badge" id="faq-badge">1</span>';
  document.body.appendChild(btn);

  const panel = document.createElement('div');
  panel.id = 'faq-panel';
  panel.className = 'faq-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'FAQ chat');
  panel.innerHTML =
    '<div class="faq-head"><div class="faq-avatar">🤖</div>' +
    '<div><h3>Maruf Assistant</h3><p>Online • replies instantly</p></div>' +
    '<button class="faq-close" id="faq-close" aria-label="Close chat">✕</button></div>' +
    '<div class="faq-body" id="faq-body" aria-live="polite"></div>' +
    '<div class="faq-chips" id="faq-chips"></div>' +
    '<form class="faq-input-row" id="faq-form">' +
    '<input id="faq-input" type="text" placeholder="Ask: pricing? booking? work?" aria-label="Ask a question" autocomplete="off">' +
    '<button type="submit" aria-label="Send">➤</button></form>';
  document.body.appendChild(panel);

  const body = panel.querySelector('#faq-body');
  const chipsBox = panel.querySelector('#faq-chips');
  const form = panel.querySelector('#faq-form');
  const input = panel.querySelector('#faq-input');
  const badge = document.getElementById('faq-badge');
  let greeted = false;

  function addMsg(html, who) {
    const d = document.createElement('div');
    d.className = 'faq-msg ' + who;
    if (who === 'bot') d.innerHTML = html;
    else d.textContent = html;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
  }

  function botReply(q) {
    const typing = document.createElement('div');
    typing.className = 'faq-msg bot faq-typing';
    typing.textContent = 'Typing...';
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;
    setTimeout(() => {
      typing.remove();
      addMsg(faqFindAnswer(q), 'bot');
    }, 450);
  }

  FAQ_CHIPS.forEach((c) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'faq-chip';
    b.textContent = c;
    b.addEventListener('click', () => {
      addMsg(c, 'user');
      botReply(c);
    });
    chipsBox.appendChild(b);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = (input.value || '').trim();
    if (!v) return;
    addMsg(v, 'user');
    input.value = '';
    botReply(v);
  });

  function toggle(force) {
    const open = force !== undefined ? force : !panel.classList.contains('open');
    panel.classList.toggle('open', open);
    if (open) {
      if (badge) badge.style.display = 'none';
      if (!greeted) {
        greeted = true;
        setTimeout(() => addMsg(hello, 'bot'), 200);
      }
      setTimeout(() => input.focus(), 300);
    }
  }

  btn.addEventListener('click', () => toggle());
  panel.querySelector('#faq-close').addEventListener('click', () => toggle(false));
  // In-page links (e.g. #contact) close the chat so the section is visible
  panel.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (a) toggle(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggle(false);
  });
});
