/* ── MAR CIRUELA PORTFOLIO — main.js ── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── FILTRO PORTFOLIO ── */
  window.filterPortfolio = function(btn, cat) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.portfolio-item').forEach(item => {
      const show = cat === 'all' || item.dataset.cat === cat;
      item.style.opacity = show ? '1' : '0.15';
      item.style.transform = show ? 'scale(1)' : 'scale(0.97)';
      item.style.transition = 'all 0.35s cubic-bezier(0.16,1,0.3,1)';
      item.style.pointerEvents = show ? 'auto' : 'none';
    });
  };

  /* ── SCROLL REVEAL ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('section').forEach(s => {
    s.style.opacity = '0';
    s.style.transform = 'translateY(28px)';
    s.style.transition = 'opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)';
    revealObserver.observe(s);
  });

  /* ── NAV ACTIVO AL HACER SCROLL ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === '#' + entry.target.id
            ? 'var(--accent)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => navObserver.observe(s));

  /* ── FORMULARIO CONTACTO ── */
  window.sendMessage = function() {
    const name    = document.getElementById('contact-name').value.trim();
    const email   = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      alert('Por favor rellena todos los campos.');
      return;
    }
    const mailtoLink = `mailto:hola@marciruela.es?subject=Contacto portfolio — ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0A${encodeURIComponent(email)}`;
    window.location.href = mailtoLink;
  };

  /* ── CURSOR PERSONALIZADO (sutil) ── */
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed; width: 6px; height: 6px;
    background: var(--accent); border-radius: 50%;
    pointer-events: none; z-index: 9999;
    transition: transform 0.15s ease, opacity 0.2s;
    transform: translate(-50%, -50%);
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .portfolio-item, .cat-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(3)');
    el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
  });

});
