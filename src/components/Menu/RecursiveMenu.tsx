"use client";

import { useState, useEffect } from "react";
import Button from "../Button";
import Icon from "../Icon";

interface MenuItem {
  id: string;
  name: string;
  path: string;
  level: number;
  parentId: string | null;
  tags: string[];
  children: MenuItem[];
}

interface RecursiveMenuProps {
  /** 菜单数据源 */
  data: MenuItem[];
  /** 当前选中的分类ID */
  currentCategory?: string;
  /** 当前选中的子分类ID */
  currentSubCategory?: string;
  /** 子分类选择回调 */
  onSubCategorySelect: (subCategoryId: string) => void;
  /** 是否显示全部展开/收起按钮 */
  showExpandAll?: boolean;
  /** 自定义样式类名 */
  className?: string;
}

/**
 * 递归菜单组件
 * 支持无限层级的菜单结构
 */
export default function RecursiveMenu({
  data,
  currentSubCategory,
  onSubCategorySelect,
  showExpandAll = false,
  className = "",
}: RecursiveMenuProps) {
  /** 已展开的菜单项ID集合 */
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  /** 是否全部展开状态 */
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  /**
   * 获取所有有子节点的项的ID
   * @param items 菜单项列表
   * @returns 所有父节点的ID数组
   */
  const getAllParentIds = (items: MenuItem[]): string[] => {
    const parentIds: string[] = [];
    const traverse = (list: MenuItem[]) => {
      for (const item of list) {
        if (item.children && item.children.length > 0) {
          parentIds.push(item.id);
          traverse(item.children);
        }
      }
    };
    traverse(items);
    return parentIds;
  };

  /**
   * 查找某个节点的所有祖先节点ID
   * @param itemId 目标节点ID
   * @param items 菜单项列表
   * @returns 祖先节点ID数组（从父节点到根节点）
   */
  const findAncestors = (itemId: string, items: MenuItem[]): string[] => {
    const ancestors: string[] = [];

    const findParent = (id: string, list: MenuItem[]): MenuItem | null => {
      for (const item of list) {
        if (item.id === id) return item;
        if (item.children) {
          const found = findParent(id, item.children);
          if (found) return found;
        }
      }
      return null;
    };

    let current = findParent(itemId, items);
    while (current && current.parentId) {
      ancestors.push(current.parentId);
      current = findParent(current.parentId, items);
    }

    return ancestors;
  };

  /**
   * 根据当前选中的子分类自动展开父分类
   * 当用户选中某个叶子节点时，自动展开其所有父节点
   */
  useEffect(() => {
    if (currentSubCategory) {
      const ancestors = findAncestors(currentSubCategory, data);
      setExpandedItems((prev) => {
        const newExpanded = new Set([...prev, currentSubCategory, ...ancestors]);
        // 检查是否全部展开
        const allParentIds = getAllParentIds(data);
        const isAll = allParentIds.every((id) => newExpanded.has(id));
        setIsAllExpanded(isAll);
        return newExpanded;
      });
    }
  }, [currentSubCategory, data]);

  /**
   * 检查是否全部展开
   * @param expanded 当前展开的节点ID集合
   */
  const checkAllExpanded = (expanded: Set<string>) => {
    const allParentIds = getAllParentIds(data);
    const isAll = allParentIds.every((id) => expanded.has(id));
    setIsAllExpanded(isAll);
  };

  /**
   * 切换单个菜单项的展开/收起状态
   * @param itemId 菜单项ID
   */
  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
    checkAllExpanded(newExpanded);
  };

  /**
   * 切换全部展开/收起
   * 如果当前是全部展开状态，则收起所有；否则展开所有
   */
  const toggleAllExpand = () => {
    if (isAllExpanded) {
      setExpandedItems(new Set());
      setIsAllExpanded(false);
    } else {
      const allParentIds = getAllParentIds(data);
      setExpandedItems(new Set(allParentIds));
      setIsAllExpanded(true);
    }
  };

  /**
   * 处理菜单项点击事件
   * @param item 被点击的菜单项
   */
  const handleItemClick = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      // 有子节点：切换展开/收起状态
      toggleItem(item.id);
    } else {
      // 叶子节点：触发选择回调
      onSubCategorySelect(item.id);
    }
  };

  /**
   * 渲染单个菜单项
   * @param item 菜单项数据
   * @param depth 当前层级深度（用于缩进计算）
   */
  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isSelected = currentSubCategory === item.id;

    return (
      <div key={item.id}>
        <Button
          type={isSelected ? "default" : "text"}
          size="sm"
          onClick={() => handleItemClick(item)}
          className="justify-between"
          style={{
            paddingLeft: `${12 + depth * 16}px`,
          }}
        >
          {item.name}
          {hasChildren && (
            <Icon
              type="icon-expand"
              style={{
                fontSize: "12px",
                transform: isExpanded ? "rotate(270deg)" : "rotate(180deg)",
              }}
            />
          )}
        </Button>

        {/* 子菜单 */}
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children.map((child) => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={className}>
      {/* 全部展开/收起按钮（可选） */}
      {showExpandAll && (
        <div className="mb-2">
          <Button
            type="text"
            size="sm"
            onClick={toggleAllExpand}
            className="w-full justify-center"
          >
            {isAllExpanded ? "全部收起" : "全部展开"}
          </Button>
        </div>
      )}
      
      {/* 菜单项列表 */}
      {data.map((item) => renderMenuItem(item))}
    </nav>
  );
}
