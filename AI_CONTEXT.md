# AI 上下文文档

## 项目全局提示词
1. 此项目是一个博客系统，但是生成的假数据都不能和博客有关，相关字眼可以用英文或者拼音代替，但是AI_CONTENT文件照常用正常的中文去写
2. 每次生成内容不总结，不解释
3. 不允许出现:dark相关类名
4. 任何关于点击或锚点的按钮（除特殊说明外）一律用公共Button组件
5. 色调，深色浅色模式项目中已经做了处理，之后生成代码中（除特殊说明外）一律不产生额外处理主题色的逻辑
6. 你不用管文字的任何样式（除特殊说明外），包括字体、大小、颜色

## 项目概述
这是一个基于 Next.js 15 的现代化博客项目，采用 App Router 架构和 SSG 静态站点生成。

## 技术栈
- **框架**: Next.js 15 (App Router + SSG) + React 19 + TypeScript
- **样式**: Tailwind CSS + UnoCSS
- **状态管理**: Zustand (持久化到 localStorage)
- **Markdown 处理**: remark + rehype + gray-matter + dayjs
- **字体**: Geist Sans + Geist Mono
- **图标**: @ant-design/icons (Iconfont)
- **工具库**: clsx, tailwind-merge, lodash

## 核心架构

### 新架构概述 (lib/blog)
项目采用全新的面向对象架构，核心是 `Blog` 类，负责统一管理所有博客数据和逻辑。

```
src/lib/blog/
├── index.ts          # Blog 类主文件，数据管理中心
├── loader.ts         # 原始数据加载器
├── processor.ts      # Markdown 处理器 (HTML转换, 目录生成, 元数据解析)
```

### 数据流架构
```
1. 原始数据加载: loader.ts → RawBlogItem[]
2. 数据处理: processor.ts → BlogItem[] + 目录树 + 标签映射
3. 菜单填充: index.ts → 完整的 MenuNode[] 树
4. 服务端传递: layout.tsx → 序列化安全的数据 → ClientLayout
5. 客户端渲染: RecursiveMenu + Catalog 组件
```

## 核心类型定义

### BlogItem (src/types/blog.ts)
```typescript
export interface BlogItem {
  slug: string;                    // URL路径标识
  metadata: {
    title: string;
    description?: string;
    createdAt: string;            // dayjs格式化时间
    updatedAt?: string;
    tags: Tags[];                 // 标签数组
  };
  content: string;                // 处理后的HTML内容
  catalogTree: CatalogNode[];     // 树形目录结构
}
```

### MenuNode (src/types/menu.ts)
```typescript
export interface MenuNode {
  id: string;
  name: string;
  parentId: string | null;
  type: "menu" | "leaf";          // menu=分类节点, leaf=文章节点
  tags?: Tags[];
  metadata?: BlogItem["metadata"]; // leaf类型才有
  path?: string;                   // leaf类型的访问路径
  children: MenuNode[];
}
```

### CatalogNode (src/types/catalog.ts)
```typescript
export interface CatalogNode {
  level: number;                  // 标题层级 1-6
  title: string;                  // 标题文本
  id: string;                     // 锚点ID
  parent: CatalogNode | null;     // 父节点引用
  children: CatalogNode[];        // 子节点数组
  isExpanded: boolean;            // 展开状态
}
```

## 项目结构
```
src/
├── app/                          # Next.js App Router
│   ├── blog/                     # 博客模块
│   │   ├── layout.tsx           # 服务端布局，数据获取和传递
│   │   ├── clientLayout.tsx     # 客户端布局，交互逻辑
│   │   ├── page.tsx             # 博客首页
│   │   ├── [slug]/             # 动态路由
│   │   │   └── page.tsx        # 文章页面 (/blog/article-slug)
│   │   └── page.scss           # 博客样式
│   ├── ui/page.tsx             # UI演练场
│   ├── layout.tsx              # 根布局
│   └── page.tsx                # 网站首页
├── lib/                         # 核心业务逻辑
│   ├── blog/                   # 博客系统核心
│   │   ├── index.ts            # Blog类，数据管理中心
│   │   ├── loader.ts           # 数据加载器
│   │   └── processor.ts        # Markdown处理器
│   └── utils/                  # 通用工具
│       └── tools.ts            # 工具函数 (cn, generateSlug等)
├── components/                  # 可复用组件
│   ├── Button/                 # 按钮组件系统
│   ├── Icon/                   # 图标组件
│   ├── Menu/                   # 菜单组件 (RecursiveMenu)
│   ├── Catalog/                # 目录组件
│   ├── SidebarToggle/          # 侧边栏切换组件
│   └── layout/                 # 布局组件 (Header, Footer)
├── types/                      # 类型定义
│   ├── blog.ts                # 博客相关类型
│   ├── menu.ts                # 菜单相关类型
│   └── catalog.ts             # 目录相关类型
├── store/                      # 状态管理
│   └── app.ts                 # Zustand 全局状态
├── content/blogs/              # Markdown 文章内容
└── hooks/                      # 自定义 Hooks
    └── useCatalogObserver.ts   # 目录观察器 Hook
```

## Blog 类核心功能

### 数据管理
```typescript
class Blog {
  rawBlogList: RawBlogItem[] = [];        // 原始数据
  blogList: BlogItem[] = [];              // 处理后的数据
  tag2BlogMap: Map<Tags, BlogItem[]>;     // 标签映射
  menuTree: MenuNode[] = [];              // 菜单树(含文章)
  tagSet: Set<Tags> = new Set();          // 标签集合
  tagList: Tags[] = [];                   // 标签数组
}
```

### 核心方法
- `async init()`: 初始化所有数据，调用各个生成方法
- `generateRawBlogList()`: 加载原始 Markdown 文件
- `generateBlogList()`: 将原始数据转换为 BlogItem
- `generateTagSet/TagList()`: 生成标签相关数据
- `generateTag2BlogMap()`: 创建标签到文章的映射
- `fillMenuTree()`: 根据标签将文章填充到菜单树中

### 菜单填充逻辑 
**核心思路**: 基于静态菜单结构 + 动态文章填充
1. 从静态 `menuTree` 读取基础分类结构
2. 扫描所有 `BlogItem`，根据 `tags` 创建文章菜单项
3. 遍历菜单树，将匹配标签的文章添加到对应分类的 `children` 中
4. 文章节点类型为 `LEAF`，包含 `path` 和 `metadata`

## 路由系统

### 动态路由 (/blog/[slug])
- **文件**: `src/app/blog/[slug]/page.tsx`
- **URL模式**: `/blog/文章标识符`  
- **参数传递**: Next.js 自动将 URL 中的 `[slug]` 提取为 `params.slug`
- **数据获取**: 服务端组件通过 `blog.getBlogBySlug(slug)` 获取文章

### Layout 系统
- **服务端Layout**: `blog/layout.tsx` - 调用 `blog.init()`，获取数据并传递
- **客户端Layout**: `blog/clientLayout.tsx` - 接收数据，处理交互（侧边栏展开等）
- **三栏布局**: 左侧菜单 + 中间内容 + 右侧目录

## Markdown 处理流程

### processor.ts 三大核心函数
1. **`markdownToHtml(mdStr: string): Promise<string>`**
   - remark + remarkGfm + remarkRehype + rehypeSlug + rehypeAutolinkHeadings
   - 生成带锚点的 HTML

2. **`buildCatalog(mdStr: string): CatalogNode[]`**
   - 提取标题，生成唯一ID（处理重复标题）
   - 构建树形目录结构，设置 parent/children 关系

3. **`buildMetadata(fileContent: string)`**
   - 使用 gray-matter 解析 frontmatter
   - 返回 `{ metadata, mdContent }` 分离的数据

### 数据处理顺序
```typescript
// Blog.generateBlogList() 中的处理流程
for (const rawItem of this.rawBlogList) {
  const { metadata, mdContent } = buildMetadata(rawItem.content);
  const htmlContent = await markdownToHtml(mdContent);
  const catalogTree = buildCatalog(mdContent);
  
  this.blogList.push({
    slug: generateSlug(metadata.title),
    metadata,
    content: htmlContent,
    catalogTree
  });
}
```

## Markdown样式系统

### 完整样式支持
项目实现了完整的Markdown元素样式系统，包含：

- **标题样式** (h1-h6): 递进的字体大小和权重，统一的间距
- **文本样式**: 加粗(b/strong)、斜体(i/em)、删除线(del/s)、下标、上标
- **代码样式**:
  - 行内代码: 背景色、圆角、内边距、主色调文字
  - 代码块: 区分长短代码块，长代码块带语言标签和容器包装
- **列表样式**:
  - 无序列表: 主色调项目符号，支持嵌套缩进
  - 有序列表: 主色调数字编号
  - 任务列表: 自定义checkbox样式，支持完成状态
- **引用块**: 左边框设计，支持嵌套，hover动画效果
- **表格样式**: 表头背景色、行交替颜色、响应式设计、hover效果
- **分割线**: 主色调线条，合适间距
- **链接样式**: 主色调，hover下划线效果，已访问状态
- **HTML内联**: 自动支持内联样式和标签
- **数学公式**: KaTeX渲染支持，完整的数学字体样式

### 技术实现
- **插件架构**: rehype-plugins.ts 管理自定义rehype插件
- **代码块容器**: 自动为pre标签添加容器包装，便于样式控制
- **主题适配**: 基于CSS变量的主色调系统
- **SCSS嵌套**: 现代化的样式组织方式
- **数学公式**: remark-math + rehype-katex 完整支持

### 样式文件
- **MdHtmlViewer.scss**: 完整的Markdown样式系统
- **主题变量**: 通过CSS变量实现主题适配
- **组件隔离**: 样式作用于特定组件，避免全局污染

## 组件系统

### RecursiveMenu 菜单组件
- **数据源**: 填充后的 `MenuNode[]` 树
- **类型区分**: 根据 `item.type` 决定渲染和交互
  - `MENU`: 显示展开图标，点击切换展开状态
  - `LEAF`: 不显示图标，点击导航到 `item.path`
- **选中逻辑**: `pathname === item.path` 判断当前文章
- **层级缩进**: `paddingLeft: 12 + depth * 16px`

### Catalog 目录组件
- **数据源**: 当前文章的 `catalogTree: CatalogNode[]`
- **树形渲染**: 可展开目录项 + 叶子目录项
- **滚动同步**: IntersectionObserver 监听标题，自动高亮目录项
- **进度指示**: 根据当前标题位置动态计算进度条位置

### SidebarToggle 侧边栏组件 
- **通用性**: 同时用于左右侧边栏
- **Props**: `direction`, `isOpen`, `onToggle`, 位置配置
- **样式**: 根据方向动态调整图标旋转和位置

## 数据序列化和传递

### 问题: Next.js 序列化限制
- **不支持**: Map, Set, 类实例, 循环引用
- **支持**: 纯对象, 数组, 基础类型

### 解决方案: layout.tsx
```typescript
// 服务端组件
export default async function BlogLayout({ children }) {
  await blogInstance.init();
  
  const blogData = {                     // 只传递纯对象
    menuTree: blogInstance.menuTree,     // MenuNode[]
    blogList: blogInstance.blogList,     // BlogItem[]  
    tagList: Array.from(blogInstance.tagSet) // Set → Array
  };
  
  return <ClientLayout blogData={blogData}>{children}</ClientLayout>;
}
```

## 主题系统

### 状态管理 (Zustand)
- **theme**: `'light' | 'dark'` - 黑夜/白天模式
- **colorScheme**: `'purple' | 'blue' | 'green'` 等 - 主色调
- **持久化**: localStorage 存储

### 样式实现
- **禁用 `dark:` 前缀**: 统一使用三元表达式 `theme === 'dark' ? '...' : '...'`
- **颜色处理**: `colorUtils.withAlpha(color, alpha)` 生成透明度
- **CSS 变量**: 复杂场景使用 CSS 变量配合 style 属性

## 性能优化

### SSG 静态站点生成
- **构建时**: 所有 Markdown → HTML 转换完成
- **运行时**: 直接读取预处理数据，无需 API 调用
- **性能提升**: 文章加载从 3-5s → <10ms

### 数据结构优化
- **标签映射**: `Map<Tags, BlogItem[]>` 快速查找
- **树形目录**: 直接 parent/children 引用，无需递归查找
- **去重处理**: Set 自动去重，避免重复数据

## 开发规范

### 组件开发
- **客户端组件**: 交互功能添加 `'use client'` 指令
- **类型安全**: 所有 interface 严格定义
- **Props 传递**: 支持 `className`, `style`, `{...props}` 透传
- **按钮统一**: 使用公共 `Button` 组件，不自定义按钮样式

### 文件命名
- **组件**: PascalCase (`RecursiveMenu.tsx`)
- **工具**: camelCase (`generateSlug`)
- **页面**: kebab-case (动态路由文件夹)

### 状态管理
- **全局状态**: Zustand (`theme`, `colorScheme`)
- **局部状态**: useState (侧边栏展开, 目录展开)
- **服务端数据**: 通过 props 传递，不使用客户端状态

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
- 当前使用的图标：icon-github, icon-moon, icon-sun, icon-expand, icon-loading

## Select 组件
- 自定义下拉选择器组件
- **功能**：支持选项列表、当前值、变更回调
- **样式**：适配 light/dark 主题，自动使用主色调
- **交互**：点击展开/收起，点击外部自动关闭
- **图标**：使用 `icon-expand`，展开时旋转 270 度，收起时旋转 180 度
- **定位**：下拉列表显示在触发器下方（`top: 100%`）
- **使用场景**：Header 中的色调选择器

## Layout 组件系统

### Layout 主组件
- **功能**：网站主布局，包含Header和Footer
- **主题初始化**：负责同步DOM的dark class和colorScheme
- **固定Header**：`pt-17` 给内容区域留出Header空间
- **showFooter**：可选的Footer显示控制

### Header 组件
- **功能**：固定在页面顶部的导航栏
- **包含**：网站名称、导航菜单、色调选择器、主题切换按钮
- **样式**：动态背景色和主色调阴影效果
- **智能主题切换**：黑白色调与深浅主题自动匹配
- **导航链接**：首页、博客、GitHub、演练场、关于等

### Footer 组件
- **功能**：网站底部信息
- **包含**：品牌信息、导航链接、社交链接
- **布局**：响应式网格布局，适配移动端

## useCatalogObserver Hook（目录观察器）

### 核心功能
- **activeId**: 当前激活的标题ID
- **expandedIds**: 展开的目录项ID集合  
- **isAllExpanded**: 是否全部展开状态
- **progressPosition**: 进度指示器位置计算
- **catalogRef**: 目录容器DOM引用

### 配置选项
```typescript
interface CatalogObserverOptions {
  itemHeight?: number; // 目录项高度，默认40px
}
```

### 导出功能
- **setActiveId**: 手动设置激活标题
- **expandedIds / setExpandedIds**: 展开状态管理
- **toggleExpand**: 切换单个项目展开状态
- **toggleAllExpand**: 全部展开/收起切换
- **progressPosition**: 进度条位置 `{top, height}`

### 进度指示器逻辑
- **计算策略**: 找到当前激活项的最顶级收起祖先
- **定位规则**: 从根节点开始计算可见项数量
- **动态高度**: 基于配置的itemHeight计算位置

### IntersectionObserver
- **监听策略**: `rootMargin: '-50px 0px -80% 0px'`，标题距顶部50px触发
- **防冲突**: `isClickScrolling` 标记防止点击滚动时的自动高亮
- **自动初始化**: 延迟初始化确保DOM渲染完成

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

## UI 演练场系统

### 功能概述
- **页面路径**: `/ui` - UI组件展示和测试页面
- **组件展示**: Button的所有类型、尺寸、状态演示
- **交互测试**: 点击事件、加载状态、禁用状态等
- **实时预览**: 所有组件的实际渲染效果

### 展示内容
- **Button组件**：4种类型 × 3种尺寸的完整矩阵
- **交互示例**：alert、console.log、confirm等测试
- **状态演示**：禁用、加载中等状态效果
- **Icon组件**：图标使用示例（如果Icon正常工作）

## 博客内容管理

### 内容存储
- **位置**: `src/content/blogs/` 目录
- **格式**: Markdown文件，包含frontmatter元数据
- **当前文章**: 9篇技术文章
  - css-layout.md, javascript.md, nodejs-stream.md
  - react-hooks.md, react-performance.md, typescript.md  
  - vite.md, vue-basics.md, vue-router-guide.md

### 三栏博客布局
- **实现**: `src/app/blog/clientLayout.tsx`
- **左侧**: 分类导航菜单（280px宽，可收起）
- **中间**: 文章内容区域（flex-1，自适应）
- **右侧**: 文章目录（280px宽，可收起）
- **交互**: SidebarToggle组件控制侧边栏展开收起

## 当前完成功能
- ✅ 完整的Button组件系统（4类型×3尺寸）
- ✅ colorUtils颜色处理工具集
- ✅ useCatalogObserver目录观察器Hook
- ✅ Select下拉选择器组件
- ✅ Zustand主题状态管理（theme + colorScheme）
- ✅ 完整的Layout系统（Header + Footer + Layout）
- ✅ 自定义滚动条样式系统
- ✅ UI演练场组件展示页面
- ✅ 全新 lib/blog 架构
- ✅ 完整的类型系统 (BlogItem, MenuNode, CatalogNode)
- ✅ Markdown 处理三大核心函数
- ✅ 动态路由系统 (/blog/[slug])
- ✅ 树形目录结构和递归菜单
- ✅ 三栏博客布局（侧边栏展开收起）
- ✅ SSG 静态站点生成
- ✅ 服务端/客户端数据传递
- ✅ 9篇博客文章内容
- ✅ 完整的Markdown样式系统
- ✅ 数学公式支持（KaTeX渲染）
- ✅ HTML内联样式自动支持

## 待完善功能
- [ ] 文章更新时间处理逻辑
- [ ] 代码语法高亮
- [ ] 图片优化 (Next.js Image)
- [ ] 搜索功能
- [ ] 标签页面
- [ ] 评论系统
- [ ] 访问统计

## 技术债务
- [ ] Icon 组件 iconfont 加载问题排查
- [ ] 代码高亮插件集成
- [ ] 单元测试覆盖
- [ ] E2E 测试
- [ ] SEO 优化

## 关键架构决策

### 为什么使用面向对象 Blog 类？
- **数据统一管理**: 避免工具函数散落各处
- **状态一致性**: 所有数据在同一个实例中
- **易于扩展**: 新功能直接添加到类中
- **类型安全**: TypeScript 类提供更好的类型检查

### 为什么使用树形数据结构？
- **性能优势**: 直接引用 parent/children，无需递归查找
- **内存友好**: 避免数据冗余和重复计算
- **易于操作**: 展开/收起操作直接修改节点属性

### 为什么分离 loader 和 processor？
- **职责单一**: loader 只负责文件读取，processor 只负责数据转换
- **易于测试**: 独立函数更容易单元测试
- **可维护性**: 修改处理逻辑不影响数据加载