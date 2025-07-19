// Add shadow to header on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    // Add 'scrolled' class to header when page is scrolled more than 10px
    if (window.scrollY > 10) {
        header.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
});
// Wait for the window to load before initializing AOS
window.addEventListener('load', () => {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false, // অ্যানিমেশনটি যতবার স্ক্রল করা হবে, ততবার হবে
    mirror: false,
    anchorPlacement: 'top-bottom',
  });
});
