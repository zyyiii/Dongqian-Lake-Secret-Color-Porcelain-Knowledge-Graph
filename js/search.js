/* ============================================
   知识库与检索模块 - 全局搜索 + 分类浏览
   ============================================ */

let kbActiveCat = 'all';
let kbSearchQuery = '';

function initKnowledgeBase() {
  renderKBResults();

  // Search input
  const searchInput = document.getElementById('kbSearch');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(function() {
      kbSearchQuery = this.value.trim().toLowerCase();
      renderKBResults();
    }, 300));
  }

  // Category buttons
  document.querySelectorAll('.kb-cat-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.kb-cat-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      kbActiveCat = this.dataset.cat;
      renderKBResults();
    });
  });
}

function renderKBResults() {
  const container = document.getElementById('kbResults');
  if (!container) return;

  let entries = KB_ENTRIES;

  // Filter by category
  if (kbActiveCat !== 'all') {
    entries = entries.filter(e => e.cat === kbActiveCat);
  }

  // Filter by search
  if (kbSearchQuery) {
    entries = entries.filter(e =>
      e.title.toLowerCase().includes(kbSearchQuery) ||
      e.desc.toLowerCase().includes(kbSearchQuery) ||
      e.tags.some(t => t.toLowerCase().includes(kbSearchQuery)) ||
      e.cat.includes(kbSearchQuery)
    );
  }

  const catType = {
    '窑址': 'kiln', '人物': 'person', '器物': 'vessel', '工艺': 'process', '纹样': 'pattern', '文创': 'cc'
  };
  const catColor = {
    '窑址': '#e07050', '人物': '#6b8ec9', '器物': '#5aad89', '工艺': '#f0c060', '纹样': '#c97bbf', '文创': '#e8a840'
  };

  if (entries.length === 0) {
    container.innerHTML = `
      <div class="kb-empty">
        <svg class="icon-empty" aria-hidden="true"><use href="#icon-search"/></svg>
        <p>未找到匹配的知识条目</p>
        <p style="font-size:0.85rem;">请尝试其他关键词或分类</p>
      </div>
    `;
    return;
  }

  container.innerHTML = entries.map(e => `
    <div class="kb-card fade-in" onclick="openKBDetail('${e.id}')" title="点击查看详情">
      <div class="kb-card-cat"><span class="cat-dot" style="background:${catColor[e.cat] || '#5aad89'}"></span>${e.cat}</div>
      <h4>${highlightMatch(e.title)}</h4>
      <p>${highlightMatch(e.desc)}</p>
      <div style="display:flex;flex-wrap:wrap;gap:0.3rem;margin-bottom:0.75rem;">
        ${e.tags.map(t => `<span style="font-size:0.65rem;padding:0.15rem 0.5rem;border-radius:10px;background:var(--celadon-50);color:var(--celadon-600);">${highlightMatch(t)}</span>`).join('')}
      </div>
      <div class="kb-card-footer">
        <span class="kb-card-source">${e.source} · ${e.year}</span>
        <span class="kb-card-share" onclick="shareKBCard(event, '${e.id}')" title="分享">分享</span>
      </div>
    </div>
  `).join('');

  // Re-trigger fade-in animations
  setTimeout(() => {
    document.querySelectorAll('.kb-card.fade-in').forEach(el => {
      el.classList.add('visible');
    });
  }, 50);
}

function highlightMatch(text) {
  if (!kbSearchQuery) return text;
  const regex = new RegExp(`(${escapeRegExp(kbSearchQuery)})`, 'gi');
  return text.replace(regex, '<mark style="background:var(--celadon-100);color:var(--celadon-700);padding:0 2px;border-radius:2px;">$1</mark>');
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ===== 知识卡片详情弹窗 =====
// 部分条目关联知识图谱节点图片，丰富详情页视觉
const KB_IMAGE_REF = {
  'kb-1': 'kiln-guojiazhi',
  'kb-2': 'kiln-guotongao',
  'kb-3': 'kiln-shangshuiao',
  'kb-4': 'kiln-laohuyan',
  'kb-5': 'person-wenguoli',
  'kb-6': 'person-zhaolulu',
  'kb-7': 'person-wenchangqing',
  'kb-9': 'vessel-huakouzun',
  'kb-10': 'shard-fengwen',
  'kb-11': 'vessel-quezao',
  'kb-12': 'vessel-dongqianhu',
  'kb-17': 'pattern-lianhe',
  'kb-18': 'pattern-duidie',
  'kb-19': 'pattern-yingwu',
  'kb-20': 'pattern-ying',
  'kb-21': 'vessel-dongqianhu',
};

function openKBDetail(id) {
  const e = KB_ENTRIES.find(x => x.id === id);
  if (!e) return;

  const imgRef = KB_IMAGE_REF[id];
  const imgHtml = imgRef ? `
    <div style="width:100%;height:240px;border-radius:var(--radius-lg);overflow:hidden;margin-bottom:1.5rem;background:var(--celadon-50);">
      ${getImageWithFallback(imgRef, e.title, 'kg-panel-img', catType[e.cat])}
    </div>
  ` : '';

  document.getElementById('modalBody').innerHTML = `
    ${imgHtml}
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem;">
      <span style="font-size:0.75rem;padding:0.3rem 1rem;border-radius:16px;background:var(--celadon-50);color:var(--celadon-600);"><span class="cat-dot" style="background:${catColor[e.cat] || '#5aad89'}"></span>${e.cat}</span>
      <span style="font-size:0.75rem;padding:0.3rem 1rem;border-radius:16px;background:var(--gold-light);color:var(--lake-clay-dark);">${e.year}</span>
    </div>
    <h2 style="color:var(--celadon-700);margin-bottom:1rem;">${e.title}</h2>
    <p style="font-size:1rem;line-height:1.9;color:var(--text-secondary);margin-bottom:1.5rem;">${e.desc}</p>
    <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1.5rem;">
      ${e.tags.map(t => `<span style="font-size:0.7rem;padding:0.25rem 0.7rem;border-radius:14px;background:var(--celadon-50);color:var(--celadon-600);">${t}</span>`).join('')}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;padding-top:1rem;border-top:1px solid var(--border-color);">
      <span style="font-size:0.8rem;color:var(--text-muted);">来源：${e.source}</span>
      <button class="btn btn-outline" onclick="shareKBCard(event, '${e.id}')">分享此卡片</button>
    </div>
  `;

  document.getElementById('modalOverlay').classList.add('open');
}

function shareKBCard(event, id) {
  event.stopPropagation();
  const entry = KB_ENTRIES.find(e => e.id === id);
  if (!entry) return;

  const shareText = `【东钱湖秘色瓷知识图谱】${entry.title}——${entry.desc}`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareText).then(() => {
      showToast('已复制到剪贴板');
    });
  } else {
    showToast(shareText);
  }
}

function showToast(message) {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
    background: rgba(44, 36, 22, 0.9); color: #fff; padding: 0.75rem 1.5rem;
    border-radius: 24px; font-size: 0.9rem; z-index: 3000;
    animation: fadeInUp 0.3s ease;
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Add fadeInUp animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translate(-50%, 20px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
`;
document.head.appendChild(style);
