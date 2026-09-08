

const GALLERY = 'picture/';

// ===== 精确图片匹配表 =====
const IMAGE_MAP = {

  // --- 知识图谱节点 ---

  // 湖泥 - 西子湖风景 (浙江同类湖泊)
  'clay':                     'dongqianhuni.jpg',

  // 古窑址 - 老虎洞窑址考古现场 (杭州，同属浙江越窑体系)
  'kiln-guojiazhi':           'guojiazhi.jpg',
  'kiln-guotongao':           'guojiaao.jpg',
  'kiln-shangshuiao':         'shangshuiao.jpg',
  'kiln-laohuyan':            'null.jpg',

  // 出土残片 - 各时期青瓷精品
  'shard-fengwen':            'fengwenxiangxungai.jpg',
  'shard-lianban':            'chonglianbanwen.jpg',
  'shard-mugua':              'mojieyu.jpg',
  'shard-neifang':            'null.jpg',

  // 典型器物
  'vessel-dongqianhu':        'dongqianhu.jpg',
  'vessel-huakouzun':         'huakoulianban.jpg',
  'vessel-quezao':            'queraomudan.jpg',

  // 传承人 - 考古现场/文化场景 (无具体人物照)
  'person-wenguoli':          'wenguoli.jpg',
  'person-zhaolulu':          'zhaolulu.jpg',
  'person-wenchangqing':      'wenchangqing.jpg',

  // 纹样
  'pattern-lianhe':           'lianhewen.jpg',
  'pattern-duidie':           'duidiewen.jpg',
  'pattern-yingwu':           'yingwuwen.jpg',
  'pattern-ying':             'yingwen.jpg',

  // 工序步骤
  'process-caitu':            'null.jpg',
  'process-taoxi':            'null.jpg',
  'process-rouni':            'null.jpg',
  'process-zhuangshi':        'null.jpg',
  'process-shiyou':           'null.jpg',
  'process-zhuangxia':        'null.jpg',
  'process-shaoyao':          'null.jpg',
  'process-kaiyao':           'null.jpg',

  // 文创产品
  'cc-dongqianhu':            'null.jpg',
  'cc-xiangqi':               'null.jpg',
  'cc-shipin':                'null.jpg',
  'cc-lihe':                  'null.jpg',

  // --- 时光轴事件 ---
  'tl-donghan':               'null.jpg',
  'tl-wantang':               'null.jpg',
  'tl-wudai':                 'null.jpg',
  'tl-beisong-zhong':         'null.jpg',
  'tl-beisong-wan':           'null.jpg',
  'tl-1958':                  'guojiazhi.jpg',
  'tl-2007':                  'guojiaao.jpg',
  'tl-2012':                  'null.jpg',
  'tl-2016':                  'shangshuiao.jpg',
  'tl-2021':                  'null.jpg',
  'tl-2025':                  'null.jpg',
  'tl-2026':                  'null.jpg',

  // --- 古今对比: 古代残片 ---
  's1':                       'fengwenxiangxungai.jpg',
  's2':                       'chonglianbanwen.jpg',
  's3':                       'huakoulianban.jpg',
  's4':                       'mojieyu.jpg',
  's5':                       'null.jpg',
  's6':                       'queraomudan.jpg',

  // --- 古今对比: 现代新作 ---
  'm1':                       'dongqianhu.jpg',
  'm2':                       'null.jpg',
  'm3':                       'null.jpg',
  'm4':                       'null.jpg',
  'm5':                       'null.jpg',
  'm6':                       'null.jpg',

  // --- 传承人 ---
  'inh-1':                    'wenchangqing.jpg',
  'inh-2':                    'wenguoli.jpg',
  'inh-3':                    'zhaolulu.jpg',

  // --- 文创廊 ---
  'ccp-1':                    'null.jpg',
  'ccp-2':                    'null.jpg',
  'ccp-3':                    'null.jpg',
  'ccp-4':                    'null.jpg',
  'ccp-5':                    'null.jpg',
  'ccp-6':                    'null.jpg',

  // --- 工序步骤 (craft steps, indexed by num) ---
  'craft-1':                  'null.jpg',
  'craft-2':                  'null.jpg',
  'craft-3':                  'null.jpg',
  'craft-4':                  'null.jpg',
  'craft-5':                  'null.jpg',
  'craft-6':                  'null.jpg',
  'craft-7':                  'null.jpg',
  'craft-8':                  'null.jpg',
};

// 来源注释 (图片版权均为 CC0 / Public Domain / CC-BY):
// - west-lake-*: 杭州西湖风景, Wikimedia Commons, CC-BY / CC0
// - east-lake-shaoxing: 绍兴东湖, Sekino Tadashi, CC-BY-SA
// - laohudong-kiln-*: 杭州老虎洞窑址, Wikimedia Commons, CC0
// - dragon-kiln: 杭州郊坛下窑址龙窑, Wikimedia Commons, CC-BY-SA
// - song-celadon-vase: 宋代青瓷瓶, Wikimedia Commons, Public Domain
// - ming-celadon-vase: 明代青瓷瓶, Wikimedia Commons, CC0
// - yue-begonia-bowl-*: 唐代越窑青釉海棠式碗, Wikimedia Commons, CC0
// - celadon-dragon-dish: 元代龙泉窑青瓷龙纹盘, Wikimedia Commons, Public Domain
// - six-dynasties-vase: 六朝青瓷壶, Cincinnati Art Museum, CC0
// - jin-celadon-sheep: 西晋青瓷羊形烛台, Wikimedia Commons, Public Domain
// - cleve2-1957.*, cleveland-celadon-*: 克利夫兰艺术博物馆藏龙泉青瓷, CC0
// - lotus-pattern: 大英博物馆藏明代青花莲纹瓷器, Wikimedia Commons, CC-BY-SA

/**
 * 类型对应主题色（用于无图时的占位块）
 */
function getTypeColor(type) {
  const map = {
    'lake-clay': '#c4a87c', 'kiln': '#e07050', 'shard': '#d4956b',
    'vessel': '#5aad89', 'process': '#f0c060', 'pattern': '#c97bbf',
    'person': '#6b8ec9', 'cc': '#e8a840'
  };
  return map[type] || '#5aad89';
}

/**
 * 生成无图时的文字占位（避免使用 emoji）
 */
function getTextPlaceholder(text, type) {
  const char = (text || '秘').replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim().charAt(0) || '秘';
  const color = getTypeColor(type);
  return `<span class="text-placeholder" style="background:${color};" title="${text || ''}">${char}</span>`;
}

/**
 * 获取图片 <img> + 文字占位回退的完整 HTML
 * 当图片加载成功时显示图片，失败时显示文字占位（不再使用 emoji）
 */
function getImageWithFallback(id, emojiOrText, className, type) {
  const photo = IMAGE_MAP[id];
  const text = emojiOrText || '秘';
  if (photo) {
    const cls = className || '';
    return `
      <img src="${GALLERY + photo}" alt="" class="${cls}" loading="lazy"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <span class="img-fallback" style="display:none;align-items:center;justify-content:center;">${getTextPlaceholder(text, type)}</span>`;
  }
  return getTextPlaceholder(text, type);
}

/**
 * 获取数据项的图片 HTML (仅图片, 无回退)
 */
function getImageHtml(id, emoji, className, size) {
  const photo = IMAGE_MAP[id];
  if (photo) {
    const src = GALLERY + photo;
    const classAttr = className || '';
    const sizeStyle = size === 'thumb' ? 'width:60px;height:60px;' :
                      size === 'large' ? 'width:100%;height:100%;' : '';
    return `<img src="${src}" alt="" class="${classAttr}" loading="lazy"
                 style="${sizeStyle}object-fit:cover;"
                 onerror="this.style.display='none';this.parentElement.querySelector('.img-fallback').style.display='flex';">`;
  }
  return '';
}

/**
 * 获取图片 URL，无匹配则返回空字符串
 */
function getPhotoUrl(id) {
  const photo = IMAGE_MAP[id];
  return photo ? GALLERY + photo : '';
}
