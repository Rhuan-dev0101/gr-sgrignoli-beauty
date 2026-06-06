/* ============================================================
   GR RIGNOLI BEAUTY STUDIO — script.js
   ============================================================ */

'use strict';

// ── Constantes de WhatsApp ────────────────────────────────────
const WHATSAPP_GEEH  = '5511991810620'; // ← Altere para o número da Geeh
const WHATSAPP_RAPHA = '5511942615005'; // ← Altere para o número da Rapha

// ── Dados das profissionais ───────────────────────────────────
const PROFESSIONALS = {
  geeh: {
    id:          'geeh',
    name:        'Geeh',
    fullName:    'Geeh Sgrignoli',
    role:        'Especialista em Sobrancelhas, Lábios & Cílios',
    tags:        ['Sobrancelhas', 'Lábios', 'Cílios'],
    initials:    'GS',
    whatsapp:    WHATSAPP_GEEH,
    services: {
      'SOBRANCELHAS': [
        { name: 'Design de Sobrancelhas',       price: 25 },
        { name: 'Design + Henna',                price: 45 },
        { name: 'Brow Lamination',               price: 120 },
        { name: 'Brow Lamination + Design',      price: 150 },
      ],
      'LÁBIOS': [
        { name: 'Hydra Gloss Lips',              price: 150 },
        { name: 'Hydra Color Lips',              price: 180 },
      ],
      'CÍLIOS': [
        { name: 'Extensão Clássico',             price: 80 },
        { name: 'Extensão Hibrido',              price: 100 },
        { name: 'Extensão Volume Brasileiro',    price: 120 },
        { name: 'Extensão Volume Russo',         price: 140 },
        { name: 'Extensão Volume Egípcio',       price: 190 },
      ],
    },
  },
  rapha: {
    id:          'rapha',
    name:        'Rapha',
    fullName:    'Rapha Sgrignoli',
    role:        'Especialista em Estética Facial & Corporal',
    tags:        ['Estética Facial', 'Estética Corporal', 'Massagens'],
    initials:    'RS',
    whatsapp:    WHATSAPP_RAPHA,
    services: {
      'ESTÉTICA FACIAL': [
        { name: 'Limpeza de Pele',               price: 100 },
      ],
      'ESTÉTICA CORPORAL': [
        { name: 'Drenagem linfática',             price: 90 },
        { name: 'Massagem modeladora (por área)',            price: 80 },
        { name: 'modeladora + ultrassom (por area)',         price: 100 },
      ],
      'MASSAGENS': [
        { name: 'Massagem Relaxante',            price: 50 },
        { name: 'Massagem Relaxante (corpo todo)',           price: 80 },
        { name: 'Massagem c/ pedras quentes (corpo todo)',            price: 100 },
        { name: 'Ventosaterapia (por área)',             price: 60 },
        { name: 'Ventosaterapia (corpo todo)',            price: 140 },
      ],
    },
  },
};

// ── Estado da aplicação ───────────────────────────────────────
const state = {
  professional: null, // 'geeh' | 'rapha'
  service:      null, // { name, price }
  category:     null, // string
  date:         null, // Date
  calYear:      new Date().getFullYear(),
  calMonth:     new Date().getMonth(),
};

// ── Refs ──────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

// ── Loading screen ────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const screen = $('loading-screen');
    if (screen) screen.classList.add('hidden');
  }, 1700);
});

// ── Custom cursor ─────────────────────────────────────────────
(function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animateCursor() {
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    rx += (mx - rx) * .14;
    ry += (my - ry) * .14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Efeito ao passar sobre elementos interativos
  document.addEventListener('mouseover', e => {
    if (e.target.matches('button, a, .pro-card, .service-card, .cal-day')) {
      dot.style.transform  = 'translate(-50%,-50%) scale(2)';
      ring.style.width     = '54px';
      ring.style.height    = '54px';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.matches('button, a, .pro-card, .service-card, .cal-day')) {
      dot.style.transform  = 'translate(-50%,-50%) scale(1)';
      ring.style.width     = '36px';
      ring.style.height    = '36px';
    }
  });
})();

// ── Navbar scroll ─────────────────────────────────────────────
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Mobile menu ───────────────────────────────────────────────
const toggle = document.querySelector('.nav-toggle');
const links  = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.classList.remove('open');
    links.classList.remove('open');
  }));
}

// ── Scroll reveal ─────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

function observeReveal() {
  $$('.reveal').forEach(el => revealObserver.observe(el));
}
observeReveal();

// ── Smooth scroll helper ──────────────────────────────────────
function scrollTo(id) {
  const el = $(id);
  if (!el) return;
  const offset = navbar.offsetHeight + 20;
  window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
}

// ── Hero CTA ──────────────────────────────────────────────────
const heroCta = $('hero-cta');
if (heroCta) heroCta.addEventListener('click', () => scrollTo('profissionais'));

// ── Render profissionais ──────────────────────────────────────
function renderProfessionals() {
  const grid = $('pro-grid');
  if (!grid) return;
  grid.innerHTML = '';

  Object.values(PROFESSIONALS).forEach(pro => {
    const card = document.createElement('div');
    card.className = 'pro-card reveal';
    card.dataset.id = pro.id;
    card.innerHTML = `
      <div class="pro-avatar-wrap">
        <div class="pro-avatar-ring"></div>
        <div class="pro-avatar">${pro.initials}</div>
        <div class="pro-selected-badge">✓</div>
      </div>
      <div class="pro-name">${pro.name}</div>
      <div class="pro-role">Beauty Specialist</div>
      <div class="pro-tags">${pro.tags.map(t => `<span class="pro-tag">${t}</span>`).join('')}</div>
      <button class="btn-select-pro" aria-label="Selecionar ${pro.name}">
        Selecionar
      </button>
    `;
    card.addEventListener('click', () => selectProfessional(pro.id));
    grid.appendChild(card);
    revealObserver.observe(card);
  });
}

// ── Selecionar profissional ───────────────────────────────────
function selectProfessional(id) {
  state.professional = id;
  state.service      = null;
  state.category     = null;
  state.date         = null;

  $$('.pro-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.id === id);
    const btn = c.querySelector('.btn-select-pro');
    btn.textContent = c.dataset.id === id ? '✓ Selecionada' : 'Selecionar';
  });

  updateSteps();
  renderServices(id);
  clearCalendar();
  clearForm();
  updateFormSummary();
  setTimeout(() => scrollTo('servicos'), 200);
}

// ── Render serviços ───────────────────────────────────────────
function renderServices(proId) {
  const wrapper = $('services-wrapper-inner');
  if (!wrapper) return;
  wrapper.innerHTML = '';

  const pro = PROFESSIONALS[proId];
  if (!pro) return;

  let delay = 0;
  Object.entries(pro.services).forEach(([cat, items]) => {
    const catDiv = document.createElement('div');
    catDiv.className = 'service-category reveal';
    catDiv.style.transitionDelay = delay + 's';

    const grid = items.map(s => `
      <div class="service-card" data-name="${s.name}" data-price="${s.price}" data-cat="${cat}" tabindex="0" role="button" aria-label="${s.name}">
        <div class="service-info">
          <div class="service-name">${s.name}</div>
        </div>
        <div class="service-price">R$ ${s.price.toFixed(2).replace('.',',')}</div>
        <div class="service-check">✓</div>
      </div>
    `).join('');

    catDiv.innerHTML = `
      <div class="service-cat-title">${cat}</div>
      <div class="services-grid">${grid}</div>
    `;
    wrapper.appendChild(catDiv);
    revealObserver.observe(catDiv);

    catDiv.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('click', () => selectService(card));
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') selectService(card); });
    });

    delay += .08;
  });
}

// ── Selecionar serviço ────────────────────────────────────────
function selectService(card) {
  $$('.service-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  state.service  = { name: card.dataset.name, price: parseFloat(card.dataset.price) };
  state.category = card.dataset.cat;
  updateSteps();
  updateFormSummary();
  if (!state.date) setTimeout(() => scrollTo('data'), 250);
}

// ── Calendário ────────────────────────────────────────────────
const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DAY_NAMES   = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

function renderCalendar() {
  const { calYear: y, calMonth: m } = state;
  const today = new Date();
  today.setHours(0,0,0,0);

  $('cal-month-year').innerHTML = `<span>${MONTH_NAMES[m]}</span> ${y}`;

  const firstDay    = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const daysInPrev  = new Date(y, m, 0).getDate();

  const grid = $('cal-days');
  grid.innerHTML = '';

  // Dias do mês anterior
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = document.createElement('div');
    d.className = 'cal-day other-month disabled';
    d.textContent = daysInPrev - i;
    grid.appendChild(d);
  }

  // Dias do mês atual
  for (let day = 1; day <= daysInMonth; day++) {
    const d  = document.createElement('div');
    const dt = new Date(y, m, day);
    dt.setHours(0,0,0,0);
    const isPast     = dt < today;
    const isToday    = dt.getTime() === today.getTime();
    const isSelected = state.date && dt.getTime() === new Date(state.date.getFullYear(), state.date.getMonth(), state.date.getDate()).getTime();

    d.className = 'cal-day';
    if (isPast)     d.classList.add('disabled');
    if (isToday)    d.classList.add('today');
    if (isSelected) d.classList.add('selected');
    d.textContent = day;
    d.setAttribute('aria-label', dt.toLocaleDateString('pt-BR'));

    if (!isPast) {
      d.addEventListener('click', () => {
        state.date = dt;
        renderCalendar();
        updateCalDisplay();
        updateSteps();
        updateFormSummary();
        setTimeout(() => scrollTo('formulario'), 250);
      });
    }
    grid.appendChild(d);
  }

  // Completar grid com próximo mês
  const totalCells = firstDay + daysInMonth;
  const remaining  = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= remaining; i++) {
    const d = document.createElement('div');
    d.className = 'cal-day other-month disabled';
    d.textContent = i;
    grid.appendChild(d);
  }

  updateCalDisplay();
}

function updateCalDisplay() {
  const el = $('cal-selected');
  if (!el) return;
  if (state.date) {
    el.textContent = '✦  ' + state.date.toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  } else {
    el.textContent = 'Selecione uma data de preferência';
  }
}

function clearCalendar() {
  state.date = null;
  if ($('cal-days')) renderCalendar();
}

// Navegação de mês/ano
function prevMonth() {
  state.calMonth--;
  if (state.calMonth < 0) { state.calMonth = 11; state.calYear--; }
  renderCalendar();
}
function nextMonth() {
  state.calMonth++;
  if (state.calMonth > 11) { state.calMonth = 0; state.calYear++; }
  renderCalendar();
}
function prevYear() { state.calYear--; renderCalendar(); }
function nextYear() { state.calYear++; renderCalendar(); }

// ── Steps ─────────────────────────────────────────────────────
function updateSteps() {
  const steps = $$('.step-item');
  if (!steps.length) return;
  const level = (state.professional ? 1 : 0) + (state.service ? 1 : 0) + (state.date ? 1 : 0);
  steps.forEach((s, i) => {
    s.classList.remove('active', 'done');
    if (i < level)   s.classList.add('done');
    if (i === level) s.classList.add('active');
  });
}

// ── Formulário summary ────────────────────────────────────────
function updateFormSummary() {
  const container = $('form-summary');
  if (!container) return;
  const pro   = state.professional ? PROFESSIONALS[state.professional] : null;
  const items = [];
  if (pro)           items.push({ label: 'Profissional', value: pro.fullName });
  if (state.service) items.push({ label: 'Serviço',      value: state.service.name });
  if (state.date)    items.push({ label: 'Data',         value: state.date.toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long', year:'numeric' }) });

  if (!items.length) {
    container.style.display = 'none';
    return;
  }
  container.style.display = '';
  container.querySelector('.form-summary-items').innerHTML = items.map(it => `
    <div class="form-summary-item">
      <div class="form-summary-dot"></div>
      <span>${it.label}: <strong>${it.value}</strong></span>
    </div>
  `).join('');
}

function clearForm() {
  const n = $('input-nome');
  const t = $('input-telefone');
  const o = $('input-obs');
  if (n) n.value = '';
  if (t) t.value = '';
  if (o) o.value = '';
}

// ── WhatsApp ──────────────────────────────────────────────────
function sendWhatsApp() {
  if (!state.professional) { showToast('Por favor, selecione uma profissional.'); return; }
  if (!state.service)      { showToast('Por favor, selecione um serviço.'); return; }
  if (!state.date)         { showToast('Por favor, selecione uma data.'); return; }

  const nome = $('input-nome')?.value.trim();
  const tel  = $('input-telefone')?.value.trim();
  const obs  = $('input-obs')?.value.trim();

  if (!nome) { showToast('Por favor, informe seu nome.'); return; }
  if (!tel)  { showToast('Por favor, informe seu telefone.'); return; }

  const pro  = PROFESSIONALS[state.professional];
  const data = state.date.toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  const msg = [
    'Olá!',
    '',
    'Gostaria de solicitar um agendamento.',
    '',
    `*Profissional:* ${pro.fullName}`,
    `*Serviço:* ${state.service.name}`,
    `*Data desejada:* ${data}`,
    '',
    `*Nome:* ${nome}`,
    `*Telefone:* ${tel}`,
    obs ? `*Observações:* ${obs}` : '',
    '',
    'Gostaria de verificar a disponibilidade para esta data.',
    '',
    'Obrigado!',
  ].filter(l => l !== undefined).join('\n');

  const url = `https://wa.me/${pro.whatsapp}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank', 'noopener');
}

// ── Toast notification ────────────────────────────────────────
function showToast(msg) {
  let t = document.querySelector('.sg-toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'sg-toast';
    t.style.cssText = `
      position:fixed; bottom:5.5rem; left:50%; transform:translateX(-50%) translateY(20px);
      background:rgba(14,14,14,.95); border:.5px solid rgba(200,149,108,.3);
      backdrop-filter:blur(20px); border-radius:100px;
      padding:.7rem 1.5rem; font-family:'Jost',sans-serif;
      font-size:.75rem; letter-spacing:.1em; color:#e0b49a;
      z-index:999; opacity:0; transition:opacity .3s, transform .3s; white-space:nowrap;
    `;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3200);
}

// ── FAB WhatsApp ──────────────────────────────────────────────
const fabWa = document.querySelector('.fab-whatsapp');
if (fabWa) {
  fabWa.addEventListener('click', () => {
    if (state.professional) {
      scrollTo('formulario');
    } else {
      scrollTo('profissionais');
      showToast('Selecione uma profissional para continuar.');
    }
  });
}

// ── Telefone mask ─────────────────────────────────────────────
const telInput = $('input-telefone');
if (telInput) {
  telInput.addEventListener('input', function() {
    let v = this.value.replace(/\D/g,'');
    if (v.length > 11) v = v.slice(0,11);
    if (v.length > 7) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    this.value = v;
  });
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProfessionals();
  renderCalendar();
  updateSteps();
  updateFormSummary();
  $('form-summary').style.display = 'none';
});
