import { blog as blogInstance } from "@/lib/blog";
import { notFound } from "next/navigation";
import { Empty } from "@/components/Empty";
import { MdHtmlViewer } from "@/components/MdHtmlViewer";

interface BlogArticlePageProps {
  params: { slug: string };
}

/**
 * 博客文章页面 - 服务端组件
 */
export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = params;

  // 在服务端获取文章数据
  const post = blogInstance.getBlogBySlug(slug);

  if (!post) {
    return <Empty />;
  }

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.metadata.title}</h1>
        {post.metadata.description && (
          <p className="text-lg text-gray-600 mb-4">
            {post.metadata.description}
          </p>
        )}
        <div className="flex gap-2 text-sm text-gray-500">
          <span>创建时间: {post.metadata.createdAt}</span>
          {post.metadata.updatedAt && (
            <span>更新时间: {post.metadata.updatedAt}</span>
          )}
        </div>
        {post.metadata.tags && post.metadata.tags.length > 0 && (
          <div className="flex gap-2 mt-2">
            {post.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      <MdHtmlViewer htmlContent={post.content} />
    </article>
  );
}
