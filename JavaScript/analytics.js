// Analytics and Tracking Scripts

// Google Analytics
(function() {
    // Load Google Analytics
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6643839621415615';
    script1.crossOrigin = 'anonymous';
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.async = true;
    script2.src = 'https://www.googletagmanager.com/gtag/js?id=G-52XK1Y68N8';
    document.head.appendChild(script2);

    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-52XK1Y68N8');
    
    // Make gtag available globally
    window.gtag = gtag;
})();

// Google Tag Manager
(function(w,d,s,l,i){
    w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;
    f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5J6T4SNR');

// Add GTM noscript fallback
document.addEventListener('DOMContentLoaded', function() {
    const noscript = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-5J6T4SNR';
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);
});

// Custom Analytics Events
function trackEvent(eventName, category, label, value) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'event_category': category,
            'event_label': label,
            'value': value
        });
    }
}

// Track form submissions
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            trackEvent('form_submit', 'Contact', 'Contact Form', 1);
        });
    }
    
    // Track portfolio clicks
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(function(item, index) {
        item.addEventListener('click', function() {
            trackEvent('portfolio_click', 'Portfolio', 'Portfolio Item ' + (index + 1), 1);
        });
    });
    
    // Track service clicks
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(function(card, index) {
        card.addEventListener('click', function() {
            const serviceName = card.querySelector('h3').textContent;
            trackEvent('service_click', 'Services', serviceName, 1);
        });
    });
});

// Performance tracking
window.addEventListener('load', function() {
    // Track page load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    trackEvent('page_load_time', 'Performance', 'Load Time', Math.round(loadTime / 1000));
});
