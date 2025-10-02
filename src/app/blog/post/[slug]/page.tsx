'use client'

import Layout from '@/components/Layout'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { categories, getCategoryById } from '@/config/categories'

interface CategoryNavProps {
  categories: typeof categories
  currentCategory?: string
  currentSubCategory?: string
}

function CategoryNav({ categories, currentCategory, currentSubCategory }: CategoryNavProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // 根据当前选中的子分类自动展开父分类
  useEffect(() => {
    if (currentCategory) {
      setExpandedCategories(prev => new Set([...prev, currentCategory]))
    }
  }, [currentCategory])

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const handleCategoryClick = (categoryId: string, hasChildren: boolean) => {
    if (hasChildren) {
      toggleCategory(categoryId)
    }
    // 非叶子节点不跳转，只展开/收起
  }

  return (
    <nav className="space-y-1">
      {categories.map((category) => (
        <div key={category.id}>
          <div className="flex items-center">
            <button
              onClick={() => handleCategoryClick(category.id, category.children && category.children.length > 0)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors text-left ${
                currentCategory === category.id
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
            {category.children && category.children.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleCategory(category.id)
                }}
                className="ml-2 p-1 hover:bg-gray-100 rounded"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${
                    expandedCategories.has(category.id) ? 'rotate-90' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          
          {category.children && category.children.length > 0 && expandedCategories.has(category.id) && (
            <div className="ml-4 mt-1 space-y-1">
              {category.children.map((subCategory) => (
                <Link
                  key={subCategory.id}
                  href={`/blog/post/${subCategory.id}`}
                  className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                    currentSubCategory === subCategory.id
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {subCategory.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

function TableOfContents() {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">目录</h3>
      <div className="space-y-2">
        <div className="text-sm text-gray-500">目录内容占位</div>
        <div className="text-xs text-gray-400">待实现</div>
      </div>
    </div>
  )
}

interface BlogPost {
  title: string
  description: string
  createdAt: string
  updatedAt: string
  tags: string[]
  category: string
  featured: boolean
  slug: string
  content: string
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)
  const [currentSubCategory, setCurrentSubCategory] = useState<string | null>(null)

  useEffect(() => {
    // 模拟从文件系统读取 MD 文件
    const allPosts: BlogPost[] = [
      {
        title: "Vue 3 Composition API 完全指南",
        description: "深入理解 Vue 3 Composition API 的核心概念和最佳实践",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-20T15:30:00Z",
        tags: ["vue", "vue3", "composition-api", "javascript", "frontend"],
        category: "frontend",
        featured: true,
        slug: "vue",
        content: `# Vue 3 Composition API 完全指南

Vue 3 的 Composition API 是一个革命性的特性，它让我们能够更好地组织和复用组件逻辑。本文将深入探讨 Composition API 的核心概念、使用方法和最佳实践。

## 什么是 Composition API？

Composition API 是 Vue 3 引入的一种新的组件逻辑组织方式，它基于函数式编程的思想，让我们能够将相关的逻辑代码组织在一起，而不是分散在不同的选项中。

## 核心概念

### 1. setup() 函数

\`setup()\` 是 Composition API 的入口点，它在组件创建之前执行。

\`\`\`javascript
import { ref, reactive, computed } from 'vue'

export default {
  setup() {
    // 响应式数据
    const count = ref(0)
    const state = reactive({
      name: 'Vue 3',
      version: '3.0'
    })
    
    // 计算属性
    const doubleCount = computed(() => count.value * 2)
    
    // 方法
    const increment = () => {
      count.value++
    }
    
    return {
      count,
      state,
      doubleCount,
      increment
    }
  }
}
\`\`\`

### 2. 响应式引用 (ref)

\`ref\` 用于创建响应式的原始值引用。

\`\`\`javascript
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0
count.value = 1
console.log(count.value) // 1
\`\`\`

### 3. 响应式对象 (reactive)

\`reactive\` 用于创建响应式的对象。

\`\`\`javascript
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  name: 'Vue 3'
})

state.count++ // 自动触发更新
\`\`\`

## 生命周期钩子

Composition API 提供了对应的生命周期钩子：

\`\`\`javascript
import { onMounted, onUpdated, onUnmounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    onUpdated(() => {
      console.log('组件已更新')
    })
    
    onUnmounted(() => {
      console.log('组件已卸载')
    })
  }
}
\`\`\`

## 组合式函数 (Composables)

Composition API 的强大之处在于可以创建可复用的组合式函数：

\`\`\`javascript
// useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  const doubleCount = computed(() => count.value * 2)
  
  return {
    count,
    increment,
    decrement,
    reset,
    doubleCount
  }
}
\`\`\`

## 最佳实践

1. **使用组合式函数提取逻辑**：将相关的逻辑提取到独立的函数中
2. **合理使用 ref 和 reactive**：原始值用 ref，对象用 reactive
3. **避免在 setup 中使用 this**：Composition API 中 this 是 undefined
4. **使用 TypeScript**：获得更好的类型支持和开发体验

## 总结

Composition API 为 Vue 3 带来了更灵活、更强大的组件逻辑组织方式。通过合理使用 Composition API，我们可以创建更易维护、更易测试的 Vue 应用。

---

*本文介绍了 Vue 3 Composition API 的核心概念和使用方法，希望对你的 Vue 3 学习之旅有所帮助。*`
      },
      {
        title: "React Hooks 设计模式与最佳实践",
        description: "探索 React Hooks 的各种设计模式，提升代码质量和可维护性",
        createdAt: "2024-01-18T14:20:00Z",
        updatedAt: "2024-01-22T09:15:00Z",
        tags: ["react", "hooks", "javascript", "frontend", "patterns"],
        category: "frontend",
        featured: false,
        slug: "react",
        content: `# React Hooks 设计模式与最佳实践

React Hooks 自 16.8 版本引入以来，彻底改变了我们编写 React 组件的方式。本文将深入探讨各种 Hooks 设计模式，帮助你写出更优雅、更可维护的 React 代码。

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

### 2. 本地存储 Hook

\`\`\`javascript
import { useState, useEffect } from 'react'

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}
\`\`\`

## 状态管理模式

### 1. useReducer 模式

\`\`\`javascript
import { useReducer } from 'react'

const initialState = {
  count: 0,
  loading: false,
  error: null
}

function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 }
    case 'decrement':
      return { ...state, count: state.count - 1 }
    case 'setLoading':
      return { ...state, loading: action.payload }
    case 'setError':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, initialState)
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>
        Increment
      </button>
    </div>
  )
}
\`\`\`

## 性能优化模式

### 1. useMemo 和 useCallback

\`\`\`javascript
import { useState, useMemo, useCallback } from 'react'

function ExpensiveComponent({ items, filter }) {
  const [count, setCount] = useState(0)

  // 使用 useMemo 缓存计算结果
  const filteredItems = useMemo(() => {
    return items.filter(item => item.category === filter)
  }, [items, filter])

  // 使用 useCallback 缓存函数
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1)
  }, [])

  return (
    <div>
      <p>Count: {count}</p>
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <button onClick={handleClick}>Increment</button>
    </div>
  )
}
\`\`\`

## 总结

React Hooks 为我们提供了强大的工具来构建可复用、可维护的组件逻辑。通过掌握这些设计模式和最佳实践，我们可以写出更优雅、更高效的 React 代码。

---

*掌握 React Hooks 的设计模式，让你的 React 应用更加优雅和高效。*`
      },
      {
        title: "LeetCode 两数之和：从暴力到哈希表",
        description: "深入解析 LeetCode 经典题目两数之和，从暴力解法到最优解法的完整思路",
        createdAt: "2024-01-20T16:45:00Z",
        updatedAt: "2024-01-25T11:20:00Z",
        tags: ["leetcode", "algorithm", "hash-table", "array", "two-pointer", "javascript", "python"],
        category: "algorithm",
        featured: true,
        slug: "algorithm",
        content: `# LeetCode 两数之和：从暴力到哈希表

两数之和（Two Sum）是 LeetCode 上最经典的算法题目之一，也是很多面试的必考题目。本文将详细解析这道题目的多种解法，从最直观的暴力解法到最优的哈希表解法。

## 题目描述

给定一个整数数组 \`nums\` 和一个整数目标值 \`target\`，请你在该数组中找出和为目标值的那两个整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

**示例 1：**
\`\`\`
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
\`\`\`

**示例 2：**
\`\`\`
输入：nums = [3,2,4], target = 6
输出：[1,2]
\`\`\`

## 解法一：暴力解法

最直观的解法是使用双重循环遍历数组，检查每两个数的和是否等于目标值。

### JavaScript 实现

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

### 复杂度分析

- **时间复杂度**：O(n²)，需要遍历数组两次
- **空间复杂度**：O(1)，只使用了常数额外空间

## 解法二：哈希表解法（推荐）

使用哈希表可以在一次遍历中完成查找，大大提高效率。

### JavaScript 实现

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

### Python 实现

\`\`\`python
def twoSum(nums, target):
    hash_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in hash_map:
            return [hash_map[complement], i]
        
        hash_map[num] = i
    
    return []
\`\`\`

### 复杂度分析

- **时间复杂度**：O(n)，只需要遍历数组一次
- **空间复杂度**：O(n)，最坏情况下需要存储 n 个元素

## 总结

两数之和问题展示了算法优化的重要性：

1. **暴力解法**：思路简单，但效率低下
2. **哈希表解法**：时间空间权衡的最佳选择
3. **双指针法**：适用于已排序数组
4. **边界处理**：提高代码的健壮性

掌握这些解法不仅有助于解决 LeetCode 题目，更重要的是培养了算法思维和优化意识。

---

*算法学习是一个循序渐进的过程，从暴力解法到最优解法，每一步都是思维的提升。*`
      },
      {
        title: "HTTP 协议深度解析：从基础到现代",
        description: "全面解析 HTTP 协议的发展历程、核心概念和现代特性",
        createdAt: "2024-01-22T09:30:00Z",
        updatedAt: "2024-01-28T16:45:00Z",
        tags: ["http", "https", "http2", "http3", "network", "protocol", "web", "security"],
        category: "network",
        featured: true,
        slug: "network",
        content: `# HTTP 协议深度解析：从基础到现代

HTTP（HyperText Transfer Protocol）是万维网的基础协议，从 1991 年的 HTTP/0.9 到现在的 HTTP/3，经历了多次重大升级。本文将深入解析 HTTP 协议的发展历程、核心概念和现代特性。

## HTTP 协议发展历程

### HTTP/0.9 (1991)
- 只支持 GET 方法
- 没有请求头和响应头
- 只支持 HTML 格式

### HTTP/1.0 (1996)
- 引入了请求头和响应头
- 支持多种内容类型
- 添加了状态码
- 支持 POST、PUT、DELETE 等方法

### HTTP/1.1 (1997)
- 持久连接（Keep-Alive）
- 管道化（Pipelining）
- 分块传输编码
- 缓存控制
- 主机头支持

### HTTP/2 (2015)
- 二进制分帧
- 多路复用
- 服务器推送
- 头部压缩
- 流优先级

### HTTP/3 (2022)
- 基于 QUIC 协议
- 更快的连接建立
- 改进的拥塞控制
- 更好的移动网络支持

## HTTP 请求结构

### 请求行
\`\`\`
GET /api/users HTTP/1.1
\`\`\`

包含：
- 方法（Method）
- 请求 URI
- HTTP 版本

### 请求头
\`\`\`
Host: api.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

### 请求体
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com"
}
\`\`\`

## HTTP 响应结构

### 状态行
\`\`\`
HTTP/1.1 200 OK
\`\`\`

包含：
- HTTP 版本
- 状态码
- 状态描述

### 响应头
\`\`\`
Content-Type: application/json
Content-Length: 1024
Cache-Control: max-age=3600
Set-Cookie: sessionId=abc123; HttpOnly; Secure
\`\`\`

### 响应体
\`\`\`json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
\`\`\`

## 常用 HTTP 方法

### GET
- 获取资源
- 幂等性
- 可缓存
- 参数在 URL 中

\`\`\`javascript
fetch('/api/users?id=123')
  .then(response => response.json())
  .then(data => console.log(data));
\`\`\`

### POST
- 创建资源
- 非幂等
- 不可缓存
- 数据在请求体中

\`\`\`javascript
fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
});
\`\`\`

## HTTP 状态码详解

### 2xx 成功
- **200 OK**：请求成功
- **201 Created**：资源创建成功
- **204 No Content**：请求成功但无内容

### 3xx 重定向
- **301 Moved Permanently**：永久重定向
- **302 Found**：临时重定向
- **304 Not Modified**：资源未修改

### 4xx 客户端错误
- **400 Bad Request**：请求语法错误
- **401 Unauthorized**：未授权
- **403 Forbidden**：禁止访问
- **404 Not Found**：资源不存在

### 5xx 服务器错误
- **500 Internal Server Error**：服务器内部错误
- **502 Bad Gateway**：网关错误
- **503 Service Unavailable**：服务不可用

## 总结

HTTP 协议从简单的文本协议发展到现代的二进制协议，每一次升级都带来了性能和安全性的提升：

1. **HTTP/1.1**：引入了持久连接和管道化
2. **HTTP/2**：通过二进制分帧和多路复用大幅提升性能
3. **HTTP/3**：基于 QUIC 协议，进一步优化了连接建立和传输效率

理解 HTTP 协议的发展历程和核心特性，对于构建高性能的 Web 应用至关重要。

---

*HTTP 协议是 Web 的基石，掌握其原理和最佳实践，让我们能够构建更好的网络应用。*`
      }
    ]

    const currentPost = allPosts.find(p => p.slug === slug)
    if (currentPost) {
      setPost(currentPost)
      
      // 设置当前分类和子分类
      setCurrentCategory(currentPost.category)
      
      // 根据文章标签找到对应的子分类
      const parentCategory = categories.find(cat => cat.id === currentPost.category)
      if (parentCategory) {
        // 首先尝试通过 slug 直接匹配子分类
        const directMatch = parentCategory.children?.find(subCat => subCat.id === currentPost.slug)
        if (directMatch) {
          setCurrentSubCategory(directMatch.id)
        } else {
          // 如果没有直接匹配，通过标签匹配
          const matchingSubCategory = parentCategory.children?.find(subCat => 
            subCat.tags.some(tag => currentPost.tags.includes(tag))
          )
          if (matchingSubCategory) {
            setCurrentSubCategory(matchingSubCategory.id)
          } else {
            // 如果都没有匹配，使用第一个子分类作为默认
            setCurrentSubCategory(parentCategory.children?.[0]?.id || null)
          }
        }
      }
      
      // 获取相关文章（同分类的其他文章）
      const related = allPosts
        .filter(p => p.category === currentPost.category && p.slug !== slug)
        .slice(0, 3)
      setRelatedPosts(related)
    }
    
    setLoading(false)
  }, [slug])

  const getCategoryName = (categoryKey: string) => {
    const category = getCategoryById(categoryKey)
    return category?.name || categoryKey
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* 左侧分类导航 */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">分类导航</h2>
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">加载中...</p>
                  </div>
                </div>
              </div>

              {/* 中间内容区域 */}
              <div className="lg:col-span-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">加载中...</p>
                  </div>
                </div>
              </div>

              {/* 右侧目录导航 */}
              <div className="lg:col-span-3">
                <div className="sticky top-8">
                  <TableOfContents />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* 左侧分类导航 */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">分类导航</h2>
                  <CategoryNav 
                    categories={categories} 
        currentCategory={currentCategory || undefined}
        currentSubCategory={currentSubCategory || undefined}
                  />
                </div>
              </div>

              {/* 中间内容区域 */}
              <div className="lg:col-span-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <div className="text-center py-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">文章不存在</h1>
                    <p className="text-gray-600 mb-8">请检查 URL 是否正确</p>
                    <Link href="/blog" className="text-purple-600 hover:text-purple-700 font-medium">
                      返回博客首页
                    </Link>
                  </div>
                </div>
              </div>

              {/* 右侧目录导航 */}
              <div className="lg:col-span-3">
                <div className="sticky top-8">
                  <TableOfContents />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 左侧分类导航 */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">分类导航</h2>
                <CategoryNav 
                  categories={categories} 
        currentCategory={currentCategory || undefined}
        currentSubCategory={currentSubCategory || undefined}
                />
              </div>
            </div>

            {/* 中间内容区域 */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                {/* 面包屑导航 */}
                <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
                  <Link href="/" className="hover:text-gray-700">首页</Link>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <Link href="/blog" className="hover:text-gray-700">博客</Link>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <Link href={`/blog/${post.category}`} className="hover:text-gray-700">
                    {getCategoryName(post.category)}
                  </Link>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-gray-900">{post.title}</span>
                </nav>

                {/* 文章头部 */}
                <header className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {getCategoryName(post.category)}
                    </span>
                    {post.featured && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        精选
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
                  <p className="text-xl text-gray-600 mb-6">{post.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center space-x-4">
                      <span>创建时间：{formatDate(post.createdAt)}</span>
                      <span>更新时间：{formatDate(post.updatedAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </header>

                {/* 文章内容 */}
                <article className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {post.content}
                  </div>
                </article>

                {/* 相关文章 */}
                {relatedPosts.length > 0 && (
                  <section className="mt-16">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">相关文章</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {relatedPosts.map((relatedPost) => (
                        <article key={relatedPost.slug} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            <Link href={`/blog/post/${relatedPost.slug}`} className="hover:text-purple-600 transition-colors">
                              {relatedPost.title}
                            </Link>
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {relatedPost.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{formatDate(relatedPost.createdAt)}</span>
                            <Link
                              href={`/blog/post/${relatedPost.slug}`}
                              className="text-purple-600 hover:text-purple-700 font-medium"
                            >
                              阅读更多
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>

            {/* 右侧目录导航 */}
            <div className="lg:col-span-3">
              <div className="sticky top-8">
                <TableOfContents />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
