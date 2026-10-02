import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/poppins/latin-700.css';
import './styles/components.css';
import './styles/site.css';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (toggle && nav) {
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    header.classList.toggle('menu-open', open);
  };
  toggle.hidden = false;
  header.classList.add('nav-ready');
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setMenu(false);
  });
  matchMedia('(min-width: 900px)').addEventListener('change', () => setMenu(false));
}

const reveals = [
  ['.tuv-project-compare', 'tuv-play'],
  ['.tuv-project-details', 'tuv-details-play'],
];
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add(entry.target.dataset.revealClass);
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.1 });
  for (const [selector, className] of reveals) {
    const element = document.querySelector(selector);
    if (element) {
      element.dataset.revealClass = className;
      observer.observe(element);
    }
  }
}

const demo = document.querySelector('.tuv-demo-experience');
if (demo) {
  const frame = demo.querySelector('iframe');
  const shell = demo.querySelector('.tuv-demo-shell');
  demo.querySelector('.tuv-demo-trigger').addEventListener('click', () => {
    shell.classList.add('tuv-demo-engaged');
    shell.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    frame.focus({ preventScroll: true });
  });
}
