---
title: "Vite 极速构建工具完全指南"
description: "了解 Vite 的核心原理和最佳实践"
createdAt: "2024-01-03"
updatedAt: "2024-01-08"
tags: ["vite", "vite-vue", "vite-react", "rollup", "esbuild"]
category: "前端"
featured: false
---

# Vite 极速构建工具完全指南

Vite 是新一代前端构建工具，由 Vue.js 作者尤雨溪开发，以其极快的开发服务器启动速度和热更新性能而闻名。

## 为什么选择 Vite

### 传统构建工具的问题

**Webpack 的痛点**：
- 冷启动慢：需要打包整个项目
- 热更新慢：修改一个文件需要重新打包相关模块
- 配置复杂：学习成本高

### Vite 的优势

- ⚡ **极速启动**：无需打包，秒级启动
- 🔥 **快速热更新**：基于 ESM 的 HMR，速度与项目大小无关
- 📦 **优化的构建**：基于 Rollup 的生产构建
- 🛠️ **开箱即用**：内置支持 TypeScript、JSX、CSS 等
- 🔌 **插件生态**：兼容 Rollup 插件

## 核心原理

### 开发环境：基于 ESM

Vite 在开发环境下不打包代码，而是利用浏览器原生的 ES 模块支持：

```javascript
// 传统方式：需要打包
import { createApp } from 'vue';
import App from './App.vue';

// Vite 方式：浏览器直接请求
// http://localhost:5173/@fs/path/to/vue
// http://localhost:5173/src/App.vue
```

### 依赖预构建

Vite 使用 esbuild 预构建依赖：

```bash
node_modules/.vite/
  ├── vue.js          # 预构建的 Vue
  ├── react.js        # 预构建的 React
  └── ...
```

**为什么预构建**：
1. 转换 CommonJS/UMD 为 ESM
2. 减少 HTTP 请求数量
3. 提升加载性能

### 生产构建：基于 Rollup

生产环境使用 Rollup 打包，获得最优的代码分割和懒加载效果。

## 快速开始

### 创建项目

```bash
# npm
npm create vite@latest my-app

# yarn
yarn create vite my-app

# pnpm
pnpm create vite my-app
```

### 选择模板

Vite 支持多种模板：
- vanilla（原生 JS）
- vue
- vue-ts
- react
- react-ts
- preact
- lit
- svelte
- solid

### 项目结构

```
my-app/
├── index.html          # 入口 HTML
├── package.json
├── vite.config.ts      # Vite 配置
├── public/             # 静态资源
└── src/
    ├── main.ts         # 应用入口
    ├── App.vue
    └── components/
```

## 配置

### 基础配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    open: true, // 自动打开浏览器
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

### 路径别名

```typescript
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
});
```

### 环境变量

```bash
# .env
VITE_API_URL=https://api.example.com

# .env.development
VITE_API_URL=http://localhost:3000

# .env.production
VITE_API_URL=https://prod-api.example.com
```

```typescript
// 使用环境变量
const apiUrl = import.meta.env.VITE_API_URL;
console.log(apiUrl);
```

### 代理配置

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

## 静态资源处理

### 导入静态资源

```typescript
// 导入为 URL
import imgUrl from './assets/logo.png';

// 导入为字符串
import imgContent from './assets/logo.svg?raw';

// 导入为 Web Worker
import Worker from './worker?worker';
```

### public 目录

`public` 目录下的文件会被直接复制到输出目录：

```html
<!-- 直接引用 public 目录下的文件 -->
<img src="/logo.png" />
```

### CSS 处理

```typescript
// 导入 CSS
import './style.css';

// CSS Modules
import styles from './style.module.css';

// SCSS/SASS
import './style.scss';
```

## 插件系统

### 官方插件

```bash
# Vue
npm install @vitejs/plugin-vue

# React
npm install @vitejs/plugin-react

# Legacy 浏览器支持
npm install @vitejs/plugin-legacy
```

### 使用插件

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
});
```

### 自定义插件

```typescript
export default function myPlugin() {
  return {
    name: 'my-plugin',
    
    // 转换钩子
    transform(code, id) {
      if (id.endsWith('.txt')) {
        return {
          code: `export default ${JSON.stringify(code)}`,
          map: null,
        };
      }
    },
    
    // 服务器钩子
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 自定义中间件
        next();
      });
    },
  };
}
```

## 性能优化

### 1. 依赖预构建优化

```typescript
export default defineConfig({
  optimizeDeps: {
    include: ['lodash-es', 'axios'], // 预构建指定依赖
    exclude: ['some-large-dep'], // 排除不需要预构建的依赖
  },
});
```

### 2. 代码分割

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router'],
          'ui': ['element-plus'],
        },
      },
    },
  },
});
```

### 3. 压缩配置

```typescript
export default defineConfig({
  build: {
    minify: 'esbuild', // 或 'terser'
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console
        drop_debugger: true,
      },
    },
  },
});
```

### 4. 图片优化

```bash
npm install vite-plugin-imagemin
```

```typescript
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 80,
      },
    }),
  ],
});
```

## 与 Webpack 对比

| 特性 | Vite | Webpack |
|------|------|---------|
| 启动速度 | ⚡ 秒级 | 🐌 分钟级 |
| 热更新 | ⚡ 毫秒级 | 🐌 秒级 |
| 配置复杂度 | 简单 | 复杂 |
| 生态 | 新兴 | 成熟 |
| 浏览器支持 | 现代浏览器 | 全面 |

## 实战案例

### Vue 3 + Vite 项目

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  plugins: [
    vue(),
    // 自动导入组件
    Components({
      dts: true,
      dirs: ['src/components'],
    }),
    // 自动导入 API
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: true,
    }),
  ],
});
```

### React + Vite 项目

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // 启用 React Fast Refresh
      fastRefresh: true,
    }),
  ],
  esbuild: {
    jsxInject: `import React from 'react'`, // 自动注入 React
  },
});
```

## 常见问题

### 1. 依赖预构建失败

```bash
# 清除缓存
rm -rf node_modules/.vite
```

### 2. HMR 不工作

检查防火墙设置，确保 WebSocket 连接正常。

### 3. 生产环境白屏

检查 `base` 配置：

```typescript
export default defineConfig({
  base: '/my-app/', // 子路径部署
});
```

## 总结

Vite 的核心优势：
- ⚡ 极速的开发体验
- 🔥 基于 ESM 的 HMR
- 📦 优化的生产构建
- 🛠️ 简单的配置
- 🔌 丰富的插件生态

Vite 是现代前端开发的最佳选择之一，特别适合新项目。

