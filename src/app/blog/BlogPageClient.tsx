"use client";

import { Layout } from "@/components/layout";
import { RecursiveMenu } from "@/components/Menu";
import { Catalog } from "@/components/Catalog";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { categories } from "@/config/categories";
import type { CatalogItem } from "@/utils/markdown";
import type { ParsedPost } from "@/utils/markdown";
import "./page.scss";

/** 文章数据类型 */
interface PostData {
  title: string;
  content: string;
  catalog: CatalogItem[];
}

interface BlogPageClientProps {
  /** 所有文章的静态数据 */
  allPosts: Record<string, ParsedPost>;
}

/**
 * 博客页面客户端组件
 * 所有文章数据在构建时生成，无需 API 调用，秒开！
 */
export default function BlogPageClient({ allPosts }: BlogPageClientProps) {
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

  /**
   * 获取第一个包含 hot 标签的叶子节点（缓存结果）
   */
  const firstHotArticle = useMemo(() => {
    const findHotLeaf = (cats: typeof categories): string | null => {
      for (const cat of cats) {
        // 如果是叶子节点（没有子节点）且包含 hot 标签
        if (cat.children.length === 0 && cat.tags.includes("hot")) {
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

  /** 加载文章数据 - 直接从静态数据读取，无需 API */
  useEffect(() => {
    if (!selectedSubCategory) {
      setCurrentPost(null);
      return;
    }

    // 直接从静态数据获取（秒开！）
    const post = allPosts[selectedSubCategory];
    if (post) {
      setCurrentPost({
        title: post.metadata.title,
        content: post.content,
        catalog: post.catalog,
      });
    } else {
      console.error(`Post not found: ${selectedSubCategory}`);
      setCurrentPost(null);
    }
  }, [selectedSubCategory, allPosts]);

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
      <div className="h-[calc(99vh-68px)] flex overflow-hidden relative">
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
                right: "0px",
                top: "20px",
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
                top: "20px",
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
        <div
          className="flex-1 h-full overflow-y-auto px-8 py-8 custom-scrollbar transition-all duration-300"
          style={{ paddingRight: isRightSidebarOpen ? "280px" : "0" }}
        >
          {currentPost ? (
            <article className="max-w-4xl mx-auto">
              <header className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{currentPost.title}</h1>
              </header>
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: currentPost.content }}
              />
            </article>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">
                请从左侧选择一条测试用例
              </p>
            </div>
          )}
        </div>

        {/* 右侧目录导航 - 可收起 */}
        <div
          className="absolute right-0 top-0 bottom-0 blog-sidebar-right h-full transition-all duration-300"
          style={{ width: isRightSidebarOpen ? "280px" : "0" }}
        >
          <div className="h-full overflow-hidden">
            <div className="h-full custom-scrollbar" style={{ width: "280px" }}>
              <Catalog
                key={selectedSubCategory}
                catalog={currentPost?.catalog || []}
              />
            </div>
          </div>

          {/* 收起按钮 - 左侧居中，hover时显示 */}
          {isRightSidebarOpen && (
            <div
              className="collapse-btn absolute z-10"
              style={{
                left: "-20px",
                top: "20px",
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
                right: "0",
                top: "20px",
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
