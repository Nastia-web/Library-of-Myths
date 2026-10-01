/* ---------- Glowing particles ---------- */
(function () {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dots;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    const count = Math.min(140, Math.floor((w * h) / 12000));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.8 + 0.4,
      vy: -(Math.random() * 0.25 + 0.05), vx: (Math.random() - 0.5) * 0.15,
      p: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.35
    }));
  }
  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      d.x += d.vx; d.y += d.vy;
      if (d.y < -5) { d.y = h + 5; d.x = Math.random() * w; }
      const a = 0.35 + 0.35 * Math.sin(t / 900 + d.p);
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, 6.283);
      ctx.fillStyle = d.gold ? `rgba(240,217,138,${a})` : `rgba(180,150,240,${a})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = d.gold ? '#d4af37' : '#8a5fd0';
      ctx.fill();
    }
    if (!still) requestAnimationFrame(draw);
  }
  addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();

/* ---------- Myth modal ---------- */
(function () {
  const modal = document.getElementById('modal');
  if (!modal) return;
  const mImg = modal.querySelector('.m-img');
  const mTitle = modal.querySelector('.m-title');
  const mMeta = modal.querySelector('.m-meta');
  const mText = modal.querySelector('.m-text');
  let lastFocus = null;

  function open(card) {
    lastFocus = document.activeElement;
    mImg.src = card.querySelector('.card-img img').src;
    mImg.alt = card.querySelector('.card-img img').alt;
    mTitle.textContent = card.querySelector('h3').textContent;
    mMeta.textContent = card.querySelector('.culture').textContent + ' · ' + card.querySelector('.author').textContent;
    mText.innerHTML = card.querySelector('.full-myth').innerHTML;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close').focus();
  }
  function close() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('.read-btn').forEach(btn =>
    btn.addEventListener('click', () => open(btn.closest('.card'))));
  modal.querySelector('.modal-close').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
})();

/* ---------- Contact form (no backend: opens the visitor's mail app) ---------- */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(form);
    const subject = encodeURIComponent('Message to the Library of Myths from ' + d.get('name'));
    const body = encodeURIComponent(d.get('message') + '\n\n— ' + d.get('name') + ' (' + d.get('email') + ')');
    // Change this address to your own:
    location.href = 'mailto:keeper@libraryofmyths.example?subject=' + subject + '&body=' + body;
    document.getElementById('form-note').textContent = 'Opening your mail app to send the message.';
  });
})();
