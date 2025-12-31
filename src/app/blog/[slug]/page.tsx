// app/blog/[slug]/page.js
import { blog as blogInstance } from '@/lib/blog';
import { Empty } from '@/components/Empty';
import { MdHtmlViewer } from '@/components/MdHtmlViewer';

/**
 * slug 生成静态页面路由
 */
export async function generateStaticParams() {
  return blogInstance.blogList.map(post => ({
    slug: post.slug,
  }));
}

/**
 * 为每个slug生成页面元数据
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogInstance.getBlogBySlug(slug);

  if (!post) {
    return {
      title: '文章不存在',
      description: '文章不存在，请检查文章是否存在',
    };
  }

  return {
    title: post.metadata.title,
    description: post.metadata.description || 'longshixu的博客文章',
    keywords: post.metadata.tags?.join(', '),
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.description,
      type: 'article',
      publishedTime: post.metadata.createdAt,
      modifiedTime: post.metadata.updatedAt,
      tags: post.metadata.tags,
    },
  };
}

/**
 * 生成静态 HTML 页面
 */
export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = blogInstance.getBlogBySlug(slug);

  if (!post) {
    return <Empty />;
  }

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.metadata.title}</h1>
        {post.metadata.description && <p className="text-lg text-gray-600 mb-4">{post.metadata.description}</p>}
        <div className="flex gap-2 text-sm text-gray-500">
          <span>创建时间: {post.metadata.createdAt}</span>
          {post.metadata.updatedAt && <span>更新时间: {post.metadata.updatedAt}</span>}
        </div>
        {post.metadata.tags && post.metadata.tags.length > 0 && (
          <div className="flex gap-2 mt-2">
            {post.metadata.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
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
