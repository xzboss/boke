'use client'

import Layout from '@/components/Layout'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { categories } from '@/config/categories'

interface BlogPost {
  title: string
  description: string
  createdAt: string
  updatedAt: string
  tags: string[]
  category: string
  featured: boolean
  slug: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟从文件系统读取 MD 文件
    const mockPosts: BlogPost[] = [
      {
        title: "Vue 3 Composition API 完全指南",
        description: "深入理解 Vue 3 Composition API 的核心概念和最佳实践",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-20T15:30:00Z",
        tags: ["vue", "vue3", "composition-api", "javascript", "frontend"],
        category: "frontend",
        featured: true,
        slug: "vue3-composition-api-guide"
      },
      {
        title: "React Hooks 设计模式与最佳实践",
        description: "探索 React Hooks 的各种设计模式，提升代码质量和可维护性",
        createdAt: "2024-01-18T14:20:00Z",
        updatedAt: "2024-01-22T09:15:00Z",
        tags: ["react", "hooks", "javascript", "frontend", "patterns"],
        category: "frontend",
        featured: false,
        slug: "react-hooks-patterns"
      },
      {
        title: "LeetCode 两数之和：从暴力到哈希表",
        description: "深入解析 LeetCode 经典题目两数之和，从暴力解法到最优解法的完整思路",
        createdAt: "2024-01-20T16:45:00Z",
        updatedAt: "2024-01-25T11:20:00Z",
        tags: ["leetcode", "algorithm", "hash-table", "array", "two-pointer", "javascript", "python"],
        category: "algorithm",
        featured: true,
        slug: "leetcode-two-sum"
      },
      {
        title: "HTTP 协议深度解析：从基础到现代",
        description: "全面解析 HTTP 协议的发展历程、核心概念和现代特性",
        createdAt: "2024-01-22T09:30:00Z",
        updatedAt: "2024-01-28T16:45:00Z",
        tags: ["http", "https", "http2", "http3", "network", "protocol", "web", "security"],
        category: "network",
        featured: true,
        slug: "http-protocol-deep-dive"
      }
    ]
    
    setPosts(mockPosts)
    setLoading(false)
  }, [])

  const getCategoryName = (categoryKey: string) => {
    const category = categories.find(cat => cat.id === categoryKey)
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            技术博客
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            分享技术见解、学习心得和实践经验
          </p>
        </div>

        {/* 分类导航 */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">分类</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/${category.id}`}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 text-center"
              >
                <div className="text-sm font-medium text-gray-900">{category.name}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* 精选文章 */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">精选文章</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.filter(post => post.featured).map((post) => (
              <article key={post.slug} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {getCategoryName(post.category)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    <Link href={`/blog/post/${post.slug}`} className="hover:text-purple-600 transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <Link
                    href={`/blog/post/${post.slug}`}
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    阅读更多
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 所有文章 */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">所有文章</h2>
          <div className="space-y-6">
            {posts.map((post) => (
              <article key={post.slug} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {getCategoryName(post.category)}
                      </span>
                      {post.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          精选
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      <Link href={`/blog/post/${post.slug}`} className="hover:text-purple-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 mb-3">
                      {post.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-6 text-right">
                    <div className="text-sm text-gray-500 mb-2">
                      {formatDate(post.createdAt)}
                    </div>
                    <Link
                      href={`/blog/post/${post.slug}`}
                      className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm"
                    >
                      阅读更多
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
