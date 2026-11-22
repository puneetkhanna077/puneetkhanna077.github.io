const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(isOpen));
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
}));
document.getElementById('year').textContent = new Date().getFullYear();

const revealTargets = [
  '.section-heading',
  '.about-grid',
  '.capability-grid .cap-card',
  '.experience-item',
  '.impact-grid',
  '.credentials-grid',
  '.extras-grid .extras-content',
];
const revealEls = document.querySelectorAll(revealTargets.join(','));
revealEls.forEach(el => el.classList.add('reveal'));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
revealEls.forEach(el => observer.observe(el));

const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('visible', window.scrollY > 400);
}, {passive: true});
backToTop?.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));

const contactForm = document.querySelector('.contact-form');
const formStatus = contactForm?.querySelector('.form-status');
contactForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = contactForm.querySelector('.form-submit');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = 'Sending…';
  btn.disabled = true;
  try {
    const res = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: {Accept: 'application/json'}
    });
    if (res.ok) {
      contactForm.reset();
      formStatus.textContent = "Message sent — I'll be in touch soon.";
      formStatus.className = 'form-status success';
    } else { throw new Error(); }
  } catch {
    formStatus.textContent = 'Something went wrong. Please email puneet.khanna077@gmail.com directly.';
    formStatus.className = 'form-status error';
  }
  btn.innerHTML = originalHTML;
  btn.disabled = false;
});
