// Portfolio interactions — 페이지에 해당 요소가 있을 때만 켜진다.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ---- TOC: 현재 읽는 섹션 강조
  const tocLinks = $$('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const map = new Map(tocLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          tocLinks.forEach((a) => a.classList.remove('active'));
          map.get(e.target.id)?.classList.add('active');
        });
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    map.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  }

  // ---- Lightbox
  const lb = $('.lightbox');
  if (lb) {
    const img = $('img', lb);
    const cap = $('.cap', lb);
    $$('[data-zoom]').forEach((btn) =>
      btn.addEventListener('click', () => {
        img.src = btn.dataset.zoom;
        img.alt = btn.dataset.caption || '';
        cap.textContent = btn.dataset.caption || '';
        lb.classList.add('open');
        lb.focus();
      }),
    );
    const close = () => lb.classList.remove('open');
    lb.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  // ---- Game embed: 클릭 전엔 iframe을 만들지 않는다 (소리·로딩 방지)
  $$('.embed[data-src]').forEach((box) => {
    const btn = $('.facade', box);
    btn?.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.src = box.dataset.src;
      f.title = box.dataset.title || 'game';
      f.allow = 'autoplay; fullscreen; gamepad';
      f.allowFullscreen = true;
      box.replaceChildren(f);
      f.focus();
    });
  });

  // ---- Chart: 도네이션 간격 곡선 (마왕 채널)
  const dChart = $('#donation-chart');
  if (dChart) {
    const W = 640, H = 260, L = 44, R = 16, T = 30, B = 36;
    const interval = (v) => Math.min(25, Math.max(12, 40 - 6 * Math.log10(Math.max(1, v))));
    const xs = (lg) => L + ((lg - 0) / 6) * (W - L - R); // log10 viewers 0..6
    const ys = (s) => T + ((30 - s) / 20) * (H - T - B); // 10..30s
    let d = '';
    for (let i = 0; i <= 120; i++) {
      const lg = (i / 120) * 6;
      d += `${i ? 'L' : 'M'}${xs(lg).toFixed(1)},${ys(interval(10 ** lg)).toFixed(1)}`;
    }
    const ticksX = [0, 1, 2, 3, 4, 5, 6].map((lg) => `<line class="grid" x1="${xs(lg)}" x2="${xs(lg)}" y1="${T}" y2="${H - B}"/><text x="${xs(lg)}" y="${H - B + 18}" text-anchor="middle">${['1', '10', '100', '1K', '10K', '100K', '1M'][lg]}</text>`).join('');
    const ticksY = [10, 15, 20, 25, 30].map((s) => `<line class="grid" x1="${L}" x2="${W - R}" y1="${ys(s)}" y2="${ys(s)}"/><text x="${L - 8}" y="${ys(s) + 4}" text-anchor="end">${s}s</text>`).join('');
    const pts = [[100, '100명'], [1000, '1,000명'], [10000, '10,000명']].map(([v, l]) => {
      const x = xs(Math.log10(v)), y = ys(interval(v));
      return `<circle cx="${x}" cy="${y}" r="4.5" fill="var(--accent)"/><text class="val" x="${x + 8}" y="${y - 9}">${l} · ${interval(v).toFixed(0)}초</text>`;
    }).join('');
    dChart.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="시청자 수에 따른 도네이션 간격: 100명 이하 25초, 1,000명 22초, 10,000명 16초, 100,000명 이상 12초">
      <text class="title" x="${L}" y="16">시청자 수 → 도네이션 간격</text>
      ${ticksY}${ticksX}
      <line class="axis" x1="${L}" x2="${W - R}" y1="${H - B}" y2="${H - B}"/>
      <path d="${d}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round"/>
      ${pts}
    </svg>`;
  }

  // ---- Demo: 감각을 팔면 화면이 바뀐다 (23)
  const demo = $('#sense-demo');
  if (demo) {
    const stage = $('.stage', demo);
    const img = $('img', stage);
    const fog = $('.fog', stage);
    const colors = $('#colors', demo);
    const colorsOut = $('#colors-out', demo);
    const state = { black: false, white: false, smell: false };
    const vignette = document.createElement('div');
    vignette.style.cssText = 'position:absolute;inset:0;pointer-events:none;transition:box-shadow .35s ease';
    stage.appendChild(vignette);
    const render = () => {
      const c = +colors.value; // 남은 색 채널 수 (7 → 3)
      const sat = 0.12 + ((c - 3) / 4) * 0.88;
      const f = [`saturate(${sat.toFixed(2)})`];
      if (c <= 3) f.push('brightness(.92)');
      if (state.black && state.white) f.push('contrast(.45)', 'brightness(1.05)');
      else if (state.black) f.push('contrast(.7)', 'brightness(1.2)');
      else if (state.white) f.push('contrast(.8)', 'brightness(.75)');
      img.style.filter = f.join(' ');
      stage.classList.toggle('shake', state.black && state.white);
      vignette.style.boxShadow = c <= 3 ? 'inset 0 0 120px 40px rgba(0,0,0,.85)' : 'none'; // 색 3개 이하 → 비네팅
      fog.classList.toggle('on', state.smell);
      colorsOut.value = `${c}/7`;
    };
    colors.addEventListener('input', render);
    $$('.toggle', demo).forEach((t) =>
      t.addEventListener('click', () => {
        const k = t.dataset.k;
        state[k] = !state[k];
        t.setAttribute('aria-pressed', String(state[k]));
        render();
      }),
    );
    render();
  }

  // ---- Calculator: 거짓말 간파 확률 (23)
  const calc = $('#lie-calc');
  if (calc) {
    const sus = $('#sus', calc), aff = $('#aff', calc);
    const out = $('#p-out', calc), susOut = $('#sus-out', calc), affOut = $('#aff-out', calc), note = $('#p-note', calc);
    const run = () => {
      const s = +sus.value / 100, a = +aff.value;
      const p = s * (1 - (a + 100) / 400);
      susOut.value = s.toFixed(2);
      affOut.value = a > 0 ? `+${a}` : `${a}`;
      out.textContent = `${Math.round(p * 100)}%`;
      note.textContent = p >= 0.5 ? '발각 확률이 더 높음. 이 손님에게는 속임 비추천' : p >= 0.25 ? '발각 가능성 있음' : '거의 안 걸림. 그래서 더 찜찜한 선택';
    };
    sus.addEventListener('input', run);
    aff.addEventListener('input', run);
    run();
  }
})();
