/* ============ Страница сравнения ============ */
mountChrome();
pageEnter();
document.body.dataset.solid = '1';
document.querySelector('.header').classList.add('solid');

const page = document.getElementById('page');

function render() {
  const list = Compare.list().map(byId);
  if (!list.length) {
    page.innerHTML = `<div class="cmp-empty">
      <div class="kicker">Сравнение</div>
      <h1 class="h2">Здесь пока <em>пусто</em></h1>
      <p>Нажмите «Сравнить» на карточке аромата — он появится здесь. Можно сравнить до ${COMPARE_MAX} ароматов.</p>
      <a class="btn" href="index.html#catalog" data-link>Перейти в каталог</a>
    </div>`;
    return;
  }
  const maxLon = Math.max(...list.map(p => p.lon)), maxSil = Math.max(...list.map(p => p.sil));
  // в строках с нотами подсвечиваем общие для всех ноты
  const common = key => {
    if (list.length < 2) return new Set();
    return new Set(list[0].notes[key].filter(n => list.every(p => p.notes[key].includes(n))));
  };
  const notesCell = (p, key, set) => p.notes[key].map(n => `<span class="note-link" data-note-info="${esc(n)}" role="button" tabindex="0">${set.has(n) ? `<b>${esc(n)}</b>` : esc(n)}</span>`).join(', ') || '—';
  const cTop = common('top'), cMid = common('mid'), cBase = common('base');

  const rows = [
    ['Бренд', p => esc(p.brand)],
    ['Год', p => p.year],
    ['Концентрация', p => LABELS.conc[p.conc]],
    ['Пол', p => LABELS.gender[p.gender]],
    ['Тип аромата', p => esc(p.family)],
    ['Описание', p => `<span style="color:var(--ink-2)">${esc(p.short)}</span>`],
    ['Аккорды', p => `<div class="mini-acc">${p.accords.slice(0, 5).map(a => { const c = accordColor(a.name); return `<div style="width:${a.value}%;background:${c};color:${textOn(c)}">${esc(a.name)}</div>`; }).join('')}</div>`],
    ['Верхние ноты', p => notesCell(p, 'top', cTop)],
    ['Ноты сердца', p => notesCell(p, 'mid', cMid)],
    ['Базовые ноты', p => notesCell(p, 'base', cBase)],
    ['Стойкость', p => `<span class="${p.lon === maxLon && list.length > 1 ? 'best' : ''}">${LABELS.lon[p.lon]}</span><br><small style="color:var(--ink-2)">${LABELS.lonHours[p.lon]}</small>`],
    ['Шлейф', p => `<span class="${p.sil === maxSil && list.length > 1 ? 'best' : ''}">${LABELS.sil[p.sil]}</span>`],
    ['Сезон', p => `<div class="card__icons" style="margin:0">${p.seasons.map(s => `<span class="ico">${ICONS[s]}${LABELS.seasons[s]}</span>`).join('')}</div>`],
    ['Время суток', p => p.times.map(t => LABELS.times[t]).join(', ')],
    ['Повод', p => p.occ.map(o => LABELS.occ[o]).join(', ')],
    ['Объёмы', p => p.vols.map(v => v + ' мл').join(' · ')]
  ];

  page.innerHTML = `
    <div class="cmp-head">
      <div><div class="kicker">Сравнение</div><h1 class="h2">${list.length} ${plural(list.length, '<em>аромат</em>', '<em>аромата</em>', '<em>ароматов</em>')}</h1></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <a class="btn btn--ghost btn--sm" href="index.html#catalog" data-link>Добавить ещё</a>
        <button class="btn btn--sm" id="clearAll">Очистить</button>
      </div>
    </div>
    <div class="cmp-scroll reveal">
      <table class="cmp">
        <tr><th></th>${list.map(p => `<td class="cmp__top">
          <button class="cmp__remove" data-rm="${p.id}" aria-label="Убрать">×</button>
          <a href="perfume.html?id=${p.id}" data-link><div class="cmp__img">${imgTag(p)}</div></a>
          <div class="card__brand">${esc(p.brand)}</div>
          <a class="cmp__name" href="perfume.html?id=${p.id}" data-link>${esc(p.name)}</a>
        </td>`).join('')}</tr>
        ${rows.map(([label, fn]) => `<tr><th>${label}</th>${list.map(p => `<td>${fn(p)}</td>`).join('')}</tr>`).join('')}
      </table>
    </div>
    ${list.length > 1 ? '<p style="margin-top:20px;font-size:13px;color:var(--ink-2)">Жирным выделены общие ноты, ★ — лучший показатель среди выбранных.</p>' : ''}`;
  observeReveal();
}

page.addEventListener('click', e => {
  const rm = e.target.closest('[data-rm]');
  if (rm) { Compare.remove(rm.dataset.rm); render(); }
  if (e.target.id === 'clearAll') { store.set('mp_compare', []); updateCompareBadge(); render(); }
});
document.addEventListener('compare-change', render);
render();
