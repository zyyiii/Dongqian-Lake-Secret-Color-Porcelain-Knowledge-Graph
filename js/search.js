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

  const catIcons = {
    '窑址': '🏛️', '人物': '👤', '器物': '🏺', '工艺': '🔥', '纹样': '🎨', '文创': '💰'
  };

  if (entries.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">
        <div style="font-size:3rem;margin-bottom:1rem;">🔍</div>
        <p>未找到匹配的知识条目</p>
        <p style="font-size:0.85rem;">请尝试其他关键词或分类</p>
      </div>
    `;
    return;
  }

  container.innerHTML = entries.map(e => `
    <div class="kb-card fade-in">
      <div class="kb-card-cat">${catIcons[e.cat] || '📄'} ${e.cat}</div>
      <h4>${highlightMatch(e.title)}</h4>
      <p>${highlightMatch(e.desc)}</p>
      <div style="display:flex;flex-wrap:wrap;gap:0.3rem;margin-bottom:0.75rem;">
        ${e.tags.map(t => `<span style="font-size:0.65rem;padding:0.15rem 0.5rem;border-radius:10px;background:var(--celadon-50);color:var(--celadon-600);">${highlightMatch(t)}</span>`).join('')}
      </div>
      <div class="kb-card-footer">
        <span class="kb-card-source">📚 ${e.source} · ${e.year}</span>
        <span class="kb-card-share" onclick="shareKBCard(event, '${e.id}')" title="分享">📤 分享</span>
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

function shareKBCard(event, id) {
  event.stopPropagation();
  const entry = KB_ENTRIES.find(e => e.id === id);
  if (!entry) return;

  const shareText = `【东钱湖秘色瓷知识图谱】${entry.title}——${entry.desc}`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareText).then(() => {
      showToast('✅ 已复制到剪贴板');
    });
  } else {
    showToast('📤 ' + shareText);
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
