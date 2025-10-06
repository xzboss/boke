---
title: "现代 CSS 布局完全指南"
description: "掌握 Flexbox、Grid 等现代 CSS 布局技术"
createdAt: "2024-01-20"
updatedAt: "2024-01-25"
tags: ["css", "flexbox", "grid", "布局"]
category: "前端"
featured: true
---

# 现代 CSS 布局完全指南

现代 CSS 提供了强大的布局系统，本文将全面介绍 Flexbox、Grid 等布局技术。

## Flexbox 布局

### 基础概念

Flexbox 是一维布局模型，主要用于在单一维度（行或列）上排列元素。

#### 主轴与交叉轴

- **主轴 (Main Axis)**: flex-direction 定义的方向
- **交叉轴 (Cross Axis)**: 与主轴垂直的方向

### 容器属性

#### display

```css
.container {
  display: flex; /* 或 inline-flex */
}
```

#### flex-direction

```css
.container {
  flex-direction: row; /* 默认值 */
  /* row | row-reverse | column | column-reverse */
}
```

#### justify-content

```css
.container {
  justify-content: flex-start; /* 默认值 */
  /* flex-start | flex-end | center | 
     space-between | space-around | space-evenly */
}
```

#### align-items

```css
.container {
  align-items: stretch; /* 默认值 */
  /* stretch | flex-start | flex-end | center | baseline */
}
```

#### flex-wrap

```css
.container {
  flex-wrap: nowrap; /* 默认值 */
  /* nowrap | wrap | wrap-reverse */
}
```

#### gap

```css
.container {
  gap: 20px; /* 子项之间的间距 */
  row-gap: 20px;
  column-gap: 10px;
}
```

### 子项属性

#### flex-grow

```css
.item {
  flex-grow: 0; /* 默认值，不放大 */
}

.item-1 { flex-grow: 1; }
.item-2 { flex-grow: 2; } /* 占据两倍空间 */
```

#### flex-shrink

```css
.item {
  flex-shrink: 1; /* 默认值，允许收缩 */
}
```

#### flex-basis

```css
.item {
  flex-basis: auto; /* 默认值 */
  /* 可以是具体值：200px, 30%, 等 */
}
```

#### flex 简写

```css
.item {
  flex: 1; /* flex-grow: 1; flex-shrink: 1; flex-basis: 0%; */
  flex: 0 1 auto; /* 默认值 */
}
```

#### align-self

```css
.item {
  align-self: auto; /* 默认值 */
  /* auto | flex-start | flex-end | center | baseline | stretch */
}
```

### 常见布局

#### 水平居中

```css
.container {
  display: flex;
  justify-content: center;
}
```

#### 垂直居中

```css
.container {
  display: flex;
  align-items: center;
}
```

#### 完全居中

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

#### 等分布局

```css
.container {
  display: flex;
}

.item {
  flex: 1;
}
```

#### 自适应导航栏

```css
.nav {
  display: flex;
  gap: 20px;
}

.nav-item {
  flex: 0 0 auto;
}

.nav-spacer {
  flex: 1;
}
```

## Grid 布局

### 基础概念

Grid 是二维布局系统，可以同时控制行和列。

#### 网格线与网格轨道

- **网格线 (Grid Line)**: 构成网格结构的分界线
- **网格轨道 (Grid Track)**: 两条相邻网格线之间的空间
- **网格单元 (Grid Cell)**: 最小的网格单位
- **网格区域 (Grid Area)**: 多个网格单元组成的矩形区域

### 容器属性

#### display

```css
.container {
  display: grid; /* 或 inline-grid */
}
```

#### grid-template-columns / rows

```css
.container {
  /* 固定宽度 */
  grid-template-columns: 200px 200px 200px;
  
  /* 使用 fr 单位 */
  grid-template-columns: 1fr 2fr 1fr;
  
  /* repeat 函数 */
  grid-template-columns: repeat(3, 1fr);
  
  /* auto-fill 自动填充 */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
```

#### gap

```css
.container {
  gap: 20px;
  /* 或分别设置 */
  row-gap: 20px;
  column-gap: 10px;
}
```

#### grid-template-areas

```css
.container {
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

#### justify-items / align-items

```css
.container {
  /* 水平对齐 */
  justify-items: start; /* start | end | center | stretch */
  
  /* 垂直对齐 */
  align-items: start; /* start | end | center | stretch */
}
```

#### justify-content / align-content

```css
.container {
  /* 整个网格在容器中的水平对齐 */
  justify-content: start;
  /* start | end | center | stretch | space-around | 
     space-between | space-evenly */
  
  /* 整个网格在容器中的垂直对齐 */
  align-content: start;
}
```

### 子项属性

#### grid-column / grid-row

```css
.item {
  /* 起始线 / 结束线 */
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  
  /* 或使用 span */
  grid-column: 1 / span 2; /* 占据 2 列 */
}
```

#### grid-area

```css
.item {
  /* row-start / column-start / row-end / column-end */
  grid-area: 1 / 1 / 3 / 3;
  
  /* 或使用命名区域 */
  grid-area: header;
}
```

### 常见布局

#### 响应式网格

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
```

#### 圣杯布局

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  min-height: 100vh;
}
```

#### 卡片网格

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  padding: 24px;
}
```

#### 砌体布局 (Masonry)

```css
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 10px;
  gap: 10px;
}

.masonry-item {
  /* 根据内容高度动态设置 */
  grid-row-end: span 20;
}
```

## 多列布局

### 基本用法

```css
.container {
  column-count: 3; /* 列数 */
  column-gap: 20px; /* 列间距 */
  column-rule: 1px solid #ccc; /* 列分隔线 */
}
```

### 列宽控制

```css
.container {
  column-width: 200px; /* 每列宽度 */
  /* 浏览器会自动计算列数 */
}
```

### 跨列元素

```css
.item {
  column-span: all; /* 跨越所有列 */
}
```

## 定位布局

### position 属性

#### static (默认)

```css
.item {
  position: static; /* 正常文档流 */
}
```

#### relative

```css
.item {
  position: relative;
  top: 10px;
  left: 10px;
  /* 相对于自身原始位置偏移 */
}
```

#### absolute

```css
.parent {
  position: relative;
}

.child {
  position: absolute;
  top: 0;
  left: 0;
  /* 相对于最近的非 static 祖先元素定位 */
}
```

#### fixed

```css
.item {
  position: fixed;
  top: 0;
  left: 0;
  /* 相对于视口定位，不随滚动 */
}
```

#### sticky

```css
.item {
  position: sticky;
  top: 0;
  /* 在正常流中，到达阈值后固定 */
}
```

## 实战案例

### 响应式导航栏

```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

@media (max-width: 768px) {
  .nav {
    flex-direction: column;
  }
  
  .nav-links {
    flex-direction: column;
    width: 100%;
  }
}
```

### 响应式卡片布局

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-content {
  flex: 1;
  padding: 1.5rem;
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
}
```

### 仪表板布局

```css
.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  height: 100vh;
}

.sidebar {
  grid-area: sidebar;
  background: #2c3e50;
}

.header {
  grid-area: header;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main {
  grid-area: main;
  padding: 2rem;
  overflow: auto;
}
```

## 最佳实践

### 1. 选择合适的布局方式

- **Flexbox**: 一维布局（行或列）
- **Grid**: 二维布局（行和列）
- **Multi-column**: 报纸/杂志式多列

### 2. 移动优先

```css
/* 移动端 */
.container {
  grid-template-columns: 1fr;
}

/* 平板 */
@media (min-width: 768px) {
  .container {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 3. 使用语义化单位

```css
.container {
  /* 使用 fr 而不是百分比 */
  grid-template-columns: 1fr 2fr 1fr;
  
  /* 使用 gap 而不是 margin */
  gap: 1rem;
}
```

### 4. 利用现代特性

```css
.container {
  /* 自动填充 */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  
  /* 子网格（新特性）*/
  display: grid;
  grid-template-columns: subgrid;
}
```

## 总结

现代 CSS 布局强大而灵活：
- Flexbox 适合一维布局
- Grid 适合二维布局
- 两者可以结合使用
- 移动优先，渐进增强

掌握这些技术，可以轻松应对各种布局需求。

