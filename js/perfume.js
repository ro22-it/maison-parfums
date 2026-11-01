/* ============ Страница аромата ============ */
mountChrome();
pageEnter();
document.body.dataset.solid = '1';
document.querySelector('.header').classList.add('solid');

const params = new URLSearchParams(location.search);
const p = byId(params.get('id')) || PERFUMES[0];
document.title = `${p.name} — ${p.brand} — Maison Parfums`;

const seasonsText = p.seasons.map(s => LABELS.seasons[s].toLowerCase());
const joinRu = arr => arr.length > 1 ? arr.slice(0, -1).join(', ') + ' и ' + arr[arr.length - 1] : arr[0] || '';

/* ---------- Кому подойдёт и когда носить — собираем из характеристик ---------- */
function whoText() {
  const g = { m: 'Мужчинам', f: 'Девушкам и женщинам', u: 'И мужчинам, и женщинам' }[p.gender];
  const top = p.accords.slice(0, 2).map(a => a.name);
  const char = p.sil >= 4 ? 'кто любит быть заметным и не боится ярких ароматов' : p.sil <= 2 ? 'кто любит ненавязчивые ароматы «для себя»' : 'кто ценит баланс: аромат слышно, но он не давит';
  return `${g}, ${char}. Главное настроение — ${joinRu(top)}.`;
}
function whenText() {
  const t = p.times.length === 2 ? 'днём и вечером' : p.times[0] === 'd' ? 'днём' : 'вечером';
  return `Лучше всего — ${joinRu(seasonsText)}, ${t}. Подходит для поводов: ${p.occ.map(o => LABELS.occ[o].toLowerCase()).join(', ')}.`;
}
function howText() {
  if (p.sil >= 5) return 'Очень мощный — хватит 1–2 пшиков на шею или запястья.';
  if (p.sil >= 4) return '2–3 пшика: на шею и запястья. В закрытом помещении — поменьше.';
  if (p.lon <= 2) return 'Держится недолго — наносите на одежду и возьмите с собой маленький флакон.';
  return '3–4 пшика на шею, запястья и одежду — аромат будет звучать весь день.';
}
function tipText() {
  if (p.tip) return p.tip;
  const warm = p.seasons.every(s => s === 'w' || s === 'a');
  const hot = p.seasons.every(s => s === 'u' || s === 's');
  if (warm) return 'Тяжеловат для жары — лучше носить в прохладную погоду';
  if (hot) return 'Лёгкий и свежий — в мороз может «потеряться»';
  return 'Универсальный — можно носить круглый год';
}

/* ---------- Отзывы ---------- */
const allReviews = () => store.get('mp_reviews', {});
const reviewsOf = id => allReviews()[id] || [];

function meter(v) { return `<div class="meter">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= v ? 'on' : ''}" style="transition-delay:${i * 80}ms"></i>`).join('')}</div>`; }
function noteTier(label, list) {
  return `<div class="tier"><div class="tier__label">${label}</div>
    <div class="tier__notes">${list.map((n, i) => `<span class="note-link" data-note-info="${esc(n)}" role="button" tabindex="0" style="transition-delay:${i * 90}ms">${esc(n)}</span>`).join('')}</div></div>`;
}

function render() {
  const n = p.notes;
  // у некоторых ароматов всего одна нота — тогда показываем её одним ярусом
  const pyramid = n.top.length || n.base.length
    ? noteTier('Верхние ноты', n.top) + noteTier('Ноты сердца', n.mid) + noteTier('Базовые ноты', n.base)
    : `<div class="tier" style="width:100%;clip-path:none"><div class="tier__label">Единственная нота</div><div class="tier__notes">${n.mid.map(x => `<span class="note-link" data-note-info="${esc(x)}" role="button" tabindex="0">${esc(x)}</span>`).join('')}</div></div>`;

  document.getElementById('page').innerHTML = `
  <section class="p-hero">
    <div class="p-hero__media">
      <span class="big-initial">${esc(p.name[0])}</span>
      ${imgTag(p, true)}
      <span class="photo-credit">Фото: Fragrantica</span>
    </div>
    <div class="p-hero__info">
      <div class="crumbs"><a href="index.html#catalog" data-link class="link-u" style="position:relative">Каталог</a><span>/</span><span>${esc(p.brand)}</span></div>
      <h1 class="p-title">${esc(p.name)}</h1>
      <div class="p-brand">${esc(p.brand)}</div>
      <div class="p-meta">
        <div><small>Год</small><b>${p.year}</b></div>
        <div><small>Концентрация</small><b>${LABELS.conc[p.conc]}</b></div>
        <div><small>Для кого</small><b>${LABELS.gender[p.gender]}</b></div>
      </div>
      <p class="p-short">${esc(p.short)}</p>
      <div class="p-vols">
        <div class="filter__label">Объёмы</div>
        <div class="chips">${p.vols.map(v => `<span class="chip">${v} мл</span>`).join('')}</div>
      </div>
      <div class="p-actions">
        <button class="btn" data-cmp="${p.id}" data-on="В сравнении ✓" data-off="Добавить к сравнению">${Compare.has(p.id) ? 'В сравнении ✓' : 'Добавить к сравнению'}</button>
        <a class="btn btn--ghost" href="#similar">Похожие ароматы</a>
      </div>
    </div>
  </section>

  <section class="p-section">
    <div class="p-section__grid reveal">
      <h2 class="p-section__title"><small>01</small>Об аромате</h2>
      <p class="p-desc">${esc(p.desc)}</p>
    </div>
  </section>

  <section class="p-section">
    <div class="p-section__grid">
      <h2 class="p-section__title reveal"><small>02</small>Пирамида нот</h2>
      <div class="pyramid reveal">${pyramid}</div>
    </div>
  </section>

  <section class="p-section">
    <div class="p-section__grid">
      <h2 class="p-section__title reveal"><small>03</small>Основные аккорды</h2>
      <div class="accords reveal" id="accords">
        ${p.accords.map(a => { const c = accordColor(a.name); return `<div class="accord"><div class="accord__bar" data-w="${a.value}" style="background:${c};color:${textOn(c)}"><span>${esc(a.name)}</span></div></div>`; }).join('')}
      </div>
    </div>
  </section>

  <section class="p-section">
    <div class="p-section__grid">
      <h2 class="p-section__title reveal"><small>04</small>Характеристики</h2>
      <div class="specs reveal">
        <div class="spec"><small>Стойкость</small>${meter(p.lon)}<div class="spec__val">${LABELS.lon[p.lon]} · ${LABELS.lonHours[p.lon]}</div></div>
        <div class="spec"><small>Шлейф</small>${meter(p.sil)}<div class="spec__val">${LABELS.sil[p.sil]}</div></div>
        <div class="spec"><small>Сезон</small><div class="chips">${['w', 's', 'u', 'a'].map(s => `<span class="chip ${p.seasons.includes(s) ? 'on' : ''}">${LABELS.seasons[s]}</span>`).join('')}</div></div>
        <div class="spec"><small>Время суток</small><div class="chips">${['d', 'n'].map(s => `<span class="chip ${p.times.includes(s) ? 'on' : ''}">${LABELS.times[s]}</span>`).join('')}</div></div>
        <div class="spec"><small>Тип аромата</small><div class="spec__val">${esc(p.family)}</div></div>
        <div class="spec"><small>Повод</small><div class="chips">${p.occ.map(o => `<span class="chip">${LABELS.occ[o]}</span>`).join('')}</div></div>
      </div>
    </div>
  </section>

  <section class="p-section">
    <div class="p-section__grid">
      <h2 class="p-section__title reveal"><small>05</small>Кому подойдёт</h2>
      <div class="fit reveal">
        <div class="fit__card">${ICONS.person}<h4>Кому</h4><p>${esc(whoText())}</p></div>
        <div class="fit__card">${ICONS.calendar}<h4>Когда</h4><p>${esc(whenText())}</p></div>
        <div class="fit__card">${ICONS.clock}<h4>Как наносить</h4><p>${esc(howText())}</p></div>
        <div class="fit__tip">${ICONS.info}<span>${esc(tipText())}</span></div>
      </div>
    </div>
  </section>

  <section class="p-section" id="reviews">
    <div class="p-section__grid">
      <h2 class="p-section__title reveal"><small>06</small>Отзывы и оценки</h2>
      <div class="reveal">
        <div class="rating-sum" id="ratingSum"></div>
        <form class="review-form" id="reviewForm" novalidate>
          <div class="row">
            <div class="filter__label" style="margin:0">Ваша оценка</div>
            <div class="star-input">
              ${[5, 4, 3, 2, 1].map(i => `<input type="radio" name="r" id="r${i}" value="${i}"><label for="r${i}" title="${i}">${ICONS.star}</label>`).join('')}
            </div>
          </div>
          <input type="text" name="name" placeholder="Ваше имя" maxlength="40">
          <textarea name="text" placeholder="Как вам аромат? На что похож, сколько держится, получали ли комплименты…" maxlength="1000"></textarea>
          <div class="row">
            <span class="form-err" id="formErr"></span>
            <button class="btn" type="submit">Оставить отзыв</button>
          </div>
        </form>
        <div class="reviews" id="reviewsList"></div>
      </div>
    </div>
  </section>

  <section class="p-section" id="similar">
    <div style="max-width:1300px;margin:0 auto">
      <div class="section-head reveal" style="margin-bottom:40px">
        <div><div class="kicker">Если понравился этот</div><h2 class="h2" style="font-size:clamp(40px,5vw,72px)">Похожие <em>ароматы</em></h2></div>
      </div>
      <div class="rail">${similarTo(p, 8).map(cardHTML).join('')}</div>
    </div>
  </section>`;

  renderReviews();
  observeReveal();
  // полоски аккордов растут при появлении
  new IntersectionObserver((en, ob) => {
    if (!en[0].isIntersecting) return;
    document.querySelectorAll('.accord__bar').forEach((b, i) => setTimeout(() => { b.style.width = b.dataset.w + '%'; }, i * 90));
    ob.disconnect();
  }, { threshold: .3 }).observe(document.getElementById('accords'));
}

function renderReviews() {
  const list = reviewsOf(p.id);
  const sum = document.getElementById('ratingSum');
  if (list.length) {
    const avg = list.reduce((s, r) => s + r.rating, 0) / list.length;
    sum.innerHTML = `<b>${avg.toFixed(1)}</b><div>${starsHTML(avg)}<div style="color:var(--ink-2);font-size:13px;margin-top:6px">${list.length} ${plural(list.length, 'оценка', 'оценки', 'оценок')}</div></div>`;
  } else {
    sum.innerHTML = `<p class="reviews-empty">Пока нет ни одной оценки — будьте первым.</p>`;
  }
  document.getElementById('reviewsList').innerHTML = list.slice().reverse().map(r => `
    <div class="review">
      <div class="review__who"><b>${esc(r.name)}</b><small>${new Date(r.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</small></div>
      <div>${starsHTML(r.rating)}<p class="review__text" style="margin-top:8px">${esc(r.text)}</p></div>
    </div>`).join('');
}

document.addEventListener('submit', e => {
  if (e.target.id !== 'reviewForm') return;
  e.preventDefault();
  const f = e.target, err = document.getElementById('formErr');
  const rating = +(f.querySelector('input[name=r]:checked')?.value || 0);
  const name = f.name.value.trim(), text = f.text.value.trim();
  if (!rating) { err.textContent = 'Поставьте оценку звёздами'; return; }
  if (!name) { err.textContent = 'Напишите, как вас зовут'; return; }
  if (text.length < 5) { err.textContent = 'Отзыв слишком короткий'; return; }
  err.textContent = '';
  const all = allReviews();
  (all[p.id] = all[p.id] || []).push({ name, rating, text, date: Date.now() });
  store.set('mp_reviews', all);
  f.reset();
  renderReviews();
  toast('Спасибо! Отзыв сохранён');
});

// «Похожие» на странице аромата ведут на главную с подборкой — тут просто листаем к блоку
document.addEventListener('click', e => {
  const b = e.target.closest('[data-similar]');
  if (b) location.href = `perfume.html?id=${b.dataset.similar}#similar`;
});

render();
if (location.hash) setTimeout(() => { const t = document.querySelector(location.hash); t && smoothScrollTo(t.offsetTop - 60, 900); }, 300);
