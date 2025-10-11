import { useEffect, useState, useRef, useMemo } from 'react';
import type { CatalogItem } from '@/utils/markdown';

/**
 * 递归获取所有目录项ID（树形结构）
 */
function getAllCatalogIds(catalog: CatalogItem[]): string[] {
  const ids: string[] = [];
  
  function traverse(items: CatalogItem[]) {
    items.forEach(item => {
      ids.push(item.id);
      if (item.children.length > 0) {
        traverse(item.children);
      }
    });
  }
  
  traverse(catalog);
  return ids;
}

/**
 * 递归获取有子节点的项目
 */
function getItemsWithChildren(catalog: CatalogItem[]): CatalogItem[] {
  const items: CatalogItem[] = [];
  
  function traverse(itemList: CatalogItem[]) {
    itemList.forEach(item => {
      if (item.children.length > 0) {
        items.push(item);
        traverse(item.children);
      }
    });
  }
  
  traverse(catalog);
  return items;
}

/**
 * 查找指定ID的最顶级收起状态祖先元素
 * 如果没有收起的祖先，返回自己
 */
function findTopCollapsedAncestor(catalog: CatalogItem[], targetId: string, expandedIds: Set<string>): string {
  // 创建ID到节点的映射
  const idToItemMap = new Map<string, CatalogItem>();
  
  function buildMap(items: CatalogItem[]) {
    items.forEach(item => {
      idToItemMap.set(item.id, item);
      if (item.children.length > 0) {
        buildMap(item.children);
      }
    });
  }
  
  buildMap(catalog);
  
  const targetItem = idToItemMap.get(targetId);
  if (!targetItem) return targetId;
  
  // 向上查找最顶级的收起祖先
  let current = targetItem;
  let topCollapsedAncestor: CatalogItem | null = null;
  
  while (current.parent) {
    const parent = current.parent;
    // 如果父节点是收起状态，记录它（但继续向上查找更顶级的）
    if (!expandedIds.has(parent.id)) {
      topCollapsedAncestor = parent;
    }
    current = parent;
  }
  
  return topCollapsedAncestor?.id || targetId;
}

/**
 * 计算当前选中项在可见列表中的位置（用于进度条）
 * 从第一个根节点开始查找，收起的节点不继续递归
 */
function calculateProgressPosition(catalog: CatalogItem[], endId: string, expandedIds: Set<string>, itemHeight: number): { top: number; height: number } {
  let count = 0;
  let found = false;
  
  function traverse(items: CatalogItem[]): boolean {
    for (const item of items) {
      if (found) return true;
      
      if (item.id === endId) {
        found = true;
        return true;
      }
      
      count++;
      
      // 如果当前项展开且有子节点，继续递归
      if (expandedIds.has(item.id) && item.children.length > 0) {
        if (traverse(item.children)) {
          return true;
        }
      }
    }
    return false;
  }
  
  traverse(catalog);
  
  return {
    top: count * itemHeight,
    height: itemHeight
  };
}

/**
 * 目录观察者 Hook 配置选项
 */
interface CatalogObserverOptions {
  /** 目录项高度（用于进度条计算） */
  itemHeight?: number;
}

/**
 * 目录观察者 Hook
 * @param catalog 目录数据数组（树形结构）
 * @param scrollContainer 可选的滚动容器
 * @param options 配置选项
 */
export function useCatalogObserver(catalog: CatalogItem[], scrollContainer?: HTMLElement | null, options: CatalogObserverOptions = {}) {
  const { itemHeight = 40 } = options;
  /** 当前激活的标题 ID */
  const [activeId, setActiveId] = useState<string | null>(null);
  /** 展开的项目ID集合 */
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  
  /** 标记是否为主动点击触发的滚动 */
  const isClickScrolling = useRef<boolean>(false);
  /** 滚动定时器 */
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  /** 目录容器引用 */
  const catalogRef = useRef<HTMLDivElement>(null);

  /**
   * 获取所有目录项的ID列表（缓存）
   */
  const allIds = useMemo(() => getAllCatalogIds(catalog), [catalog]);

  /**
   * 获取有子节点的项目（用于展开/收起逻辑）
   */
  const itemsWithChildren = useMemo(() => getItemsWithChildren(catalog), [catalog]);

  /**
   * 初始化展开状态 - 默认全部展开
   */
  useEffect(() => {
    if (catalog && catalog.length > 0) {
      const initialExpandedIds = new Set<string>();
      itemsWithChildren.forEach(item => {
        initialExpandedIds.add(item.id);
      });
      setExpandedIds(initialExpandedIds);
    }
  }, [catalog, itemsWithChildren]);

  /**
   * 检查是否全部展开
   */
  const isAllExpanded = useMemo(() => {
    return itemsWithChildren.every(item => expandedIds.has(item.id));
  }, [itemsWithChildren, expandedIds]);

  /**
   * 计算进度指示器位置
   */
  const progressPosition = useMemo(() => {
    if (!activeId || !catalog.length) return { top: 0, height: itemHeight };
    
    // 找到最顶级的收起祖先
    const endId = findTopCollapsedAncestor(catalog, activeId, expandedIds);
    
    // 计算位置
    return calculateProgressPosition(catalog, endId, expandedIds, itemHeight);
  }, [activeId, catalog, expandedIds, itemHeight]);

  /**
   * 监听页面滚动，自动高亮当前可见的标题
   */
  useEffect(() => {
    if (!catalog || catalog.length === 0 || allIds.length === 0) {
      setActiveId(null);
      return;
    }

    // 延迟初始化，确保DOM元素已渲染
    const initObserver = () => {
      // 初始化激活 ID 为第一个
      if (allIds.length > 0) {
        setActiveId(allIds[0]);
      }

      const observer = new IntersectionObserver(
        (entries) => {
          // 如果是点击触发的滚动，不更新高亮状态
          if (isClickScrolling.current) {
            return;
          }

          // 找到最靠近顶部的可见元素
          let closestEntry: IntersectionObserverEntry | null = null;
          let closestDistance = Infinity;

          for (const entry of entries) {
            if (entry.isIntersecting) {
              const distance = Math.abs(entry.boundingClientRect.top);
              if (distance < closestDistance) {
                closestDistance = distance;
                closestEntry = entry;
              }
            }
          }

          if (closestEntry && closestEntry.target instanceof HTMLElement) {
            const id = closestEntry.target.id;
            if (allIds.includes(id)) {
              setActiveId(id);
            }
          }
        },
        {
          root: scrollContainer,
          rootMargin: '-50px 0px -80% 0px',
          threshold: [0, 0.25, 0.5, 0.75, 1],
        }
      );

      // 监听所有标题元素
      allIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.observe(element);
        }
      });

      return observer;
    };

    // 短暂延迟确保DOM渲染完成
    let observer: IntersectionObserver | null = null;
    const timer = setTimeout(() => {
      observer = initObserver();
    }, 100);

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, [catalog, scrollContainer, allIds]);

  /**
   * 主动设置激活 ID（点击目录项）
   */
  const setActiveIdManually = (id: string) => {
    // 清除之前的滚动定时器
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // 标记为点击触发的滚动
    isClickScrolling.current = true;

    // 立即设置激活状态
    setActiveId(id);

    // 滚动到目标元素
    if (scrollContainer) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: 'instant',
          block: 'start',
        });
      }
    }

    // 短暂延迟后解除标记，允许自动高亮
    scrollTimeoutRef.current = setTimeout(() => {
      isClickScrolling.current = false;
      scrollTimeoutRef.current = null;
    }, 100);
  };

  /**
   * 切换展开/收起状态
   */
  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  /**
   * 切换全部展开/收起
   */
  const toggleAllExpand = () => {
    const shouldExpand = !isAllExpanded;
    if (shouldExpand) {
      // 展开所有
      const allItemsWithChildren = new Set<string>();
      itemsWithChildren.forEach(item => {
        allItemsWithChildren.add(item.id);
      });
      setExpandedIds(allItemsWithChildren);
    } else {
      // 收起所有
      setExpandedIds(new Set());
    }
  };

  return {
    // 状态
    activeId,
    expandedIds,
    isAllExpanded,
    progressPosition,
    
    // 引用
    catalogRef,
    
    // 方法
    setActiveId: setActiveIdManually,
    toggleExpand,
    toggleAllExpand,
  };
}