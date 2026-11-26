/* ============================================
   古今对话对比模块 - 点击/拖拽选入 · 卷帘剖切 · 叠影透视
   ============================================ */

let compareSlots = { left: null, right: null };
let compareMode = 'curtain'; // 'curtain' | 'blend'
let compareValue = 50;

function initCompare() {
  const shardContainer = document.getElementById('shardItems');
  if (shardContainer) {
    shardContainer.innerHTML = SHARD_ITEMS.map(item => `
      <div class="compare-item shard-item" draggable="true"
           data-id="${item.id}" data-side="shard"
           data-name="${item.name}" data-era="${item.era}"
           data-desc="${item.desc}" title="点击或拖拽至鉴赏台">
        <div class="compare-item-icon">${getImageWithFallback(item.id, item.name, 'compare-thumb', 'shard')}</div>
        <div class="compare-item-name">${item.name}</div>
        <div class="compare-item-meta">${item.era} · ${item.kiln}</div>
      </div>
    `).join('');
  }

  const modernContainer = document.getElementById('modernItems');
  if (modernContainer) {
    modernContainer.innerHTML = MODERN_ITEMS.map(item => `
      <div class="compare-item modern-item" draggable="true"
           data-id="${item.id}" data-side="modern"
           data-name="${item.name}" data-maker="${item.maker}"
           data-desc="${item.desc}" title="点击或拖拽至鉴赏台">
        <div class="compare-item-icon">${getImageWithFallback(item.id, item.name, 'compare-thumb', 'cc')}</div>
        <div class="compare-item-name">${item.name}</div>
        <div class="compare-item-meta">${item.maker}</div>
      </div>
    `).join('');
  }

  setupDragDrop();
  setupCompareFilters();
  setupCompareStageControls();

  // 默认预载一组高清实拍经典对照，开箱即享卷帘对比
  const defaultShard = SHARD_ITEMS[0];
  const defaultModern = MODERN_ITEMS[0];
  if (defaultShard) setCompareSlot('left', toSlotData(defaultShard, 'shard'));
  if (defaultModern) setCompareSlot('right', toSlotData(defaultModern, 'modern'));
}

function toSlotData(item, side) {
  return {
    id: item.id,
    name: item.name,
    desc: item.desc,
    era: item.era || '',
    maker: item.maker || '',
    side
  };
}

function setupDragDrop() {
  document.querySelectorAll('.compare-item').forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('click', function() {
      const targetSide = this.dataset.side === 'shard' ? 'left' : 'right';
      setCompareSlot(targetSide, {
        id: this.dataset.id,
        name: this.dataset.name,
        desc: this.dataset.desc,
        era: this.dataset.era || '',
        maker: this.dataset.maker || '',
        side: this.dataset.side
      });
    });
  });

  document.querySelectorAll('.compare-slot').forEach(slot => {
    slot.addEventListener('dragover', handleDragOver);
    slot.addEventListener('dragleave', handleDragLeave);
    slot.addEventListener('drop', handleDrop);
  });

  const compareZone = document.getElementById('compareZone');
  if (compareZone) {
    compareZone.addEventListener('dragover', handleDragOver);
    compareZone.addEventListener('dragleave', handleDragLeave);
    compareZone.addEventListener('drop', handleDrop);
  }
}

let draggedItem = null;

function handleDragStart(e) {
  draggedItem = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', this.dataset.id);
}

function handleDragEnd() {
  this.classList.remove('dragging');
  draggedItem = null;
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  this.classList.add('drag-over');
}

function handleDragLeave() {
  this.classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  this.classList.remove('drag-over');
  if (!draggedItem) return;

  let targetSide;
  if (this.classList.contains('compare-slot')) {
    targetSide = this.dataset.slot;
  } else {
    targetSide = draggedItem.dataset.side === 'shard' ? 'left' : 'right';
  }

  setCompareSlot(targetSide, {
    id: draggedItem.dataset.id,
    name: draggedItem.dataset.name,
    desc: draggedItem.dataset.desc,
    era: draggedItem.dataset.era || '',
    maker: draggedItem.dataset.maker || '',
    side: draggedItem.dataset.side
  });
}

function setCompareSlot(side, data) {
  compareSlots[side] = data;

  const targetSlot = document.getElementById(side === 'left' ? 'slotLeft' : 'slotRight');
  if (targetSlot) {
    targetSlot.classList.add('filled');
    const visualType = data.side === 'shard' ? 'shard' : 'cc';
    targetSlot.innerHTML = `
      <div style="width:100%;height:78%;overflow:hidden;border-radius:8px;">
        ${getImageWithFallback(data.id, data.name, '', visualType)}
      </div>
      <small style="font-size:0.7rem;color:var(--celadon-800);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;">${data.name}</small>
    `;
  }

  syncSelectedHighlight();
  renderCompareStage();
  updateCompareNotes();
}

function syncSelectedHighlight() {
  const leftId = compareSlots.left?.id;
  const rightId = compareSlots.right?.id;
  document.querySelectorAll('.compare-item').forEach(el => {
    const isSel = (el.dataset.side === 'shard' && el.dataset.id === leftId) ||
                  (el.dataset.side === 'modern' && el.dataset.id === rightId);
    el.classList.toggle('selected', isSel);
  });
}

function setupCompareStageControls() {
  const slider = document.getElementById('overlayOpacity');
  const stageLayers = document.getElementById('compareStageLayers');
  const modeBtns = document.querySelectorAll('.compare-mode-btn');

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      compareMode = btn.dataset.mode;
      modeBtns.forEach(b => b.classList.toggle('active', b === btn));
      const label = document.getElementById('compareSliderLabel');
      if (label) {
        label.textContent = compareMode === 'curtain' ? '卷帘位置' : '叠影透明';
      }
      applyCompareVisual();
    });
  });

  slider?.addEventListener('input', () => {
    compareValue = Number(slider.value);
    applyCompareVisual();
  });

  // 1:1 指针拖拽卷帘（Apple Design: Pointer Events + setPointerCapture）
  if (stageLayers) {
    let draggingCurtain = false;

    const updateFromClientX = (clientX) => {
      const rect = stageLayers.getBoundingClientRect();
      if (!rect.width) return;
      const pct = Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)));
      compareValue = pct;
      if (slider) slider.value = String(pct);
      applyCompareVisual();
    };

    stageLayers.addEventListener('pointerdown', (e) => {
      draggingCurtain = true;
      stageLayers.setPointerCapture?.(e.pointerId);
      updateFromClientX(e.clientX);
    });

    stageLayers.addEventListener('pointermove', (e) => {
      if (!draggingCurtain) return;
      updateFromClientX(e.clientX);
    });

    const endDrag = () => { draggingCurtain = false; };
    stageLayers.addEventListener('pointerup', endDrag);
    stageLayers.addEventListener('pointercancel', endDrag);
  }
}

function renderCompareStage() {
  const emptyEl = document.getElementById('compareStageEmpty');
  const layersEl = document.getElementById('compareStageLayers');
  const leftLayer = document.getElementById('compareLayerLeft');
  const rightLayer = document.getElementById('compareLayerRight');
  const badgeLeft = document.getElementById('compareBadgeLeft');
  const badgeRight = document.getElementById('compareBadgeRight');

  const left = compareSlots.left;
  const right = compareSlots.right;

  if (!left || !right) {
    if (emptyEl) emptyEl.style.display = 'flex';
    if (layersEl) layersEl.style.display = 'none';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (layersEl) layersEl.style.display = 'block';

  if (leftLayer) {
    leftLayer.innerHTML = getImageWithFallback(left.id, left.name, '', 'shard');
  }
  if (rightLayer) {
    rightLayer.innerHTML = getImageWithFallback(right.id, right.name, '', 'cc');
  }
  if (badgeLeft) badgeLeft.textContent = `古 · ${left.name}`;
  if (badgeRight) badgeRight.textContent = `今 · ${right.name}`;

  applyCompareVisual();
}

function applyCompareVisual() {
  const rightLayer = document.getElementById('compareLayerRight');
  const divider = document.getElementById('compareCurtainDivider');
  const valEl = document.getElementById('opacityVal');

  if (valEl) valEl.textContent = `${compareValue}%`;
  if (!rightLayer) return;

  if (compareMode === 'curtain') {
    rightLayer.style.opacity = '1';
    rightLayer.style.clipPath = `inset(0 0 0 ${compareValue}%)`;
    if (divider) {
      divider.style.display = 'block';
      divider.style.left = `${compareValue}%`;
    }
  } else {
    rightLayer.style.clipPath = 'inset(0 0 0 0)';
    rightLayer.style.opacity = String(compareValue / 100);
    if (divider) divider.style.display = 'none';
  }
}

function updateCompareNotes() {
  const notesDiv = document.getElementById('compareNotes');
  if (!notesDiv) return;

  const left = compareSlots.left;
  const right = compareSlots.right;

  if (left && right) {
    notesDiv.innerHTML = `
      <div style="background:linear-gradient(145deg, var(--celadon-50), #f8f3e7);padding:1rem 1.1rem;border-radius:14px;border:1px solid rgba(90,173,137,0.22);">
        <h4 style="color:var(--celadon-800);margin-bottom:0.45rem;font-size:0.95rem;">古今鉴赏笔记</h4>
        <p style="margin-bottom:0.25rem;"><strong>古 · ${left.name}</strong>（${left.era || '出土标本'}）</p>
        <p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:0.55rem;">${left.desc}</p>
        <p style="margin-bottom:0.25rem;"><strong>今 · ${right.name}</strong>（${right.maker || '当代新作'}）</p>
        <p style="font-size:0.78rem;color:var(--text-muted);">${right.desc}</p>
        <hr style="border:none;border-top:1px solid rgba(201,169,92,0.3);margin:0.7rem 0;">
        <p style="font-size:0.76rem;color:var(--celadon-700);line-height:1.6;">拖动上方画框或滑块，即可在卷帘剖切与叠影透视之间对比千年釉色、器型轮廓与匠心延续。</p>
      </div>
    `;
  } else if (left || right) {
    const item = left || right;
    notesDiv.innerHTML = `
      <p style="font-size:0.84rem;color:var(--text-secondary);text-align:center;">已选入 <strong>${item.name}</strong>，请再点击或拖入${left ? '右侧新作' : '左侧残片'}开启对比。</p>
    `;
  }
}

function setupCompareFilters() {
  document.querySelectorAll('#shardGallery .compare-filter').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#shardGallery .compare-filter').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filterItems('shard', this.dataset.filter);
    });
  });

  document.querySelectorAll('#modernGallery .compare-filter').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#modernGallery .compare-filter').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filterItems('modern', this.dataset.filter);
    });
  });
}

function filterItems(gallery, filter) {
  const items = document.querySelectorAll(`#${gallery === 'shard' ? 'shardItems' : 'modernItems'} .compare-item`);
  items.forEach(item => {
    if (filter === 'all') {
      item.style.display = '';
      return;
    }
    const data = gallery === 'shard'
      ? SHARD_ITEMS.find(s => s.id === item.dataset.id)
      : MODERN_ITEMS.find(m => m.id === item.dataset.id);
    if (!data) { item.style.display = ''; return; }

    let match = false;
    if (gallery === 'shard') {
      if (filter === 'wudai' && data.era?.includes('五代')) match = true;
      if (filter === 'beisong' && data.era?.includes('北宋')) match = true;
      if (filter === 'bowl' && data.type === 'bowl') match = true;
      if (filter === 'vase' && data.type === 'vase') match = true;
    } else {
      if (filter === 'tea' && data.type === 'tea') match = true;
      if (filter === 'incense' && data.type === 'incense') match = true;
      if (filter === 'vase-modern' && data.type === 'vase-modern') match = true;
    }
    item.style.display = match ? '' : 'none';
  });
}
