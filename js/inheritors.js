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
          <div class="inheritor-avatar">${getImageWithFallback(inh.id, inh.name, 'inheritor-avatar-img', 'person')}</div>
          <h3>${inh.name}</h3>
          <p class="inheritor-title">${inh.role}</p>
        </div>
        <div class="inheritor-card-body">
          <p>${inh.desc.substring(0, 120)}...</p>
          <div class="inheritor-tags">
            ${inh.tags.map(t => `<span class="inheritor-tag">${t}</span>`).join('')}
          </div>
          <p style="font-size:0.75rem;color:var(--text-muted);margin-top:0.75rem;">
            ${inh.relation}：${inh.related.join('、')}
          </p>
        </div>
      </div>
    `).join('');
  }

  // Draw inheritor relationship graph
  drawInheritorGraph();
}

let inheritorSvg, inheritorG, inheritorZoom, inheritorSelectedId = null;

// 图谱节点 id → 数据 INHERITORS id 的映射（供右侧面板使用）
const INH_ID_MAP = { wcq: 'inh-1', wgl: 'inh-2', zll: 'inh-3' };

function setInheritorHighlight(d) {
  if (!inheritorG) return;
  const nodeId = d && d.id;

  if (!nodeId) {
    inheritorG.selectAll('g.node').transition().duration(200).style('opacity', 1);
    inheritorG.selectAll('line').transition().duration(200).style('opacity', 0.7);
    inheritorG.selectAll('text.link-label').transition().duration(200).style('opacity', 1);
    inheritorG.selectAll('.node-labels text').transition().duration(200).style('opacity', 1);
    return;
  }

  const connected = new Set([nodeId]);
  inheritorG.selectAll('line').each(function(l) {
    if (l.source.id === nodeId || l.target.id === nodeId) {
      connected.add(l.source.id);
      connected.add(l.target.id);
    }
  });

  inheritorG.selectAll('g.node')
    .transition().duration(200)
    .style('opacity', n => connected.has(n.id) ? 1 : 0.2);

  inheritorG.selectAll('line')
    .transition().duration(200)
    .style('opacity', l => (l.source.id === nodeId || l.target.id === nodeId) ? 1 : 0.08);

  inheritorG.selectAll('text.link-label')
    .transition().duration(200)
    .style('opacity', l => (l.source.id === nodeId || l.target.id === nodeId) ? 1 : 0.15);

  inheritorG.selectAll('.node-labels text')
    .transition().duration(200)
    .style('opacity', n => connected.has(n.id) ? 1 : 0.25);
}

function drawInheritorGraph() {
  const container = document.getElementById('inheritorGraph');
  if (!container) return;
  container.innerHTML = '';

  const width = container.clientWidth;
  const height = container.clientHeight;

  const nodeColors = {
    ancestor: '#c9a95c',
    founder: '#6b8ec9',
    master: '#e07050',
    innovator: '#5aad89',
    product: '#e8a840',
    resource: '#c4a87c'
  };

  const nodes = [
    { id: 'f', label: '范蠡', sub: '陶朱公', type: 'ancestor' },
    { id: 'wcq', label: '闻长庆', sub: '开创者', type: 'founder' },
    { id: 'wgl', label: '闻果立', sub: '代表性传承人', type: 'master' },
    { id: 'zll', label: '赵路路', sub: '新锐传承者', type: 'innovator' },
    { id: 'dp', label: '东钱壶', sub: '文创产品', type: 'product' },
    { id: 'clay', label: '湖泥', sub: '自然馈赠', type: 'resource' },
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

  // 对人物节点补齐头像信息（用于右侧面板）
  nodes.forEach(n => {
    const info = INHERITORS.find(i => i.id === INH_ID_MAP[n.id]);
    if (info) {
      n.role = info.role;
      n.desc = info.desc;
      n.tags = info.tags;
      n.relation = info.relation;
      n.related = info.related;
      n.hasCard = true;
    } else if (n.id === 'f') {
      n.role = '春秋政治家、越国谋臣';
      n.desc = '范蠡助越王勾践灭吴后隐居东钱湖畔，被尊为“陶朱公”。他在此制陶经商的传说，为东钱湖陶瓷文化增添了深厚的历史底蕴。';
      n.tags = ['历史渊源', '东钱湖', '陶朱公'];
      n.relation = '隐居之地';
      n.related = ['东钱湖', '湖泥'];
      n.hasCard = true;
    } else if (n.id === 'dp') {
      n.role = '湖泥文创代表作';
      n.desc = '以东钱湖泥为核心理念设计的文创茶具系列，将非遗技艺与现代生活美学结合，是传承与创新的结晶。';
      n.tags = ['文创产品', '东钱壶', '现代设计'];
      n.relation = '设计创作';
      n.related = ['赵路路'];
      n.hasCard = true;
    } else if (n.id === 'clay') {
      n.role = '核心原料';
      n.desc = '东钱湖泥含微量贝壳屑、铁量偏高，形成秘色青绿中微泛黄的独特韵味，是东钱湖秘色瓷不可替代的自然根基。';
      n.tags = ['湖泥', '自然馈赠', '原料'];
      n.relation = '研究原料';
      n.related = ['闻长庆', '闻果立'];
      n.hasCard = true;
    }
  });

  const svg = d3.select('#inheritorGraph')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('aria-label', '传承人关系图谱');

  inheritorSvg = svg;
  inheritorG = svg.append('g');

  // Zoom
  inheritorZoom = d3.zoom()
    .scaleExtent([0.5, 3])
    .on('zoom', (event) => {
      inheritorG.attr('transform', event.transform);
    });
  svg.call(inheritorZoom);

  // 力导向模拟
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(150))
    .force('charge', d3.forceManyBody().strength(-700))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide().radius(48));

  // Links
  const linkG = inheritorG.append('g').attr('class', 'links');
  const link = linkG.selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', '#d4c5a9')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', d => d.source.id === 'f' ? '6,3' : 'none')
    .attr('opacity', 0.7);

  // Link labels
  const linkLabel = linkG.selectAll('text')
    .data(links)
    .join('text')
    .attr('class', 'link-label')
    .attr('text-anchor', 'middle')
    .attr('font-size', 10)
    .attr('fill', '#9c8e78')
    .text(d => d.label);

  // Nodes
  const nodeG = inheritorG.append('g').attr('class', 'nodes')
    .selectAll('g.node')
    .data(nodes)
    .join('g')
    .attr('class', 'node')
    .style('cursor', 'pointer')
    .call(d3.drag()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x; d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x; d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null; d.fy = null;
      }));

  nodeG.append('circle')
    .attr('r', d => d.type === 'ancestor' ? 26 : 22)
    .attr('fill', d => nodeColors[d.type])
    .attr('stroke', d => d3.color(nodeColors[d.type]).darker(0.3))
    .attr('stroke-width', 2.5);

  nodeG.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('font-size', d => d.type === 'ancestor' ? 14 : 11)
    .attr('fill', '#fff')
    .attr('font-weight', 600)
    .text(d => d.label.charAt(0));

  // Label below node
  const nameLabel = inheritorG.append('g').attr('class', 'node-labels')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .attr('text-anchor', 'middle')
    .attr('font-size', 11)
    .attr('fill', '#5c4c30')
    .attr('font-weight', 600)
    .text(d => d.label);

  const subLabel = inheritorG.append('g').attr('class', 'node-labels')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .attr('text-anchor', 'middle')
    .attr('font-size', 9)
    .attr('fill', '#9c8e78')
    .text(d => d.sub);

  // Click
  nodeG.on('click', (event, d) => {
    event.stopPropagation();
    setInheritorHighlight(d);
    showInheritorDetail(d);
  });

  // Click background to deselect
  svg.on('click', () => {
    setInheritorHighlight(null);
    deselectInheritor();
  });

  // Simulation tick
  simulation.on('tick', () => {
    // Constrain within bounds
    nodes.forEach(d => {
      d.x = Math.max(40, Math.min(width - 40, d.x));
      d.y = Math.max(40, Math.min(height - 40, d.y));
    });

    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    linkLabel
      .attr('x', d => (d.source.x + d.target.x) / 2)
      .attr('y', d => (d.source.y + d.target.y) / 2 - 10);

    nodeG.attr('transform', d => `translate(${d.x},${d.y})`);

    nameLabel
      .attr('x', d => d.x)
      .attr('y', d => d.y + 36);
    subLabel
      .attr('x', d => d.x)
      .attr('y', d => d.y + 50);
  });
}

function showInheritorDetail(d) {
  inheritorSelectedId = d.id;
  const panel = document.getElementById('inheritorPanel');
  if (!panel) return;

  panel.classList.remove('empty');

  const colorMap = {
    ancestor: '#c9a95c',
    founder: '#6b8ec9',
    master: '#e07050',
    innovator: '#5aad89',
    product: '#e8a840',
    resource: '#c4a87c'
  };

  let extra = '';
  if (['wcq', 'wgl', 'zll'].includes(d.id)) {
    extra = `<div style="width:120px;height:120px;border-radius:50%;overflow:hidden;margin:0 auto 1rem;display:flex;align-items:center;justify-content:center;">${getImageWithFallback(INH_ID_MAP[d.id], d.label, '', 'person')}</div>`;
  } else {
    extra = `<div style="width:90px;height:90px;border-radius:50%;background:${colorMap[d.type]};margin:0 auto 1rem;display:flex;align-items:center;justify-content:center;color:#fff;font-size:2rem;font-weight:700;">${d.label.charAt(0)}</div>`;
  }

  const relatedLinks = [
    { source: 'f', target: 'clay', label: '隐居之地' },
    { source: 'wcq', target: 'wgl', label: '父子传承' },
    { source: 'wgl', target: 'zll', label: '师徒授艺' },
    { source: 'zll', target: 'dp', label: '设计创作' },
    { source: 'clay', target: 'dp', label: '原料供给' },
    { source: 'wgl', target: 'clay', label: '研究原料' },
    { source: 'wcq', target: 'clay', label: '研究原料' },
  ].filter(l => l.source === d.id || l.target === d.id);

  const relationHtml = relatedLinks.map(l => {
    const isSrc = l.source === d.id;
    const otherId = isSrc ? l.target : l.source;
    const otherNode = { f: '范蠡', wcq: '闻长庆', wgl: '闻果立', zll: '赵路路', dp: '东钱壶', clay: '湖泥' }[otherId];
    return `<span class="inh-rel-tag">${l.label} · ${otherNode}</span>`;
  }).join('');

  panel.innerHTML = `
    ${extra}
    <div style="text-align:center;margin-bottom:1rem;">
      <h3 style="color:var(--celadon-700);font-size:1.4rem;margin-bottom:0.25rem;">${d.label}</h3>
      <p style="color:${colorMap[d.type]};font-size:0.85rem;font-weight:600;">${d.sub}</p>
    </div>
    <p style="font-size:0.9rem;line-height:1.7;color:var(--text-secondary);margin-bottom:1rem;">${d.desc}</p>
    <div style="margin-bottom:1rem;">${relationHtml}</div>
    <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
      ${d.tags.map(t => `<span class="inheritor-tag">${t}</span>`).join('')}
    </div>
  `;
}

function deselectInheritor() {
  inheritorSelectedId = null;
  setInheritorHighlight(null);
  const panel = document.getElementById('inheritorPanel');
  if (!panel) return;
  panel.classList.add('empty');
  panel.innerHTML = `
    <div>
      <div style="font-size:3rem;margin-bottom:1rem;">👆</div>
      <p>点击星谱中的任意节点<br>查看人物与关联故事</p>
    </div>
  `;
}

function zoomInheritorGraph(scaleFactor) {
  if (!inheritorSvg || !inheritorZoom) return;
  inheritorSvg.transition().duration(300).call(
    inheritorZoom.scaleBy, scaleFactor,
    [inheritorSvg.attr('width') / 2, inheritorSvg.attr('height') / 2]
  );
}

function resetInheritorGraph() {
  if (!inheritorSvg || !inheritorZoom) return;
  inheritorSvg.transition().duration(300).call(inheritorZoom.transform, d3.zoomIdentity);
  deselectInheritor();
}

function openInheritorDetail(id) {
  const inh = INHERITORS.find(i => i.id === id);
  if (!inh) return;

  document.getElementById('modalBody').innerHTML = `
    <div style="text-align:center;margin-bottom:1.5rem;">
      <div style="width:160px;height:160px;border-radius:50%;overflow:hidden;margin:0 auto;">${getImageWithFallback(inh.id, inh.name, '', 'person')}</div>
      <h2 style="color:var(--celadon-700);margin-top:0.5rem;">${inh.name}</h2>
      <p style="font-size:1rem;color:var(--celadon-500);">${inh.role}</p>
    </div>
    <div style="background:var(--celadon-50);padding:1.5rem;border-radius:var(--radius-lg);margin-bottom:1.5rem;">
      <h4 style="color:var(--celadon-700);margin-bottom:0.75rem;">传承关系</h4>
      <p style="font-size:0.95rem;line-height:1.8;color:var(--text-secondary);">
        <strong>${inh.relation}：</strong>${inh.related.join('、')}
      </p>
    </div>
    <p style="font-size:1rem;line-height:1.8;color:var(--text-secondary);margin-bottom:1rem;">${inh.desc}</p>
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.5rem;">
      ${inh.tags.map(t => `<span class="inheritor-tag">${t}</span>`).join('')}
    </div>
    <div style="background:var(--parchment);padding:1.5rem;border-radius:var(--radius-lg);">
      <h4 style="color:var(--celadon-700);margin-bottom:0.75rem;">湖泥心得</h4>
      <p style="font-size:0.9rem;line-height:1.7;color:var(--text-secondary);font-style:italic;">
        "东钱湖泥是大自然给予我们的独一无二的礼物。它的铁含量和贝壳屑比例是任何人工调配都无法复制的。每次触摸湖泥，都能感受到千年前窑工的温度。"
      </p>
    </div>
  `;

  document.getElementById('modalOverlay').classList.add('open');
}
