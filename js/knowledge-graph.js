/* ============================================
   知识图谱交互探索 - D3.js Force-Directed Graph
   三层玉质节点 · 路径流动光效 · 图例过滤 · 关联漫游
   ============================================ */

let kgSimulation, kgSvg, kgZoom;
let currentPath = 'all';
let selectedNode = null;
const hiddenNodeTypes = new Set();

const nodeColors = {
  'lake-clay': '#c4a87c',
  'kiln': '#e07050',
  'shard': '#d4956b',
  'vessel': '#5aad89',
  'person': '#6b8ec9',
  'pattern': '#c97bbf',
  'process': '#f0c060',
  'cc': '#e8a840'
};

const nodeGlyphs = {
  'lake-clay': '泥',
  'kiln': '窑',
  'shard': '残',
  'vessel': '器',
  'person': '师',
  'pattern': '纹',
  'process': '工',
  'cc': '创'
};

const nodeTypeLabels = {
  'lake-clay': '自然资源',
  'kiln': '古窑址',
  'shard': '出土残片',
  'vessel': '典型器物',
  'person': '传承人',
  'pattern': '经典纹样',
  'process': '工序步骤',
  'cc': '文创产品'
};

function getNodeRadius(d) {
  if (d.type === 'lake-clay') return 19;
  if (d.type === 'person') return 16;
  if (d.type === 'kiln' || d.type === 'vessel') return 14;
  return 12;
}

function initKnowledgeGraph() {
  const container = document.getElementById('kgCanvas');
  if (!container) return;

  const width = container.clientWidth || 720;
  const height = container.clientHeight || 560;

  kgSvg = d3.select('#kgCanvas')
    .append('svg')
    .attr('viewBox', [0, 0, width, height])
    .attr('width', width)
    .attr('height', height);

  const g = kgSvg.append('g');

  kgZoom = d3.zoom()
    .scaleExtent([0.35, 3])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

  kgSvg.call(kgZoom);

  const nodes = KG_NODES.map(n => ({ ...n }));
  const edges = KG_EDGES.map(e => ({
    source: e.source,
    target: e.target,
    path: e.path,
    label: e.label
  }));

  const defs = g.append('defs');
  Object.entries(nodeColors).forEach(([type, color]) => {
    defs.append('marker')
      .attr('id', `arrow-${type}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 23)
      .attr('refY', 0)
      .attr('markerWidth', 5.5)
      .attr('markerHeight', 5.5)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', color)
      .attr('opacity', 0.6)
      .attr('d', 'M0,-4.5L9.5,0L0,4.5Z');
  });

  const link = g.append('g')
    .attr('class', 'kg-edges-layer')
    .selectAll('line')
    .data(edges)
    .join('line')
    .attr('class', d => `kg-edge edge-${d.path}`)
    .attr('stroke', d => {
      const src = KG_NODES.find(n => n.id === (d.source.id || d.source));
      return nodeColors[src?.type] || '#9c8e78';
    })
    .attr('stroke-width', 1.6)
    .attr('marker-end', d => {
      const src = KG_NODES.find(n => n.id === (d.source.id || d.source));
      return src ? `url(#arrow-${src.type})` : null;
    });

  const edgeLabels = g.append('g')
    .attr('class', 'kg-edge-labels-layer')
    .selectAll('text')
    .data(edges)
    .join('text')
    .attr('class', 'kg-edge-label')
    .text(d => d.label)
    .attr('font-size', 9.5)
    .attr('fill', '#7a6c56')
    .attr('text-anchor', 'middle')
    .attr('dy', -4);

  const node = g.append('g')
    .attr('class', 'kg-nodes-layer')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .attr('class', 'kg-node')
    .call(d3.drag()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded))
    .on('click', (event, d) => {
      event.stopPropagation();
      selectNode(d);
    });

  // 柔和外光晕
  node.append('circle')
    .attr('class', 'kg-node-halo')
    .attr('r', d => getNodeRadius(d) + 7)
    .attr('fill', d => nodeColors[d.type])
    .attr('opacity', 0.14);

  // 选中脉冲扩散环
  node.append('circle')
    .attr('class', 'kg-node-pulse')
    .attr('r', d => getNodeRadius(d) + 3)
    .attr('fill', 'none')
    .attr('stroke', d => nodeColors[d.type])
    .attr('stroke-width', 2)
    .attr('opacity', 0);

  // 玉质主圆
  node.append('circle')
    .attr('class', 'kg-node-main')
    .attr('r', d => getNodeRadius(d))
    .attr('fill', d => nodeColors[d.type])
    .attr('stroke', '#ffffff')
    .attr('stroke-width', 2.2);

  // 节点中心单字篆意徽标
  node.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('font-size', d => d.type === 'lake-clay' ? 11.5 : 9.5)
    .attr('fill', '#ffffff')
    .attr('font-weight', 600)
    .style('text-shadow', 'none')
    .text(d => nodeGlyphs[d.type] || '秘');

  // 带白色光晕衬底的节点名称
  node.append('text')
    .attr('class', 'kg-node-label')
    .attr('dx', d => getNodeRadius(d) + 6)
    .attr('dy', 4)
    .text(d => d.label)
    .attr('font-size', 11.5)
    .attr('font-weight', d => (d.type === 'lake-clay' || d.type === 'person') ? 600 : 500)
    .attr('fill', '#2c2416');

  kgSimulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(edges).id(d => d.id).distance(115))
    .force('charge', d3.forceManyBody().strength(-360))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(d => getNodeRadius(d) + 20))
    .on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      edgeLabels
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

  kgSvg.on('click', () => {
    deselectNode();
  });

  // 悬浮精致毛玻璃 Tooltip（带边界防溢出）
  const tooltip = document.getElementById('graphTooltip');
  node.on('mouseenter', (event, d) => {
    if (!tooltip) return;
    const tagColor = nodeColors[d.type] || '#3d9470';
    const tagText = d.group || nodeTypeLabels[d.type] || '';
    const snippet = d.desc ? (d.desc.length > 68 ? d.desc.slice(0, 68) + '…' : d.desc) : '';
    tooltip.innerHTML = `
      <div style="margin-bottom:0.25rem;">
        <span class="tooltip-tag" style="background:${tagColor};">${tagText}</span>
        <strong>${d.label}</strong>
      </div>
      <small style="color:rgba(240,247,244,0.82);">${snippet}</small>
    `;
    tooltip.style.opacity = '1';
  }).on('mousemove', (event) => {
    if (!tooltip) return;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const left = Math.min(x + 16, rect.width - 260);
    const top = Math.max(12, y - 24);
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  }).on('mouseleave', () => {
    if (tooltip) tooltip.style.opacity = '0';
  });

  kgSvg.node()._graphData = { nodes, edges, link, node, edgeLabels, g };

  setupLegendFilters();
}

function setupLegendFilters() {
  const legendItems = document.querySelectorAll('.kg-legend-item[data-type]');
  const resetBtn = document.getElementById('kgLegendReset');

  const toggleType = (item) => {
    const type = item.dataset.type;
    if (!type) return;
    if (hiddenNodeTypes.has(type)) {
      hiddenNodeTypes.delete(type);
      item.classList.remove('dimmed');
    } else {
      hiddenNodeTypes.add(type);
      item.classList.add('dimmed');
    }
    applyGraphVisualState();
  };

  legendItems.forEach(item => {
    item.addEventListener('click', () => toggleType(item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleType(item);
      }
    });
  });

  resetBtn?.addEventListener('click', () => {
    hiddenNodeTypes.clear();
    legendItems.forEach(item => item.classList.remove('dimmed'));
    currentPath = 'all';
    document.querySelectorAll('.path-toggle-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.path === 'all');
    });
    deselectNode();
    applyGraphVisualState();
  });
}

function dragStarted(event, d) {
  if (!event.active) kgSimulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragEnded(event, d) {
  if (!event.active) kgSimulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function focusNodeById(nodeId) {
  const data = kgSvg?.node()?._graphData;
  if (!data) return;
  const target = data.nodes.find(n => n.id === nodeId);
  if (target) {
    selectNode(target);
  }
}

function selectNode(d) {
  selectedNode = d;
  const panel = document.getElementById('kgPanel');
  if (!panel) return;
  panel.classList.remove('empty');

  const data = kgSvg?.node()?._graphData;
  const relatedChips = [];
  if (data) {
    data.edges.forEach(e => {
      const sId = e.source.id || e.source;
      const tId = e.target.id || e.target;
      if (sId === d.id) {
        const other = data.nodes.find(n => n.id === tId);
        if (other) relatedChips.push({ id: other.id, label: other.label, rel: e.label });
      } else if (tId === d.id) {
        const other = data.nodes.find(n => n.id === sId);
        if (other) relatedChips.push({ id: other.id, label: other.label, rel: e.label });
      }
    });
  }

  let actionsHtml = '';
  if (d.type === 'shard' || (d.type === 'vessel' && d.id === 'vessel-dongqianhu')) {
    actionsHtml += `<button class="btn btn-outline" onclick="scrollToSection('compare')">古今对比</button>`;
  }
  if (d.type === 'pattern') {
    actionsHtml += `<button class="btn btn-outline" onclick="scrollToSection('cc-gallery')">查看文创应用</button>`;
  }
  if (d.type === 'person') {
    actionsHtml += `<button class="btn btn-outline" onclick="scrollToSection('inheritors')">传承人星谱</button>`;
  }
  if (d.type === 'cc') {
    actionsHtml += `<button class="btn btn-gold" onclick="scrollToSection('cc-gallery')">进入文创廊</button>`;
  }
  if (d.type === 'process' || d.type === 'lake-clay') {
    actionsHtml += `<button class="btn btn-primary" onclick="scrollToSection('craft')">查看工艺解密</button>`;
  }

  const metaParts = [d.era, d.kiln, d.role].filter(Boolean);
  const relationsHtml = relatedChips.length ? `
    <div class="kg-panel-relations">
      <h5>关联脉络（点击继续漫游）</h5>
      <div>
        ${relatedChips.slice(0, 8).map(r => `
          <button type="button" class="kg-rel-chip" onclick="focusNodeById('${r.id}')">
            <span style="color:var(--text-muted);">${r.rel}</span>
            <span>${r.label}</span>
          </button>
        `).join('')}
      </div>
    </div>
  ` : '';

  panel.innerHTML = `
    <div class="kg-panel-image">${getImageWithFallback(d.id, d.label, 'kg-panel-img', d.type)}</div>
    <div class="kg-panel-tag" style="border:1px solid ${nodeColors[d.type]}44;">${d.group || nodeTypeLabels[d.type] || d.type}</div>
    <h3 class="kg-panel-title">${d.label}</h3>
    ${metaParts.length ? `<div class="kg-panel-meta">${metaParts.join(' · ')}</div>` : ''}
    <p class="kg-panel-desc">${d.detail || d.desc}</p>
    ${relationsHtml}
    <div class="kg-panel-actions">${actionsHtml}</div>
  `;

  applyGraphVisualState();
}

function deselectNode() {
  selectedNode = null;
  const panel = document.getElementById('kgPanel');
  if (panel) {
    panel.classList.add('empty');
    panel.innerHTML = `
      <div class="panel-empty-state">
        <div class="panel-empty-icon"><svg class="icon" aria-hidden="true"><use href="#icon-hand"/></svg></div>
        <h4>探索图谱节点</h4>
        <p>点击左侧画布中的任意节点<br>查看考古档案与关联脉络</p>
      </div>
    `;
  }
  applyGraphVisualState();
}

function applyGraphVisualState() {
  const data = kgSvg?.node()?._graphData;
  if (!data) return;

  const isVisibleNode = (n) => !hiddenNodeTypes.has(n.type);
  const nodeById = new Map(data.nodes.map(n => [n.id, n]));

  // 1) 若存在选中节点，优先聚焦其 1-hop 邻域
  if (selectedNode) {
    const connectedEdges = new Set();
    const connectedNodes = new Set([selectedNode.id]);

    data.edges.forEach(e => {
      const sId = e.source.id || e.source;
      const tId = e.target.id || e.target;
      if (sId === selectedNode.id || tId === selectedNode.id) {
        connectedEdges.add(e);
        connectedNodes.add(sId);
        connectedNodes.add(tId);
      }
    });

    data.link
      .classed('path-active', e => connectedEdges.has(e))
      .attr('stroke-opacity', e => {
        const s = nodeById.get(e.source.id || e.source);
        const t = nodeById.get(e.target.id || e.target);
        if (!isVisibleNode(s) || !isVisibleNode(t)) return 0.03;
        return connectedEdges.has(e) ? 0.92 : 0.07;
      })
      .attr('stroke-width', e => connectedEdges.has(e) ? 2.6 : 1);

    data.edgeLabels
      .attr('opacity', e => connectedEdges.has(e) ? 1 : 0.08);

    data.node
      .classed('selected', n => n.id === selectedNode.id)
      .attr('opacity', n => {
        if (!isVisibleNode(n)) return 0.06;
        return connectedNodes.has(n.id) ? 1 : 0.16;
      });
    return;
  }

  // 2) 若开启路径高亮
  if (currentPath !== 'all') {
    const pathEdges = new Set();
    const pathNodes = new Set();

    data.edges.forEach(e => {
      if (e.path === currentPath) {
        pathEdges.add(e);
        pathNodes.add(e.source.id || e.source);
        pathNodes.add(e.target.id || e.target);
      }
    });

    data.link
      .classed('path-active', e => pathEdges.has(e))
      .attr('stroke-opacity', e => {
        const s = nodeById.get(e.source.id || e.source);
        const t = nodeById.get(e.target.id || e.target);
        if (!isVisibleNode(s) || !isVisibleNode(t)) return 0.03;
        return pathEdges.has(e) ? 0.92 : 0.06;
      })
      .attr('stroke-width', e => pathEdges.has(e) ? 2.8 : 0.9);

    data.edgeLabels
      .attr('opacity', e => pathEdges.has(e) ? 1 : 0);

    data.node
      .classed('selected', false)
      .attr('opacity', n => {
        if (!isVisibleNode(n)) return 0.06;
        return pathNodes.has(n.id) ? 1 : 0.16;
      });
    return;
  }

  // 3) 默认全景状态（遵循图例显隐过滤）
  data.link
    .classed('path-active', false)
    .attr('stroke-opacity', e => {
      const s = nodeById.get(e.source.id || e.source);
      const t = nodeById.get(e.target.id || e.target);
      return (isVisibleNode(s) && isVisibleNode(t)) ? 0.36 : 0.04;
    })
    .attr('stroke-width', 1.6);

  data.edgeLabels
    .attr('opacity', e => {
      const s = nodeById.get(e.source.id || e.source);
      const t = nodeById.get(e.target.id || e.target);
      return (isVisibleNode(s) && isVisibleNode(t)) ? 0.9 : 0.04;
    });

  data.node
    .classed('selected', false)
    .attr('opacity', n => isVisibleNode(n) ? 1 : 0.08);
}

function highlightPath(pathName) {
  currentPath = pathName;
  selectedNode = null;
  document.querySelectorAll('.path-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.path === pathName);
  });
  deselectNode();
}

function zoomGraph(factor) {
  if (kgSvg && kgZoom) {
    kgSvg.transition().duration(260).call(kgZoom.scaleBy, factor);
  }
}

function resetGraph() {
  if (kgSvg && kgZoom) {
    kgSvg.transition().duration(380).call(kgZoom.transform, d3.zoomIdentity);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.path-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      highlightPath(btn.dataset.path);
    });
  });
});
