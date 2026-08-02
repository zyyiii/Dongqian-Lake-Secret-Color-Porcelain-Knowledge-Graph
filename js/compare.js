/* ============================================
   古今对话对比模块 - 拖拽对比
   ============================================ */

let compareSlots = { left: null, right: null };

function initCompare() {
  // Populate shard items
  const shardContainer = document.getElementById('shardItems');
  if (shardContainer) {
    shardContainer.innerHTML = SHARD_ITEMS.map(item => `
      <div class="compare-item shard-item" draggable="true"
           data-id="${item.id}" data-side="shard"
           data-name="${item.name}" data-era="${item.era}"
           data-desc="${item.desc}" data-icon="${item.icon}">
        <div class="compare-item-icon">${getImageWithFallback(item.id, item.icon, 'compare-thumb')}</div>
        <div class="compare-item-name">${item.name}</div>
        <div class="compare-item-meta">${item.era} · ${item.kiln}</div>
      </div>
    `).join('');
  }

  // Populate modern items
  const modernContainer = document.getElementById('modernItems');
  if (modernContainer) {
    modernContainer.innerHTML = MODERN_ITEMS.map(item => `
      <div class="compare-item modern-item" draggable="true"
           data-id="${item.id}" data-side="modern"
           data-name="${item.name}" data-maker="${item.maker}"
           data-desc="${item.desc}" data-icon="${item.icon}">
        <div class="compare-item-icon">${getImageWithFallback(item.id, item.icon, 'compare-thumb')}</div>
        <div class="compare-item-name">${item.name}</div>
        <div class="compare-item-meta">${item.maker}</div>
      </div>
    `).join('');
  }

  // Setup drag & drop
  setupDragDrop();

  // Setup filters
  setupCompareFilters();

  // Setup opacity slider
  const opacitySlider = document.getElementById('overlayOpacity');
  const opacityVal = document.getElementById('opacityVal');
  if (opacitySlider && opacityVal) {
    opacitySlider.addEventListener('input', () => {
      opacityVal.textContent = opacitySlider.value + '%';
    });
  }
}

function setupDragDrop() {
  document.querySelectorAll('.compare-item[draggable]').forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
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

function handleDragEnd(e) {
  this.classList.remove('dragging');
  draggedItem = null;
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  this.classList.add('drag-over');
}

function handleDragLeave(e) {
  this.classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  this.classList.remove('drag-over');

  if (!draggedItem) return;

  let targetSlot;
  if (this.classList.contains('compare-slot')) {
    targetSlot = this;
  } else if (this.id === 'compareZone') {
    // Default to left slot for shards, right for modern
    targetSlot = draggedItem.dataset.side === 'shard'
      ? document.getElementById('slotLeft')
      : document.getElementById('slotRight');
  }

  if (!targetSlot) return;

  const side = targetSlot.dataset.slot;
  const expectedSide = (side === 'left') ? 'shard' : 'modern';

  // Only allow correct side
  if (draggedItem.dataset.side !== expectedSide) {
    // Allow cross-drop with visual feedback
    targetSlot.style.animation = 'none';
    targetSlot.offsetHeight;
    targetSlot.style.animation = '';
  }

  // Update slot
  const data = {
    id: draggedItem.dataset.id,
    name: draggedItem.dataset.name,
    desc: draggedItem.dataset.desc,
    icon: draggedItem.dataset.icon,
    era: draggedItem.dataset.era || '',
    maker: draggedItem.dataset.maker || '',
    side: draggedItem.dataset.side
  };

  compareSlots[side] = data;
  targetSlot.classList.add('filled');
  targetSlot.innerHTML = `<div style="width:100%;height:80%;overflow:hidden;border-radius:8px;">${getImageWithFallback(data.id, data.icon, '')}</div><small>${data.name}</small>`;

  updateCompareNotes();
}

function updateCompareNotes() {
  const notesDiv = document.getElementById('compareNotes');
  if (!notesDiv) return;

  const left = compareSlots.left;
  const right = compareSlots.right;

  if (left && right) {
    notesDiv.innerHTML = `
      <div style="background:var(--celadon-50);padding:1rem;border-radius:var(--radius-md);">
        <h4 style="color:var(--celadon-700);margin-bottom:0.5rem;">📋 对比分析</h4>
        <p><strong>📜 ${left.name}</strong>（${left.era}）</p>
        <p style="font-size:0.8rem;color:var(--text-muted);">${left.desc}</p>
        <p style="margin-top:0.5rem;"><strong>✨ ${right.name}</strong>（${right.maker}）</p>
        <p style="font-size:0.8rem;color:var(--text-muted);">${right.desc}</p>
        <hr style="border-color:var(--border-color);margin:0.75rem 0;">
        <p style="font-size:0.8rem;color:var(--celadon-600);">💡 调整上方透明度滑块，观察器型吻合度与釉色差异</p>
        <p style="font-size:0.75rem;color:var(--text-muted);">🔬 考古说明：${left.name}出土于东钱湖窑场，代表了当时的工艺水平。现代复刻在传承基础上融入了当代审美与改良工艺。</p>
      </div>
    `;
  } else if (left || right) {
    const item = left || right;
    notesDiv.innerHTML = `
      <p style="font-size:0.85rem;color:var(--text-secondary);">已选择 <strong>${item.name}</strong>，请拖入${left ? '右侧新作' : '左侧残片'}完成对比。</p>
    `;
  }
}

function setupCompareFilters() {
  // Shard filters
  document.querySelectorAll('#shardGallery .compare-filter').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#shardGallery .compare-filter').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filterItems('shard', this.dataset.filter);
    });
  });

  // Modern filters
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
    const data = gallery === 'shard' ? SHARD_ITEMS.find(s => s.id === item.dataset.id) : MODERN_ITEMS.find(m => m.id === item.dataset.id);
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
