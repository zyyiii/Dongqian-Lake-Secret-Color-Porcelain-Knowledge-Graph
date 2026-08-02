/* ============================================
   知识图谱交互探索 - D3.js Force-Directed Graph
   ============================================ */

let kgSimulation, kgSvg, kgZoom;
let currentPath = 'all';
let selectedNode = null;

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

function initKnowledgeGraph() {
  const container = document.getElementById('kgCanvas');
  const width = container.clientWidth;
  const height = container.clientHeight;

  kgSvg = d3.select('#kgCanvas')
    .append('svg')
    .attr('viewBox', [0, 0, width, height])
    .attr('width', width)
    .attr('height', height);

  // Zoom behavior
  kgZoom = d3.zoom()
    .scaleExtent([0.3, 3])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

  kgSvg.call(kgZoom);

  const g = kgSvg.append('g');

  // Prepare data
  const nodes = KG_NODES.map(n => ({ ...n }));
  const edges = KG_EDGES.map(e => ({
    source: e.source,
    target: e.target,
    path: e.path,
    label: e.label
  }));

  // Arrow markers
  const defs = g.append('defs');
  Object.entries(nodeColors).forEach(([type, color]) => {
    defs.append('marker')
      .attr('id', `arrow-${type}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', color)
      .attr('opacity', 0.5)
      .attr('d', 'M0,-5L10,0L0,5');
  });

  // Edges
  const link = g.append('g')
    .selectAll('line')
    .data(edges)
    .join('line')
    .attr('class', d => `kg-edge edge-${d.path}`)
    .attr('stroke', d => nodeColors[KG_NODES.find(n => n.id === (d.source.id || d.source))?.type] || '#ccc')
    .attr('stroke-width', 1.5)
    .attr('marker-end', d => {
      const sourceNode = KG_NODES.find(n => n.id === (d.source.id || d.source));
      return sourceNode ? `url(#arrow-${sourceNode.type})` : null;
    });

  // Edge labels
  const edgeLabels = g.append('g')
    .selectAll('text')
    .data(edges)
    .join('text')
    .attr('class', 'kg-edge-label')
    .text(d => d.label)
    .attr('font-size', 9)
    .attr('fill', '#9c8e78')
    .attr('text-anchor', 'middle')
    .attr('dy', -5);

  // Nodes
  const node = g.append('g')
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

  // Node circles
  node.append('circle')
    .attr('r', d => d.type === 'lake-clay' ? 16 : d.type === 'person' ? 14 : 11)
    .attr('fill', d => nodeColors[d.type])
    .attr('stroke', d => d3.color(nodeColors[d.type]).darker(0.4))
    .attr('stroke-width', 1.5);

  // Node icons
  node.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('font-size', d => d.type === 'lake-clay' ? 14 : 10)
    .text(d => d.icon || '');

  // Node labels
  node.append('text')
    .attr('dx', d => d.type === 'lake-clay' ? 20 : 15)
    .attr('dy', 4)
    .text(d => d.label)
    .attr('font-size', 11)
    .attr('fill', '#2c2416');

  // Simulation
  kgSimulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(edges).id(d => d.id).distance(120))
    .force('charge', d3.forceManyBody().strength(-400))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(30))
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

  // Click background to deselect
  kgSvg.on('click', () => {
    deselectNode();
  });

  // Tooltip
  node.on('mouseenter', (event, d) => {
    const tooltip = document.getElementById('graphTooltip');
    tooltip.innerHTML = `<strong>${d.label}</strong><br><small>${d.desc?.substring(0, 80)}...</small>`;
    tooltip.style.opacity = '1';
  }).on('mousemove', (event) => {
    const tooltip = document.getElementById('graphTooltip');
    tooltip.style.left = (event.offsetX + 15) + 'px';
    tooltip.style.top = (event.offsetY - 30) + 'px';
  }).on('mouseleave', () => {
    document.getElementById('graphTooltip').style.opacity = '0';
  });

  // Store references
  kgSvg.node()._graphData = { nodes, edges, link, node, edgeLabels, g };
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

function selectNode(d) {
  selectedNode = d;
  const panel = document.getElementById('kgPanel');
  panel.classList.remove('empty');

  let actionsHtml = '';
  if (d.type === 'shard') {
    actionsHtml += `<button class="btn btn-outline" onclick="scrollToSection('compare')">🔍 古今对比</button>`;
  }
  if (d.type === 'vessel' && d.id === 'vessel-dongqianhu') {
    actionsHtml += `<button class="btn btn-outline" onclick="scrollToSection('compare')">🔍 古今对比</button>`;
  }
  if (d.type === 'pattern') {
    actionsHtml += `<button class="btn btn-outline" onclick="scrollToSection('cc-gallery')">🎨 查看应用</button>`;
  }
  if (d.type === 'person') {
    actionsHtml += `<button class="btn btn-outline" onclick="scrollToSection('inheritors')">👤 传承人星谱</button>`;
  }
  if (d.type === 'cc') {
    actionsHtml += `<button class="btn btn-gold" onclick="scrollToSection('cc-gallery')">💰 进入文创廊</button>`;
  }

  panel.innerHTML = `
    <div class="kg-panel-image">${getImageWithFallback(d.id, d.image, 'kg-panel-img')}</div>
    <div class="kg-panel-tag">${d.group || d.type}</div>
    <h3 class="kg-panel-title">${d.label}</h3>
    <p class="kg-panel-desc">${d.detail || d.desc}</p>
    ${d.era ? `<p style="font-size:0.8rem;color:var(--text-muted);">📅 ${d.era}${d.kiln ? ' · ' + d.kiln : ''}${d.role ? ' · ' + d.role : ''}</p>` : ''}
    <div class="kg-panel-actions">${actionsHtml}</div>
  `;

  // Highlight in graph
  highlightConnections(d.id);
}

function deselectNode() {
  selectedNode = null;
  const panel = document.getElementById('kgPanel');
  panel.classList.add('empty');
  panel.innerHTML = `
    <div>
      <div style="font-size:3rem;margin-bottom:1rem;">👆</div>
      <p>点击图谱中的任意节点<br>查看详细信息</p>
    </div>
  `;
  resetHighlights();
}

function highlightConnections(nodeId) {
  const data = kgSvg.node()._graphData;
  if (!data) return;

  const connectedEdges = new Set();
  const connectedNodes = new Set();
  connectedNodes.add(nodeId);

  data.edges.each(function(d) {
    const sourceId = d.source.id || d.source;
    const targetId = d.target.id || d.target;
    if (sourceId === nodeId || targetId === nodeId) {
      connectedEdges.add(d);
      connectedNodes.add(sourceId);
      connectedNodes.add(targetId);
    }
  });

  data.link
    .attr('stroke-opacity', d => connectedEdges.has(d) ? 0.8 : 0.08)
    .attr('stroke-width', d => connectedEdges.has(d) ? 2.5 : 1);

  data.node
    .select('circle')
    .attr('opacity', d => connectedNodes.has(d.id) ? 1 : 0.3);
}

function resetHighlights() {
  const data = kgSvg.node()._graphData;
  if (!data) return;

  data.link
    .attr('stroke-opacity', 0.35)
    .attr('stroke-width', 1.5);

  data.node
    .select('circle')
    .attr('opacity', 1);
}

function highlightPath(pathName) {
  currentPath = pathName;
  const data = kgSvg.node()._graphData;
  if (!data) return;

  document.querySelectorAll('.path-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.path === pathName);
  });

  if (pathName === 'all') {
    data.link
      .attr('stroke-opacity', 0.35)
      .attr('stroke-width', 1.5);
    data.node.select('circle').attr('opacity', 1);
    data.edgeLabels.attr('opacity', 1);
    return;
  }

  const pathEdges = new Set();
  const pathNodes = new Set();

  data.edges.each(function(d) {
    if (d.path === pathName) {
      pathEdges.add(d);
      pathNodes.add(d.source.id || d.source);
      pathNodes.add(d.target.id || d.target);
    }
  });

  data.link
    .attr('stroke-opacity', d => pathEdges.has(d) ? 0.9 : 0.06)
    .attr('stroke-width', d => pathEdges.has(d) ? 3 : 0.8);

  data.node
    .select('circle')
    .attr('opacity', d => pathNodes.has(d.id) ? 1 : 0.15);

  data.edgeLabels
    .attr('opacity', d => pathEdges.has(d) ? 1 : 0);
}

function zoomGraph(factor) {
  if (kgSvg) {
    kgSvg.transition().duration(300).call(kgZoom.scaleBy, factor);
  }
}

function resetGraph() {
  if (kgSvg) {
    kgSvg.transition().duration(500).call(kgZoom.transform, d3.zoomIdentity);
  }
}

// Path toggle buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.path-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      highlightPath(btn.dataset.path);
    });
  });
});
