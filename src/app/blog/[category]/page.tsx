'use client'

import Layout from '@/components/Layout'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { categories, getCategoryById } from '@/config/categories'

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

export default function CategoryPage() {
  const params = useParams()
  const categoryKey = params.category as string
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)

  const category = getCategoryById(categoryKey)

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

    // 根据分类过滤文章
    const categoryPosts = allPosts.filter(post => {
      if (post.category !== categoryKey) return false
      
      if (!selectedSubCategory) return true
      
      // 检查文章的标签是否匹配子分类的标签
      const subCategory = category?.children?.find(child => child.id === selectedSubCategory)
      if (!subCategory) return true
      
      return post.tags.some(tag => subCategory.tags.includes(tag))
    })

    setPosts(categoryPosts)
    setLoading(false)
  }, [categoryKey, selectedSubCategory])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!category) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">分类不存在</h1>
            <p className="text-gray-600 mb-8">请检查 URL 是否正确</p>
            <Link href="/blog" className="text-purple-600 hover:text-purple-700 font-medium">
              返回博客首页
            </Link>
          </div>
        </div>
      </Layout>
    )
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
          <span className="text-gray-900">{category.name}</span>
        </nav>

        {/* 页面标题 */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
          <p className="text-lg text-gray-600">探索 {category.name} 相关的技术文章和教程</p>
        </div>

        {/* 子分类导航 */}
        {category.children && category.children.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">子分类</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedSubCategory(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !selectedSubCategory
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              {category.children?.map((subCategory) => (
                <button
                  key={subCategory.id}
                  onClick={() => setSelectedSubCategory(subCategory.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedSubCategory === subCategory.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {subCategory.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 文章列表 */}
        <div>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无文章</h3>
              <p className="text-gray-600">
                {selectedSubCategory 
                  ? `在 ${category.children?.find(child => child.id === selectedSubCategory)?.name} 分类下暂无文章`
                  : `在 ${category.name} 分类下暂无文章`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <article key={post.slug} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {post.featured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            精选
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {formatDate(post.createdAt)}
                        </span>
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
          )}
        </div>
      </div>
    </Layout>
  )
}
