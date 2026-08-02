/* ============================================
   图片映射注册表 - 全部使用网络来源图片
   来源: Wikimedia Commons (CC0 / Public Domain / CC-BY)
   26张图片覆盖 72个数据项
   三层回退: 精确匹配 → 图片 → emoji
   ============================================ */

const GALLERY = 'picture/web/';

// ===== 图片文件列表 (26张, 来源 Wikimedia Commons) =====
// 湖景/风景 (7): west-lake-1, wl-west_lake__hangzhou, wl-west_lake_1,
//                   wl-west_lake_twilight, wl-west_lake_pavilion_china,
//                   wl-west_lake_img_8773_panorama, east-lake-shaoxing
// 窑址/考古 (7): laohudong-kiln-01~04, laohudong-kiln-07~08, dragon-kiln
// 青瓷器物 (12): song-celadon-vase, ming-celadon-vase, yue-begonia-bowl(1-3),
//                 celadon-dragon-dish, six-dynasties-vase, jin-celadon-sheep,
//                 cleve2-1957.52, cleve2-1957.73, cleveland-celadon-1957.54, lotus-pattern

// ===== 精确图片匹配表 =====
const IMAGE_MAP = {

  // --- 知识图谱节点 ---

  // 湖泥 - 西子湖风景 (浙江同类湖泊)
  'clay':                     'west-lake-1.jpg',

  // 古窑址 - 老虎洞窑址考古现场 (杭州，同属浙江越窑体系)
  'kiln-guojiazhi':           'laohudong-kiln-04.jpg',
  'kiln-guotongao':           'laohudong-kiln-02.jpg',
  'kiln-shangshuiao':         'laohudong-kiln-07.jpg',
  'kiln-laohuyan':            'laohudong-kiln-08.jpg',

  // 出土残片 - 各时期青瓷精品
  'shard-fengwen':            'celadon-dragon-dish.jpg',
  'shard-lianban':            'yue-begonia-bowl.jpg',
  'shard-mugua':              'six-dynasties-vase.jpg',
  'shard-neifang':            'jin-celadon-sheep.jpg',

  // 典型器物
  'vessel-dongqianhu':        'ming-celadon-vase.jpg',
  'vessel-huakouzun':         'song-celadon-vase.jpg',
  'vessel-quezao':            'yue-begonia-bowl-3.jpg',

  // 传承人 - 考古现场/文化场景 (无具体人物照)
  'person-wenguoli':          'laohudong-kiln-01.jpg',
  'person-zhaolulu':          'wl-west_lake_pavilion_china.jpg',
  'person-wenchangqing':      'dragon-kiln.jpg',

  // 纹样
  'pattern-lianhe':           'lotus-pattern.jpg',
  'pattern-duidie':           'yue-begonia-bowl-2.jpg',
  'pattern-yingwu':           'cleve2-1957.52.jpg',
  'pattern-ying':             'celadon-dragon-dish.jpg',

  // 工序步骤
  'process-caitu':            'wl-west_lake__hangzhou.jpg',
  'process-taoxi':            'east-lake-shaoxing.jpg',
  'process-rouni':            'laohudong-kiln-03.jpg',
  'process-zhuangshi':        'lotus-pattern.jpg',
  'process-shiyou':           'cleve2-1957.73.jpg',
  'process-zhuangxia':        'laohudong-kiln-07.jpg',
  'process-shaoyao':          'dragon-kiln.jpg',
  'process-kaiyao':           'yue-begonia-bowl-2.jpg',

  // 文创产品
  'cc-dongqianhu':            'ming-celadon-vase.jpg',
  'cc-xiangqi':               'cleve2-1957.52.jpg',
  'cc-shipin':                'cleveland-celadon-1957.54.jpg',
  'cc-lihe':                  'cleve2-1957.73.jpg',

  // --- 时光轴事件 ---
  'tl-donghan':               'six-dynasties-vase.jpg',
  'tl-wantang':               'yue-begonia-bowl.jpg',
  'tl-wudai':                 'song-celadon-vase.jpg',
  'tl-beisong-zhong':         'yue-begonia-bowl-2.jpg',
  'tl-beisong-wan':           'yue-begonia-bowl-3.jpg',
  'tl-1958':                  'laohudong-kiln-04.jpg',
  'tl-2007':                  'laohudong-kiln-02.jpg',
  'tl-2012':                  'dragon-kiln.jpg',
  'tl-2016':                  'laohudong-kiln-07.jpg',
  'tl-2021':                  'laohudong-kiln-01.jpg',
  'tl-2025':                  'ming-celadon-vase.jpg',
  'tl-2026':                  'wl-west_lake_twilight.jpg',

  // --- 古今对比: 古代残片 ---
  's1':                       'celadon-dragon-dish.jpg',
  's2':                       'yue-begonia-bowl.jpg',
  's3':                       'song-celadon-vase.jpg',
  's4':                       'six-dynasties-vase.jpg',
  's5':                       'jin-celadon-sheep.jpg',
  's6':                       'yue-begonia-bowl-3.jpg',

  // --- 古今对比: 现代新作 ---
  'm1':                       'ming-celadon-vase.jpg',
  'm2':                       'yue-begonia-bowl-2.jpg',
  'm3':                       'cleve2-1957.52.jpg',
  'm4':                       'yue-begonia-bowl.jpg',
  'm5':                       'song-celadon-vase.jpg',
  'm6':                       'cleveland-celadon-1957.54.jpg',

  // --- 传承人 ---
  'inh-1':                    'dragon-kiln.jpg',
  'inh-2':                    'laohudong-kiln-01.jpg',
  'inh-3':                    'wl-west_lake_pavilion_china.jpg',

  // --- 文创廊 ---
  'ccp-1':                    'ming-celadon-vase.jpg',
  'ccp-2':                    'yue-begonia-bowl-2.jpg',
  'ccp-3':                    'cleve2-1957.52.jpg',
  'ccp-4':                    'yue-begonia-bowl.jpg',
  'ccp-5':                    'cleveland-celadon-1957.54.jpg',
  'ccp-6':                    'cleve2-1957.73.jpg',

  // --- 工序步骤 (craft steps, indexed by num) ---
  'craft-1':                  'wl-west_lake__hangzhou.jpg',
  'craft-2':                  'east-lake-shaoxing.jpg',
  'craft-3':                  'laohudong-kiln-03.jpg',
  'craft-4':                  'lotus-pattern.jpg',
  'craft-5':                  'cleve2-1957.73.jpg',
  'craft-6':                  'laohudong-kiln-07.jpg',
  'craft-7':                  'dragon-kiln.jpg',
  'craft-8':                  'yue-begonia-bowl-2.jpg',
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
 * 获取图片 <img> + emoji 回退的完整 HTML
 * 当图片加载成功时显示图片，失败时显示 emoji
 */
function getImageWithFallback(id, emoji, className) {
  const photo = IMAGE_MAP[id];
  if (photo) {
    const cls = className || '';
    return `
      <img src="${GALLERY + photo}" alt="" class="${cls}" loading="lazy"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <span class="img-fallback" style="display:none;align-items:center;justify-content:center;font-size:2rem;">${emoji || '🏺'}</span>`;
  }
  return `<span style="font-size:2rem;">${emoji || '🏺'}</span>`;
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
