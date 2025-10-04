"use client";

import { Layout } from "@/components/layout";
import { RecursiveMenu } from "@/components/Menu";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { categories } from "@/config/categories";
import "./page.scss";

/**
 * 目录导航组件
 * 显示当前文章的目录结构（待实现）
 */
function TableOfContents() {
  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold mb-3">目录</h3>
      <div className="space-y-2">
        <div className="text-sm opacity-60">目录内容占位</div>
        <div className="text-xs opacity-40">待实现</div>
      </div>
    </div>
  );
}

// 模拟文章数据
const mockPosts = {
  vue: {
    title: "Vue 3 Composition API 完全指南",
    content: `# Vue 3 Composition API 完全指南

Vue 3 的 Composition API 是一个革命性的特性，它让我们能够更好地组织和复用组件逻辑。

## 什么是 Composition API？

Composition API 是 Vue 3 引入的一种新的组件逻辑组织方式，它基于函数式编程的思想。

## 核心概念

### 1. setup() 函数

\`setup()\` 是 Composition API 的入口点，它在组件创建之前执行。

\`\`\`javascript
import { ref, reactive, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const state = reactive({
      name: 'Vue 3',
      version: '3.0'
    })
    
    return {
      count,
      state
    }
  }
}
\`\`\`

## 总结

Composition API 为 Vue 3 带来了更灵活、更强大的组件逻辑组织方式。`,
  },
  react: {
    title: "React Hooks 设计模式与最佳实践",
    content: `# React Hooks 设计模式与最佳实践

React Hooks 自 16.8 版本引入以来，彻底改变了我们编写 React 组件的方式。

## 自定义 Hooks 模式

### 1. 数据获取 Hook

\`\`\`javascript
import { useState, useEffect } from 'react'

function useApi(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(url)
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}
\`\`\`

## 总结

React Hooks 为我们提供了强大的工具来构建可复用、可维护的组件逻辑。`,
  },
  algorithm: {
    title: "LeetCode 两数之和：从暴力到哈希表",
    content: `# LeetCode 两数之和：从暴力到哈希表

两数之和（Two Sum）是 LeetCode 上最经典的算法题目之一。

## 题目描述

给定一个整数数组 \`nums\` 和一个整数目标值 \`target\`，请你在该数组中找出和为目标值的那两个整数。

## 解法一：暴力解法

\`\`\`javascript
function twoSum(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}
\`\`\`

## 解法二：哈希表解法

\`\`\`javascript
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}
\`\`\`

## 总结

掌握这些解法不仅有助于解决 LeetCode 题目，更重要的是培养了算法思维。`,
  },
  network: {
    title: "HTTP 协议深度解析：从基础到现代",
    content: `# HTTP 协议深度解析：从基础到现代

HTTP（HyperText Transfer Protocol）是万维网的基础协议，从 1991 年的 HTTP/0.9 到现在的 HTTP/3，经历了多次重大升级。

## HTTP 协议发展历程

### HTTP/1.0 (1996)
- 引入了请求头和响应头
- 支持多种内容类型
- 添加了状态码

### HTTP/1.1 (1997)
- 持久连接（Keep-Alive）
- 管道化（Pipelining）
- 分块传输编码

### HTTP/2 (2015)
- 二进制分帧
- 多路复用
- 服务器推送
- 头部压缩

### HTTP/3 (2022)
- 基于 QUIC 协议
- 更快的连接建立
- 改进的拥塞控制

## 总结

HTTP 协议不断演进，从最初的简单文本传输到现在的多路复用和加密，旨在提供更快、更安全的网络体验。`,
  },
  "vue-basics": {
    title: "Vue 3 基础入门指南",
    content: `# Vue 3 基础入门指南

Vue 3 是一个渐进式 JavaScript 框架，用于构建用户界面。

## 模板语法

Vue 使用基于 HTML 的模板语法，允许你声明式地将 DOM 绑定到底层组件实例的数据。

\`\`\`vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p v-if="showContent">{{ content }}</p>
  </div>
</template>
\`\`\`

## 指令

Vue 提供了许多内置指令，如 v-if、v-for、v-model 等。

## 总结

掌握 Vue 3 的基础知识是学习更高级特性的前提。`,
  },
  "vue-advanced": {
    title: "Vue 3 进阶技巧与最佳实践",
    content: `# Vue 3 进阶技巧与最佳实践

深入理解 Vue 3 的高级特性和最佳实践。

## Composition API

Composition API 是 Vue 3 的核心特性，提供了更灵活的逻辑复用方式。

## 性能优化

- 使用 v-memo 优化渲染性能
- 合理使用 keep-alive
- 懒加载组件

## 总结

掌握这些进阶技巧，让你的 Vue 应用更加高效和可维护。`,
  },
  "react-hooks": {
    title: "React Hooks 完全指南",
    content: `# React Hooks 完全指南

React Hooks 让你在函数组件中使用状态和其他 React 特性。

## 基础 Hooks

### useState
\`\`\`javascript
const [count, setCount] = useState(0)
\`\`\`

### useEffect
\`\`\`javascript
useEffect(() => {
  // 副作用逻辑
}, [dependencies])
\`\`\`

## 自定义 Hooks

创建可复用的状态逻辑。

## 总结

Hooks 让函数组件更加强大和灵活。`,
  },
  "react-state": {
    title: "React 状态管理深度解析",
    content: `# React 状态管理深度解析

探索 React 中各种状态管理方案。

## Context API

React 内置的状态管理解决方案。

## Redux

可预测的状态容器。

## Zustand

轻量级状态管理库。

## 总结

选择合适的状态管理方案对应用的可维护性至关重要。`,
  },
};

/**
 * 博客首页组件
 * 三栏布局：左侧分类导航 + 中间文章内容 + 右侧目录
 * 支持 URL 同步和单页面应用切换
 * 支持左右侧边栏收起/展开
 */
export default function BlogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  /** 当前选中的子分类ID */
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  /** 当前选中的分类ID */
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  /** 左侧边栏是否展开 */
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  /** 右侧边栏是否展开 */
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  /** 从 URL 参数初始化状态 */
  useEffect(() => {
    const article = searchParams.get("article");
    if (article) {
      setSelectedSubCategory(article);
      // 找到对应的父分类
      const parentCategory = categories.find((cat) =>
        cat.children?.some((child) => child.id === article)
      );
      setCurrentCategory(parentCategory?.id || null);
    }
  }, [searchParams]);

  /** 处理子分类选择，更新状态和 URL */
  const handleSubCategorySelect = (subCategoryId: string) => {
    setSelectedSubCategory(subCategoryId);
    // 找到对应的父分类
    const parentCategory = categories.find((cat) =>
      cat.children?.some((child) => child.id === subCategoryId)
    );
    setCurrentCategory(parentCategory?.id || null);

    // 更新 URL 参数
    const params = new URLSearchParams(searchParams.toString());
    params.set("article", subCategoryId);
    router.push(`/blog?${params.toString()}`, { scroll: false });
  };

  /** 获取当前选中的文章内容 */
  const getCurrentPost = () => {
    if (!selectedSubCategory) return null;
    return mockPosts[selectedSubCategory as keyof typeof mockPosts] || null;
  };

  const currentPost = getCurrentPost();

  return (
    <Layout>
      <div className="h-full flex">
        {/* 左侧分类导航 - 可收起 */}
        <div
          className="blog-sidebar-left relative h-full transition-all duration-300"
          style={{ width: isLeftSidebarOpen ? "280px" : "0" }}
        >
          <div className="h-full overflow-hidden">
            <div
              className="w-full h-full p-4 custom-scrollbar"
              style={{ width: "280px" }}
            >
              <RecursiveMenu
                data={categories}
                currentCategory={currentCategory || undefined}
                currentSubCategory={selectedSubCategory || undefined}
                onSubCategorySelect={handleSubCategorySelect}
              />
            </div>
          </div>

          {/* 收起按钮 - 右侧居中，hover时显示 */}
          {isLeftSidebarOpen && (
            <div
              className="collapse-btn absolute z-10"
              style={{
                right: 0,
                top: "200px",
              }}
            >
              <Button
                type="default"
                size="sm"
                onClick={() => setIsLeftSidebarOpen(false)}
                className="rounded-full w-8 h-8 p-0 flex items-center justify-center"
              >
                <Icon type="icon-expand" style={{ fontSize: "12px" }} />
              </Button>
            </div>
          )}
          {/* 展开左侧边栏按钮 */}
          {!isLeftSidebarOpen && (
            <div
              className="absolute z-10"
              style={{
                left: 0,
                top: "200px",
              }}
            >
              <Button
                type="default"
                size="sm"
                onClick={() => setIsLeftSidebarOpen(true)}
                className="rounded-r-full w-8 h-8 p-0 flex items-center justify-center"
              >
                <Icon
                  type="icon-expand"
                  style={{ fontSize: "12px", transform: "rotate(180deg)" }}
                />
              </Button>
            </div>
          )}
        </div>

        {/* 中间文章内容区域 */}
        <div className="flex-1 h-full overflow-y-auto px-8 py-8">
          {currentPost ? (
            <article className="max-w-4xl mx-auto">
              {/* 文章标题区域 */}
              <header className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{currentPost.title}</h1>
              </header>
              {/* 文章正文内容 */}
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed">
                  {currentPost.content}
                </div>
              </div>
            </article>
          ) : (
            /* 空状态提示 */
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">选择文章</h3>
              <p className="opacity-60">请从左侧分类中选择一篇文章进行阅读</p>
            </div>
          )}
        </div>

        {/* 右侧目录导航 - 可收起 */}
        <div
          className="blog-sidebar-right relative h-full transition-all duration-300"
          style={{ width: isRightSidebarOpen ? "280px" : "0" }}
        >
          <div className="h-full overflow-hidden">
            <div
              className="h-full custom-scrollbar"
              style={{ width: "280px" }}
            >
              <TableOfContents />
            </div>
          </div>

          {/* 收起按钮 - 左侧居中，hover时显示 */}
          {isRightSidebarOpen && (
            <div
              className="collapse-btn absolute z-10"
              style={{
                left: 0,
                top: "200px",
              }}
            >
              <Button
                type="default"
                size="sm"
                onClick={() => setIsRightSidebarOpen(false)}
                className="rounded-full w-8 h-8 p-0 flex items-center justify-center"
              >
                <Icon
                  type="icon-expand"
                  style={{ fontSize: "12px", transform: "rotate(180deg)" }}
                />
              </Button>
            </div>
          )}
          {/* 展开右侧边栏按钮 */}
          {!isRightSidebarOpen && (
            <div
              className="absolute z-10"
              style={{
                right: 0,
                top: "200px",
              }}
            >
              <Button
                type="default"
                size="sm"
                onClick={() => setIsRightSidebarOpen(true)}
                className="rounded-l-full w-8 h-8 p-0 flex items-center justify-center"
              >
                <Icon type="icon-expand" style={{ fontSize: "12px" }} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
