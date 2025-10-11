import { getFilledCategories } from "@/utils/categoryBuilder";
import type { CatalogItem } from "@/utils/markdown";
import BlogLayoutClient from "./BlogLayoutClient";
import "./page.scss";

interface BlogLayoutProps {
  children: React.ReactNode;
  catalog?: CatalogItem[];
}

/**
 * 博客布局组件（服务端组件）
 * 处理数据获取，传递给客户端组件处理交互
 */
export default async function BlogLayout({ children, catalog = [] }: BlogLayoutProps) {
  // 在服务端获取填充后的分类数据
  const filledCategories = getFilledCategories();

  return (
    <BlogLayoutClient 
      catalog={catalog} 
      filledCategories={filledCategories}
    >
      {children}
    </BlogLayoutClient>
  );
}
