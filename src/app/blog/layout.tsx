import { blog as blogInstance } from "@/lib/blog";
import ClientLayout from "./clientLayout";

interface BlogLayoutProps {
  children: React.ReactNode;
}

/**
 * 博客布局 - 服务端组件
 * 获取博客数据并传递给客户端组件
 */
export default async function BlogLayout({ children }: BlogLayoutProps) {
  // 获取需要传递给客户端的数据
  const blogData = {
    menuTree: blogInstance.menuTree,
    blogList: blogInstance.blogList,
    tagList: blogInstance.tagList,
  };

  return <ClientLayout blogData={blogData}>{children}</ClientLayout>;
}
