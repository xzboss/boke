"use client";

import { useEffect, useState, useRef } from "react";
import Button from "../Button";
import Icon from "../Icon";
import type { CatalogItem } from "@/utils/markdown";
import "./catalog.scss";

/**
 * 目录组件 Props
 */
interface CatalogProps {
  /** 目录数据 */
  catalog: CatalogItem[];
  /** 自定义类名 */
  className?: string;
  /** 是否显示全部展开/收起按钮 */
  showExpandAll?: boolean;
}

/**
 * 目录导航组件
 * 显示文章的标题层级结构，支持点击跳转和自动高亮当前标题
 * 左侧有进度指示器，根据当前标题位置跳跃式显示
 */
export function Catalog({
  catalog,
  className,
  showExpandAll = true,
}: CatalogProps) {
  /** 当前激活的标题索引 */
  const [activeIndex, setActiveIndex] = useState<number>(0);
  /** 是否全部展开 */
  const [isAllExpanded, setIsAllExpanded] = useState<boolean>(true);
  /** 展开的标题 ID 集合 */
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  /** 目录容器引用 */
  const catalogRef = useRef<HTMLDivElement>(null);
  /** 目录项按钮引用数组 */
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  /** 标记是否为点击触发的滚动 */
  const isClickScrolling = useRef<boolean>(false);
  /** 保存当前的滚动定时器 */
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 初始化展开状态和激活索引
   * 当 catalog 变化时（切换文章），重置为初始状态
   */
  useEffect(() => {
    if (catalog && catalog.length > 0) {
      // 默认展开所有
      const allIds = new Set(catalog.map((item) => item.id));
      setExpandedIds(allIds);
      setIsAllExpanded(true);
      
      // 重置激活索引为 0
      setActiveIndex(0);
      
      // 清空 itemRefs 避免旧引用
      itemRefs.current = [];
    }
  }, [catalog]);

  /**
   * 当 activeIndex 改变时，自动滚动目录让激活项保持在视野中间
   */
  useEffect(() => {
    if (
      activeIndex === null ||
      !catalogRef.current ||
      !itemRefs.current[activeIndex]
    ) {
      return;
    }

    const catalogContainer = catalogRef.current;
    const activeItem = itemRefs.current[activeIndex];

    if (!activeItem) return;

    // 获取容器和激活项的位置信息
    const containerRect = catalogContainer.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    // 计算激活项相对于容器的位置
    const itemRelativeTop =
      itemRect.top - containerRect.top + catalogContainer.scrollTop;

    // 计算目标滚动位置：让激活项显示在容器中间
    const targetScrollTop =
      itemRelativeTop - containerRect.height / 2 + itemRect.height / 2;

    // 平滑滚动到目标位置
    catalogContainer.scrollTo({
      top: targetScrollTop,
      behavior: "smooth",
    });
  }, [activeIndex]);

  /**
   * 监听页面滚动，自动高亮当前可见的标题
   */
  useEffect(() => {
    if (!catalog || catalog.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 如果是点击触发的滚动，不更新高亮状态
        if (isClickScrolling.current) {
          return;
        }

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = catalog.findIndex(
              (item) => item.id === entry.target.id
            );
            if (index !== -1) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        // 当标题距离视口顶部 50px 时触发
        rootMargin: "-50px 0px -80% 0px",
      }
    );

    // 监听所有标题元素
    catalog.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [catalog]);

  /**
   * 处理标题点击，跳转到对应标题并高亮
   */
  const handleTitleClick = (id: string, index: number) => {
    const element = document.getElementById(id);
    if (element) {
      // 清除之前的滚动定时器
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // 标记为点击触发的滚动
      isClickScrolling.current = true;

      // 立即设置激活状态
      setActiveIndex(index);

      // 直接跳转到目标位置，不使用平滑滚动
      element.scrollIntoView({ behavior: "auto", block: "start" });

      // 短暂延迟后解除标记，允许自动高亮
      // 使用 100ms 即可，因为是瞬间跳转
      scrollTimeoutRef.current = setTimeout(() => {
        isClickScrolling.current = false;
        scrollTimeoutRef.current = null;
      }, 100);
    }
  };

  /**
   * 切换展开/收起状态
   */
  const toggleExpand = (e: React.MouseEvent, id: string) => {
    // 阻止事件冒泡，防止触发标题点击
    e.stopPropagation();

    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);

    // 更新全部展开状态
    setIsAllExpanded(newExpanded.size === catalog.length);
  };

  /**
   * 切换全部展开/收起
   */
  const toggleAllExpand = () => {
    if (isAllExpanded) {
      setExpandedIds(new Set());
      setIsAllExpanded(false);
    } else {
      const allIds = new Set(catalog.map((item) => item.id));
      setExpandedIds(allIds);
      setIsAllExpanded(true);
    }
  };

  /**
   * 判断某个标题是否有子标题
   */
  const hasChildren = (item: CatalogItem, index: number) => {
    // 检查后面是否有更深层级的标题
    for (let i = index + 1; i < catalog.length; i++) {
      const nextItem = catalog[i];
      // 如果下一个标题层级更深，说明当前标题有子标题
      if (nextItem.level > item.level) {
        return true;
      }
      // 如果下一个标题层级相同或更浅，说明没有子标题了
      if (nextItem.level <= item.level) {
        break;
      }
    }
    return false;
  };

  /**
   * 获取可见的目录项（根据展开状态）
   */
  const getVisibleItems = () => {
    const visible: CatalogItem[] = [];
    let lastVisibleAtLevel: { [level: number]: CatalogItem } = {};

    catalog.forEach((item) => {
      // 一级标题始终显示
      if (item.level === 1) {
        visible.push(item);
        lastVisibleAtLevel = { 1: item };
      } else {
        // 检查所有更浅层级的父节点是否都展开
        let shouldShow = true;
        for (let parentLevel = 1; parentLevel < item.level; parentLevel++) {
          const parent = lastVisibleAtLevel[parentLevel];
          if (!parent || !expandedIds.has(parent.id)) {
            shouldShow = false;
            break;
          }
        }

        if (shouldShow) {
          visible.push(item);
          lastVisibleAtLevel[item.level] = item;
          // 清除更深层级的记录
          for (let level = item.level + 1; level <= 6; level++) {
            delete lastVisibleAtLevel[level];
          }
        }
      }
    });

    return visible;
  };

  const visibleItems = getVisibleItems();

  if (!catalog || catalog.length === 0) {
    return (
      <div className="catalog-container">
        <div className="catalog-header">
          <h3 className="text-sm font-semibold">目录</h3>
        </div>
        <div className="p-4">
          <div className="text-sm opacity-60">暂无目录</div>
        </div>
      </div>
    );
  }

  // 计算进度指示器位置
  const getProgressPosition = () => {
    if (catalogRef.current && itemRefs.current[activeIndex]) {
      const container = catalogRef.current;
      const activeItem = itemRefs.current[activeIndex];
      if (activeItem) {
        const containerRect = container.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        const top = itemRect.top - containerRect.top + container.scrollTop;
        return { top, height: itemRect.height };
      }
    }
    return { top: 0, height: 40 };
  };

  const progressPos = getProgressPosition();

  return (
    <div className={`catalog-container ${className || ""}`}>
      {/* 目录标题 */}
      <div className="catalog-header">
        <h3 className="text-sm font-semibold">目录</h3>
      </div>

      {/* 全部展开/收起按钮 */}
      {showExpandAll && (
        <div className="px-3 py-2">
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

      {/* 目录列表 */}
      <nav ref={catalogRef} className="catalog-list custom-scrollbar">
        {/* 进度指示器 */}
        <div
          className="catalog-progress"
          style={{
            top: `${progressPos.top}px`,
            height: `${progressPos.height}px`,
          }}
        />

        {/* 目录项 */}
        {visibleItems.map((item) => {
          const actualIndex = catalog.indexOf(item);
          const isActive = actualIndex === activeIndex;
          const isExpanded = expandedIds.has(item.id);
          const itemHasChildren = hasChildren(item, actualIndex);

          return (
            <div
              key={item.id}
              ref={(el) => {
                itemRefs.current[actualIndex] = el;
              }}
              className="catalog-item"
              style={{
                paddingLeft: `${12 + (item.level - 1) * 16}px`,
              }}
            >
              <div className="catalog-item-content">
                {/* 左侧展开/收起图标 - 只有当确实有子节点时才显示 */}
                {itemHasChildren && (
                  <div
                    className="catalog-expand-icon"
                    onClick={(e) => toggleExpand(e, item.id)}
                  >
                    <Icon
                      type="icon-expand"
                      style={{
                        fontSize: "12px",
                        transform: isExpanded
                          ? "rotate(270deg)"
                          : "rotate(180deg)",
                      }}
                    />
                  </div>
                )}

                {/* 右侧标题按钮 */}
                <Button
                  type={isActive ? "default" : "text"}
                  size="sm"
                  onClick={() => handleTitleClick(item.id, actualIndex)}
                  className="flex-1"
                  style={itemHasChildren ? {} : { marginLeft: "24px" }}
                >
                  {item.text}
                </Button>
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
