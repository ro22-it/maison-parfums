/* ============ Общие штуки для всех страниц ============ */

const LABELS = {
  gender: { m: 'Мужской', f: 'Женский', u: 'Унисекс' },
  seasons: { w: 'Зима', s: 'Весна', u: 'Лето', a: 'Осень' },
  times: { d: 'День', n: 'Вечер' },
  occ: { e: 'На каждый день', w: 'Работа', s: 'Учёба', d: 'Свидание', p: 'Вечеринка', o: 'Особый случай', g: 'Подарок' },
  lon: ['', 'Очень слабая', 'Слабая', 'Средняя', 'Стойкая', 'Очень стойкая'],
  lonHours: ['', 'до 2 часов', '2–4 часа', '4–6 часов', '6–9 часов', '10+ часов'],
  sil: ['', 'Интимный', 'Близкий', 'Умеренный', 'Сильный', 'Огромный'],
  conc: { EDC: 'Eau de Cologne', EDT: 'Eau de Toilette', EDP: 'Eau de Parfum', Parfum: 'Parfum', Extrait: 'Extrait de Parfum' }
};

const ICONS = {
  compare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M7 4v16M17 4v16"/><path d="M3 9l4-5 4 5M13 15l4 5 4-5"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  arrow: '<svg viewBox="0 0 30 12" fill="none" stroke="currentColor" stroke-width="1"><path d="M0 6h28M23 1l5 5-5 5"/></svg>',
  down: '<svg viewBox="0 0 16 22" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M8 0v20M1 13l7 7 7-7"/></svg>',
  search: '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="11" cy="11" r="8.5"/><path d="M17.5 17.5L25 25"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>',
  starO: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>',
  w: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 3.5l3 2 3-2M9 20.5l3-2 3 2"/></svg>',
  s: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="10" r="2.5"/><path d="M12 7.5c0-3 3-4.5 3-4.5s1.5 3-1.2 5M14.4 10.5c2.7-.6 5 1.4 5 1.4s-2.4 2.2-5 .6M9.6 10.5c-2.7-.6-5 1.4-5 1.4s2.4 2.2 5 .6M12 12.5V22"/></svg>',
  u: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/></svg>',
  a: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M5 19C5 10 11 4 20 4c0 9-6 15-15 15z"/><path d="M5 19L14 10"/></svg>',
  d: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/></svg>',
  n: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M20 14.5A8.5 8.5 0 019.5 4 8.5 8.5 0 1020 14.5z"/></svg>',
  m: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="10" cy="14" r="6"/><path d="M14.5 9.5L21 3M15 3h6v6"/></svg>',
  f: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="9" r="6"/><path d="M12 15v7M8.5 19h7"/></svg>',
  g_u: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="11" cy="12" r="5.5"/><path d="M15 8l5-5M16 3h4v4M11 17.5V23M8 20.5h6"/></svg>',
  person: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>'
};

const genderIcon = g => g === 'u' ? ICONS.g_u : ICONS[g];

/* ---------- Цвета аккордов ---------- */
const ACCORD_COLORS = [
  ['ванил', '#efdcb6'], ['древес', '#8b6a4c'], ['сандал', '#c49a6c'], ['дымн', '#6e6a66'], ['табач', '#7a4f2c'],
  ['кожан', '#5a3b2a'], ['цитрус', '#f2d34f'], ['свеж', '#bfe3d9'], ['морск', '#5fa4c9'], ['водян', '#8cc5df'], ['озон', '#b3d7ea'],
  ['цветоч', '#f1a7bf'], ['розов', '#e2738f'], ['белые цветы', '#f5efe0'], ['туберо', '#f4ead2'], ['фиалк', '#9a7bb8'], ['ирис', '#b7a7cf'],
  ['пудров', '#e8d1d6'], ['мускус', '#e4dbd3'], ['сладк', '#e9a27c'], ['гурман', '#c98a5e'], ['карамел', '#c9874c'], ['медов', '#e1a83c'],
  ['кофе', '#5b3a26'], ['какао', '#6b4129'], ['шоколад', '#55311f'], ['фрукт', '#f08a5d'], ['ягод', '#b0304f'], ['вишн', '#8e1b34'],
  ['тёплый пряный', '#c45a2c'], ['свежий пряный', '#8fb878'], ['пряный', '#b9552f'], ['ароматич', '#7fa58a'], ['лаванд', '#9d8cc6'],
  ['зелён', '#6a9c4f'], ['мшист', '#5e6f3e'], ['мох', '#5e6f3e'], ['амбр', '#d1914a'], ['бальзам', '#a8693a'], ['удов', '#4b3426'],
  ['землист', '#6f5a3d'], ['пачули', '#6d5338'], ['альдегид', '#e9eef3'], ['мыльн', '#e3eef2'], ['минерал', '#a9aeb2'], ['металл', '#9aa3ab'],
  ['алкогол', '#a35a2a'], ['ром', '#8a4a25'], ['миндал', '#e7cfa6'], ['кокос', '#f3ece0'], ['сливоч', '#f3e6cf'], ['молоч', '#f4ece0'],
  ['чайн', '#9c8a4e'], ['солён', '#a7c4cc'], ['мятн', '#a6e0c8'], ['нероли', '#f7e6a5'], ['каштан', '#8b5a35'], ['ладан', '#9b8b77'],
  ['имбир', '#e0b04a'], ['животн', '#7b5a43'], ['тропич', '#f6a54a'], ['бархат', '#a38b78'], ['чист', '#eef3f5'], ['необыч', '#7c7f94']
];
function accordColor(name) {
  const n = name.toLowerCase();
  const hit = ACCORD_COLORS.find(([k]) => n.includes(k));
  return hit ? hit[1] : '#cbbfae';
}
function textOn(hex) {
  const c = parseInt(hex.slice(1), 16), r = c >> 16, g = (c >> 8) & 255, b = c & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#19110b' : '#ffffff';
}

/* ---------- Фото и запасной флакон ---------- */
// у Fragrantica самая крупная версия — 375×500 (o.ID.jpg меньше), её и берём везде
const imgUrl = p => `https://fimgs.net/mdimg/perfume/375x500.${p.img}.jpg`;

// Рисуем SVG-флакон, если фото с Fragrantica не загрузилось
function fallbackBottle(p) {
  const juice = accordColor(p.accords[0].name);
  const initials = p.name.replace(/[^A-Za-zА-Яа-я0-9 ]/g, '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return `<svg class="fallback" viewBox="0 0 120 190" xmlns="http://www.w3.org/2000/svg">
    <rect x="44" y="6" width="32" height="30" rx="3" fill="#19110b"/>
    <rect x="50" y="34" width="20" height="12" fill="#cfc6b8"/>
    <rect x="12" y="44" width="96" height="140" rx="12" fill="rgba(255,255,255,.55)" stroke="#19110b" stroke-width="1"/>
    <rect x="18" y="70" width="84" height="108" rx="8" fill="${juice}" opacity=".75"/>
    <rect x="28" y="96" width="64" height="46" fill="#fbf8f2"/>
    <text x="60" y="118" text-anchor="middle" font-size="13" letter-spacing="2" fill="#19110b">${initials}</text>
    <text x="60" y="133" text-anchor="middle" font-size="5" letter-spacing="1.5" fill="#5b524b">${p.brand.toUpperCase().slice(0, 22)}</text>
    <path d="M22 52v120" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/>
  </svg>`;
}
function imgTag(p, big) {
  return `<img src="${imgUrl(p, big)}" alt="${esc(p.name)} — ${esc(p.brand)}" loading="${big ? 'eager' : 'lazy'}" referrerpolicy="no-referrer" data-fb="${p.id}">`;
}
// Подменяем битые картинки на нарисованный флакон
document.addEventListener('error', e => {
  const img = e.target;
  if (img.tagName !== 'IMG' || !img.dataset.fb) return;
  const p = PERFUMES.find(x => x.id === img.dataset.fb);
  if (p) img.outerHTML = fallbackBottle(p);
}, true);

function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
const byId = id => PERFUMES.find(p => p.id === id);
const plural = (n, one, few, many) => {
  const m10 = n % 10, m100 = n % 100;
  return m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? few : many;
};

/* ---------- Хранилище (в браузере) ---------- */
const store = {
  get(key, def) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; } },
  set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
};

/* ---------- Сравнение ---------- */
const COMPARE_MAX = 5;
const Compare = {
  list() { return store.get('mp_compare', []).filter(byId); },
  has(id) { return this.list().includes(id); },
  toggle(id) {
    let l = this.list();
    if (l.includes(id)) { l = l.filter(x => x !== id); store.set('mp_compare', l); updateCompareBadge(); return false; }
    if (l.length >= COMPARE_MAX) { toast(`Можно сравнить до ${COMPARE_MAX} ароматов`, 'compare.html', 'Открыть'); return null; }
    l.push(id); store.set('mp_compare', l); updateCompareBadge(true);
    toast(`«${byId(id).name}» добавлен в сравнение`, 'compare.html', 'Сравнить');
    return true;
  },
  remove(id) { store.set('mp_compare', this.list().filter(x => x !== id)); updateCompareBadge(); }
};
function updateCompareBadge(bump) {
  const el = document.querySelector('.compare-count');
  if (!el) return;
  const n = Compare.list().length;
  el.textContent = n;
  el.classList.toggle('show', n > 0);
  if (bump) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
}
// синхронизация между вкладками
window.addEventListener('storage', e => { if (e.key === 'mp_compare') { updateCompareBadge(); document.dispatchEvent(new Event('compare-change')); } });

/* ---------- Похожие ароматы ---------- */
function similarity(a, b) {
  if (a.id === b.id) return -1;
  const accB = new Map(b.accords.map(x => [x.name, x.value]));
  let s = 0;
  a.accords.forEach(x => { if (accB.has(x.name)) s += Math.min(x.value, accB.get(x.name)) / 25; });
  const notesA = new Set([...a.notes.top, ...a.notes.mid, ...a.notes.base].map(n => n.toLowerCase()));
  [...b.notes.top, ...b.notes.mid, ...b.notes.base].forEach(n => { if (notesA.has(n.toLowerCase())) s += 1.2; });
  if (a.family === b.family) s += 3;
  if (a.gender === b.gender || b.gender === 'u' || a.gender === 'u') s += 1;
  s += a.seasons.filter(x => b.seasons.includes(x)).length * .4;
  return s;
}
const similarTo = (p, n = 8) => PERFUMES.map(x => [x, similarity(p, x)]).filter(x => x[1] > 0).sort((x, y) => y[1] - x[1]).slice(0, n).map(x => x[0]);

/* ---------- Тост ---------- */
let toastTimer;
function toast(text, href, linkText) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.innerHTML = `<span>${esc(text)}</span>${href ? `<a href="${href}" data-link>${linkText}</a>` : ''}`;
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ---------- Карточка аромата ---------- */
function cardHTML(p) {
  const on = Compare.has(p.id);
  const occ = p.occ.slice(0, 2).map(o => `<span class="ico">${LABELS.occ[o]}</span>`).join('') + (p.occ.length > 2 ? `<span class="ico">+${p.occ.length - 2}</span>` : '');
  return `<article class="card" data-id="${p.id}">
    <a class="card__media" href="perfume.html?id=${p.id}" data-link>
      ${imgTag(p)}
      <span class="card__year">${p.year}</span>
    </a>
    <button class="card__cmp ${on ? 'on' : ''}" data-cmp="${p.id}" title="Сравнить" aria-label="Добавить в сравнение">${on ? ICONS.check : ICONS.compare}</button>
    <div class="card__body">
      <div class="card__brand">${esc(p.brand)}</div>
      <a class="card__name" href="perfume.html?id=${p.id}" data-link>${esc(p.name)}</a>
      <div class="card__short">${esc(p.short)}</div>
      <div class="card__icons">
        <span class="ico" title="${LABELS.gender[p.gender]}">${genderIcon(p.gender)}${LABELS.gender[p.gender]}</span>
        ${p.seasons.map(s => `<span class="ico" title="${LABELS.seasons[s]}">${ICONS[s]}</span>`).join('')}
        ${occ}
      </div>
      <div class="card__actions">
        <a href="perfume.html?id=${p.id}" data-link>Подробнее</a>
        <button data-cmp="${p.id}" class="${on ? 'on' : ''}">${on ? 'В сравнении' : 'Сравнить'}</button>
        <button data-similar="${p.id}">Похожие</button>
      </div>
    </div>
  </article>`;
}
function syncCompareButtons(root = document) {
  root.querySelectorAll('[data-cmp]').forEach(b => {
    const on = Compare.has(b.dataset.cmp);
    b.classList.toggle('on', on);
    if (b.classList.contains('card__cmp')) b.innerHTML = on ? ICONS.check : ICONS.compare;
    else if (b.dataset.label !== 'keep') b.textContent = on ? (b.dataset.on || 'В сравнении') : (b.dataset.off || 'Сравнить');
  });
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-cmp]');
  if (!b) return;
  e.preventDefault();
  Compare.toggle(b.dataset.cmp);
  syncCompareButtons();
  document.dispatchEvent(new Event('compare-change'));
});
document.addEventListener('compare-change', () => syncCompareButtons());

/* ---------- Появление при прокрутке ---------- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    // карточки появляются лесенкой
    if (el.classList.contains('card')) {
      const siblings = [...el.parentElement.children].filter(c => !c.classList.contains('vis'));
      el.style.transitionDelay = Math.min(siblings.indexOf(el), 6) * 70 + 'ms';
    }
    el.classList.add('vis');
    revealObserver.unobserve(el);
  });
}, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
const observeReveal = (root = document) => root.querySelectorAll('.reveal:not(.vis), .card:not(.vis), [data-reveal]:not(.vis)').forEach(el => revealObserver.observe(el));

/* ---------- Шапка ---------- */
function headerHTML() {
  return `<header class="header">
    <nav class="header__left">
      <a href="index.html#catalog" data-link>Каталог</a>
      <a href="index.html#finder" data-link>Подбор</a>
    </nav>
    <a class="logo" href="index.html" data-link>Maison Parfums</a>
    <div class="header__right">
      <a class="compare-btn" href="compare.html" data-link title="Сравнение" aria-label="Сравнение">
        ${ICONS.compare}<span class="compare-count">0</span>
      </a>
    </div>
  </header>`;
}
function footerHTML() {
  return `<footer class="footer">
    <div class="footer__big">Maison<br>Parfums</div>
    <div class="footer__row">
      <span>© ${new Date().getFullYear()} Maison Parfums — каталог ароматов</span>
      <span>Фото флаконов: <a href="https://www.fragrantica.com" target="_blank" rel="noopener" style="text-decoration:underline;text-underline-offset:3px">Fragrantica.com</a></span>
      <span>Отзывы хранятся в вашем браузере</span>
    </div>
  </footer>`;
}
function mountChrome() {
  document.body.insertAdjacentHTML('afterbegin', headerHTML() + '<div class="curtain"><span class="curtain__name">Maison Parfums</span></div>');
  if (!document.body.dataset.nofooter) document.body.insertAdjacentHTML('beforeend', footerHTML());
  updateCompareBadge();
  const header = document.querySelector('.header');
  const onScroll = () => header.classList.toggle('solid', window.scrollY > 40 || document.body.dataset.solid === '1');
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Переходы между страницами (шторка) ---------- */
function pageEnter() {
  const c = document.querySelector('.curtain');
  if (sessionStorage.getItem('mp_curtain') === '1') {
    sessionStorage.removeItem('mp_curtain');
    c.style.transition = 'none';
    c.classList.add('in');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      c.style.transition = '';
      c.classList.add('up');
      setTimeout(() => { c.classList.remove('in', 'up'); }, 800);
    }));
  }
}
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-link]');
  if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
  const url = new URL(a.href, location.href);
  // якорь на той же странице — просто плавно едем
  if (url.pathname === location.pathname && url.hash) {
    const t = document.querySelector(url.hash);
    if (t) { e.preventDefault(); smoothScrollTo(t.getBoundingClientRect().top + scrollY); return; }
  }
  if (url.href === location.href) return;
  e.preventDefault();
  sessionStorage.setItem('mp_curtain', '1');
  document.querySelector('.curtain').classList.add('in');
  setTimeout(() => { location.href = url.href; }, 650);
});
window.addEventListener('pageshow', e => { if (e.persisted) document.querySelector('.curtain')?.classList.remove('in', 'up'); });

/* ---------- Плавная прокрутка с кастомной кривой ---------- */
let scrollAnim = null;
function smoothScrollTo(y, dur = 1300) {
  const start = scrollY, dist = y - start, t0 = performance.now();
  const ease = t => t < .5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2;
  cancelAnimationFrame(scrollAnim);
  return new Promise(res => {
    const step = now => {
      const k = Math.min((now - t0) / dur, 1);
      window.scrollTo(0, start + dist * ease(k));
      if (k < 1) scrollAnim = requestAnimationFrame(step); else { scrollAnim = null; res(); }
    };
    scrollAnim = requestAnimationFrame(step);
  });
}

function starsHTML(v) {
  let s = '';
  for (let i = 1; i <= 5; i++) s += v >= i - .25 ? ICONS.star : ICONS.starO;
  return `<span class="stars">${s}</span>`;
}
