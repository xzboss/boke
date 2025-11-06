'use client';

import { useRouter } from 'next/navigation';

interface TempHomeProps {
  blogList: any[];
}

function BlogCard({ article }: { article: any }) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/blog/${article.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      router.push(`/blog/${article.slug}`);
    }
  };

  return (
    <article
      className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
    >
      <h2 className="text-xl font-semibold mb-2">{article.metadata.title}</h2>
      {article.metadata.description && <p className="mb-4">{article.metadata.description}</p>}
      <div className="flex flex-wrap gap-2 mb-4">
        {article.metadata.tags?.map((tag: string) => (
          <span key={tag} className="px-2 py-1 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>
      <time>{article.metadata.createdAt}</time>
    </article>
  );
}

export function TempHome({ blogList }: TempHomeProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">----</h1>
      {blogList && blogList.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogList.map((article: any) => (
            <BlogCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p>暂无博客文章</p>
        </div>
      )}
    </div>
  );
}
