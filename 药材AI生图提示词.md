# 智慧中医 · 药材 AI 生图提示词

统一风格要求：**高清产品摄影风格，浅色纯色背景，正面平拍，自然光，药材主体清晰居中，无文字水印，600×400 横版比例**。

---

## 1. 人参 (h1) — Ginseng Root

**Midjourney / DALL-E：**
> A high-quality product photograph of a whole dried ginseng root (Panax ginseng), beige-brown color, with visible rootlets and main body, placed on a clean light cream background, natural soft lighting, centered composition, no text no watermark, horizontal 3:2 ratio, commercial herbal medicine photography style.

**中文（通义万相 / 文心一格）：**
> 一支完整的干人参（Panax ginseng），米褐色，根须分明主根饱满，放在干净的浅米色背景上，自然柔光，居中构图，高清产品摄影风格，横版 3:2，无文字无水印，中药材商业摄影。

---

## 2. 枸杞子 (h2) — Goji Berries

**Midjourney / DALL-E：**
> A high-quality overhead product photograph of dried goji berries (Lycium barbarum), vibrant red-orange color, scattered on a clean light beige surface, some berries slightly wrinkled showing their dried texture, natural soft lighting, centered composition, horizontal 3:2 ratio, commercial health food photography style, no text no watermark.

**中文：**
> 干枸杞子（Lycium barbarum），鲜艳的红橙色，散落在干净的浅米色平面上，部分果粒微微皱缩展现干燥质感，自然柔光俯拍，居中构图，高清健康食品摄影风格，横版 3:2，无文字无水印。

---

## 3. 黄芪 (h3) — Astragalus Root

**Midjourney / DALL-E：**
> A high-quality product photograph of sliced dried astragalus root (Astragalus membranaceus), light yellow-beige color, thin round slices with visible concentric rings and fibrous texture, arranged neatly on a clean white background, natural soft lighting, centered composition, horizontal 3:2 ratio, commercial Chinese herbal medicine photography style, no text no watermark.

**中文：**
> 干黄芪切片（Astragalus membranaceus），浅黄米色，薄圆片状，可见同心环纹和纤维纹理，整齐摆放在干净的白色背景上，自然柔光，居中构图，高清中药材摄影风格，横版 3:2，无文字无水印。

---

## 4. 菊花 (h4) — Chrysanthemum Flowers

**Midjourney / DALL-E：**
> A high-quality overhead product photograph of dried chrysanthemum flowers (Chrysanthemum morifolium), small golden-yellow blossoms with visible petals, scattered on a clean light cream background, some flowers facing up showing the petal arrangement, natural soft lighting, centered composition, horizontal 3:2 ratio, commercial herbal tea photography style, no text no watermark.

**中文：**
> 干菊花（Chrysanthemum morifolium），金黄色小花朵，花瓣分明，散落在干净的浅米色背景上，部分花朵朝上展示花瓣排列，自然柔光俯拍，居中构图，高清花茶产品摄影风格，横版 3:2，无文字无水印。

---

## 5. 干姜 (h5) — Dried Ginger

**Midjourney / DALL-E：**
> A high-quality product photograph of dried ginger slices (Zingiber officinale), pale beige-tan color, irregular flat slices with fibrous texture and slightly darker outer skin edge, arranged on a clean light warm gray background, natural soft lighting, centered composition, horizontal 3:2 ratio, commercial spice photography style, no text no watermark.

**中文：**
> 干姜片（Zingiber officinale），浅米褐色，不规则扁平切片，可见纤维纹理和稍微深色的外皮边缘，摆放在干净的浅暖灰色背景上，自然柔光，居中构图，高清香料产品摄影风格，横版 3:2，无文字无水印。

---

## 6. 甘草 (h6) — Licorice Root

**Midjourney / DALL-E：**
> A high-quality product photograph of dried licorice root slices (Glycyrrhiza uralensis), warm brownish-yellow color, round and slightly oval flat slices with visible radial fibers and darker concentric rings, arranged neatly on a clean light beige background, natural soft lighting, centered composition, horizontal 3:2 ratio, commercial Chinese herbal medicine photography style, no text no watermark.

**中文：**
> 干甘草切片（Glycyrrhiza uralensis），暖黄褐色，圆形和微椭圆形扁平切片，可见放射状纤维和深色同心环纹，整齐摆放在干净的浅米色背景上，自然柔光，居中构图，高清中药材摄影风格，横版 3:2，无文字无水印。

---

## 使用方式

1. 把对应药材的提示词复制到 AI 生图工具（DALL-E / Midjourney / 通义万相 / 文心一格 / Stable Diffusion）
2. 生成图片后下载
3. 放到项目 `backend/uploads/herbs/` 目录
4. 替换 `frontend/src/herb-images.ts` 和 `backend/app/api/routes/content.py` 中的图片路径

> 建议每味药材生成 2-3 张备选，挑选最符合实际药材外观的一张。
