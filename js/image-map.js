/* ============================================
   图片映射与宋韵青瓷艺术图鉴卡系统
   ============================================ */

const GALLERY = 'picture/';

// ===== 精确真实图片匹配表（仅映射真实实拍素材，彻底移除 null.jpg） =====
const IMAGE_MAP = {
  // --- 知识图谱节点 ---
  'clay':                     'dongqianhuni.jpg',

  // 古窑址
  'kiln-guojiazhi':           'guojiazhi.jpg',
  'kiln-guotongao':           'guojiaao.jpg',
  'kiln-shangshuiao':         'shangshuiao.jpg',

  // 出土残片
  'shard-fengwen':            'fengwenxiangxungai.jpg',
  'shard-lianban':            'chonglianbanwen.jpg',
  'shard-mugua':              'mojieyu.jpg',

  // 典型器物
  'vessel-dongqianhu':        'dongqianhu.jpg',
  'vessel-huakouzun':         'huakoulianban.jpg',
  'vessel-quezao':            'queraomudan.jpg',

  // 传承人
  'person-wenguoli':          'wenguoli.jpg',
  'person-zhaolulu':          'zhaolulu.jpg',
  'person-wenchangqing':      'wenchangqing.jpg',

  // 纹样
  'pattern-lianhe':           'lianhewen.jpg',
  'pattern-duidie':           'duidiewen.jpg',
  'pattern-yingwu':           'yingwuwen.jpg',
  'pattern-ying':             'yingwen.jpg',

  // 工序步骤（启用项目内已有实拍）
  'process-caitu':            'caihuni.jpg',
  'craft-1':                  'caihuni.jpg',

  // 文创产品（启用东钱壶实拍）
  'cc-dongqianhu':            'dongqianhu.jpg',
  'ccp-1':                    'dongqianhu.jpg',

  // --- 时光轴事件（匹配对应真实考古/器物/人物照片） ---
  'tl-wudai':                 'mojieyu.jpg',
  'tl-beisong-zhong':         'huakoulianban.jpg',
  'tl-1958':                  'guojiazhi.jpg',
  'tl-2007':                  'guojiaao.jpg',
  'tl-2012':                  'wenguoli.jpg',
  'tl-2016':                  'shangshuiao.jpg',
  'tl-2025':                  'dongqianhu.jpg',
  'tl-2026':                  'zhaolulu.jpg',

  // --- 古今对比: 古代残片 ---
  's1':                       'fengwenxiangxungai.jpg',
  's2':                       'chonglianbanwen.jpg',
  's3':                       'huakoulianban.jpg',
  's4':                       'mojieyu.jpg',
  's6':                       'queraomudan.jpg',

  // --- 古今对比: 现代新作 ---
  'm1':                       'dongqianhu.jpg',

  // --- 传承人 ---
  'inh-1':                    'wenchangqing.jpg',
  'inh-2':                    'wenguoli.jpg',
  'inh-3':                    'zhaolulu.jpg',
};

// ===== 宋韵工笔线描艺术图鉴库（无实拍条目自动呈现博物馆级青瓷美学视觉卡） =====
const ART_MOTIFS = {
  kiln: {
    palette: 'linear-gradient(145deg, #27483b 0%, #3d6b57 52%, #5c8a72 100%)',
    accent: '#e8d5a3',
    svg: `<path d="M18 68 Q40 42 64 56 T104 48" stroke="currentColor" stroke-width="1.6" fill="none" opacity="0.55"/>
          <path d="M24 68 C24 44, 46 30, 62 30 C78 30, 96 44, 96 68" stroke="currentColor" stroke-width="2" fill="none"/>
          <path d="M46 68 C46 54, 52 46, 62 46 C72 46, 78 54, 78 68" stroke="currentColor" stroke-width="1.6" fill="none"/>
          <path d="M62 24 C59 18, 66 14, 62 8" stroke="#e8d5a3" stroke-width="1.6" fill="none" stroke-linecap="round"/>
          <line x1="16" y1="68" x2="104" y2="68" stroke="currentColor" stroke-width="1.5" opacity="0.7"/>`
  },
  wash: {
    palette: 'linear-gradient(145deg, #1d4a44 0%, #2f6f64 55%, #5b9a8b 100%)',
    accent: '#cfe8dc',
    svg: `<path d="M32 34 L36 62 C36 68 84 68 84 62 L88 34 Z" stroke="currentColor" stroke-width="1.8" fill="none"/>
          <ellipse cx="60" cy="34" rx="28" ry="6" stroke="currentColor" stroke-width="1.8" fill="none"/>
          <path d="M36 46 Q48 41 60 46 T84 46" stroke="#e8d5a3" stroke-width="1.5" fill="none"/>
          <path d="M40 55 Q50 51 60 55 T80 55" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.65"/>
          <circle cx="60" cy="18" r="2.2" fill="#e8d5a3"/>
          <path d="M60 22 L60 28" stroke="#e8d5a3" stroke-width="1.4" stroke-dasharray="2 2"/>`
  },
  wheel: {
    palette: 'linear-gradient(145deg, #4b3d2b 0%, #7a6144 52%, #a88c66 100%)',
    accent: '#f2e4c8',
    svg: `<path d="M46 22 C46 18 74 18 74 22 C74 28 69 32 72 40 C76 48 74 56 68 60 L52 60 C46 56 44 48 48 40 C51 32 46 28 46 22 Z" stroke="currentColor" stroke-width="1.8" fill="none"/>
          <ellipse cx="60" cy="64" rx="32" ry="7" stroke="#e8d5a3" stroke-width="1.6" fill="none"/>
          <ellipse cx="60" cy="68" rx="36" ry="7" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.5"/>
          <path d="M34 38 C28 38 28 46 36 46" stroke="#e8d5a3" stroke-width="1.3" fill="none" opacity="0.7"/>
          <path d="M86 38 C92 38 92 46 84 46" stroke="#e8d5a3" stroke-width="1.3" fill="none" opacity="0.7"/>`
  },
  carve: {
    palette: 'linear-gradient(145deg, #1d4939 0%, #2f7259 55%, #559c7f 100%)',
    accent: '#e8d5a3',
    svg: `<path d="M60 18 C50 32 48 46 60 62 C72 46 70 32 60 18 Z" stroke="currentColor" stroke-width="1.8" fill="none"/>
          <path d="M60 62 C44 54 34 40 36 26 C46 32 54 44 60 62 Z" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.8"/>
          <path d="M60 62 C76 54 86 40 84 26 C74 32 66 44 60 62 Z" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.8"/>
          <path d="M24 68 Q60 60 96 68" stroke="#e8d5a3" stroke-width="1.4" fill="none"/>
          <circle cx="60" cy="40" r="2.2" fill="#e8d5a3"/>`
  },
  glaze: {
    palette: 'linear-gradient(145deg, #14382a 0%, #25644b 50%, #489777 100%)',
    accent: '#d7f0e4',
    svg: `<path d="M48 20 H72 L68 30 C82 36 84 56 72 66 H48 C36 56 38 36 52 30 Z" stroke="currentColor" stroke-width="1.9" fill="none"/>
          <path d="M44 43 Q52 49 60 44 T76 46" stroke="#e8d5a3" stroke-width="1.5" fill="none"/>
          <path d="M56 32 C56 38 52 40 52 44 C52 46 54 47 56 47 C58 47 60 46 60 44" stroke="#d7f0e4" stroke-width="1.3" fill="none" opacity="0.8"/>
          <line x1="42" y1="66" x2="78" y2="66" stroke="currentColor" stroke-width="1.6"/>`
  },
  saggar: {
    palette: 'linear-gradient(145deg, #3b3228 0%, #5c4f3e 48%, #2e5e4b 100%)',
    accent: '#e8d5a3',
    svg: `<rect x="30" y="24" width="60" height="44" rx="6" stroke="currentColor" stroke-width="1.8" fill="none"/>
          <line x1="26" y1="34" x2="94" y2="34" stroke="#e8d5a3" stroke-width="2"/>
          <path d="M44 42 C44 54 50 60 60 60 C70 60 76 54 76 42 Z" stroke="#b9e4cf" stroke-width="1.8" fill="none"/>
          <line x1="52" y1="60" x2="68" y2="60" stroke="#e8d5a3" stroke-width="1.6"/>
          <circle cx="34" cy="34" r="2" fill="#e8d5a3"/><circle cx="86" cy="34" r="2" fill="#e8d5a3"/>`
  },
  fire: {
    palette: 'linear-gradient(145deg, #3c2219 0%, #6e3b26 48%, #2a5b46 100%)',
    accent: '#f0c060',
    svg: `<path d="M60 16 C48 28 42 40 44 52 C46 62 52 68 60 68 C68 68 74 62 76 52 C78 40 72 28 60 16 Z" stroke="#f0c060" stroke-width="1.8" fill="none"/>
          <path d="M60 32 C54 40 52 48 54 56 C55 61 57 64 60 64 C63 64 65 61 66 56 C68 48 66 40 60 32 Z" stroke="currentColor" stroke-width="1.6" fill="none"/>
          <path d="M22 68 Q40 58 60 68 T98 64" stroke="currentColor" stroke-width="1.4" fill="none" opacity="0.6"/>`
  },
  crackle: {
    palette: 'linear-gradient(145deg, #1b4b39 0%, #317a5e 52%, #68b092 100%)',
    accent: '#e8d5a3',
    svg: `<circle cx="60" cy="44" r="24" stroke="currentColor" stroke-width="1.8" fill="none"/>
          <path d="M46 26 L58 42 L78 36 M58 42 L50 64 M58 42 L72 60 M40 44 L58 42" stroke="#e8d5a3" stroke-width="1.3" fill="none" opacity="0.85"/>
          <circle cx="60" cy="44" r="29" stroke="currentColor" stroke-width="1" stroke-dasharray="3 4" fill="none" opacity="0.5"/>`
  },
  cup: {
    palette: 'linear-gradient(145deg, #184232 0%, #2c6c53 55%, #559c7f 100%)',
    accent: '#e8d5a3',
    svg: `<path d="M34 36 C36 54 46 64 60 64 C74 64 84 54 86 36 Z" stroke="currentColor" stroke-width="1.9" fill="none"/>
          <ellipse cx="60" cy="36" rx="26" ry="5.5" stroke="currentColor" stroke-width="1.6" fill="none"/>
          <path d="M50 64 L48 69 H72 L70 64" stroke="#e8d5a3" stroke-width="1.6" fill="none"/>
          <path d="M54 26 Q52 20 56 15 M66 24 Q64 18 68 13" stroke="#e8d5a3" stroke-width="1.4" fill="none" stroke-linecap="round"/>`
  },
  incense: {
    palette: 'linear-gradient(145deg, #17362b 0%, #2b5d4a 52%, #5c8a72 100%)',
    accent: '#e8d5a3',
    svg: `<path d="M38 42 C38 56 46 62 60 62 C74 62 82 56 82 42 Z" stroke="currentColor" stroke-width="1.8" fill="none"/>
          <path d="M40 42 C44 28 76 28 80 42" stroke="#e8d5a3" stroke-width="1.6" fill="none"/>
          <path d="M46 62 L42 70 M74 62 L78 70 M60 62 L60 70" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          <path d="M60 28 C54 20 68 16 60 8" stroke="#e8d5a3" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
  },
  vase: {
    palette: 'linear-gradient(145deg, #153c2e 0%, #2a6a52 54%, #5aa386 100%)',
    accent: '#e8d5a3',
    svg: `<path d="M51 18 H69 L65 28 C78 33 80 48 70 66 H50 C40 48 42 33 55 28 Z" stroke="currentColor" stroke-width="1.9" fill="none"/>
          <path d="M47 46 Q60 40 73 46" stroke="#e8d5a3" stroke-width="1.3" fill="none" opacity="0.8"/>
          <path d="M60 18 Q68 10 76 12" stroke="#e8d5a3" stroke-width="1.4" fill="none" stroke-linecap="round"/>
          <circle cx="77" cy="12" r="2" fill="#e8d5a3"/>`
  },
  pendant: {
    palette: 'linear-gradient(145deg, #1b3d35 0%, #2f6b5d 50%, #72b09c 100%)',
    accent: '#f0dcad',
    svg: `<path d="M60 12 L60 26" stroke="#f0dcad" stroke-width="1.6"/>
          <circle cx="60" cy="29" r="3.5" stroke="#f0dcad" stroke-width="1.5" fill="none"/>
          <polygon points="60,34 78,48 70,68 50,68 42,48" stroke="currentColor" stroke-width="1.8" fill="none"/>
          <path d="M52 44 L62 52 L72 48 M62 52 L57 65" stroke="#f0dcad" stroke-width="1.2" fill="none"/>`
  },
  gift: {
    palette: 'linear-gradient(145deg, #2a3d31 0%, #46614d 48%, #9d8049 100%)',
    accent: '#f3dfaa',
    svg: `<rect x="28" y="24" width="64" height="42" rx="5" stroke="currentColor" stroke-width="1.8" fill="none"/>
          <circle cx="60" cy="45" r="13" stroke="#f3dfaa" stroke-width="1.7" fill="none"/>
          <rect x="55" y="40" width="10" height="10" stroke="#f3dfaa" stroke-width="1.5" fill="none"/>
          <path d="M28 36 H46 M74 36 H92 M28 54 H46 M74 54 H92" stroke="currentColor" stroke-width="1.2" opacity="0.6"/>`
  },
  mark: {
    palette: 'linear-gradient(145deg, #244537 0%, #3a6c56 54%, #6a9981 100%)',
    accent: '#f0d8a3',
    svg: `<circle cx="60" cy="44" r="24" stroke="currentColor" stroke-width="1.8" fill="none"/>
          <circle cx="60" cy="44" r="18" stroke="#f0d8a3" stroke-width="1.2" stroke-dasharray="2 3" fill="none"/>
          <text x="60" y="49" text-anchor="middle" fill="#f0d8a3" font-size="14" font-family="'Noto Serif SC', serif" letter-spacing="2">内坊</text>`
  },
  sail: {
    palette: 'linear-gradient(145deg, #16373a 0%, #285d5b 52%, #4e8b7d 100%)',
    accent: '#e8d5a3',
    svg: `<path d="M30 56 Q60 66 90 56 L82 64 H38 Z" stroke="currentColor" stroke-width="1.7" fill="none"/>
          <path d="M58 54 V20 C72 26 76 42 74 54" stroke="#e8d5a3" stroke-width="1.7" fill="none"/>
          <path d="M54 54 V28 C44 34 42 44 44 54" stroke="currentColor" stroke-width="1.4" fill="none" opacity="0.8"/>
          <path d="M22 70 Q40 65 60 70 T98 70" stroke="currentColor" stroke-width="1.3" fill="none" opacity="0.6"/>`
  },
  museum: {
    palette: 'linear-gradient(145deg, #173a2c 0%, #2a654d 52%, #529377 100%)',
    accent: '#e8d5a3',
    svg: `<path d="M22 38 Q60 18 98 38" stroke="#e8d5a3" stroke-width="2" fill="none"/>
          <path d="M30 40 V64 M48 40 V64 M72 40 V64 M90 40 V64" stroke="currentColor" stroke-width="1.7"/>
          <line x1="20" y1="64" x2="100" y2="64" stroke="currentColor" stroke-width="2"/>
          <line x1="26" y1="40" x2="94" y2="40" stroke="currentColor" stroke-width="1.5"/>`
  }
};

// ===== 各无图条目专属艺术卡配置 =====
const ART_CARD_META = {
  'kiln-laohuyan':    { motif: 'kiln',    seal: '汉窑', sub: '东汉中晚期 · 陶瓷混烧' },
  'shard-neifang':    { motif: 'mark',    seal: '贡款', sub: '宫府款识 · 越窑贡瓷' },
  's5':               { motif: 'mark',    seal: '贡款', sub: '五代北宋 · 内坊款' },

  'process-taoxi':    { motif: 'wash',    seal: '淘洗', sub: '湖水浸泡 · 五滤提精' },
  'process-rouni':    { motif: 'wheel',   seal: '拉坯', sub: '手揉精泥 · 辘轳成型' },
  'process-zhuangshi':{ motif: 'carve',   seal: '刻花', sub: '划刻镂雕 · 素烧定型' },
  'process-shiyou':   { motif: 'glaze',   seal: '施釉', sub: '草木灰釉 · 满釉微润' },
  'process-zhuangxia':{ motif: 'saggar',  seal: '装匣', sub: '瓷质匣钵 · 一器一钵' },
  'process-shaoyao':  { motif: 'fire',    seal: '龙窑', sub: '松柴还原 · 千三窑火' },
  'process-kaiyao':   { motif: 'crackle', seal: '开片', sub: '敲匣取器 · 类冰似玉' },

  'craft-2':          { motif: 'wash',    seal: '淘洗', sub: '湖水浸泡 · 五滤提精' },
  'craft-3':          { motif: 'wheel',   seal: '拉坯', sub: '手揉精泥 · 辘轳成型' },
  'craft-4':          { motif: 'carve',   seal: '刻花', sub: '划刻镂雕 · 素烧定型' },
  'craft-5':          { motif: 'glaze',   seal: '施釉', sub: '草木灰釉 · 满釉微润' },
  'craft-6':          { motif: 'saggar',  seal: '装匣', sub: '瓷质匣钵 · 一器一钵' },
  'craft-7':          { motif: 'fire',    seal: '龙窑', sub: '松柴还原 · 千三窑火' },
  'craft-8':          { motif: 'crackle', seal: '开片', sub: '敲匣取器 · 类冰似玉' },

  'cc-xiangqi':       { motif: 'incense', seal: '匠心', sub: '原矿泥釉 · 手作香器' },
  'cc-shipin':        { motif: 'pendant', seal: '肇新', sub: '秘色瓷片 · 银镶配饰' },
  'cc-lihe':          { motif: 'gift',    seal: '财智', sub: '陶朱商道 · 典藏礼盒' },

  'ccp-2':            { motif: 'cup',     seal: '器韵', sub: '宋式斗笠 · 聚香拢味' },
  'ccp-3':            { motif: 'incense', seal: '匠心', sub: '唐宋炉意 · 清心雅韵' },
  'ccp-4':            { motif: 'carve',   seal: '清雅', sub: '三层莲瓣 · 宋韵茶盏' },
  'ccp-5':            { motif: 'pendant', seal: '肇新', sub: '自然开片 · 秘色随身' },
  'ccp-6':            { motif: 'gift',    seal: '财智', sub: '一壶二杯 · 范蠡商道' },

  'm2':               { motif: 'cup',     seal: '圆融', sub: '东钱湖原矿泥釉' },
  'm3':               { motif: 'incense', seal: '香韵', sub: '匠心系列 · 手作香炉' },
  'm4':               { motif: 'carve',   seal: '复刻', sub: '国家专利秘色工艺' },
  'm5':               { motif: 'vase',    seal: '花器', sub: '当代极简 · 秘色釉韵' },
  'm6':               { motif: 'pendant', seal: '肇新', sub: '青瓷开片 · 925银镶' },

  'tl-donghan':       { motif: 'kiln',    seal: '东汉', sub: '原始青瓷 · 窑火初燃' },
  'tl-wantang':       { motif: 'sail',    seal: '晚唐', sub: '明州出海 · 远销东瀛' },
  'tl-beisong-wan':   { motif: 'crackle', seal: '余韵', sub: '窑火渐熄 · 千年沉寂' },
  'tl-2021':          { motif: 'museum',  seal: '传承', sub: '国家非遗 · 展馆落成' },
};

/**
 * 类型对应主题色
 */
function getTypeColor(type) {
  const map = {
    'lake-clay': '#c4a87c', 'kiln': '#e07050', 'shard': '#d4956b',
    'vessel': '#5aad89', 'process': '#f0c060', 'pattern': '#c97bbf',
    'person': '#6b8ec9', 'cc': '#e8a840'
  };
  return map[type] || '#3d9470';
}

/**
 * 渲染宋韵青瓷艺术图鉴卡（无实拍图时的博物馆级视觉呈现）
 */
function renderCeladonArtCard(id, title, type) {
  const meta = ART_CARD_META[id];
  const fallbackMotifKey = type === 'kiln' ? 'kiln'
    : type === 'process' ? 'wheel'
    : type === 'cc' ? 'vase'
    : type === 'shard' ? 'mark'
    : 'crackle';
  const motif = ART_MOTIFS[(meta && meta.motif) || fallbackMotifKey] || ART_MOTIFS.crackle;
  const sealText = (meta && meta.seal) || (title || '秘色').replace(/[^\u4e00-\u9fa5]/g, '').slice(0, 2) || '秘色';
  const subText = (meta && meta.sub) || (title || '东钱湖秘色瓷');

  return `
    <div class="celadon-art-card" style="background:${motif.palette};" aria-label="${title || ''}">
      <span class="celadon-art-crackle" aria-hidden="true"></span>
      <span class="celadon-art-seal" aria-hidden="true">${sealText}</span>
      <svg class="celadon-art-svg" viewBox="0 0 120 82" aria-hidden="true" focusable="false">
        ${motif.svg}
      </svg>
      <span class="celadon-art-caption">${subText}</span>
    </div>
  `;
}

/**
 * 兼容旧调用的占位回退
 */
function getTextPlaceholder(text, type) {
  return renderCeladonArtCard('', text, type);
}

/**
 * 获取图片 <img> + 宋韵青瓷艺术图鉴卡回退的完整 HTML
 */
function getImageWithFallback(id, emojiOrText, className, type) {
  const photo = IMAGE_MAP[id];
  const text = emojiOrText || '秘色';
  if (photo && photo !== 'null.jpg') {
    const cls = className || '';
    const artFallback = renderCeladonArtCard(id, text, type);
    return `
      <img src="${GALLERY + photo}" alt="${text}" class="${cls}" loading="lazy"
           onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='flex';">
      <span class="img-fallback" style="display:none;align-items:center;justify-content:center;">${artFallback}</span>`;
  }
  return renderCeladonArtCard(id, text, type);
}

/**
 * 获取数据项的图片 HTML (仅图片, 无回退)
 */
function getImageHtml(id, emoji, className, size) {
  const photo = IMAGE_MAP[id];
  if (photo && photo !== 'null.jpg') {
    const src = GALLERY + photo;
    const classAttr = className || '';
    const sizeStyle = size === 'thumb' ? 'width:60px;height:60px;' :
                      size === 'large' ? 'width:100%;height:100%;' : '';
    return `<img src="${src}" alt="" class="${classAttr}" loading="lazy"
                 style="${sizeStyle}object-fit:cover;"
                 onerror="this.style.display='none';if(this.parentElement.querySelector('.img-fallback'))this.parentElement.querySelector('.img-fallback').style.display='flex';">`;
  }
  return '';
}

/**
 * 获取图片 URL，无匹配则返回空字符串
 */
function getPhotoUrl(id) {
  const photo = IMAGE_MAP[id];
  return (photo && photo !== 'null.jpg') ? GALLERY + photo : '';
}
