/* ============================================
   时光轴模块 - 水平卷轴 · 快捷定位 · 指针拖拽
   ============================================ */

const TL_IDS = ['tl-donghan','tl-wantang','tl-wudai','tl-beisong-zhong','tl-beisong-wan','tl-1958','tl-2007','tl-2012','tl-2016','tl-2021','tl-2025','tl-2026'];

function initTimeline() {
  const container = document.getElementById('timelineScroll');
  if (!container) return;

  container.innerHTML = TIMELINE_DATA.map((item, i) => `
    <div class="timeline-item fade-in" data-index="${i}" onclick="handleTimelineCardClick(event, ${i})">
      <div class="timeline-dot"></div>
      <div class="timeline-year">${item.year}</div>
      <div class="timeline-era">${item.era}</div>
      <div class="timeline-item-icon">${getImageWithFallback(TL_IDS[i], item.title, 'timeline-thumb', 'kiln')}</div>
      <h4>${item.title}</h4>
      <p>${item.desc}</p>
    </div>
  `).join('');

  setupTimelineControls(container);
  setupTimelineDrag(container);

  // 初始温柔定位到五代-北宋鼎盛段
  setTimeout(() => {
    scrollTimelineToIndex(2, false);
  }, 400);
}

let timelineDragged = false;

function handleTimelineCardClick(event, index) {
  if (timelineDragged) {
    timelineDragged = false;
    return;
  }
  openTimelineDetail(index);
}

function scrollTimelineToIndex(index, smooth = true) {
  const container = document.getElementById('timelineScroll');
  if (!container) return;
  const targetCard = container.querySelector(`.timeline-item[data-index="${index}"]`);
  if (!targetCard) return;

  const left = targetCard.offsetLeft - Math.max(48, (container.clientWidth - targetCard.clientWidth) / 2);
  container.scrollTo({
    left: Math.max(0, left),
    behavior: smooth ? 'smooth' : 'auto'
  });
}

function setupTimelineControls(container) {
  const prevBtn = document.getElementById('timelinePrev');
  const nextBtn = document.getElementById('timelineNext');
  const jumpBtns = document.querySelectorAll('#timelineEraJump .era-jump-btn');

  prevBtn?.addEventListener('click', () => {
    container.scrollBy({ left: -340, behavior: 'smooth' });
  });

  nextBtn?.addEventListener('click', () => {
    container.scrollBy({ left: 340, behavior: 'smooth' });
  });

  jumpBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.target || 0);
      jumpBtns.forEach(b => b.classList.toggle('active', b === btn));
      scrollTimelineToIndex(idx, true);
    });
  });

  // 滚动时同步高亮最近的时代按钮
  container.addEventListener('scroll', () => {
    const centerX = container.scrollLeft + container.clientWidth * 0.45;
    const cards = container.querySelectorAll('.timeline-item');
    let closestIndex = 0;
    let minDiff = Infinity;
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const diff = Math.abs(cardCenter - centerX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    });

    let activeBtn = jumpBtns[0];
    jumpBtns.forEach(btn => {
      const targetIdx = Number(btn.dataset.target || 0);
      if (closestIndex >= targetIdx) activeBtn = btn;
    });
    jumpBtns.forEach(btn => btn.classList.toggle('active', btn === activeBtn));
  }, { passive: true });
}

function setupTimelineDrag(container) {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  container.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    isDown = true;
    timelineDragged = false;
    startX = e.clientX;
    scrollLeft = container.scrollLeft;
    container.classList.add('is-dragging');
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 6) {
      timelineDragged = true;
    }
    container.scrollLeft = scrollLeft - dx;
  });

  window.addEventListener('pointerup', () => {
    if (!isDown) return;
    isDown = false;
    container.classList.remove('is-dragging');
  });
}

function openTimelineDetail(index) {
  const item = TIMELINE_DATA[index];
  if (!item) return;

  document.getElementById('modalBody').innerHTML = `
    <div style="text-align:center;margin-bottom:1.5rem;">
      <div style="width:240px;height:180px;margin:0 auto 1rem;border-radius:16px;overflow:hidden;box-shadow:var(--shadow-md);">${getImageWithFallback(TL_IDS[index], item.title, '', 'kiln')}</div>
      <span style="display:inline-block;padding:0.24rem 0.9rem;border-radius:999px;background:var(--celadon-50);color:var(--celadon-700);font-size:0.78rem;margin-bottom:0.5rem;">${item.year} · ${item.era}</span>
      <h2 style="color:var(--celadon-800);">${item.title}</h2>
    </div>
    <p style="font-size:1rem;line-height:1.9;color:var(--text-secondary);">${item.desc}</p>
    <div style="margin-top:1.75rem;text-align:center;">
      <button class="btn btn-primary" onclick="closeModal();scrollToSection('knowledge-graph');">在知识图谱中继续探索</button>
    </div>
  `;

  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay')?.classList.remove('open');
}

document.getElementById('modalOverlay')?.addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});
