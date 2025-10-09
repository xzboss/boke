# AI 上下文文档

## 项目全局提示词
1. 此项目是一个博客系统，但是生成的假数据都不能和博客有关，相关字眼可以用英文或者拼音代替，但是AI_CONTENT文件照常用正常的中文去写
2. 每次生成内容不总结，不解释

## 项目概述
这是一个基于 Next.js 15 的现代化博客项目，名为 "boke"。

## 技术栈
- **框架**: Next.js 15 (App Router + SSG) + React 19 + TypeScript
- **样式**: Tailwind CSS + UnoCSS
- **状态管理**: Zustand (持久化到 localStorage)
- **Markdown 处理**: remark + rehype + gray-matter
- **字体**: Geist Sans + Geist Mono
- **图标**: @ant-design/icons (Iconfont)
- **工具库**: clsx, tailwind-merge

## 项目结构
```
boke/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 首页
│   │   ├── blog/              # 博客页面
│   │   │   ├── page.tsx       # 博客首页（Server Component - SSG）
│   │   │   ├── BlogPageClient.tsx  # 博客客户端组件（三栏布局）
│   │   │   └── page.scss      # 博客页面样式（侧边栏 hover 效果）
│   │   ├── ui/                # UI 演练场
│   │   │   └── page.tsx       # UI 组件展示页（客户端组件）
│   │   ├── layout.tsx         # 根布局
│   │   ├── globals.css        # 全局样式（主题、滚动条）
│   │   └── favicon.ico        # 网站图标
│   ├── components/            # 组件库
│   │   ├── Button/           # 按钮组件
│   │   │   ├── Button.tsx    # 按钮组件实现（复合组件架构）
│   │   │   └── index.ts      # 按钮组件导出
│   │   ├── Icon/             # 图标组件
│   │   │   ├── Icon.tsx      # Iconfont 图标组件
│   │   │   └── index.ts      # 图标组件导出
│   │   ├── Select/           # 下拉选择器组件
│   │   │   ├── Select.tsx    # 下拉选择器实现
│   │   │   └── index.ts      # 下拉选择器导出
│   │   ├── Menu/             # 菜单组件
│   │   │   ├── RecursiveMenu.tsx  # 递归菜单组件
│   │   │   └── index.ts      # 菜单组件导出
│   │   ├── Catalog/          # 目录组件
│   │   │   ├── Catalog.tsx   # 文章目录组件（TOC）
│   │   │   ├── catalog.scss  # 目录样式（进度条）
│   │   │   └── index.ts      # 目录组件导出
│   │   └── layout/           # 布局组件
│   │       ├── Layout.tsx    # 主布局组件
│   │       ├── Header.tsx    # 头部组件
│   │       ├── Footer.tsx    # 底部组件
│   │       └── index.ts      # 布局组件导出
│   ├── store/                # 全局状态管理
│   │   └── app.ts            # 应用状态 (Zustand)
│   ├── config/               # 配置文件
│   │   └── categories.ts     # 博客分类配置
│   ├── content/              # 内容文件
│   │   └── blog/             # 博客 Markdown 文件
│   │       ├── vue-basics.md     # Vue 3 响应式原理
│   │       ├── react-hooks.md    # React Hooks 完全指南
│   │       ├── javascript.md     # JavaScript 异步编程
│   │       ├── typescript.md     # TypeScript 类型系统
│   │       └── vite.md           # Vite 构建工具
│   └── utils/                # 工具函数
│       ├── tools.ts          # 工具函数集合 (cn, colorUtils)
│       ├── markdown.ts       # Markdown 处理（解析、TOC 生成、ID 去重）
│       └── staticBlog.ts     # 静态博客工具（SSG 专用）
├── public/                   # 静态资源
│   ├── *.svg                # SVG 图标文件
│   └── ...
├── package.json
├── tsconfig.json
├── next.config.ts
└── uno.config.ts
```

## 开发约定

### 1. 代码风格
- 使用中文注释和界面文本
- 组件使用 TypeScript 严格类型
- 使用 `cn` 工具函数合并类名
- 客户端组件需要添加 `'use client'` 指令
- **函数注释**：使用 `/** */` 格式，简洁明了
- **HTML 分块注释**：为每个主要区块添加功能说明注释

### 2. 组件规范
- 所有组件都支持 `className` 属性
- 使用 `React.forwardRef` 包装需要 ref 的组件
- 组件接口使用 `interface` 定义
- 导出组件时设置 `displayName`

### 3. 样式规范
- **不使用 onMouseEnter/onMouseLeave**：所有 hover 效果通过 CSS 类名实现
- 优先使用 Tailwind CSS 类名
- 使用 UnoCSS 的 shortcuts 功能
- 响应式设计使用 Tailwind 的断点前缀
- **暗黑模式**：不使用 `dark:` 前缀（UnoCSS 不支持），而是在组件内部根据 theme 状态选择不同的类名组合
- **无边框**：按钮组件不使用边框
- **无阴影**：按钮组件不使用阴影效果
- **防止文本选中**：按钮组件使用 `select-none` 类

### 4. 文件命名
- 组件文件使用 PascalCase
- 工具文件使用 camelCase
- 页面文件使用 kebab-case

### 5. 主题系统（重要）

#### 术语定义
- **theme**：主题模式，值为 `'light'` 或 `'dark'`，表示黑夜/白天模式
- **colorScheme**：色调，值为 `'black' | 'white' | 'purple' | 'blue' | 'green' | 'red' | 'orange' | 'pink' | 'indigo' | 'teal'`，表示主色调

#### 实现方式
- **全局状态管理**：使用 Zustand 管理主题状态，存储在 `src/store/app.ts`
- **持久化**：使用 Zustand persist 中间件，数据存储到 localStorage
- **色调预设**：`colorSchemePresets` 定义每个色调的主色调十六进制值
- **主题切换**：`toggleTheme()` 切换 light/dark 模式，同时更新 DOM 的 `dark` class
- **色调切换**：`setColorScheme()` 切换主色调
- **颜色处理**：组件内部使用 `colorUtils.adjustBrightness()` 处理深浅变化
- **过渡动画**：所有主题切换都有 200ms 的过渡效果

#### 暗黑模式适配策略
1. 在 Button 主组件中统一获取 `theme` 状态
2. 将 `theme` 作为 props 传递给各个子按钮组件
3. 子组件内部根据 `theme === 'dark'` 选择不同的类名组合
4. **不使用 `dark:` 前缀**，而是用三元表达式选择类名

## 当前状态
- 基础布局已完成（Header, Footer, Layout）
- Button 组件已完善，支持 4 种类型和 3 种尺寸
- Icon 组件已接入 Iconfont
- UI 演练场页面已创建并展示所有组件功能
- 字体配置已统一为 Geist
- 已修复水合错误和客户端组件问题
- **Header 组件已完善**：所有导航链接都使用 Button text 类型
- **主题系统已实现**：完整的深色模式支持，主题切换按钮（moon/sun 图标）
- **动态色调系统**：支持用户实时切换主色调（下拉选择器）
- **递归菜单组件**：支持无限层级的菜单结构

## Button 组件功能

### 组件架构
- **BaseButton**：基础按钮组件，处理公共逻辑
  - 尺寸处理（sm/md/lg）
  - 加载状态（loading spinner）
  - 事件处理（onClick, onKeyDown）
  - 可访问性属性（role, tabIndex, aria-disabled）
  - 基础样式：`flex items-center gap-2 font-medium rounded-lg transition-all duration-200 cursor-pointer select-none active:scale-95`
  
- **PrimaryButton**：主按钮
  - 背景：主色调纯色
  - 文字：白色（所有色调统一，不分 light/dark）
  - hover：透明度降低到 80%
  - 支持 `color` 属性自定义色调
  
- **DefaultButton**：默认按钮
  - 背景：主色调 5% 透明度（rgba）
  - 文字：主色调
  - hover：背景透明度加重到 10%
  - 通过 CSS 变量 `--bg-color` 和 `--hover-bg` 实现
  
- **TextButton**：文本按钮
  - 背景：无
  - 文字：深色主题用白色，浅色主题用黑色
  - hover：背景显示为主色调 5% 透明度 + 文字变为主色调
  - 通过 CSS 变量 `--hover-bg` 和 `--hover-text` 实现
  
- **LinkButton**：链接按钮
  - 背景：无
  - 文字：深色主题用白色，浅色主题用黑色
  - hover：文字变为主色调
  - 通过 CSS 变量 `--hover-text` 实现
  
- **Button**：主组件，根据 `type` 分发到具体实现

### 核心特性
- **类型**: primary, default, text, link
- **尺寸**: sm (px-3 py-1.5 text-sm), md (px-4 py-2 text-base), lg (px-6 py-3 text-lg)
- **功能**: loading 状态, 支持 href 链接
- **样式**: 纯色背景（不使用渐变）, 透明度过渡, 点击缩放效果
- **交互**: active:scale-95 触摸反馈, select-none 防止文本选中
- **注释**: 所有组件和 props 都有 JSDoc 注释

### 按钮类型详细说明

| 类型 | 背景 | 文字 | hover 效果 |
|------|------|------|-----------|
| primary | 主色调 | 白色 | 透明度 80% |
| default | 主色调 5% | 主色调 | 背景加重到 10% |
| text | 无 | 黑/白 | 背景 5% + 文字变色调 |
| link | 无 | 黑/白 | 文字变色调 |

### color 属性
- 所有按钮类型都支持 `color` 属性
- 传入 `ColorSchemeKey` 类型（'purple' | 'blue' | 'green' 等）
- 优先级高于全局 `colorScheme`，用于单个按钮自定义色调

### 使用 div 而非 button
- 使用 `<div>` 元素避免原生按钮样式干扰
- 添加 `role="button"` 保证语义化
- 添加 `tabIndex={loading ? -1 : 0}` 支持键盘导航
- 添加 `aria-disabled={loading}` 标识禁用状态
- 添加 `onKeyDown` 处理键盘事件（Enter/Space）

### href 支持
- 所有按钮类型都支持 `href` 属性
- 有 `href` 时自动使用 `next/link` 包裹
- Link 组件使用 `whitespace-nowrap` 和 `textDecoration: 'none'`

### 透明度系统（重要）
使用 `colorUtils.withAlpha()` 而非 `adjustBrightness()` 的原因：
- **问题**：`adjustBrightness` 对不同颜色效果不一致（紫色 160 合适，但黑色 160 不合适）
- **解决**：使用透明度叠加，效果统一
- **实现**：`withAlpha(hex, alpha)` 返回 `rgba(r, g, b, alpha)` 格式
- **优势**：不管是紫色、黑色还是白色，5%/10% 透明度都能保持一致的视觉效果

## Icon 组件
- 基于 `@ant-design/icons` 的 `createFromIconfontCN`
- 配置 scriptUrl 指向 iconfont.cn 生成的 JS 文件
- 使用方式：`<Icon type="icon-name" style={{ fontSize: '20px' }} />`
- 当前使用的图标：icon-github, icon-moon, icon-sun, icon-expand

## Select 组件
- 自定义下拉选择器组件
- **功能**：支持选项列表、当前值、变更回调
- **样式**：适配 light/dark 主题，自动使用主色调
- **交互**：点击展开/收起，点击外部自动关闭
- **图标**：使用 `icon-expand`，展开时旋转 270 度，收起时旋转 180 度
- **定位**：下拉列表显示在触发器下方（`top: 100%`）
- **使用场景**：Header 中的色调选择器

## RecursiveMenu 组件（递归菜单）
- **功能**：支持无限层级的树形菜单结构
- **数据源**：来自 `src/config/categories.ts` 的分类配置
- **状态管理**：
  - `expandedItems`：展开的菜单项 ID 集合
  - `currentCategory`：当前选中的分类
  - `currentSubCategory`：当前选中的子分类
- **交互逻辑**：
  - 有子项的节点：点击展开/收起
  - 叶子节点：点击触发 `onSubCategorySelect` 回调
- **样式**：
  - 复用 `Button` 组件（primary 表示选中，text 表示未选中）
  - 使用 `Icon type="icon-expand"` 显示展开状态
  - 子项通过 `paddingLeft` 缩进显示层级
- **选中状态**：
  - 叶子节点：使用 `currentSubCategory === item.id` 判断
  - 非叶子节点：使用 `currentCategory === item.id` 判断

## 博客系统架构

### 核心架构：Static Site Generation (SSG)
- **构建时处理**: 所有 Markdown 文件在构建时解析成 HTML，不在运行时处理
- **性能优势**: 刷新页面从 3-5秒 降至 <100ms，切换文章从 3-5秒 降至 <10ms
- **无需 API**: 直接在服务端组件中生成静态数据，传递给客户端组件

### 数据流
```
构建时:
  content/blog/*.md
    ↓ (staticBlog.ts)
  getAllStaticPosts()
    ↓ (parseMarkdown)
  HTML + TOC + Metadata
    ↓ (page.tsx - Server Component)
  传递给客户端

运行时:
  BlogPageClient.tsx (Client Component)
    ↓ (从 props 读取)
  allPosts[slug]  ← 瞬间！无需 API 调用
```

### 系统组成
- **分类系统**: 基于 TypeScript 配置的层级分类结构 (`config/categories.ts`)
- **标签系统**: MD 文件前置元数据中的标签字段
- **内容管理**: MD 文件存储在 `src/content/blog/` 目录
- **元数据格式**: 包含 title, description, createdAt, updatedAt, tags, category, featured

## 分类配置
- **配置文件**: `/src/config/categories.ts` - TypeScript 配置文件
- **数据结构**: 数组形式，每个分类是独立的对象
- **类型安全**: 使用 TypeScript 接口定义 Category 类型
- **层级关系**: 通过 level、parentId、children 字段管理层级
- **一级分类**: 前端、后端、计网、数据结构与算法、计算机操作系统、计算机组成原理、设计模式
- **二级分类**: 每个一级分类下的具体技术栈
- **标签匹配**: 通过 tags 字段将 MD 文件关联到对应分类
- **工具函数**: 提供 getCategoryById、getCategoriesByLevel 等工具函数
- **灵活调整**: 可随时修改 TypeScript 配置来调整分类结构

## 博客系统功能

### 页面布局
- **三栏布局** (`/blog`): 
  - 左侧：分类导航（RecursiveMenu）
  - 中间：文章内容（Markdown 渲染的 HTML）
  - 右侧：文章目录（Catalog）
- **固定 Header**: 顶部导航固定，带动态阴影（使用主色调）
- **非滚动主容器**: `main` 元素不滚动，三栏各自独立滚动
- **可收起侧边栏**: 左右侧边栏都可以收起/展开，带平滑过渡动画
- **Hover 显示收起按钮**: 侧边栏 hover 时显示收起按钮（CSS 实现）

### 文章管理
- **静态生成**: 所有文章在构建时预处理，无需运行时 API 调用
- **URL 同步**: 通过查询参数 `?article=slug` 访问特定文章
- **单页面应用**: 无页面刷新切换文章，避免闪烁
- **默认文章**: 首次访问或无 URL 参数时，自动打开第一个带 `hot` 标签的文章
- **刷新保持**: 刷新页面时根据 URL 参数恢复文章状态
- **瞬间切换**: 切换文章时直接从静态数据读取，无需等待
- **瞬间跳转**: 点击目录项直接跳转到对应标题（无平滑滚动）
- **自动高亮**: 滚动内容时，目录自动高亮当前标题（距顶部 50px 触发）

### Markdown 处理（构建时）
- **解析库**: `gray-matter`（frontmatter）, `remark`（Markdown → HTML）
- **增强功能**: 
  - `remark-gfm`: 支持 GitHub Flavored Markdown
  - 自定义 rehype 插件: 同步 HTML 标题 ID 与 TOC ID
  - `rehype-autolink-headings`: 为标题添加锚点链接
- **TOC 生成**: 自动提取标题生成目录结构（TocItem[]）
- **ID 去重**: 相同标题文本会自动添加数字后缀（如 `基础用法`, `基础用法-1`）
- **ID 同步**: HTML 中的标题 ID 与 TOC 中的 ID 保持一致
- **处理时机**: 所有处理在构建时完成，运行时直接使用 HTML

### 导航交互
- **分类展开**: 
  - 非叶子节点：只展开/收起，不选中
  - 叶子节点：选中并加载文章
- **全部展开/收起**: 
  - RecursiveMenu 支持"全部展开/收起"按钮
  - Catalog 支持"全部展开/收起"按钮
- **自动展开**: 切换文章时，只展开选中项的祖先路径，其他收起
- **状态保持**: 左侧导航自动展开对应分类并高亮选中项

### Catalog（目录）组件
- **功能**: 显示文章标题层级结构，支持点击跳转
- **进度指示器**: 左侧竖条，跟随当前标题位置"跳跃式"显示
- **全部收起时**: 进度条定位到当前标题的最高级祖先（level 1）
- **全部展开时**: 进度条恢复到当前标题的实际位置
- **自动滚动**: 当前激活项自动滚动到目录容器中间位置
- **展开/收起**: 
  - 左侧：展开图标，点击只展开/收起
  - 右侧：标题按钮，点击选中并跳转
- **层级缩进**: 根据标题 level 动态调整左侧缩进
- **无子节点样式**: 叶子节点额外添加 `marginLeft: '24px'` 保持对齐

## 工具函数

### cn 函数
```typescript
// 合并 clsx 和 tailwind-merge 的功能
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### colorUtils
```typescript
export const colorUtils = {
  // 将十六进制颜色转换为 RGB 对象
  hexToRgb: (hex: string) => { r, g, b } | null,
  
  // 将 RGB 值转换为十六进制字符串
  rgbToHex: (r: number, g: number, b: number) => string,
  
  // 调整颜色亮度（已弃用，改用 withAlpha）
  adjustBrightness: (hex: string, amount: number) => string,
  
  // 将颜色转换为带透明度的 rgba 格式（推荐使用）
  // @param hex 十六进制颜色值
  // @param alpha 透明度，0-1 之间的值
  // @returns rgba(r, g, b, alpha) 字符串
  withAlpha: (hex: string, alpha: number) => string
}
```

**重要**：新项目应使用 `withAlpha` 而非 `adjustBrightness`，因为透明度叠加对所有颜色效果一致。

## 滚动条样式系统

### 自定义滚动条
- **应用范围**: `body` 和 `.custom-scrollbar` 类的元素
- **特性**: 
  - 不占用容器宽度（`overflow: overlay`）
  - 宽度 6px，圆角 3px
  - 默认透明（隐藏）
  - Hover 时显示，颜色使用主色调
  - 深色模式自动适配
- **颜色变量**: 
  - 浅色模式：`var(--color-primary-200)`, hover 时 `var(--color-primary-300)`
  - 深色模式：`var(--color-primary-400)`, hover 时 `var(--color-primary-500)`
- **Firefox 支持**: 使用 `scrollbar-width: thin` 和 `scrollbar-color`

### 实现位置
- **CSS**: `src/app/globals.css` - 全局滚动条样式
- **应用**: Blog 页面的三个滚动区域（左侧菜单、中间内容、右侧目录）

## 静态博客工具函数

### `src/utils/staticBlog.ts`

#### `getAllArticleSlugs(): string[]`
- 从 `categories` 配置中提取所有叶子节点（文章）的 ID
- 递归遍历分类树，只返回 `children.length === 0` 的节点
- 用于在构建时确定需要处理哪些 Markdown 文件

#### `getStaticPostBySlug(slug: string): Promise<ParsedPost | null>`
- 根据 slug 读取并解析 Markdown 文件
- 文件路径：`src/content/blog/${slug}.md`
- 调用 `parseMarkdown` 完成解析
- **仅在构建时调用**，不在运行时使用

#### `getAllStaticPosts(): Promise<Array<{ slug: string; post: ParsedPost }>>`
- 获取所有文章的静态数据
- 遍历 `getAllArticleSlugs()` 的结果，逐个解析
- 返回 `{ slug, post }[]` 数组
- **在 `page.tsx` 的 Server Component 中调用**

## Markdown 工具函数

### `src/utils/markdown.ts`

#### `extractToc(markdown: string): TocItem[]`
- 从 Markdown 文本中提取目录结构
- 自动处理重复标题（添加数字后缀）
- 返回 `{ level, text, id }[]` 数组

#### `markdownToHtml(markdown: string, toc: TocItem[]): Promise<string>`
- 将 Markdown 转换为 HTML
- 接收 TOC 参数确保 ID 一致
- 使用 remark 和 rehype 插件增强功能

#### `parseMarkdown(fileContent: string): Promise<ParsedPost>`
- 解析 Markdown 文件（包含 frontmatter）
- 先提取 TOC，再转换 HTML（确保 ID 一致）
- 返回完整的文章数据

## 状态管理最佳实践

### Catalog 组件状态管理
- **activeIndex**: 当前激活的标题索引
- **expandedIds**: 已展开的标题 ID 集合
- **isAllExpanded**: 是否全部展开状态
- **itemRefs**: 目录项 DOM 引用数组（用于滚动和进度条定位）
- **isClickScrolling**: 标记是否为点击触发的滚动（防止自动高亮冲突）
- **scrollTimeoutRef**: 滚动定时器引用（用于延迟解除点击标记）

### 关键 useEffect 依赖
```typescript
// 初始化展开状态和激活索引 - 依赖 toc 变化
useEffect(() => { ... }, [toc])

// 自动滚动目录让激活项保持在视野中间 - 依赖 activeIndex
useEffect(() => { ... }, [activeIndex])

// 监听页面滚动，自动高亮当前可见的标题 - 依赖 toc
useEffect(() => { ... }, [toc])
```

### Blog 页面状态管理

#### Server Component (`page.tsx`)
- **allPosts**: 构建时生成的所有文章数据 `Record<string, ParsedPost>`
- 调用 `getAllStaticPosts()` 获取静态数据
- 通过 props 传递给 `BlogPageClient`

#### Client Component (`BlogPageClient.tsx`)
- **selectedSubCategory**: 当前选中的文章 ID
- **currentCategory**: 当前选中的分类 ID
- **currentPost**: 当前文章数据（title, content, toc）
- **isLeftSidebarOpen / isRightSidebarOpen**: 侧边栏展开状态
- **无 loading 状态**: 因为数据已在 props 中，切换瞬间完成

## 性能优化

### SSG 静态生成（核心优化）
**问题**: 之前每次刷新页面需要：
1. 读取 `.md` 文件（I/O）
2. 解析 frontmatter（`gray-matter`）
3. 提取 TOC（正则匹配）
4. Markdown → HTML（`remark` + `rehype`，耗时 3-5 秒）

**解决方案**: 
- 将所有 Markdown 处理移到**构建时**
- 运行时直接从 props 读取预处理的 HTML
- 切换文章从 **3-5秒** 降至 **<10ms**
- 刷新页面从 **3-5秒** 降至 **<100ms**

### 实现细节
```typescript
// 构建时（page.tsx - Server Component）
export default async function BlogPage() {
  const postsArray = await getAllStaticPosts(); // 构建时执行一次
  const allPosts = Object.fromEntries(
    postsArray.map(({ slug, post }) => [slug, post])
  );
  return <BlogPageClient allPosts={allPosts} />; // 传给客户端
}

// 运行时（BlogPageClient.tsx - Client Component）
useEffect(() => {
  const post = allPosts[selectedSubCategory]; // 瞬间读取！
  setCurrentPost(post);
}, [selectedSubCategory, allPosts]);
```

### useMemo 使用
- `firstHotArticle`: 缓存第一个 hot 文章的查找结果
- `visibleItems`: 缓存可见的目录项（根据展开状态过滤）

### IntersectionObserver
- 用于监听标题元素进入视口
- `rootMargin: '-50px 0px -80% 0px'` - 标题距顶部 50px 触发
- 避免在点击滚动期间触发自动高亮（`isClickScrolling` 标记）

### 防止重复渲染
- 使用 `useCallback` 包装事件处理函数
- 使用 `useMemo` 缓存计算结果
- 切换文章时清空 `itemRefs.current` 防止旧引用累积

## 待完善功能
- MD 文件代码高亮
- 图片优化（Next.js Image 组件）
- 其他 UI 组件（Input, Card, Modal 等）
- 搜索功能
- 标签页面
- RSS 订阅
- 评论系统
- 文章访问统计

## 注意事项和最佳实践

### 样式相关
- **禁止使用 onMouseEnter/onMouseLeave**：所有 hover 效果通过 CSS 类名实现
- **禁止使用 dark: 前缀**：虽然 UnoCSS 支持（配置了 `dark: 'class'`），但为了统一性，统一使用三元表达式或内联样式根据 `theme` 状态判断
- **禁止使用 inline 相关类名**：如 `inline-flex`、`inline-block`，统一使用 `flex` 或 `block`
- **按钮无边框无阴影**：保持简洁设计
- **动态类名限制**：Tailwind/UnoCSS 不支持运行时动态拼接类名（如 `bg-[${color}]`），必须使用 `style` 属性或 CSS 变量
- **不使用 SCSS/SASS**：所有样式使用 Tailwind/UnoCSS 类名或内联样式，不创建单独的样式文件

### 变量命名规范
- **theme**：表示主题模式，值为 `'light'` | `'dark'`
- **colorScheme**：表示色调，值为 `'purple'` | `'blue'` 等
- **避免使用 isDark、currentTheme** 等旧命名

### 颜色处理
- **透明度优先**：使用 `colorUtils.withAlpha(color, 0.05)` 而非 `adjustBrightness(color, 160)`
- **原因**：透明度对所有颜色效果一致，亮度调整在不同颜色上效果差异大
- **CSS 变量**：当 style 属性的优先级高于 class 时，使用 CSS 变量（如 `--hover-bg`）配合 `hover:bg-[var(--hover-bg)]`

### 属性传递
- **className 合并**：使用 `cn(baseClass, conditionalClass, props.className)` 确保外部类名不被覆盖
- **style 合并**：使用 `{ ...defaultStyle, ...props.style }` 确保外部样式优先级最高
- **其他属性**：使用 `{...props}` 传递所有剩余属性

### 组件开发
- **组件注释**：使用 `/** */` JSDoc 格式
- **HTML 注释**：使用 `{/* 注释内容 */}` 标注区块功能
- **客户端组件**：交互功能必须添加 `'use client'` 指令
- **水合错误**：确保 SSR 和 CSR 渲染一致（已通过字体配置统一解决）

## 关键 Bug 修复记录

### 1. 目录重复项 Bug（JavaScript 异步编程文章）
**问题**: 文章中有两个"基础用法"标题，生成的 ID 相同，导致目录出现重复项且无法点击。

**原因**: 
- `extractToc` 函数直接生成 ID，没有去重处理
- `rehype-slug` 独立生成 HTML 标题 ID，两者不一致
- 相同 ID 导致 React key 冲突、IntersectionObserver 混乱、itemRefs 引用错乱

**解决方案**:
1. `extractToc` 使用 `Map` 记录 ID 出现次数，重复时添加数字后缀
2. `markdownToHtml` 接收 TOC 参数，使用自定义 rehype 插件设置 ID
3. `parseMarkdown` 先提取 TOC，再用 TOC 生成 HTML（确保 ID 一致）

### 2. 点击目录滚动动画跳跃 Bug
**问题**: 快速连续点击目录项时，滚动动画会跳跃。

**原因**: 前一个平滑滚动动画还未完成，新的滚动动画就开始了。

**解决方案**: 
- 改为瞬间跳转（`behavior: 'auto'`），不使用平滑滚动
- 缩短防抖时间从 800ms 到 100ms

### 3. 点击目录触发自动高亮 Bug
**问题**: 点击目录项跳转时，滚动过程中会依次高亮中间的每个标题。

**原因**: `IntersectionObserver` 监听到滚动过程中的标题进入视口，触发自动高亮。

**解决方案**:
- 添加 `isClickScrolling` ref 标记
- 点击时设置标记为 `true`
- `IntersectionObserver` 检查标记，为 `true` 时不更新高亮
- 100ms 后解除标记

### 4. 切换文章后目录顶部出现重复项 Bug
**问题**: 频繁切换文章后，目录顶部出现多个"基础用法"项。

**原因**: 
- `itemRefs.current` 数组没有在文章切换时清空
- 旧的 DOM 引用累积，导致渲染异常

**解决方案**:
- 在 `useEffect([toc])` 中添加 `itemRefs.current = []`
- 每次 TOC 变化时清空旧引用

### 5. RecursiveMenu 刷新后默认展开所有菜单 Bug
**问题**: 切换文章或刷新页面后，左侧菜单默认展开所有项。

**原因**: `setExpandedItems((prev) => ...)` 累积了之前的状态。

**解决方案**:
- 移除 `prev` 依赖，直接创建新的 `Set`
- 只包含当前选中项和其祖先节点

### 6. 展开/收起逻辑 Bug
**问题**: 只有根节点可以展开收起，其他节点不能。

**原因**: `getVisibleItems` 只查找最近的父节点，无法处理多层级嵌套。

**解决方案**:
- 重写 `getVisibleItems` 函数
- 使用 `lastVisibleAtLevel` 记录每个层级最后显示的节点
- 检查所有更浅层级的父节点是否都展开

### 7. 刷新页面加载缓慢 Bug（性能优化）
**问题**: 刷新页面时默认文章需要 5 秒才能加载出来，但切换文章较快。

**根本原因**: 
- 使用 API 路由，每次刷新都要重新解析 Markdown
- `remark` + `rehype` 处理链非常耗时（3-5 秒）
- 即使客户端切换快（因为已有数据），刷新会丢失所有状态

**解决方案 - SSG（静态站点生成）**:
1. **创建 `staticBlog.ts`**: 提供构建时工具函数
   - `getAllArticleSlugs()`: 从 categories 提取所有文章 ID
   - `getStaticPostBySlug()`: 解析单个 Markdown 文件
   - `getAllStaticPosts()`: 批量处理所有文章
2. **拆分组件**:
   - `page.tsx`: Server Component，调用 `getAllStaticPosts()`
   - `BlogPageClient.tsx`: Client Component，接收 `allPosts` prop
3. **数据流**:
   - 构建时：Markdown → HTML（一次性处理）
   - 运行时：直接从 props 读取，无需 API

**性能提升**:
- 刷新页面: 5秒 → <100ms（50倍提升）
- 切换文章: 3-5秒 → <10ms（500倍提升）
- 首屏加载: 包含所有文章数据，无需额外请求

## 架构决策

### 为什么使用复合组件（Composite Component）？
**Button 组件架构**: BaseButton + PrimaryButton + DefaultButton + TextButton + LinkButton

**优势**:
1. **职责分离**: 每个子组件只负责一种按钮样式
2. **易于维护**: 修改某种类型不影响其他类型
3. **易于扩展**: 新增类型只需添加新组件
4. **代码复用**: BaseButton 处理公共逻辑
5. **类型安全**: 每个子组件有明确的 props 类型

### 为什么使用 TypeScript 配置而非 JSON？
**分类配置**: `/src/config/categories.ts`

**优势**:
1. **类型安全**: 编译时检查数据结构
2. **智能提示**: IDE 自动补全
3. **工具函数**: 可直接导出辅助函数
4. **注释支持**: 可添加 JSDoc 注释
5. **灵活性**: 可使用 TypeScript 特性（enum、type 等）

### 为什么使用 Zustand 而非 Redux？
**状态管理**: `/src/store/app.ts`

**优势**:
1. **简单**: 无需 action、reducer、dispatch
2. **轻量**: 包体积小，无额外依赖
3. **灵活**: 支持中间件（persist）
4. **TypeScript 友好**: 原生 TypeScript 支持
5. **性能好**: 基于 hooks，按需更新

### 为什么使用 SSG 而非 API 路由？
**演进历程**: API 路由 (`/api/blog/[slug]`) → SSG (Server Component)

**API 路由的问题**:
- 每次请求都要解析 Markdown（3-5 秒）
- 即使加缓存，首次访问仍然很慢
- 刷新页面需要重新请求

**SSG 的优势**:
1. **性能极致**: 构建时处理一次，运行时零处理
2. **无需 API**: 数据直接内嵌在页面中
3. **SEO 友好**: 完整的 HTML 直接渲染
4. **CDN 缓存**: 静态页面可完全缓存
5. **开发体验**: 本地开发时也是秒开

**何时使用 API 路由**:
- 数据频繁变化（如评论、点赞）
- 需要权限控制
- 数据来自数据库或第三方 API

## 技术债务
- [ ] 滚动条"只在滚动时显示"功能已回退（需要 JS 控制，暂时搁置）
- [ ] 代码高亮未实现（需要 `rehype-highlight` 或 `prism`）
- [ ] 图片未优化（需要 Next.js Image 组件和图片处理）
- [ ] 无单元测试（需要 Jest + Testing Library）
- [ ] 无 E2E 测试（需要 Playwright 或 Cypress）
