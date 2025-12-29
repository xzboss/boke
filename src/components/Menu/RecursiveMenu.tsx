'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Button from '../Button';
import Icon from '../Icon';
import type { MenuNode } from '@/types/menu';
import { MENU_NODE_TYPE } from '@/types/menu';

interface RecursiveMenuProps {
  /** 菜单数据源 */
  menuTree: MenuNode[];
  /** 是否显示全部展开/收起按钮 */
  showExpandAll?: boolean;
}

/**
 * 递归菜单组件
 * 支持无限层级的菜单结构，menu类型展开收起，叶子节点类型导航
 */
export default function RecursiveMenu({ menuTree, showExpandAll = true, ...rest }: RecursiveMenuProps) {
  const router = useRouter();
  const pathname = decodeURIComponent(usePathname());
  // 已展开的菜单项ID集合
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  // 是否全部展开状态
  const [isAllExpanded, setIsAllExpanded] = useState<boolean>(true);

  /**
   * 初始化时设置已展开的菜单项ID集合
   */
  useEffect(() => {
    const allMenuIds = getAllMenuIds(menuTree);
    setExpandedItems(new Set(allMenuIds));
  }, [menuTree]);

  /**
   * 获取所有 menu 类型项的ID
   * @param items 菜单项列表
   * @returns 所有 menu 类型项的ID数组
   */
  const getAllMenuIds = (items: MenuNode[]): string[] => {
    const menuIds: string[] = [];
    const traverse = (list: MenuNode[]) => {
      for (const item of list) {
        if (item.type === 'menu') {
          menuIds.push(item.id);
        }
        if (item.children && item.children.length > 0) {
          traverse(item.children);
        }
      }
    };
    traverse(items);
    return menuIds;
  };

  /**
   * 检查是否全部展开
   * @param expanded 当前展开的节点ID集合
   */
  const checkAllExpanded = (expanded: Set<string>) => {
    const allMenuIds = getAllMenuIds(menuTree);
    const isAll = allMenuIds.every(id => expanded.has(id));
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
   */
  const toggleAllExpand = () => {
    if (isAllExpanded) {
      setExpandedItems(new Set());
      setIsAllExpanded(false);
    } else {
      const allMenuIds = getAllMenuIds(menuTree);
      setExpandedItems(new Set(allMenuIds));
      setIsAllExpanded(true);
    }
  };

  /**
   * 处理菜单项点击事件
   * @param item 被点击的菜单项
   */
  const handleItemClick = (item: MenuNode) => {
    if (item.type === MENU_NODE_TYPE.MENU) {
      // menu类型：切换展开/收起状态
      toggleItem(item.id);
    } else if (item.type === MENU_NODE_TYPE.LEAF && item.path) {
      // 叶子节点类型：导航到对应页面
      router.push(item.path);
    }
  };

  /**
   * 检查是否为当前选中的节点
   */
  const isCurrentLeaf = (item: MenuNode): boolean => {
    if (item.type === MENU_NODE_TYPE.LEAF) {
      return pathname === item.path;
    }
    return false;
  };

  /**
   * 渲染单个菜单项
   * @param item 菜单项数据
   * @param depth 当前层级深度（用于缩进计算）
   */
  const renderMenuItem = (item: MenuNode, depth: number = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const isSelected = isCurrentLeaf(item);

    return (
      <div key={item.id}>
        <Button
          type={isSelected ? 'default' : 'text'}
          size="sm"
          onClick={() => handleItemClick(item)}
          className="justify-between"
          style={{
            paddingLeft: `${12 + depth * 16}px`,
          }}
        >
          {item.name}
          {item.type === MENU_NODE_TYPE.MENU && (
            <Icon
              type="icon-expand"
              style={{
                fontSize: '12px',
                transform: isExpanded ? 'rotate(270deg)' : 'rotate(180deg)',
              }}
            />
          )}
        </Button>

        {/* 子菜单 - 只有 menu 类型且展开时才显示 */}
        {item.type === MENU_NODE_TYPE.MENU && isExpanded && (
          <div className="mt-1">{item.children.map(child => renderMenuItem(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <nav {...rest}>
      {/* 全部展开/收起按钮（可选） */}
      {showExpandAll && (
        <div className="py-8px pr-16px">
          <Button type="text" size="sm" onClick={toggleAllExpand} className="w-[20px] justify-center">
            {isAllExpanded ? <Icon type="icon-quanbushouqi" /> : <Icon type="icon-quanbuzhankai" />}
          </Button>
        </div>
      )}

      {/* 菜单项列表 */}
      {menuTree.map(item => renderMenuItem(item))}
    </nav>
  );
}
