'use client'

import { useState, useEffect } from 'react'

interface MenuItem {
  id: string
  name: string
  path: string
  level: number
  parentId: string | null
  tags: string[]
  children: MenuItem[]
}

interface RecursiveMenuProps {
  /** 菜单数据源 */
  data: MenuItem[]
  /** 当前选中的分类ID */
  currentCategory?: string
  /** 当前选中的子分类ID */
  currentSubCategory?: string
  /** 子分类选择回调 */
  onSubCategorySelect: (subCategoryId: string) => void
  /** 自定义样式类名 */
  className?: string
}

/**
 * 递归菜单组件
 * 支持无限层级的菜单结构，类似 Ant Design 的 Menu 组件
 */
export default function RecursiveMenu({
  data,
  currentCategory,
  onSubCategorySelect,
  className = ''
}: RecursiveMenuProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  /** 根据当前选中的子分类自动展开父分类 */
  useEffect(() => {
    if (currentCategory) {
      setExpandedItems(prev => new Set([...prev, currentCategory]))
    }
  }, [currentCategory])

  /** 切换菜单项展开/收起状态 */
  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  /** 处理菜单项点击事件 */
  const handleItemClick = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      // 有子项，切换展开/收起
      toggleItem(item.id)
    } else {
      // 叶子节点，触发选择回调
      onSubCategorySelect(item.id)
    }
  }

  /** 渲染单个菜单项 */
  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)
    const isParentActive = currentCategory === item.id

    return (
      <div key={item.id}>
        {/* 菜单项按钮 */}
        <div className="flex items-center">
        <button
          onClick={() => handleItemClick(item)}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors text-left ${
            isParentActive
              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          {item.name}
        </button>
          
          {/* 展开/收起图标 */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleItem(item.id)
              }}
              className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200"
            >
              <svg
                className={`w-4 h-4 transition-transform ${
                  isExpanded ? 'rotate-90' : ''
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
        
        {/* 子菜单项 */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children.map((child) => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <nav className={`space-y-1 ${className}`}>
      {data.map((item) => renderMenuItem(item))}
    </nav>
  )
}
