/**
 * 博客页面 - 服务端组件
 * 在构建时生成所有文章的静态数据，无需 API 调用
 */
import { getAllStaticPosts } from "@/utils/staticBlog";
import BlogPageClient from "./BlogPageClient";
import type { ParsedPost } from "@/utils/markdown";
import "./page.scss";

/**
 * 博客首页 - 静态生成
 * 所有文章在构建时预处理，无需运行时解析 Markdown
 */
export default async function BlogPage() {
  // 在构建时获取所有文章数据
  const postsArray = await getAllStaticPosts();
  
  // 转换为 Map 方便查询
  const allPosts: Record<string, ParsedPost> = {};
  postsArray.forEach(({ slug, post }) => {
    allPosts[slug] = post;
  });

  // 将静态数据传递给客户端组件
  return <BlogPageClient allPosts={allPosts} />;
}
