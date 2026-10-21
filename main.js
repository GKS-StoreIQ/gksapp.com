(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const EASE = 'cubic-bezier(.2,.7,.3,1)';
  const ROLE_MS = 6500;
  const SCOPE_MS = 2400;
  const CONTACT = 'jpande@gatekeepersystems.com';
  const clamp = v => Math.max(0, Math.min(1, v));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ROLES = [
    { who: 'Store managers', q: 'Is my store protected today?', see: 'The active issue at their exit, the work order stage and who owns the next step.', out: "Know their exit is protected today, and who's fixing it if it isn't." },
    { who: 'District and regional', q: 'Which stores need attention?', see: 'Their territory only, ranked by open issues, theft exposure and stores running without protection.', out: 'Go straight to the stores that need them this week.' },
    { who: 'AP and LP leaders', q: 'Where are we losing, and is it working?', see: 'Loss, coverage and resolution across the fleet, with evidence to take to their own leadership.', out: 'Show their leadership what the program is delivering, with evidence.' },
    { who: 'Gatekeeper teams', q: 'Which accounts need us now?', see: 'Service, account and sales teams working from the same view as the customer.', out: 'Spot the accounts that need help before the customer has to ask.' }
  ];
  const SCOPES = ['The whole fleet', 'A banner or region', 'A territory', 'One location', 'One door, one device'];
  const MODES = {
    feedback: { label: "What's working, and what isn't?", ph: "For example: the service view is clear, but I can't tell when a work order was last updated.", btn: 'Send feedback', type: 'Feedback', area: true },
    testing: { label: 'Tell us about your team and stores', ph: "For example: 120 stores, three regional AP managers who'd use it weekly.", btn: 'Send', type: 'Testing or early access', area: false },
    request: { label: 'What should StoreIQ help you answer or do?', ph: 'For example: show which stores had the most exit events last month, by door.', btn: 'Send request', type: 'Feature or roadmap request', area: true }
  };

  /* ---------- Intro + reveal animations ---------- */
  if (!reduce) {
    $$('[data-word]').forEach(el => {
      el.style.display = 'inline-block';
      el.animate([{ opacity: 0, transform: 'translateY(45%)', filter: 'blur(10px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 900, delay: 70 * +el.dataset.word, easing: EASE, fill: 'backwards' });
    });
    $$('[data-hero]').forEach(el => el.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 450 + 110 * +el.dataset.hero, easing: EASE, fill: 'backwards' }));

    const countUp = el => {
      const to = +el.dataset.count, from = +el.dataset.from, t0 = performance.now(), D = 1100;
      const step = t => { const k = clamp((t - t0) / D), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target; io.unobserve(el); el.style.opacity = '';
      el.animate([{ opacity: 0, transform: 'translateY(36px)' }, { opacity: 1, transform: 'none' }], { duration: 800, easing: EASE });
      $$('[data-count]', el).forEach(countUp);
    }), { threshold: 0.15 });
    const vh0 = window.innerHeight;
    $$('[data-reveal]').forEach(el => { if (el.getBoundingClientRect().top > vh0 * 0.92) { el.style.opacity = '0'; io.observe(el); } });
  }

  /* ---------- Scroll-driven effects ---------- */
  const heroShot = $('#top [style*="rotateX"]');
  const merge = $('#why [data-merge-row]') && $('#why [data-merge-row]').parentElement;
  const mods = $$('[data-mod]');
  let raf = 0;
  const tick = () => {
    raf = 0;
    if (reduce) return;
    const vh = window.innerHeight, w = window.innerWidth, y = window.scrollY;
    if (heroShot) {
      const p = clamp(y / (vh * 0.6)), e = 1 - Math.pow(1 - p, 2);
      heroShot.style.transform = 'rotateX(' + (18 * (1 - e)).toFixed(2) + 'deg) scale(' + (0.92 + 0.08 * e).toFixed(4) + ')';
    }
    if (merge && w >= 900) {
      const r = merge.getBoundingClientRect();
      const p = clamp((vh * 0.8 - r.top) / (vh * 0.45));
      const row = $('[data-merge-row]', merge), cards = $$('[data-merge-card]', merge), lab = $('[data-merge-label]', merge);
      row.style.gap = (24 * (1 - p)) + 'px';
      cards.forEach((c, i) => {
        const R = 24, l = i === 0 ? R : R * (1 - p), rr = i === cards.length - 1 ? R : R * (1 - p);
        c.style.borderRadius = l + 'px ' + rr + 'px ' + rr + 'px ' + l + 'px';
        if (i > 0) c.style.borderLeftColor = p > .98 ? 'transparent' : '';
        if (i < cards.length - 1) c.style.borderRightColor = p > .98 ? '#E1E6EC' : '';
      });
      row.style.boxShadow = '0 40px 80px -40px rgba(14,46,92,' + (0.3 * p).toFixed(3) + ')';
      if (lab) { const k = clamp((p - .7) / .3); lab.style.opacity = k; lab.style.transform = 'translateY(' + (8 * (1 - k)) + 'px)'; }
    } else if (merge) {
      const lab = $('[data-merge-label]', merge);
      if (lab) lab.style.opacity = 1;
    }
    if (w >= 900 && vh >= 700) {
      mods.forEach((m, i) => {
        const nx = mods[i + 1];
        if (!nx) { m.style.transform = ''; m.style.filter = ''; return; }
        const a = m.getBoundingClientRect(), b = nx.getBoundingClientRect();
        const t = clamp(1 - (b.top - a.top) / Math.max(1, a.height));
        m.style.transform = 'scale(' + (1 - 0.05 * t).toFixed(4) + ')';
        m.style.filter = 'brightness(' + (1 - 0.06 * t).toFixed(3) + ')';
      });
    } else mods.forEach(m => { m.style.transform = ''; m.style.filter = ''; });
  };
  const queue = () => { if (!raf) raf = requestAnimationFrame(tick); };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  if (reduce && heroShot) heroShot.style.transform = 'none';
  tick();

  /* ---------- Roles tabs ---------- */
  const tabs = $$('[data-role]');
  const panel = $('[data-rpanel]');
  const rolesSection = $('#roles');
  let role = 0, roleAuto = !reduce, rolesVisible = false, barAnim = null;
  const setText = (k, v) => { const el = $('[data-r="' + k + '"]', panel); if (el) el.textContent = v; };
  const renderRole = () => {
    const r = ROLES[role];
    setText('who', r.who); setText('q', '“' + r.q + '”'); setText('see', r.see); setText('out', r.out);
    tabs.forEach((t, i) => {
      const on = i === role;
      t.setAttribute('aria-selected', on);
      t.style.background = on ? '#fff' : 'transparent';
      $('.role-who', t).style.color = on ? '#0E2E5C' : '#0A1F3D';
      $('.role-track', t).style.opacity = on && roleAuto ? 1 : 0;
    });
    panel.setAttribute('aria-labelledby', 'role-tab-' + role);
  };
  const runRoleBar = () => {
    $$('[data-rbar]').forEach(b => b.getAnimations().forEach(a => a.cancel()));
    const bar = $('[data-rbar="' + role + '"]');
    if (!bar) return;
    barAnim = bar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: ROLE_MS, easing: 'linear', fill: 'forwards' });
    if (!rolesVisible) barAnim.pause();
    barAnim.onfinish = () => { if (roleAuto) setRole((role + 1) % ROLES.length); };
  };
  const setRole = i => {
    role = i; renderRole();
    if (!reduce) panel.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: EASE });
    if (roleAuto) runRoleBar();
  };
  tabs.forEach((t, i) => t.addEventListener('click', () => {
    roleAuto = false;
    if (barAnim) barAnim.onfinish = null;
    $$('[data-rbar]').forEach(b => b.getAnimations().forEach(a => a.cancel()));
    barAnim = null;
    setRole(i);
  }));
  if (!reduce && rolesSection) {
    new IntersectionObserver(([e]) => {
      rolesVisible = e.isIntersecting;
      if (e.isIntersecting && roleAuto && !barAnim) runRoleBar();
      else if (barAnim) e.isIntersecting ? barAnim.play() : barAnim.pause();
    }, { threshold: 0.35 }).observe(rolesSection);
  }

  /* ---------- Scope picker ---------- */
  const scopeBtns = $$('[data-scope]');
  const scopeDesc = $('[data-scope-desc]');
  let scope = 0, scopeAuto = !reduce;
  const setScope = i => {
    scope = i;
    scopeBtns.forEach((b, j) => {
      const on = j === i;
      b.setAttribute('aria-pressed', on);
      b.style.background = on ? '#fff' : 'transparent';
      b.style.color = on ? '#0E2E5C' : '#DCE5F0';
    });
    scopeDesc.textContent = SCOPES[i];
    if (!reduce) scopeDesc.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: EASE });
  };
  scopeBtns.forEach((b, i) => b.addEventListener('click', () => { scopeAuto = false; setScope(i); }));
  if (!reduce) setInterval(() => { if (scopeAuto) setScope((scope + 1) % SCOPES.length); }, SCOPE_MS);

  /* ---------- Get involved form ---------- */
  const asks = $$('[data-mode]');
  const textEl = $('#f-text'), statusEl = $('#f-status'), mailEl = $('#f-mail'), noteEl = $('#f-mail-note');
  let mode = 'request';
  const setMode = (m, focus) => {
    mode = m;
    const c = MODES[m];
    asks.forEach(a => {
      const on = a.dataset.mode === m;
      a.setAttribute('aria-selected', on);
      a.style.background = on ? '#fff' : '#F4F6F9';
      a.style.borderColor = on ? '#0E2E5C' : 'transparent';
      $('.ring', a).style.borderColor = on ? '#0E2E5C' : '#C9D3E0';
      $('.fill', a).style.background = on ? '#0E2E5C' : 'transparent';
    });
    $('#f-label').textContent = c.label;
    textEl.placeholder = c.ph;
    $('#f-btn').textContent = c.btn;
    $('#f-area-wrap').hidden = !c.area;
    statusEl.hidden = true;
    if (focus) setTimeout(() => textEl.focus({ preventScroll: true }), 400);
  };
  asks.forEach(a => a.addEventListener('click', () => setMode(a.dataset.mode, true)));
  $$('[data-go-request]').forEach(a => a.addEventListener('click', () => setMode('request', true)));

  const showStatus = (text, err, href) => {
    statusEl.hidden = false;
    statusEl.style.display = 'flex';
    statusEl.style.background = err ? '#FBEAE7' : '#EEF5E6';
    $('#f-status-text').textContent = text;
    mailEl.hidden = noteEl.hidden = !href;
    if (href) mailEl.href = href;
  };
  $('#involved-form').addEventListener('submit', e => {
    e.preventDefault();
    const c = MODES[mode];
    const text = textEl.value.trim();
    if (!text) { showStatus('Add a short description so we know what you need.', true); textEl.focus(); return; }
    const role_ = $('#f-role').value, area = c.area ? $('#f-area').value : '';
    const name = $('#f-name').value.trim(), co = $('#f-co').value.trim();
    const body = c.type + '\nRole: ' + role_ + (area ? '\nArea: ' + area : '') + (name ? '\nName: ' + name : '') + (co ? '\nCompany: ' + co : '') + '\n\n' + text;
    showStatus('Your message is ready to send by email to the StoreIQ team.', false,
      'mailto:' + CONTACT + '?subject=' + encodeURIComponent('StoreIQ: ' + c.type) + '&body=' + encodeURIComponent(body));
  });
})();
