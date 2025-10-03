# AI 上下文文档

## 项目概述
这是一个基于 Next.js 15 的现代化博客项目，名为 "boke"。

## 技术栈
- **框架**: Next.js 15 + React 19 + TypeScript
- **样式**: Tailwind CSS + UnoCSS
- **状态管理**: Zustand (持久化到 localStorage)
- **字体**: Geist Sans + Geist Mono
- **图标**: @ant-design/icons (Iconfont)
- **工具库**: clsx, tailwind-merge

## 项目结构
```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── ui/page.tsx        # UI演练场（客户端组件）
│   ├── layout.tsx         # 根布局
│   └── globals.css        # 全局样式
├── components/            # 组件库
│   ├── Button/           # 按钮组件
│   │   ├── Button.tsx    # 按钮组件实现
│   │   └── index.ts      # 按钮组件导出
│   ├── Icon/             # 图标组件
│   │   ├── Icon.tsx      # Iconfont 图标组件
│   │   └── index.ts      # 图标组件导出
│   ├── Menu/             # 菜单组件
│   │   ├── RecursiveMenu.tsx  # 递归菜单组件
│   │   └── index.ts      # 菜单组件导出
│   ├── Layout.tsx        # 布局组件
│   ├── Header.tsx        # 头部组件
│   └── Footer.tsx        # 底部组件
├── store/                # 全局状态管理
│   └── app.ts            # 应用状态 (Zustand)
├── config/               # 配置文件
│   └── categories.ts     # 博客分类配置
└── utils/
    └── tools.ts          # 工具函数集合 (cn, colorUtils)
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
- **BaseButton**：基础按钮组件，处理公共逻辑（事件、加载状态、尺寸）
- **PrimaryButton**：主按钮，主色调背景渐变 + 白字（白色色调用黑字）
- **TextButton**：文本按钮，主色调文字 + 无背景（hover 有灰色背景）
- **LinkButton**：链接按钮，主色调文字 + 下划线
- **DefaultButton**：默认按钮，主色调文字 + 灰色背景
- **Button**：主组件，根据 `type` 选择具体实现，传递 `theme` 状态

### 类型和尺寸
- **类型**: primary, text, link, default
- **尺寸**: sm, md, lg
- **功能**: loading 状态, 禁用状态
- **样式**: 渐变背景（从标准色到浅色）, 悬停动画, 点击缩放效果
- **交互**: cursor-pointer, active:scale-95 触摸反馈, select-none 防止文本选中
- **注释**: 所有 props 都有完整的 JSDoc 注释

### 按钮类型详细说明
1. **primary**：主色调背景（渐变到浅色），白色文字（白色色调用黑色文字）
2. **text**：无背景，主色调文字，hover 时有灰色背景（根据 theme 选择深浅）
3. **link**：无背景，主色调文字 + 下划线，hover 时无下划线
4. **default**：灰色背景（根据 theme 选择深浅），主色调文字

### 按钮使用 div 而非 button
- 使用 `<div>` 元素而非 `<button>` 避免原生样式干扰
- 添加 `role="button"`, `tabIndex`, `aria-disabled` 保证可访问性
- 添加 `onKeyDown` 处理键盘事件（Enter/Space）

## Icon 组件
- 基于 `@ant-design/icons` 的 `createFromIconfontCN`
- 配置 scriptUrl 指向 iconfont.cn 生成的 JS 文件
- 使用方式：`<Icon type="icon-name" style={{ fontSize: '20px' }} />`
- 当前使用的图标：icon-github, icon-moon, icon-sun

## 博客系统架构
- **分类系统**: 基于 TypeScript 配置的层级分类结构
- **标签系统**: MD 文件前置元数据中的标签字段
- **路由生成**: 根据分类配置自动生成页面路由
- **内容管理**: MD 文件存储在 `/src/content/blog/` 目录
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
- **博客首页** (`/blog`): 三栏布局，左侧分类导航，中间内容区域，右侧目录导航
- **URL 同步**: 通过查询参数 `?article=vue` 访问特定文章，支持直接链接访问
- **单页面应用**: 无页面刷新切换文章，避免闪烁问题
- **导航交互**: 点击父节点展开/收起，点击子节点切换文章内容
- **状态保持**: 文章页面保持三栏布局，左侧导航自动展开对应分类

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
  hexToRgb: (hex: string) => { r, g, b },
  rgbToHex: (r, g, b) => string,
  adjustBrightness: (hex: string, amount: number) => string
}
```

## 待完善功能
- 实现 MD 文件内容展示（格式化、样式）
- 完善右侧目录导航
- 其他 UI 组件（Input, Card, Modal 等）
- 文档系统
- 搜索功能
- 标签页面

## 注意事项
- 已修复水合错误（字体配置统一）
- UI 演练场页面已标记为客户端组件
- 所有交互功能需要在客户端组件中实现
- **禁止使用 onMouseEnter/onMouseLeave**：所有 hover 效果通过 CSS 类名实现
- **禁止使用 dark: 前缀**：UnoCSS 不支持，改用三元表达式选择类名
- **按钮无边框无阴影**：保持简洁设计
- **变量命名清晰**：theme 表示 light/dark，colorScheme 表示色调
- **色调渐变方向**：从标准色到浅色，标准色是最深的颜色
