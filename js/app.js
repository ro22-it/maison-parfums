/* ============ Главная: интро, переход вниз, фильтры, каталог ============ */
mountChrome();
pageEnter();
const header = document.querySelector('.header');
header.classList.add('on-dark');

/* ---------- Интро ---------- */
(function intro() {
  const box = document.getElementById('intro');
  const word = box.querySelector('.intro__word');
  // если пришли со шторкой или по якорю — интро не показываем
  const skip = location.hash || sessionStorage.getItem('mp_intro_seen');
  if (skip) { box.remove(); document.body.classList.remove('lock'); document.body.classList.add('ready'); if (location.hash) setTimeout(() => { const t = document.querySelector(location.hash); t && scrollTo(0, t.offsetTop); }, 50); return; }
  sessionStorage.setItem('mp_intro_seen', '1');
  word.innerHTML = 'Maison Parfums'.split('').map((ch, i) => `<span style="animation-delay:${i * 45}ms">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('');
  setTimeout(() => {
    box.classList.add('out');
    document.body.classList.remove('lock');
    document.body.classList.add('ready');
    setTimeout(() => box.remove(), 1200);
  }, 1900);
})();

/* ---------- Плавный переход с главного экрана к подбору ---------- */
const hero = document.getElementById('hero');
const finder = document.getElementById('finder');
let busy = false;
const finderTop = () => finder.getBoundingClientRect().top + scrollY;
async function goFinder() { if (busy) return; busy = true; await smoothScrollTo(finderTop(), 1400); busy = false; }
async function goHero() { if (busy) return; busy = true; await smoothScrollTo(0, 1200); busy = false; }
document.getElementById('toFinder').addEventListener('click', goFinder);

/* ---------- Видео на фоне: когда ролик заиграл, 3D-флакон прячем ---------- */
const heroVideo = document.querySelector('.hero__video');
if (heroVideo) {
  const markVideo = () => hero.classList.add('has-video');
  heroVideo.addEventListener('playing', markVideo);
  heroVideo.addEventListener('timeupdate', markVideo, { once: true });
  // ролик мог запуститься раньше, чем подключился этот скрипт
  if (!heroVideo.paused && heroVideo.readyState > 2) markVideo();
  // браузеры иногда не запускают автоплей сами — пробуем ещё раз без звука
  heroVideo.muted = true;
  heroVideo.play?.().catch(() => {});
}

window.addEventListener('wheel', e => {
  if (document.body.classList.contains('lock')) { e.preventDefault(); return; }
  const y = scrollY, ft = finderTop();
  if (busy) { e.preventDefault(); return; }
  if (y < ft - 4 && e.deltaY > 0) { e.preventDefault(); goFinder(); }
  else if (y <= ft + 4 && y > 0 && e.deltaY < 0) { e.preventDefault(); goHero(); }
}, { passive: false });

let touchY = null;
window.addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, { passive: true });
window.addEventListener('touchmove', e => {
  if (touchY === null) return;
  const dy = touchY - e.touches[0].clientY, y = scrollY, ft = finderTop();
  if (busy) { e.preventDefault(); return; }
  if (y < ft - 4 && dy > 30) { e.preventDefault(); touchY = null; goFinder(); }
  else if (y <= ft + 4 && y > 0 && dy < -30) { e.preventDefault(); touchY = null; goHero(); }
}, { passive: false });
window.addEventListener('keydown', e => {
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
  if (scrollY < finderTop() - 4 && ['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); goFinder(); }
});
// шапка светлая, пока мы на тёмном главном экране
window.addEventListener('scroll', () => header.classList.toggle('on-dark', scrollY < hero.offsetHeight - 80), { passive: true });

/* ---------- Справочники для фильтров ---------- */
const allNotes = (() => {
  const freq = new Map();
  PERFUMES.forEach(p => [...p.notes.top, ...p.notes.mid, ...p.notes.base].forEach(n => freq.set(n, (freq.get(n) || 0) + 1)));
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).map(x => x[0]);
})();
const brands = [...new Set(PERFUMES.map(p => p.brand))].sort((a, b) => a.localeCompare(b));
const brandCount = PERFUMES.reduce((m, p) => (m[p.brand] = (m[p.brand] || 0) + 1, m), {});
const families = [...new Set(PERFUMES.map(p => p.family))].sort((a, b) => a.localeCompare(b, 'ru'));

const GROUPS = [
  { key: 'gender', label: 'Пол', single: true, items: [['all', 'Все'], ['m', 'Мужской'], ['f', 'Женский'], ['u', 'Унисекс']] },
  { key: 'times', label: 'Время суток', items: [['d', 'День'], ['n', 'Вечер']] },
  { key: 'seasons', label: 'Сезон', items: [['w', 'Зима'], ['s', 'Весна'], ['u', 'Лето'], ['a', 'Осень']] },
  { key: 'occ', label: 'Повод', items: Object.entries(LABELS.occ) },
  { key: 'family', label: 'Тип аромата', items: families.map(f => [f, f]) },
  { key: 'lon', label: 'Стойкость', items: [['1-2', 'Слабая'], ['3', 'Средняя'], ['4', 'Стойкая'], ['5', 'Очень стойкая']] },
  { key: 'sil', label: 'Шлейф', items: [['1-2', 'Близкий'], ['3', 'Умеренный'], ['4', 'Сильный'], ['5', 'Огромный']] },
  { key: 'vol', label: 'Объём', items: [['s', 'До 10 мл'], ['m', '30–50 мл'], ['l', 'Больше 50 мл']] },
  { key: 'conc', label: 'Концентрация', items: [['EDC', 'Одеколон'], ['EDT', 'Туалетная вода'], ['EDP', 'Парфюмерная вода'], ['P', 'Духи / Extrait']] }
];

const emptyState = () => ({ q: '', gender: 'all', times: [], seasons: [], occ: [], family: [], lon: [], sil: [], vol: [], conc: [], brands: [], notes: [], exclude: [] });
let state = emptyState();

/* ---------- Отрисовка фильтров ---------- */
const filtersEl = document.getElementById('filters');
function renderFilters() {
  const chipGroup = g => `<div class="filter">
      <div class="filter__label">${g.label}${g.single ? '' : '<small>можно несколько</small>'}</div>
      <div class="chips" data-group="${g.key}">
        ${g.items.map(([v, l]) => `<button class="chip" data-v="${esc(v)}">${esc(l)}</button>`).join('')}
      </div></div>`;
  filtersEl.innerHTML =
    GROUPS.slice(0, 4).map(chipGroup).join('') +
    `<div class="filter">
      <div class="filter__label">Ноты<small>все выбранные</small></div>
      <div class="tag-input" data-tags="notes">
        <input type="text" placeholder="Например: ваниль, роза, кофе…" autocomplete="off">
        <div class="suggest"></div>
        <div class="tag-input__tags"></div>
      </div></div>` +
    GROUPS.slice(4).map(chipGroup).join('') +
    `<div class="filter">
      <div class="filter__label">Бренд<small>${brands.length} брендов</small></div>
      <div class="tag-input" data-tags="brands">
        <input type="text" placeholder="Поиск бренда: Dior, Tom Ford…" autocomplete="off">
        <div class="suggest"></div>
        <div class="tag-input__tags"></div>
      </div></div>
    <div class="filter">
      <div class="filter__label">Исключить ноты<small>без этих нот</small></div>
      <div class="tag-input" data-tags="exclude">
        <input type="text" placeholder="Например: уд, пачули…" autocomplete="off">
        <div class="suggest"></div>
        <div class="tag-input__tags"></div>
      </div></div>`;
  syncFilters();
}
function syncFilters() {
  filtersEl.querySelectorAll('[data-group]').forEach(box => {
    const key = box.dataset.group, val = state[key];
    box.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', Array.isArray(val) ? val.includes(c.dataset.v) : val === c.dataset.v));
  });
  document.getElementById('q').value = state.q;
  filtersEl.querySelectorAll('[data-tags]').forEach(box => {
    const key = box.dataset.tags;
    box.querySelector('.tag-input__tags').innerHTML = state[key].map(n =>
      `<span class="tag ${key === 'exclude' ? 'minus' : ''}" data-note-info="${esc(n)}" title="Что это за нота">${key === 'exclude' ? '− ' : ''}${esc(n)}<button data-rm="${esc(n)}" aria-label="Убрать">×</button></span>`).join('');
  });
  updateLiveCount();
}

filtersEl.addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (chip) {
    const key = chip.closest('[data-group]').dataset.group, v = chip.dataset.v;
    if (GROUPS.find(g => g.key === key).single) state[key] = v;
    else state[key] = state[key].includes(v) ? state[key].filter(x => x !== v) : [...state[key], v];
    syncFilters();
    return;
  }
  const rm = e.target.closest('[data-rm]');
  if (rm) {
    const key = rm.closest('[data-tags]').dataset.tags;
    state[key] = state[key].filter(n => n !== rm.dataset.rm);
    syncFilters();
  }
});
document.getElementById('q').addEventListener('input', e => { state.q = e.target.value; updateLiveCount(); });
document.getElementById('q').addEventListener('keydown', e => { if (e.key === 'Enter') runSearch(); });

/* автодополнение нот */
filtersEl.addEventListener('input', e => {
  const box = e.target.closest('[data-tags]');
  if (box) showSuggest(box);
});
filtersEl.addEventListener('focusin', e => { const box = e.target.closest('[data-tags]'); if (box) showSuggest(box); });
document.addEventListener('click', e => { if (!e.target.closest('.tag-input')) filtersEl.querySelectorAll('.suggest').forEach(s => s.classList.remove('open')); });
function showSuggest(box) {
  const key = box.dataset.tags, input = box.querySelector('input'), list = box.querySelector('.suggest');
  const q = input.value.trim().toLowerCase();
  // для брендов показываем весь список с количеством ароматов, для нот — 12 самых частых совпадений
  const source = key === 'brands' ? brands : allNotes;
  const items = source.filter(n => !state[key].includes(n) && (!q || n.toLowerCase().includes(q))).slice(0, key === 'brands' ? 100 : 12);
  const count = n => key === 'brands' ? `<small style="float:right;color:var(--ink-2)">${brandCount[n]}</small>` : '';
  list.innerHTML = items.map((n, i) => `<button type="button" data-note="${esc(n)}" class="${i === 0 && q ? 'act' : ''}">${esc(n)}${count(n)}</button>`).join('') || '<button type="button" disabled>Ничего не найдено</button>';
  list.classList.add('open');
}
filtersEl.addEventListener('mousedown', e => {
  const b = e.target.closest('[data-note]');
  if (!b) return;
  e.preventDefault();
  addTag(b.closest('[data-tags]'), b.dataset.note);
});
filtersEl.addEventListener('keydown', e => {
  const box = e.target.closest('[data-tags]');
  if (!box || e.key !== 'Enter') return;
  e.preventDefault();
  const first = box.querySelector('[data-note]');
  if (first) addTag(box, first.dataset.note);
});
function addTag(box, note) {
  const key = box.dataset.tags;
  if (!state[key].includes(note)) state[key] = [...state[key], note];
  box.querySelector('input').value = '';
  syncFilters();
  box.querySelector('input').focus();
  showSuggest(box);
}

/* ---------- Логика фильтрации ---------- */
const inRange = (val, codes) => codes.some(c => c.includes('-') ? (val >= +c.split('-')[0] && val <= +c.split('-')[1]) : val === +c);
const hasNote = (p, note) => {
  const n = note.toLowerCase();
  return [...p.notes.top, ...p.notes.mid, ...p.notes.base].some(x => x.toLowerCase().includes(n));
};
function matches(p, s) {
  if (s.q) {
    const q = s.q.toLowerCase().trim();
    if (!(p.name + ' ' + p.brand).toLowerCase().includes(q)) return false;
  }
  if (s.gender !== 'all' && p.gender !== s.gender) return false;
  if (s.times.length && !s.times.some(t => p.times.includes(t))) return false;
  if (s.seasons.length && !s.seasons.some(t => p.seasons.includes(t))) return false;
  if (s.occ.length && !s.occ.some(t => p.occ.includes(t))) return false;
  if (s.family.length && !s.family.includes(p.family)) return false;
  if (s.lon.length && !inRange(p.lon, s.lon)) return false;
  if (s.sil.length && !inRange(p.sil, s.sil)) return false;
  if (s.vol.length && !s.vol.some(v => p.vols.some(ml => v === 's' ? ml <= 10 : v === 'm' ? ml >= 30 && ml <= 50 : ml > 50))) return false;
  if (s.conc.length && !s.conc.some(c => c === 'P' ? ['Parfum', 'Extrait'].includes(p.conc) : p.conc === c)) return false;
  if (s.brands.length && !s.brands.includes(p.brand)) return false;
  if (s.notes.length && !s.notes.every(n => hasNote(p, n))) return false;
  if (s.exclude.length && s.exclude.some(n => hasNote(p, n))) return false;
  return true;
}
function updateLiveCount() {
  const n = PERFUMES.filter(p => matches(p, state)).length;
  document.getElementById('liveCount').textContent = `Подходит: ${n} ${plural(n, 'аромат', 'аромата', 'ароматов')}`;
}

/* ---------- Каталог ---------- */
const grid = document.getElementById('grid');
const moreBtn = document.getElementById('moreBtn');
const PAGE = 12;
let shown = PAGE, current = [...PERFUMES], mode = 'all';

function sorted(list) {
  const s = document.getElementById('sort').value;
  const l = [...list];
  if (s === 'new') l.sort((a, b) => b.year - a.year);
  if (s === 'old') l.sort((a, b) => a.year - b.year);
  if (s === 'lon') l.sort((a, b) => b.lon - a.lon || b.sil - a.sil);
  if (s === 'az') l.sort((a, b) => a.name.localeCompare(b.name));
  return l;
}
function renderGrid() {
  const list = mode === 'similar' ? current : sorted(current);
  if (!list.length) {
    grid.innerHTML = `<div class="empty"><div class="h2">Ничего не <em>нашлось</em></div><p class="lead" style="margin:20px auto 30px">Попробуйте убрать часть фильтров.</p><button class="btn btn--ghost" onclick="resetAll()">Сбросить фильтры</button></div>`;
    moreBtn.parentElement.style.display = 'none';
    return;
  }
  grid.innerHTML = list.slice(0, shown).map(cardHTML).join('');
  moreBtn.parentElement.style.display = list.length > shown ? '' : 'none';
  observeReveal(grid);
}
moreBtn.addEventListener('click', () => {
  const before = shown;
  shown += PAGE;
  const list = mode === 'similar' ? current : sorted(current);
  grid.insertAdjacentHTML('beforeend', list.slice(before, shown).map(cardHTML).join(''));
  moreBtn.parentElement.style.display = list.length > shown ? '' : 'none';
  observeReveal(grid);
});
document.getElementById('sort').addEventListener('change', () => { shown = PAGE; renderGrid(); });

function setTitle(kicker, title) {
  document.getElementById('resKicker').textContent = kicker;
  document.getElementById('resTitle').innerHTML = title;
}
function runSearch() {
  mode = 'all';
  current = PERFUMES.filter(p => matches(p, state));
  shown = PAGE;
  document.getElementById('similarNote').classList.remove('show');
  const n = current.length;
  const isAll = JSON.stringify(state) === JSON.stringify(emptyState());
  setTitle(isAll ? 'Каталог' : 'Результаты подбора', isAll ? 'Все <em>ароматы</em>' : `${n} <em>${plural(n, 'аромат', 'аромата', 'ароматов')}</em>`);
  renderGrid();
  smoothScrollTo(document.getElementById('catalog').offsetTop - 40, 1100);
}
function resetAll() {
  state = emptyState();
  syncFilters();
  runSearch();
}
window.resetAll = resetAll;
document.getElementById('findBtn').addEventListener('click', runSearch);
document.getElementById('resetBtn').addEventListener('click', () => { state = emptyState(); syncFilters(); mode = 'all'; current = [...PERFUMES]; shown = PAGE; setTitle('Каталог', 'Все <em>ароматы</em>'); document.getElementById('similarNote').classList.remove('show'); renderGrid(); });

/* ---------- Кнопка «Похожие» ---------- */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-similar]');
  if (!b) return;
  const p = byId(b.dataset.similar);
  mode = 'similar';
  current = similarTo(p, 12);
  shown = PAGE;
  setTitle('Похожие ароматы', `Похоже на <em>${esc(p.name)}</em>`);
  const note = document.getElementById('similarNote');
  note.innerHTML = `Подобрано по нотам и аккордам «${esc(p.name)}» · <button type="button">Показать все</button>`;
  note.classList.add('show');
  note.querySelector('button').onclick = () => { note.classList.remove('show'); runSearch(); };
  renderGrid();
  smoothScrollTo(document.getElementById('catalog').offsetTop - 40, 1000);
});

renderFilters();
renderGrid();
observeReveal();

/* ---------- Поиск по ноте из панели «что это за нота» ---------- */
window.searchByNote = n => { state = emptyState(); state.notes = [n]; syncFilters(); runSearch(); };
let pendingNote = null;
try { pendingNote = sessionStorage.getItem('mp_note'); sessionStorage.removeItem('mp_note'); } catch {}
if (pendingNote) setTimeout(() => window.searchByNote(pendingNote), 120);
