/**
 * Herb images as inline SVGs — reliable, fast, and visually distinct per herb.
 * Each SVG shows the herb name + a botanical icon + property-color background.
 */

function herbSvg(name: string, bgColor: string, icon: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <rect width="600" height="400" fill="${bgColor}"/>
  <circle cx="300" cy="160" r="80" fill="rgba(255,255,255,0.25)"/>
  <text x="300" y="180" text-anchor="middle" font-size="72" fill="white">${icon}</text>
  <text x="300" y="310" text-anchor="middle" font-size="48" font-weight="bold" fill="white" font-family="sans-serif">${name}</text>
  <text x="300" y="355" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.7)" font-family="sans-serif">智慧中医 · 本草数据库</text>
</svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

export const HERB_IMAGES: Record<string, string> = {
  // 人参 — 微温，补气之王 🌿
  h1: herbSvg('人参', '#8B4513', '🌿'),
  // 枸杞子 — 平，滋补肝肾 🔴
  h2: herbSvg('枸杞子', '#C41E3A', '🔴'),
  // 黄芪 — 微温，补气升阳 🟡
  h3: herbSvg('黄芪', '#D4A017', '🟡'),
  // 菊花 — 微寒，清热明目 ⚪
  h4: herbSvg('菊花', '#F5F5DC', '🌼'),
  // 干姜 — 热，温中散寒 🟠
  h5: herbSvg('干姜', '#E87511', '🟠'),
  // 甘草 — 平，调和诸药 🟤
  h6: herbSvg('甘草', '#8B6914', '🟤'),
};
