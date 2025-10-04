import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';

/**
 * Markdown 文件的 frontmatter 结构
 */
export interface PostMetadata {
  /** 文章标题 */
  title: string;
  /** 文章描述 */
  description?: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt?: string;
  /** 标签列表 */
  tags: string[];
  /** 分类 */
  category: string;
  /** 是否精选 */
  featured?: boolean;
}

/**
 * 解析后的 Markdown 文档
 */
export interface ParsedPost {
  /** 元数据 */
  metadata: PostMetadata;
  /** HTML 内容 */
  content: string;
  /** 目录结构 */
  toc: TocItem[];
}

/**
 * 目录项
 */
export interface TocItem {
  /** 标题层级 (1-6) */
  level: number;
  /** 标题文本 */
  text: string;
  /** 标题 id（用于锚点跳转） */
  id: string;
}

/**
 * 将 Markdown 转换为 HTML
 * @param markdown Markdown 文本
 * @returns HTML 字符串
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm) // 支持 GitHub 风格 Markdown
    .use(remarkRehype) // 将 Markdown AST 转换为 HTML AST
    .use(rehypeSlug) // 为标题添加 id
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' }) // 为标题添加锚点链接
    .use(rehypeStringify) // 将 HTML AST 转换为字符串
    .process(markdown);

  return result.toString();
}

/**
 * 从 Markdown 内容中提取目录
 * @param markdown Markdown 文本
 * @returns 目录项数组
 */
export function extractToc(markdown: string): TocItem[] {
  const toc: TocItem[] = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    // 匹配标题行 (# 、## 、### 等)
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      // 生成 id：转小写，替换空格为短横线，移除特殊字符
      const id = text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u4e00-\u9fa5-]/g, '');

      toc.push({ level, text, id });
    }
  }

  return toc;
}

/**
 * 解析 Markdown 文件
 * @param fileContent 文件内容
 * @returns 解析后的文档
 */
export async function parseMarkdown(fileContent: string): Promise<ParsedPost> {
  const { data, content } = matter(fileContent);
  const metadata = data as PostMetadata;

  // 转换 Markdown 为 HTML
  const htmlContent = await markdownToHtml(content);

  // 提取目录
  const toc = extractToc(content);

  return {
    metadata,
    content: htmlContent,
    toc,
  };
}

