# Sendr.ai 设计规范分析文档

## 1. 设计定位

Sendr.ai 整体是现代 B2B SaaS / AI 工具官网风格。页面没有使用很重的视觉装饰，而是通过白底、深色文字、产品界面截图、克制的紫橙强调色，建立专业、清爽、有科技感的品牌体验。

关键词：

- 简洁
- 专业
- 产品感
- AI 工具感
- 高对比
- 克制品牌色

## 2. 颜色系统规范

Sendr.ai 的颜色系统以黑白灰为基础，紫色作为品牌主强调色，橙粉色作为辅助情绪色。

### 2.1 色彩 Token

```css
--color-text-primary: #151517;
--color-text-secondary: #535361;
--color-text-muted: #8e8e95;

--color-bg-primary: #ffffff;
--color-bg-secondary: #fafafa;

--color-brand-primary: #8b5cf6;
--color-brand-secondary: #9c80e8;

--color-accent-warm: #f39675;
--color-accent-pink: #e583a0;
--color-accent-purple-pink: #d57ec7;

--color-border-soft: rgba(0, 0, 0, 0.08);
--color-shadow-soft: rgba(0, 0, 0, 0.05);
```

### 2.2 使用规范

- 页面大面积使用白色和浅灰色，不用大面积品牌色铺底。
- 主要内容文字使用接近黑色的 `#151517`，保证高级感和阅读性。
- 说明文字使用灰色，但避免低对比浅灰。
- 品牌紫色主要用于高亮、图形、标签、重点状态，不建议大面积使用。
- 橙粉色用于渐变、强调视觉、局部装饰，不作为主按钮底色。
- 边框和阴影尽量轻，使用透明黑，而不是明显的硬边框。

## 3. 按钮系统规范

按钮系统以黑色主按钮为核心，辅助按钮使用白底或浅底。

### 3.1 一级按钮

```css
background: #151517;
color: #ffffff;
border-radius: 999px;
font-size: 14px;
font-weight: 600;
height: 40px - 48px;
padding: 0 16px - 24px;
```

使用场景：

- Try free
- Start free trial
- 立即体验
- 免费开始

### 3.2 二级按钮

```css
background: #ffffff;
color: #151517;
border: 1px solid rgba(0, 0, 0, 0.08);
border-radius: 999px;
font-size: 14px;
font-weight: 500;
height: 40px - 48px;
padding: 0 16px - 24px;
```

使用场景：

- See pricing
- Book a demo
- 查看价格
- 预约演示

### 3.3 文本按钮

```css
color: #151517;
font-size: 14px;
font-weight: 500;
```

使用场景：

- Learn more
- 查看详情
- 产品模块入口

### 3.4 标签按钮 / Pill

```css
background: #fafafa;
border: 1px solid rgba(0, 0, 0, 0.08);
border-radius: 999px;
font-size: 12px;
font-weight: 500;
padding: 4px 8px;
```

### 3.5 使用规范

- 主 CTA 优先使用黑底白字，而不是品牌紫色。
- 品牌色不直接承担按钮主色，更多用于状态、图形、渐变。
- 按钮圆角统一使用胶囊形态。
- 同一区域最多出现一个一级按钮。
- 二级按钮视觉权重必须明显低于一级按钮。
- 按钮文字尽量短，动作表达要明确。

## 4. 文字系统规范

Sendr.ai 的文字系统以 Inter 为核心，标题使用更强展示感的 Inter Display。

### 4.1 字体

```css
--font-display: "Inter Display", "Inter", sans-serif;
--font-body: "Inter", sans-serif;
```

### 4.2 字号层级

```css
--font-hero: 64px;
--font-h1: 56px;
--font-h2: 40px;
--font-h3: 24px;
--font-body: 16px;
--font-small: 14px;
--font-caption: 12px;
```

### 4.3 行高

```css
--line-height-heading: 1.1;
--line-height-body: 1.5;
--line-height-caption: 1.4;
```

### 4.4 字重

```css
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-black: 900;
```

### 4.5 字距

- 大标题：`-0.03em` 到 `-0.02em`
- 二级标题：`-0.02em`
- 正文：`0`
- 标签 / eyebrow：`0.03em`

### 4.6 使用规范

- Hero 标题需要大字号、紧字距、短句式。
- 正文保持 16px 左右，行高 1.5，保证阅读舒适。
- 小标签可以使用大写和正字距，增强精致感。
- 不建议在正文里使用过重字重。
- 页面标题层级要少而清晰，避免太多不同字号。

## 5. 圆角与卡片规范

Sendr.ai 的圆角体系比较统一，按钮多为胶囊，卡片使用中等圆角。

```css
--radius-pill: 999px;
--radius-small: 8px;
--radius-medium: 12px;
--radius-card: 16px;
--radius-large: 20px;
```

使用规范：

- 按钮统一使用 `999px`。
- 小标签使用 `999px` 或 `8px`。
- 卡片使用 `12px - 20px`。
- 产品界面容器可使用 `16px - 20px`。
- 避免所有元素都使用同一种大圆角。

## 6. 间距系统规范

Sendr.ai 的页面间距偏宽松，模块之间留白充分，组件内部紧凑。

```css
--space-4: 4px;
--space-8: 8px;
--space-12: 12px;
--space-16: 16px;
--space-24: 24px;
--space-32: 32px;
--space-48: 48px;
--space-64: 64px;
--space-80: 80px;
--space-120: 120px;
```

使用规范：

- 页面大区块上下间距：`80px - 120px`
- 卡片内部 padding：`20px - 32px`
- 按钮组间距：`8px - 12px`
- 标题与正文间距：`16px - 24px`
- 多卡片网格间距：`16px - 32px`

## 7. 可迁移到 agentsyun 官网的规范重点

如果用于优化当前 agentsyun 官网项目，建议只迁移规范，不照搬视觉：

- 用黑白灰建立页面骨架。
- 主按钮统一为黑底白字。
- 紫色只做品牌强调，不大面积铺满。
- 标题字号减少层级，统一紧字距。
- 正文统一 16px / 1.5 行高。
- 卡片边框和阴影变轻。
- CTA 按钮统一胶囊形态。
- 页面留白更克制、更规律。
- 减少过多渐变和装饰背景。

## 8. 总结

Sendr.ai 的设计规范核心是：

> 黑白灰作为稳定骨架，紫橙作为品牌点缀；按钮系统简单明确，文字系统强调大标题冲击力和正文可读性；整体保持 SaaS 产品官网的专业、克制和现代感。
