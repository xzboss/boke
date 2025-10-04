"use client";

import { Layout } from "@/components/layout";
import { RecursiveMenu } from "@/components/Menu";
import { Catalog } from "@/components/Catalog";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { categories } from "@/config/categories";
import type { TocItem } from "@/utils/markdown";
import "./page.scss";

/** 文章数据类型 */
interface PostData {
  title: string;
  content: string;
  toc: TocItem[];
}

/**
 * 博客首页组件
 * 三栏布局：左侧分类导航 + 中间文章内容 + 右侧目录
 * 支持 URL 同步和单页面应用切换
 * 支持左右侧边栏收起/展开
 */
export default function BlogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  /** 当前选中的子分类ID */
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  /** 当前选中的分类ID */
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  /** 左侧边栏是否展开 */
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  /** 右侧边栏是否展开 */
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  /** 当前文章数据 */
  const [currentPost, setCurrentPost] = useState<PostData | null>(null);
  /** 加载状态 */
  const [loading, setLoading] = useState(false);

  /**
   * 获取第一个包含 hot 标签的叶子节点（缓存结果）
   */
  const firstHotArticle = useMemo(() => {
    const findHotLeaf = (cats: typeof categories): string | null => {
      for (const cat of cats) {
        // 如果是叶子节点（没有子节点）且包含 hot 标签
        if (cat.children.length === 0 && cat.tags.includes('hot')) {
          return cat.id;
        }
        // 递归查找子节点
        if (cat.children.length > 0) {
          const found = findHotLeaf(cat.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findHotLeaf(categories);
  }, []);

  /**
   * 从 URL 参数初始化状态
   * 如果没有 article 参数，默认打开第一个 hot 标签的文章
   */
  useEffect(() => {
    const article = searchParams.get("article");
    
    if (article) {
      // 有 URL 参数，使用 URL 参数
      setSelectedSubCategory(article);
      // 找到对应的父分类
      const parentCategory = categories.find((cat) =>
        cat.children?.some((child) => child.id === article)
      );
      setCurrentCategory(parentCategory?.id || null);
    } else if (firstHotArticle) {
      // 没有 URL 参数，打开第一个 hot 文章
      setSelectedSubCategory(firstHotArticle);
      // 找到对应的父分类
      const parentCategory = categories.find((cat) =>
        cat.children?.some((child) => child.id === firstHotArticle)
      );
      setCurrentCategory(parentCategory?.id || null);
      
      // 更新 URL（不刷新页面）
      router.replace(`/blog?article=${firstHotArticle}`, { scroll: false });
    }
  }, [searchParams, router, firstHotArticle]);

  /** 加载文章数据 */
  useEffect(() => {
    if (!selectedSubCategory) {
      setCurrentPost(null);
      return;
    }

    setLoading(true);
    fetch(`/api/blog/${selectedSubCategory}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error('Error loading post:', data.error);
          setCurrentPost(null);
        } else {
          setCurrentPost({
            title: data.metadata.title,
            content: data.content,
            toc: data.toc,
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching post:', error);
        setCurrentPost(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedSubCategory]);

  /** 处理子分类选择，更新状态和 URL */
  const handleSubCategorySelect = (subCategoryId: string) => {
    setSelectedSubCategory(subCategoryId);
    // 找到对应的父分类
    const parentCategory = categories.find((cat) =>
      cat.children?.some((child) => child.id === subCategoryId)
    );
    setCurrentCategory(parentCategory?.id || null);

    // 更新 URL 参数
    const params = new URLSearchParams(searchParams.toString());
    params.set("article", subCategoryId);
    router.push(`/blog?${params.toString()}`, { scroll: false });
  };

  return (
    <Layout>
      <div className="h-full flex">
        {/* 左侧分类导航 - 可收起 */}
        <div
          className="blog-sidebar-left relative h-full transition-all duration-300"
          style={{ width: isLeftSidebarOpen ? "280px" : "0" }}
        >
          <div className="h-full overflow-hidden">
            <div
              className="w-full h-full p-4 custom-scrollbar"
              style={{ width: "280px" }}
            >
              <RecursiveMenu
                data={categories}
                currentCategory={currentCategory || undefined}
                currentSubCategory={selectedSubCategory || undefined}
                onSubCategorySelect={handleSubCategorySelect}
              />
            </div>
          </div>

          {/* 收起按钮 - 右侧居中，hover时显示 */}
          {isLeftSidebarOpen && (
            <div
              className="collapse-btn absolute z-10"
              style={{
                right: 0,
                top: "200px",
              }}
            >
              <Button
                type="default"
                size="sm"
                onClick={() => setIsLeftSidebarOpen(false)}
                className="rounded-full w-8 h-8 p-0 flex items-center justify-center"
              >
                <Icon type="icon-expand" style={{ fontSize: "12px" }} />
              </Button>
            </div>
          )}
          {/* 展开左侧边栏按钮 */}
          {!isLeftSidebarOpen && (
            <div
              className="absolute z-10"
              style={{
                left: 0,
                top: "200px",
              }}
            >
              <Button
                type="default"
                size="sm"
                onClick={() => setIsLeftSidebarOpen(true)}
                className="rounded-r-full w-8 h-8 p-0 flex items-center justify-center"
              >
                <Icon
                  type="icon-expand"
                  style={{ fontSize: "12px", transform: "rotate(180deg)" }}
                />
              </Button>
            </div>
          )}
        </div>

        {/* 中间文章内容区域 */}
        <div className="flex-1 h-full overflow-y-auto px-8 py-8 custom-scrollbar">
          {loading ? (
            /* 加载状态 */
            <div className="text-center py-16">
              <div className="text-lg opacity-60">加载中...</div>
            </div>
          ) : currentPost ? (
            <article className="max-w-4xl mx-auto">
              {/* 文章标题区域 */}
              <header className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{currentPost.title}</h1>
              </header>
              {/* 文章正文内容 - 使用 dangerouslySetInnerHTML 渲染 HTML */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: currentPost.content }}
              />
            </article>
          ) : (
            /* 空状态提示 */
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">选择文章</h3>
              <p className="opacity-60">请从左侧分类中选择一篇文章进行阅读</p>
            </div>
          )}
        </div>

        {/* 右侧目录导航 - 可收起 */}
        <div
          className="blog-sidebar-right relative h-full transition-all duration-300"
          style={{ width: isRightSidebarOpen ? "280px" : "0" }}
        >
          <div className="h-full overflow-hidden">
            <div className="h-full" style={{ width: "280px" }}>
              <Catalog toc={currentPost?.toc || []} />
            </div>
          </div>

          {/* 收起按钮 - 左侧居中，hover时显示 */}
          {isRightSidebarOpen && (
            <div
              className="collapse-btn absolute z-10"
              style={{
                left: 0,
                top: "200px",
                transform: "translateX(-50%)",
              }}
            >
              <Button
                type="default"
                size="sm"
                onClick={() => setIsRightSidebarOpen(false)}
                className="rounded-full w-8 h-8 p-0 flex items-center justify-center"
              >
                <Icon
                  type="icon-expand"
                  style={{ fontSize: "12px", transform: "rotate(180deg)" }}
                />
              </Button>
            </div>
          )}
          {/* 展开右侧边栏按钮 */}
          {!isRightSidebarOpen && (
            <div
              className="absolute z-10"
              style={{
                right: 0,
                top: "200px",
              }}
            >
              <Button
                type="default"
                size="sm"
                onClick={() => setIsRightSidebarOpen(true)}
                className="rounded-l-full w-8 h-8 p-0 flex items-center justify-center"
              >
                <Icon type="icon-expand" style={{ fontSize: "12px" }} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
