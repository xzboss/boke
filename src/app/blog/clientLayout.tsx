"use client";

import { Layout } from "@/components/layout";
import { RecursiveMenu } from "@/components/Menu";
import { Catalog } from "@/components/Catalog";
import { SidebarToggle } from "@/components/SidebarToggle";
import { useState } from "react";
import type { CatalogNode } from "@/types/catalog";
import type { MenuNode } from "@/types/menu";
import "./page.scss";
import type { BlogItem } from "@/types/blog";
import type { Tags } from "@/types/blog";
import { useParams } from "next/navigation";

interface BlogLayoutProps {
  children: React.ReactNode;
  blogData: {
    menuTree: MenuNode[];
    blogList: BlogItem[];
    tagList: Tags[];
  };
}

/**
 * 博客布局组件 - 客户端组件
 * 处理侧边栏交互，使用传入的博客数据
 */
export default function ClientLayout({ children, blogData }: BlogLayoutProps) {
  /** 路由参数 */
  const { slug } = useParams();
  /** 左侧边栏是否展开 */
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  /** 右侧边栏是否展开 */
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  /** 目录数据 - 默认空，在具体文章页面时会有数据 */
  const catalogTree: CatalogNode[] =
    blogData.blogList.find((item) => item.slug === slug)?.catalogTree || [];
  /** 菜单数据 - 使用传入的博客菜单树 */
  const menuTree: MenuNode[] = blogData.menuTree;

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
              <RecursiveMenu menuTree={menuTree} />
            </div>
          </div>

          {/* 左侧侧边栏展开收起按钮 */}
          <SidebarToggle
            isOpen={isLeftSidebarOpen}
            onToggle={setIsLeftSidebarOpen}
            direction="left"
            expandedPosition={{ right: "0px", top: "20px" }}
            collapsedPosition={{ left: 0, top: "20px" }}
          />
        </div>

        {/* 中间文章内容区域 */}
        <div
          className="flex-1 h-full overflow-y-auto px-8 py-8 custom-scrollbar transition-all duration-300"
          style={{ paddingRight: isRightSidebarOpen ? "280px" : "0" }}
        >
          {children}
        </div>

        {/* 右侧目录导航 - 可收起 */}
        <div
          className="absolute right-0 top-0 bottom-0 blog-sidebar-right h-full transition-all duration-300"
          style={{ width: isRightSidebarOpen ? "280px" : "0" }}
        >
          <div className="h-full overflow-hidden">
            <div className="h-full custom-scrollbar" style={{ width: "280px" }}>
              <Catalog
                catalogTree={catalogTree}
                scrollContainer={
                  document.querySelector(".flex-1") as HTMLElement
                }
              />
            </div>
          </div>

          {/* 右侧侧边栏展开收起按钮 */}
          <SidebarToggle
            isOpen={isRightSidebarOpen}
            onToggle={setIsRightSidebarOpen}
            direction="right"
            expandedPosition={{ left: "-20px", top: "20px" }}
            collapsedPosition={{ right: "0", top: "20px" }}
          />
        </div>
      </div>
    </Layout>
  );
}
