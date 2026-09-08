/* ============================================
   时光轴模块 - 水平滚动时间轴
   ============================================ */

const TL_IDS = ['tl-donghan','tl-wantang','tl-wudai','tl-beisong-zhong','tl-beisong-wan','tl-1958','tl-2007','tl-2012','tl-2016','tl-2021','tl-2025','tl-2026'];

function initTimeline() {
  const container = document.getElementById('timelineScroll');
  if (!container) return;

  container.innerHTML = TIMELINE_DATA.map((item, i) => `
    <div class="timeline-item fade-in" data-index="${i}" onclick="openTimelineDetail(${i})">
      <div class="timeline-dot"></div>
      <div class="timeline-year">${item.year}</div>
      <div class="timeline-era">${item.era}</div>
      <div class="timeline-item-icon">${getImageWithFallback(TL_IDS[i], item.icon, 'timeline-thumb')}</div>
      <h4>${item.title}</h4>
      <p>${item.desc}</p>
    </div>
  `).join('');

  // Initial scroll to center (北宋时期)
  setTimeout(() => {
    container.scrollLeft = container.scrollWidth * 0.35;
  }, 500);
}

function openTimelineDetail(index) {
  const item = TIMELINE_DATA[index];
  if (!item) return;

  document.getElementById('modalBody').innerHTML = `
    <div style="text-align:center;margin-bottom:1.5rem;">
      <div style="width:200px;height:200px;margin:0 auto;border-radius:12px;overflow:hidden;">${getImageWithFallback(TL_IDS[index], item.title, '', 'kiln')}</div>
      <h2 style="color:var(--celadon-700);margin-top:0.5rem;">${item.title}</h2>
      <p style="font-size:1.2rem;color:var(--celadon-500);">${item.year} · ${item.era}</p>
    </div>
    <p style="font-size:1rem;line-height:1.8;color:var(--text-secondary);">${item.desc}</p>
    <div style="margin-top:1.5rem;text-align:center;">
      <button class="btn btn-primary" onclick="closeModal();scrollToSection('knowledge-graph');">在知识图谱中探索</button>
    </div>
  `;

  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

document.getElementById('modalOverlay')?.addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});

// Horizontal scroll with mouse wheel
document.getElementById('timelineScroll')?.addEventListener('wheel', function(e) {
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    e.preventDefault();
    this.scrollLeft += e.deltaY;
  }
}, { passive: false });
