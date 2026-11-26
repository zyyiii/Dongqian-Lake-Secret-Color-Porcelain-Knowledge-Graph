/* ============================================
   主逻辑 - 导航、阅读进度、工艺平滑展开、文创廊、全局初始化
   ============================================ */

// ===== Scroll to section =====
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ===== Navigation & Reading Progress & Back To Top =====
function initNavigation() {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const progressBar = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[data-section]');

  // Mobile toggle
  navToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile nav on link click
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // Back to top button
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 合并单一高效滚动监听
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;

    nav?.classList.toggle('scrolled', y > 40);
    backToTop?.classList.toggle('visible', y > 520);

    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (y / docHeight) * 100)) : 0;
      progressBar.style.width = `${pct}%`;
    }

    let current = 'home';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (y >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('data-section') === current);
    });

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();
}

// ===== Hero 细腻釉光微粒 =====
function initHeroParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 24; i++) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';
    const size = Math.random() * 12 + 4;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = (Math.random() * 96 + 2) + '%';
    particle.style.animationDelay = (-Math.random() * 22) + 's';
    particle.style.animationDuration = (Math.random() * 14 + 14) + 's';
    fragment.appendChild(particle);
  }
  container.appendChild(fragment);
}

// ===== Craft Steps（八大秘色工序 · 平滑展开） =====
function initCraftSteps() {
  const container = document.getElementById('craftSteps');
  if (!container) return;

  container.innerHTML = CRAFT_STEPS.map((step, i) => `
    <div class="craft-step fade-in" data-step="${step.num}" onclick="toggleCraftStep(this)" style="transition-delay:${Math.min(i * 45, 280)}ms">
      <div class="craft-step-num">${String(step.num).padStart(2, '0')}</div>
      <div class="craft-step-top">
        <div class="craft-step-icon">${getImageWithFallback('craft-' + step.num, step.title, 'craft-step-img', 'process')}</div>
        <div>
          <h3>${step.title}</h3>
          <span style="font-size:0.74rem;color:var(--text-muted);">第 ${step.num} 道核心工序</span>
        </div>
      </div>
      <p>${step.desc}</p>
      ${step.clay ? `<span class="clay-badge">东钱湖泥核心环节</span>` : ''}
      <div class="craft-step-toggle">
        <span class="craft-toggle-text">展开工艺详述</span>
        <svg class="icon" aria-hidden="true"><use href="#icon-chevron-down"/></svg>
      </div>
      <div class="craft-expand">
        <div class="craft-expand-inner">
          <p style="font-size:0.86rem;color:var(--text-secondary);line-height:1.78;">${step.detail}</p>
          ${step.clay ? `<p style="font-size:0.8rem;color:var(--lake-clay-dark);margin-top:0.75rem;padding:0.65rem 0.8rem;background:rgba(224,208,176,0.45);border-radius:10px;border-left:3px solid var(--lake-clay);">${step.clay}</p>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function toggleCraftStep(el) {
  const expanded = el.classList.toggle('expanded');
  const label = el.querySelector('.craft-toggle-text');
  if (label) {
    label.textContent = expanded ? '收起工艺详述' : '展开工艺详述';
  }
}

// ===== Cultural Creative Gallery =====
function initCCGallery() {
  const container = document.getElementById('ccGrid');
  if (!container) return;

  renderCCProducts('all');

  document.querySelectorAll('.cc-filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.cc-filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderCCProducts(this.dataset.filter);
    });
  });
}

function renderCCProducts(filter) {
  const container = document.getElementById('ccGrid');
  if (!container) return;

  let products = CC_PRODUCTS;
  if (filter !== 'all') {
    products = products.filter(p => p.cat === filter);
  }

  container.innerHTML = products.map((p, i) => `
    <div class="cc-card fade-in" style="transition-delay:${Math.min(i * 45, 220)}ms" onclick="openCCDetail('${p.id}')">
      <div class="cc-card-visual">${getImageWithFallback(p.id, p.name, 'cc-card-img', 'cc')}</div>
      <div class="cc-card-body">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem;margin-bottom:0.45rem;">
          <h4 style="margin-bottom:0;">${p.name}</h4>
          <span class="cc-meaning-pill">${p.meaning}</span>
        </div>
        <p>${p.desc}</p>
        <div class="cc-design-decode">
          <span>溯源：${p.source}</span>
        </div>
      </div>
    </div>
  `).join('');

  requestAnimationFrame(() => {
    container.querySelectorAll('.cc-card.fade-in').forEach(el => {
      el.classList.add('visible');
    });
  });
}

function openCCDetail(id) {
  const p = CC_PRODUCTS.find(cc => cc.id === id);
  if (!p) return;

  document.getElementById('modalBody').innerHTML = `
    <div style="text-align:center;margin-bottom:1.5rem;">
      <div style="width:260px;height:210px;margin:0 auto 1rem;border-radius:16px;overflow:hidden;box-shadow:var(--shadow-md);">${getImageWithFallback(p.id, p.name, '', 'cc')}</div>
      <h2 style="color:var(--celadon-800);margin-bottom:0.45rem;">${p.name}</h2>
      <span class="cc-meaning-pill">${p.meaning}</span>
    </div>
    <p style="font-size:1rem;line-height:1.85;color:var(--text-secondary);margin-bottom:1.5rem;">${p.desc}</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:1rem;">
      <div style="background:var(--celadon-50);padding:1.35rem;border-radius:16px;border:1px solid var(--celadon-200);">
        <h4 style="color:var(--celadon-800);margin-bottom:0.45rem;font-size:1rem;">传统来源</h4>
        <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.65;">${p.source}</p>
      </div>
      <div style="background:rgba(201,169,92,0.14);padding:1.35rem;border-radius:16px;border:1px solid rgba(201,169,92,0.34);">
        <h4 style="color:var(--lake-clay-dark);margin-bottom:0.45rem;font-size:1rem;">现代设计解码</h4>
        <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.65;">${p.design}</p>
      </div>
    </div>
  `;

  document.getElementById('modalOverlay').classList.add('open');
}

// ===== Scroll Animations =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
}

// ===== Global Init =====
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroParticles();
  initKnowledgeGraph();
  initTimeline();
  initCraftSteps();
  initCompare();
  initInheritors();
  initCCGallery();
  initKnowledgeBase();
  initScrollAnimations();

  setTimeout(() => {
    document.querySelectorAll('.fade-in').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  }, 160);

  console.log('东钱湖秘色瓷知识图谱已就绪');
  console.log('   湖泥与焰火的千年秘语，等待您的探索');
  console.log('   节点数：' + KG_NODES.length + ' | 关系数：' + KG_EDGES.length + ' | 知识条目：' + KB_ENTRIES.length);
});
