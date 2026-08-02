/* ============================================
   传承人星谱模块 - 人物关系图谱 + 详情卡片
   ============================================ */

function initInheritors() {
  // Populate inheritor cards
  const cardsContainer = document.getElementById('inheritorCards');
  if (cardsContainer) {
    cardsContainer.innerHTML = INHERITORS.map(inh => `
      <div class="inheritor-card fade-in" onclick="openInheritorDetail('${inh.id}')">
        <div class="inheritor-card-header">
          <div class="inheritor-avatar">${getImageWithFallback(inh.id, '👤', 'inheritor-avatar-img')}</div>
          <h3>${inh.name}</h3>
          <p class="inheritor-title">${inh.role}</p>
        </div>
        <div class="inheritor-card-body">
          <p>${inh.desc.substring(0, 120)}...</p>
          <div class="inheritor-tags">
            ${inh.tags.map(t => `<span class="inheritor-tag">${t}</span>`).join('')}
          </div>
          <p style="font-size:0.75rem;color:var(--text-muted);margin-top:0.75rem;">
            🔗 ${inh.relation}：${inh.related.join('、')}
          </p>
        </div>
      </div>
    `).join('');
  }

  // Draw inheritor relationship graph
  drawInheritorGraph();
}

function drawInheritorGraph() {
  const container = document.getElementById('inheritorGraph');
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  const svg = d3.select('#inheritorGraph')
    .append('svg')
    .attr('viewBox', [0, 0, width, height])
    .attr('width', width)
    .attr('height', height);

  const g = svg.append('g');

  // Data
  const nodes = [
    { id: 'f', label: '🎓 范蠡\n(陶朱公)', type: 'ancestor', x: width * 0.5, y: height * 0.15 },
    { id: 'wcq', label: '👴 闻长庆', type: 'founder', x: width * 0.3, y: height * 0.45 },
    { id: 'wgl', label: '👨‍🎨 闻果立', type: 'master', x: width * 0.5, y: height * 0.5 },
    { id: 'zll', label: '👩‍🎨 赵路路', type: 'innovator', x: width * 0.7, y: height * 0.65 },
    { id: 'dp', label: '🫖 东钱壶\n(文创产品)', type: 'product', x: width * 0.85, y: height * 0.8 },
    { id: 'clay', label: '🏺 湖泥\n(自然馈赠)', type: 'resource', x: width * 0.2, y: height * 0.8 },
  ];

  const links = [
    { source: 'f', target: 'clay', label: '隐居之地' },
    { source: 'wcq', target: 'wgl', label: '父子传承' },
    { source: 'wgl', target: 'zll', label: '师徒授艺' },
    { source: 'zll', target: 'dp', label: '设计创作' },
    { source: 'clay', target: 'dp', label: '原料供给' },
    { source: 'wgl', target: 'clay', label: '研究原料' },
    { source: 'wcq', target: 'clay', label: '研究原料' },
  ];

  const nodeColors = {
    ancestor: '#c9a95c',
    founder: '#6b8ec9',
    master: '#e07050',
    innovator: '#5aad89',
    product: '#e8a840',
    resource: '#c4a87c'
  };

  // Draw links
  g.selectAll('line')
    .data(links)
    .join('line')
    .attr('x1', d => nodes.find(n => n.id === d.source).x)
    .attr('y1', d => nodes.find(n => n.id === d.source).y)
    .attr('x2', d => nodes.find(n => n.id === d.target).x)
    .attr('y2', d => nodes.find(n => n.id === d.target).y)
    .attr('stroke', '#d4c5a9')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', d => d.source === 'f' ? '6,3' : 'none')
    .attr('opacity', 0.6);

  // Link labels
  g.selectAll('text.link-label')
    .data(links)
    .join('text')
    .attr('class', 'link-label')
    .attr('x', d => (nodes.find(n => n.id === d.source).x + nodes.find(n => n.id === d.target).x) / 2)
    .attr('y', d => (nodes.find(n => n.id === d.source).y + nodes.find(n => n.id === d.target).y) / 2 - 8)
    .attr('text-anchor', 'middle')
    .attr('font-size', 10)
    .attr('fill', '#9c8e78')
    .text(d => d.label);

  // Draw nodes
  const nodeG = g.selectAll('g.node')
    .data(nodes)
    .join('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.x},${d.y})`);

  nodeG.append('circle')
    .attr('r', d => d.type === 'ancestor' ? 22 : 18)
    .attr('fill', d => nodeColors[d.type])
    .attr('stroke', d => d3.color(nodeColors[d.type]).darker(0.3))
    .attr('stroke-width', 2);

  nodeG.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('font-size', d => d.type === 'ancestor' ? 14 : 11)
    .attr('fill', '#fff')
    .text(d => {
      if (d.type === 'ancestor') return '范';
      return d.label.split('\n')[0].replace(/[🎓👴👨‍🎨👩‍🎨🫖🏺]/g, '').charAt(0);
    });

  // Labels below
  nodeG.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', 32)
    .attr('font-size', 10)
    .attr('fill', '#5c4c30')
    .text(d => {
      const parts = d.label.split('\n');
      return parts.length > 1 ? parts[1].replace(/[()]/g, '') : parts[0];
    });

  // Enable drag
  nodeG.call(d3.drag()
    .on('drag', function(event, d) {
      d3.select(this).attr('transform', `translate(${event.x},${event.y})`);
      // Update connected links
      // (simplified - full implementation would need link references)
    }));
}

function openInheritorDetail(id) {
  const inh = INHERITORS.find(i => i.id === id);
  if (!inh) return;

  document.getElementById('modalBody').innerHTML = `
    <div style="text-align:center;margin-bottom:1.5rem;">
      <div style="width:160px;height:160px;border-radius:50%;overflow:hidden;margin:0 auto;">${getImageWithFallback(inh.id, '👤', '')}</div>
      <h2 style="color:var(--celadon-700);margin-top:0.5rem;">${inh.name}</h2>
      <p style="font-size:1rem;color:var(--celadon-500);">${inh.role}</p>
    </div>
    <div style="background:var(--celadon-50);padding:1.5rem;border-radius:var(--radius-lg);margin-bottom:1.5rem;">
      <h4 style="color:var(--celadon-700);margin-bottom:0.75rem;">📋 传承关系</h4>
      <p style="font-size:0.95rem;line-height:1.8;color:var(--text-secondary);">
        <strong>${inh.relation}：</strong>${inh.related.join('、')}
      </p>
    </div>
    <p style="font-size:1rem;line-height:1.8;color:var(--text-secondary);margin-bottom:1rem;">${inh.desc}</p>
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.5rem;">
      ${inh.tags.map(t => `<span class="inheritor-tag">${t}</span>`).join('')}
    </div>
    <div style="background:var(--parchment);padding:1.5rem;border-radius:var(--radius-lg);">
      <h4 style="color:var(--celadon-700);margin-bottom:0.75rem;">💬 湖泥心得</h4>
      <p style="font-size:0.9rem;line-height:1.7;color:var(--text-secondary);font-style:italic;">
        "东钱湖泥是大自然给予我们的独一无二的礼物。它的铁含量和贝壳屑比例是任何人工调配都无法复制的。每次触摸湖泥，都能感受到千年前窑工的温度。"
      </p>
    </div>
  `;

  document.getElementById('modalOverlay').classList.add('open');
}
