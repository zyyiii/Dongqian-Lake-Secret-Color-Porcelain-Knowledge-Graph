/* ============================================
   主逻辑 - 导航、滚动、初始化
   ============================================ */

// ===== Scroll to section =====
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ===== Navigation =====
function initNavigation() {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Mobile toggle
  navToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // Scroll shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Active nav link update on scroll
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[data-section]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('data-section') === current);
    });
  });
}

// ===== Hero particles =====
function initHeroParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const shapes = ['circle', 'square', 'triangle'];
  for (let i = 0; i < 25; i++) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';
    const size = Math.random() * 60 + 20;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (Math.random() * 15 + 10) + 's';

    if (Math.random() > 0.5) {
      particle.style.borderRadius = '2px';
      particle.style.background = 'rgba(169, 219, 195, 0.06)';
    }

    container.appendChild(particle);
  }
}

// ===== Craft Steps =====
function initCraftSteps() {
  const container = document.getElementById('craftSteps');
  if (!container) return;

  container.innerHTML = CRAFT_STEPS.map((step, i) => `
    <div class="craft-step fade-in" data-step="${step.num}" onclick="toggleCraftStep(this)" style="animation-delay:${i * 0.1}s">
      <div class="craft-step-num">${String(step.num).padStart(2, '0')}</div>
      <div class="craft-step-icon">${getImageWithFallback('craft-' + step.num, step.title, 'craft-step-img', 'process')}</div>
      <h3>${step.title}</h3>
      <p>${step.desc}</p>
      ${step.clay ? `<span class="clay-badge">${step.clay}</span>` : ''}
      <div class="craft-expand">
        <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.7;">${step.detail}</p>
        ${step.clay ? `<p style="font-size:0.8rem;color:var(--lake-clay-dark);margin-top:0.75rem;padding:0.5rem;background:var(--lake-clay-light);border-radius:var(--radius-sm);">${step.clay}</p>` : ''}
      </div>
    </div>
  `).join('');
}

function toggleCraftStep(el) {
  el.classList.toggle('expanded');
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

  container.innerHTML = products.map(p => `
    <div class="cc-card fade-in" onclick="openCCDetail('${p.id}')">
      <div class="cc-card-visual">${getImageWithFallback(p.id, p.name, 'cc-card-img', 'cc')}</div>
      <div class="cc-card-body">
        <h4>${p.name}</h4>
        <p>${p.desc}</p>
        <div class="cc-design-decode">
          <span>来源：${p.source}</span>
          <span>${p.design}</span>
        </div>
        <div style="margin-top:0.75rem;">
          <span style="font-size:0.7rem;padding:0.2rem 0.6rem;border-radius:10px;background:var(--gold-light);color:var(--gold);">${p.meaning}</span>
        </div>
      </div>
    </div>
  `).join('');

  setTimeout(() => {
    document.querySelectorAll('.cc-card.fade-in').forEach(el => {
      el.classList.add('visible');
    });
  }, 50);
}

function openCCDetail(id) {
  const p = CC_PRODUCTS.find(cc => cc.id === id);
  if (!p) return;

  document.getElementById('modalBody').innerHTML = `
    <div style="text-align:center;margin-bottom:1.5rem;">
      <div style="width:240px;height:240px;margin:0 auto;border-radius:12px;overflow:hidden;">${getImageWithFallback(p.id, p.name, '', 'cc')}</div>
      <h2 style="color:var(--celadon-700);margin-top:0.5rem;">${p.name}</h2>
      <span style="display:inline-block;padding:0.3rem 1rem;border-radius:16px;background:var(--gold-light);color:var(--gold);margin-top:0.5rem;">${p.meaning}</span>
    </div>
    <p style="font-size:1rem;line-height:1.8;color:var(--text-secondary);margin-bottom:1.5rem;">${p.desc}</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
      <div style="background:var(--celadon-50);padding:1.5rem;border-radius:var(--radius-lg);">
        <h4 style="color:var(--celadon-700);margin-bottom:0.5rem;">传统来源</h4>
        <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.6;">${p.source}</p>
      </div>
      <div style="background:var(--gold-light);padding:1.5rem;border-radius:var(--radius-lg);">
        <h4 style="color:var(--lake-clay-dark);margin-bottom:0.5rem;">现代设计</h4>
        <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.6;">${p.design}</p>
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
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

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

  // Trigger initial visible elements
  setTimeout(() => {
    document.querySelectorAll('.fade-in').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  }, 200);

  console.log('东钱湖秘色瓷知识图谱已就绪');
  console.log('   湖泥与焰火的千年秘语，等待您的探索');
  console.log('   节点数：' + KG_NODES.length + ' | 关系数：' + KG_EDGES.length + ' | 知识条目：' + KB_ENTRIES.length);
});
