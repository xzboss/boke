'use client';

import React from 'react';
import Button from '../Button';
import Icon from '../Icon';
import { useCatalogObserver } from '@/hooks/useCatalogObserver';
import { cn } from '@/lib/utils/tools';
import { CatalogNode } from '@/types/catalog';

const ITEM_HEIGHT = 32;

/**
 * 目录组件 Props
 */
interface CatalogProps {
  /** 目录数据（树形结构） */
  catalogTree: CatalogNode[];
  /** 自定义类名 */
  className?: string;
  /** 是否显示全部展开/收起按钮 */
  showExpandAll?: boolean;
  /** 可选的滚动容器，如果提供则使用JavaScript控制滚动 */
  scrollContainer?: HTMLElement | null;
}

/**
 * 可展开目录项组件 Props
 */
interface ExpandableCatalogItemProps {
  item: CatalogNode;
  activeId: string | null;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onItemClick: (id: string) => void;
  scrollContainer?: HTMLElement | null;
}

/**
 * 叶子节点目录项组件 Props
 */
interface LeafCatalogItemProps {
  item: CatalogNode;
  activeId: string | null;
  onItemClick: (id: string) => void;
  scrollContainer?: HTMLElement | null;
}

/**
 * 可展开目录项组件（有子节点）
 */
function ExpandableCatalogItem({
  item,
  activeId,
  expandedIds,
  onToggleExpand,
  onItemClick,
  scrollContainer,
}: ExpandableCatalogItemProps) {
  const isActive = activeId === item.id;
  const isExpanded = expandedIds.has(item.id);
  const indentLevel = item.level - 1;

  return (
    <div className="catalog-item">
      {/* 当前项 */}
      <div className="flex items-center gap-1 pr-3" style={{ paddingLeft: `${12 + indentLevel * 16}px` }}>
        {/* 左侧展开/收起图标 */}
        <Button type="text" size="sm" onClick={() => onToggleExpand(item.id)}>
          <Icon
            type="icon-expand"
            style={{
              fontSize: '12px',
              transform: isExpanded ? 'rotate(270deg)' : 'rotate(180deg)',
              transition: 'transform 0.2s',
            }}
          />
        </Button>

        {/* 目录项按钮 */}
        <Button
          type={isActive ? 'default' : 'text'}
          size="sm"
          href={`#${item.id}`}
          className="text-ellipsis"
          onClick={e => {
            if (scrollContainer) {
              e.preventDefault();
            }
            onItemClick(item.id);
          }}
        >
          {item.title}
        </Button>
      </div>

      {/* 子项（递归渲染） */}
      {isExpanded && (
        <div>
          {item.children.map((child: CatalogNode) => (
            <CatalogItemRenderer
              key={child.id}
              item={child}
              activeId={activeId}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onItemClick={onItemClick}
              scrollContainer={scrollContainer}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 叶子节点目录项组件（无子节点）
 */
function LeafCatalogItem({ item, activeId, onItemClick, scrollContainer }: LeafCatalogItemProps) {
  const isActive = activeId === item.id;
  const indentLevel = item.level - 1;

  return (
    <div className="catalog-item">
      <div className="flex items-center gap-1 pr-3" style={{ paddingLeft: `${12 + indentLevel * 16}px` }}>
        {/* 叶子节点额外缩进 */}
        <div style={{ paddingLeft: '36px' }}>
          <Button
            type={isActive ? 'default' : 'text'}
            size="sm"
            href={`#${item.id}`}
            className="text-ellipsis"
            onClick={e => {
              if (scrollContainer) {
                e.preventDefault();
              }
              onItemClick(item.id);
            }}
          >
            {item.title}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * 递归渲染目录项（判断是否有子节点）
 */
function CatalogItemRenderer({
  item,
  activeId,
  expandedIds,
  onToggleExpand,
  onItemClick,
  scrollContainer,
}: {
  item: CatalogNode;
  activeId: string | null;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onItemClick: (id: string) => void;
  scrollContainer?: HTMLElement | null;
}) {
  // 判断是否有子节点
  if (item.children.length > 0) {
    return (
      <ExpandableCatalogItem
        item={item}
        activeId={activeId}
        expandedIds={expandedIds}
        onToggleExpand={onToggleExpand}
        onItemClick={onItemClick}
        scrollContainer={scrollContainer}
      />
    );
  } else {
    return (
      <LeafCatalogItem item={item} activeId={activeId} onItemClick={onItemClick} scrollContainer={scrollContainer} />
    );
  }
}

/**
 * 目录导航组件
 * 显示文章的标题层级结构，支持点击跳转和自动高亮当前标题
 * 左侧有进度指示器，根据当前标题位置跳跃式显示
 */
/**
 * 目录导航组件
 * 显示文章的标题层级结构，支持点击跳转和自动高亮当前标题
 * 左侧有进度指示器，根据当前标题位置跳跃式显示
 */
export function Catalog({ catalogTree, showExpandAll = true, scrollContainer, ...rest }: CatalogProps) {
  const {
    activeId,
    expandedIds,
    isAllExpanded,
    progressPosition,
    catalogRef,
    setActiveId,
    toggleExpand,
    toggleAllExpand,
  } = useCatalogObserver(catalogTree, scrollContainer, {
    itemHeight: ITEM_HEIGHT,
  });

  if (!catalogTree || catalogTree.length === 0) {
    return (
      <div {...rest} className={cn('flex flex-col h-full', rest?.className)}>
        <div className="flex-shrink-0 px-4 py-3 border-b border-black/10">
          <h3 className="text-sm font-semibold">目录</h3>
        </div>
        <div className="p-4">
          <div className="text-sm opacity-60">暂无目录</div>
        </div>
      </div>
    );
  }

  return (
    <div {...rest} className={cn('flex flex-col h-full', rest?.className)}>
      {/* 全部展开/收起按钮 */}
      {showExpandAll && (
        <div className="px-3 py-2">
          <Button type="text" size="sm" onClick={toggleAllExpand} className="w-[20px] justify-center">
            {isAllExpanded ? <Icon type="icon-quanbushouqi" /> : <Icon type="icon-quanbuzhankai" />}
          </Button>
        </div>
      )}

      {/* 目录列表 */}
      <nav ref={catalogRef} className="flex-1 overflow-y-auto pb-2 relative custom-scrollbar">
        {/* 进度指示器 */}
        <div
          className="absolute left-0 w-0.75 rounded-r-sm z-0 transition-all duration-300 ease-out"
          style={{
            top: `${progressPosition.top}px`,
            height: `${progressPosition.height}px`,
            backgroundColor: `var(--color-primary)`,
          }}
        />

        {/* 目录项 - 直接渲染顶级节点，递归会处理子节点 */}
        <div className="relative z-1">
          {catalogTree.map(item => (
            <CatalogItemRenderer
              key={item.id}
              item={item}
              activeId={activeId}
              expandedIds={expandedIds}
              onToggleExpand={toggleExpand}
              onItemClick={setActiveId}
              scrollContainer={scrollContainer}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}
