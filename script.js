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

const countEls = document.querySelectorAll('strong[data-count]');
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, {threshold: 0.5});
countEls.forEach(el => countObserver.observe(el));

const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      document.querySelector(`.nav-links a[href="#${entry.target.id}"]`)?.classList.add('active');
    }
  });
}, {rootMargin: '-20% 0px -70% 0px'});
document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('visible'), 10);
  setTimeout(() => { t.classList.remove('visible'); setTimeout(() => t.remove(), 300); }, 2500);
}
const emailCopy = document.getElementById('emailCopy');
emailCopy?.addEventListener('click', e => {
  e.preventDefault();
  navigator.clipboard.writeText(emailCopy.dataset.email).then(() => {
    showToast('Email copied to clipboard!');
  }).catch(() => {
    window.location.href = emailCopy.href;
  });
});

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
      body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
    });
    if (res.ok) {
      contactForm.reset();
      formStatus.textContent = "Message sent — I'll be in touch soon.";
      formStatus.className = 'form-status success';
    } else {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `HTTP ${res.status}`);
    }
  } catch(err) {
    formStatus.textContent = `Error: ${err.message}. Please email puneet.khanna077@gmail.com directly.`;
    formStatus.className = 'form-status error';
  }
  btn.innerHTML = originalHTML;
  btn.disabled = false;
});
