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
  showExpandAll = true, // 默认显示全部展开/收起按钮
  className = "",
}: RecursiveMenuProps) {
  /** 已展开的菜单项ID集合 */
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  /** 是否全部展开状态 */
  const [isAllExpanded, setIsAllExpanded] = useState(true); // 默认全展开

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
   * 初始化时默认全部展开
   */
  useEffect(() => {
    const allParentIds = getAllParentIds(data);
    setExpandedItems(new Set(allParentIds));
    setIsAllExpanded(true);
  }, [data]); // 只依赖 data，不依赖 currentSubCategory

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
