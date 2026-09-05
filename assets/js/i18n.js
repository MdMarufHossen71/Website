// Bangla / English toggle for homepage (no backend, no reload).
// Elements opt in with data-i18n="key" (innerHTML swap) or
// data-i18n-ph="key" (placeholder swap). English is the default and is
// cached from the original HTML, so only Bangla strings live here.
// Choice persists in localStorage ("portfolio-lang").

const I18N_BN = {
  'nav.home': 'হোম',
  'nav.about': 'পরিচিতি',
  'nav.services': 'সার্ভিস',
  'nav.portfolio': 'কাজসমূহ',
  'nav.experience': 'অভিজ্ঞতা',
  'nav.contact': 'যোগাযোগ',
  'nav.blog': 'ব্লগ',
  'nav.explore': 'দেখুন <i class="fas fa-chevron-down" aria-hidden="true"></i>',

  'hero.badge': 'নতুন প্রজেক্ট নিচ্ছি',
  'hero.title': 'হ্যালো, আমি <span class="gradient-text">মারুফ</span><br>প্রফেশনাল<br><span class="typing-text">গ্রাফিক ডিজাইনার</span>',
  'hero.desc': 'স্ট্র্যাটেজিক ডিজিটাল মার্কেটিং আর আকর্ষণীয় ভিজ্যুয়াল ডিজাইন দিয়ে ব্যবসা বদলে দিই। ৬+ মাসের অভিজ্ঞতা আর ২৫+ সফল প্রজেক্ট নিয়ে অনলাইন উপস্থিতি, সোশ্যাল এনগেজমেন্ট আর মনে রাখার মতো ব্র্যান্ড পরিচিতি বানাতে সাহায্য করি।',
  'hero.stat1': 'মাসের অভিজ্ঞতা',
  'hero.stat2': 'প্রজেক্ট সম্পন্ন',
  'hero.stat3': 'সন্তুষ্ট ক্লায়েন্ট',
  'hero.btn1': 'আমার কাজ দেখুন',
  'hero.btn2': 'কথা বলি',

  'about.sub': 'আমাকে চিনুন',
  'about.title': 'মোঃ মারুফ হোসেন — ক্রিয়েটিভ গ্রোথ পার্টনার',
  'about.intro': 'আমি মোঃ মারুফ হোসেন, ঢাকার একজন রেজাল্ট-ফোকাসড ডিজিটাল গ্রোথ স্পেশালিস্ট ও প্রফেশনাল গ্রাফিক ডিজাইনার। ক্রিয়েটিভ ভিজ্যুয়াল আইডিয়াকে ডেটা-ভিত্তিক মার্কেটিং সাফল্যে বদলে দিই।',
  'about.cv': 'সিভি ডাউনলোড করুন',

  'services.sub': 'আমি যা দিই',
  'services.title': 'প্রফেশনাল ডিজিটাল মার্কেটিং ও ডিজাইন সার্ভিস',
  'services.s1t': 'ডিজিটাল মার্কেটিং সার্ভিস',
  'services.s1d': 'অনলাইন উপস্থিতি, এনগেজমেন্ট আর সেল বাড়াতে সোশ্যাল মিডিয়া মার্কেটিং, SEO, কনটেন্ট আর ক্যাম্পেইন ম্যানেজমেন্ট।',
  'services.s2t': 'প্রফেশনাল ব্র্যান্ড আইডেন্টিটি ডিজাইন',
  'services.s2d': 'লোগো, কালার, টাইপোগ্রাফি আর ব্র্যান্ড গাইডলাইনসহ সম্পূর্ণ ব্র্যান্ড প্যাকেজ — শক্ত ভিজ্যুয়াল পরিচিতির জন্য।',
  'services.s3t': 'প্রফেশনাল ওয়েব ডিজাইন সার্ভিস',
  'services.s3d': 'সার্চ ও সেলের জন্য অপ্টিমাইজড আধুনিক রেসপন্সিভ ওয়েবসাইট — ভিজিটরকে কাস্টমারে বদলায়।',
  'services.s4t': 'প্রফেশনাল প্রিন্ট ডিজাইন সার্ভিস',
  'services.s4d': 'ব্রোশিওর, ফ্লায়ার, বিজনেস কার্ড, পোস্টার আর প্যাকেজিংসহ হাই-কোয়ালিটি প্রিন্ট ম্যাটেরিয়াল।',

  'portfolio.sub': 'আমার সাম্প্রতিক কাজ',
  'portfolio.title': 'ডিজিটাল মার্কেটিং ও ডিজাইন পোর্টফোলিও',
  'portfolio.all': 'সব প্রজেক্ট',
  'portfolio.branding': 'লোগো ও ব্র্যান্ডিং',
  'portfolio.print': 'পোস্টার ও প্রিন্ট',

  'exp.sub': 'আমার পথচলা',
  'exp.title': 'প্রফেশনাল অভিজ্ঞতা ও টেকনিক্যাল স্কিল',

  'testi.sub': 'ক্লায়েন্টরা যা বলে',
  'testi.title': 'ক্লায়েন্ট রিভিউ ও মতামত',

  'roi.sub': 'গ্রোথ প্ল্যান করো',
  'roi.title': 'মার্কেটিং ROI ও ক্যাম্পেইন প্ল্যানার',
  'roi.cta': 'এই কাস্টম প্ল্যানটি নিন',

  'contact.sub': 'যোগাযোগ করো',
  'contact.title': 'মোঃ মারুফ হোসেন — চলো একসাথে কাজ করি',
  'contact.h': 'ডিজিটাল মার্কেটিং প্রজেক্ট শুরু করতে রেডি?',
  'contact.p': 'নতুন ডিজিটাল মার্কেটিং আর ডিজাইন প্রজেক্টে কাজ করতে আমি সবসময় আগ্রহী। সোশ্যাল মিডিয়া মার্কেটিং, SEO আর সুন্দর ভিজ্যুয়াল ডিজাইন দিয়ে তোমার ব্যবসা বাড়াই।',
  'contact.email': 'বিজনেস ইমেইল',
  'contact.phone': 'ফোন নম্বর',
  'contact.loc': 'ঠিকানা',
  'contact.name': 'তোমার নাম',
  'contact.emailPh': 'তোমার ইমেইল',
  'contact.service': 'কোন সার্ভিস লাগবে',
  'contact.msg': 'প্রজেক্টের বিস্তারিত',
  'contact.send': 'মেসেজ পাঠাও',
  'contact.book': '📅 ৩০ মিনিটের কল বুক করো ↗',

  'footer.tag': 'বাংলাদেশের প্রফেশনাল ডিজিটাল মার্কেটার ও গ্রাফিক ডিজাইনার — সোশ্যাল মিডিয়া মার্কেটিং, SEO আর সুন্দর ভিজ্যুয়াল ডিজাইন দিয়ে ব্যবসা বাড়াতে সাহায্য করি।',
  'footer.nlPh': 'মাসিক টিপসের জন্য ইমেইল',

  'hire.t': '<i class="fas fa-briefcase"></i> মার্কেটপ্লেসে হায়ার করতে চাও?',
  'hire.p': 'রিভিউ ও নিরাপদ পেমেন্টসহ হায়ার করো:',

  'float.chat': 'মারুফের সাথে চ্যাট করো!'
};

const TYPING_BN = ['ডিজিটাল মার্কেটার', 'গ্রাফিক ডিজাইনার', 'ব্র্যান্ড স্ট্র্যাটেজিস্ট', 'লোগো ডিজাইনার', 'ওয়েব ডিজাইনার'];

function getLang() {
  return localStorage.getItem('portfolio-lang') || 'en';
}

function applyLang(lang) {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    if (el._enHTML === undefined) el._enHTML = el.innerHTML;
    const key = el.getAttribute('data-i18n');
    el.innerHTML = (lang === 'bn' && I18N_BN[key]) ? I18N_BN[key] : el._enHTML;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    if (el._enPH === undefined) el._enPH = el.getAttribute('placeholder') || '';
    const key = el.getAttribute('data-i18n-ph');
    el.setAttribute('placeholder', (lang === 'bn' && I18N_BN[key]) ? I18N_BN[key] : el._enPH);
  });
  // Floating labels sit after inputs — translate them too
  document.querySelectorAll('[data-i18n-label]').forEach((el) => {
    if (el._enT === undefined) el._enT = el.textContent;
    const key = el.getAttribute('data-i18n-label');
    el.textContent = (lang === 'bn' && I18N_BN[key]) ? I18N_BN[key] : el._enT;
  });

  document.documentElement.setAttribute('lang', lang === 'bn' ? 'bn' : 'en');
  localStorage.setItem('portfolio-lang', lang);

  // Typing animation word list (picked up live by script.js)
  window.__typingWords = lang === 'bn' ? TYPING_BN : null;

  const btn = document.getElementById('lang-toggle');
  if (btn) {
    btn.textContent = lang === 'bn' ? 'EN' : 'বাং';
    btn.setAttribute('aria-label', lang === 'bn' ? 'Switch to English' : 'বাংলায় দেখো');
    btn.classList.toggle('active', lang === 'bn');
  }

  window.dispatchEvent(new Event('portfolio-lang-change'));
}

document.addEventListener('DOMContentLoaded', () => {
  applyLang(getLang());
  const btn = document.getElementById('lang-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      applyLang(getLang() === 'bn' ? 'en' : 'bn');
    });
  }
});
