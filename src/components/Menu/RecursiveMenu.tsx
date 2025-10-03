"use client";

import { useState, useEffect } from "react";
import Button from "../Button";
import Icon from "../Icon";
import { useAppStore, colorSchemePresets } from "@/store/app";

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
  /** 自定义样式类名 */
  className?: string;
}

/**
 * 递归菜单组件
 * 支持无限层级的菜单结构
 */
export default function RecursiveMenu({
  data,
  currentCategory,
  onSubCategorySelect,
  className = "",
}: RecursiveMenuProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { colorScheme } = useAppStore();
  const primaryColor = colorSchemePresets[colorScheme];

  /** 根据当前选中的子分类自动展开父分类 */
  useEffect(() => {
    if (currentCategory) {
      setExpandedItems((prev) => new Set([...prev, currentCategory]));
    }
  }, [currentCategory]);

  /** 切换菜单项展开/收起状态 */
  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  /** 处理菜单项点击事件 */
  const handleItemClick = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      toggleItem(item.id);
    } else {
      onSubCategorySelect(item.id);
    }
  };

  /** 渲染单个菜单项 */
  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = currentCategory === item.id;

    return (
      <div key={item.id}>
        <Button
          type={isActive ? "primary" : "text"}
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
    <nav className={className}>{data.map((item) => renderMenuItem(item))}</nav>
  );
}
