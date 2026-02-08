document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('active');
    });
  }

  const postContent = document.getElementById('post-content');
  const readingTimeNode = document.querySelector('.reading-time');

  if (postContent && readingTimeNode) {
    const words = postContent.textContent.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 220));
    readingTimeNode.textContent = `${minutes} min read`;
  }
});
