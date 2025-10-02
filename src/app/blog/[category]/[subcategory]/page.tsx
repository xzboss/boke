'use client'

import Layout from '@/components/Layout'
import Link from 'next/link'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { categories, getCategoryById } from '@/config/categories'

interface CategoryNavProps {
  categories: typeof categories
  currentCategory?: string
  currentSubCategory?: string
}

function CategoryNav({ categories, currentCategory, currentSubCategory }: CategoryNavProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set([currentCategory || '']))

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

export default function SubCategoryPage() {
  const params = useParams()
  const categoryKey = params.category as string
  const subCategoryKey = params.subcategory as string
  
  const category = getCategoryById(categoryKey)
  const subCategory = category?.children?.find(child => child.id === subCategoryKey)

  if (!category || !subCategory) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">分类不存在</h1>
            <p className="text-gray-600 mb-8">请检查 URL 是否正确</p>
            <Link href="/blog" className="text-purple-600 hover:text-purple-700 font-medium">
              返回博客首页
            </Link>
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
                  currentCategory={categoryKey}
                  currentSubCategory={subCategoryKey}
                />
              </div>
            </div>

            {/* 中间内容区域 */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="mb-6">
                  <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <Link href="/" className="hover:text-gray-700">首页</Link>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <Link href="/blog" className="hover:text-gray-700">博客</Link>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-gray-900">{category.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-gray-900">{subCategory.name}</span>
                  </nav>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{subCategory.name}</h1>
                  <p className="text-gray-600">探索 {subCategory.name} 相关的技术文章和教程</p>
                </div>

                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">文章列表占位</h3>
                  <p className="text-gray-600">文章列表内容待实现</p>
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
