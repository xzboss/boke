import { getAllArticleSlugs } from "@/utils/categoryBuilder";
import { getStaticPostBySlug } from "@/utils/staticBlog";
import { Layout } from "@/components/layout";
import BlogLayout from "../layout";
import { notFound } from "next/navigation";

interface BlogArticlePageProps {
  params: { slug: string };
}

/**
 * 生成静态路由参数
 */
export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * 博客文章页面
 */
export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = params;
  
  // 获取文章数据
  const post = await getStaticPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  return (
    <Layout>
      <BlogLayout catalog={post.catalog}>
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{post.metadata.title}</h1>
            {post.metadata.description && (
              <p className="text-lg text-gray-600 mb-4">{post.metadata.description}</p>
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
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </BlogLayout>
    </Layout>
  );
}
