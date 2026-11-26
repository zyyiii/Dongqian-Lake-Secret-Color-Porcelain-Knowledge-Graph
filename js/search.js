/* ============================================
   知识库与检索模块 - 全局搜索 · 分类浏览 · 详情档案
   ============================================ */

let kbActiveCat = 'all';
let kbSearchQuery = '';
let toastTimer = null;

const KB_CAT_TYPE = {
  '窑址': 'kiln', '人物': 'person', '器物': 'vessel',
  '工艺': 'process', '纹样': 'pattern', '文创': 'cc'
};

const KB_CAT_COLOR = {
  '窑址': '#e07050', '人物': '#6b8ec9', '器物': '#5aad89',
  '工艺': '#f0c060', '纹样': '#c97bbf', '文创': '#e8a840'
};

function initKnowledgeBase() {
  renderKBResults();

  const searchInput = document.getElementById('kbSearch');
  const clearBtn = document.getElementById('kbSearchClear');

  const syncClearVisibility = () => {
    if (clearBtn && searchInput) {
      clearBtn.classList.toggle('visible', searchInput.value.trim().length > 0);
    }
  };

  if (searchInput) {
    searchInput.addEventListener('input', debounce(function() {
      kbSearchQuery = this.value.trim().toLowerCase();
      syncClearVisibility();
      renderKBResults();
    }, 140));
  }

  clearBtn?.addEventListener('click', () => {
    if (!searchInput) return;
    searchInput.value = '';
    kbSearchQuery = '';
    syncClearVisibility();
    renderKBResults();
    searchInput.focus();
  });

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
  const countEl = document.getElementById('kbCount');
  if (!container) return;

  let entries = KB_ENTRIES;

  if (kbActiveCat !== 'all') {
    entries = entries.filter(e => e.cat === kbActiveCat);
  }

  if (kbSearchQuery) {
    entries = entries.filter(e =>
      e.title.toLowerCase().includes(kbSearchQuery) ||
      e.desc.toLowerCase().includes(kbSearchQuery) ||
      e.tags.some(t => t.toLowerCase().includes(kbSearchQuery)) ||
      e.cat.includes(kbSearchQuery)
    );
  }

  if (countEl) {
    const scopeLabel = kbActiveCat === 'all' ? '全部档案' : `「${kbActiveCat}」分类`;
    countEl.textContent = kbSearchQuery
      ? `${scopeLabel}中找到 ${entries.length} 条匹配档案`
      : `${scopeLabel} · 共 ${entries.length} 条知识档案`;
  }

  if (entries.length === 0) {
    container.innerHTML = `
      <div class="kb-empty">
        <svg class="icon-empty" aria-hidden="true"><use href="#icon-search"/></svg>
        <p style="font-size:1rem;color:var(--celadon-800);margin-bottom:0.35rem;">未找到匹配的知识档案</p>
        <p style="font-size:0.84rem;">请尝试更换关键词，或切换至“全部”分类浏览</p>
      </div>
    `;
    return;
  }

  container.innerHTML = entries.map((e, i) => `
    <div class="kb-card fade-in" style="transition-delay:${Math.min(i * 25, 220)}ms" onclick="openKBDetail('${e.id}')" title="点击查看完整档案">
      <div class="kb-card-cat"><span class="cat-dot" style="background:${KB_CAT_COLOR[e.cat] || '#5aad89'}"></span>${e.cat}</div>
      <h4>${highlightMatch(e.title)}</h4>
      <p>${highlightMatch(e.desc)}</p>
      <div style="display:flex;flex-wrap:wrap;gap:0.32rem;margin-bottom:0.85rem;">
        ${e.tags.map(t => `<span style="font-size:0.68rem;padding:0.18rem 0.56rem;border-radius:999px;background:var(--celadon-50);color:var(--celadon-700);">${highlightMatch(t)}</span>`).join('')}
      </div>
      <div class="kb-card-footer">
        <span class="kb-card-source">${e.source} · ${e.year}</span>
        <span class="kb-card-share" onclick="shareKBCard(event, '${e.id}')" title="复制档案摘要">分享</span>
      </div>
    </div>
  `).join('');

  requestAnimationFrame(() => {
    container.querySelectorAll('.kb-card.fade-in').forEach(el => {
      el.classList.add('visible');
    });
  });
}

function highlightMatch(text) {
  if (!kbSearchQuery) return text;
  const regex = new RegExp(`(${escapeRegExp(kbSearchQuery)})`, 'gi');
  return text.replace(regex, '<mark style="background:var(--celadon-100);color:var(--celadon-800);padding:0 3px;border-radius:3px;">$1</mark>');
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 知识卡片与图片/艺术图鉴卡映射
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
  'kb-14': 'process-zhuangxia',
  'kb-15': 'process-caitu',
  'kb-16': 'process-shaoyao',
  'kb-17': 'pattern-lianhe',
  'kb-18': 'pattern-duidie',
  'kb-19': 'pattern-yingwu',
  'kb-20': 'pattern-ying',
  'kb-21': 'ccp-1',
  'kb-22': 'ccp-3',
  'kb-23': 'ccp-5',
  'kb-24': 'ccp-6',
};

function openKBDetail(id) {
  const e = KB_ENTRIES.find(x => x.id === id);
  if (!e) return;

  const imgRef = KB_IMAGE_REF[id] || '';
  const type = KB_CAT_TYPE[e.cat] || 'vessel';
  const color = KB_CAT_COLOR[e.cat] || '#5aad89';
  const imgHtml = imgRef ? `
    <div style="width:100%;height:240px;border-radius:16px;overflow:hidden;margin-bottom:1.5rem;background:var(--celadon-50);">
      ${getImageWithFallback(imgRef, e.title, 'kg-panel-img', type)}
    </div>
  ` : '';

  document.getElementById('modalBody').innerHTML = `
    ${imgHtml}
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.9rem;">
      <span style="display:inline-flex;align-items:center;font-size:0.75rem;padding:0.28rem 0.9rem;border-radius:999px;background:var(--celadon-50);color:var(--celadon-700);"><span class="cat-dot" style="background:${color}"></span>${e.cat}</span>
      <span style="font-size:0.75rem;padding:0.28rem 0.9rem;border-radius:999px;background:rgba(201,169,92,0.18);color:var(--lake-clay-dark);">${e.year}</span>
    </div>
    <h2 style="color:var(--celadon-800);margin-bottom:0.9rem;">${e.title}</h2>
    <p style="font-size:1rem;line-height:1.9;color:var(--text-secondary);margin-bottom:1.4rem;">${e.desc}</p>
    <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1.5rem;">
      ${e.tags.map(t => `<span style="font-size:0.72rem;padding:0.24rem 0.72rem;border-radius:999px;background:var(--celadon-50);color:var(--celadon-700);">${t}</span>`).join('')}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;padding-top:1rem;border-top:1px solid var(--border-color);">
      <span style="font-size:0.8rem;color:var(--text-muted);">来源：${e.source}</span>
      <button class="btn btn-outline" onclick="shareKBCard(event, '${e.id}')">复制分享此档案</button>
    </div>
  `;

  document.getElementById('modalOverlay').classList.add('open');
}

function shareKBCard(event, id) {
  event.stopPropagation();
  const entry = KB_ENTRIES.find(e => e.id === id);
  if (!entry) return;

  const shareText = `【东钱湖秘色瓷知识图谱】${entry.title}——${entry.desc}`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(shareText)
      .then(() => showToast('档案摘要已复制到剪贴板'))
      .catch(() => showToast('已生成档案分享内容'));
  } else {
    showToast('已生成档案分享内容');
  }
}

// Sonner 风格可中断过渡浮层
function showToast(message) {
  let toast = document.querySelector('.celadon-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'celadon-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
