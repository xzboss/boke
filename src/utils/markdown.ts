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
  catalog: CatalogItem[];
}

/**
 * 目录项
 */
export interface CatalogItem {
  /** 标题层级 (1-6) */
  level: number;
  /** 标题文本 */
  text: string;
  /** 标题 id（用于锚点跳转） */
  id: string;
}

/**
 * 生成标题 ID（去重处理）
 * @param text 标题文本
 * @param usedIds 已使用的 ID 集合
 * @returns 唯一的 ID
 */
function generateUniqueId(text: string, usedIds: Set<string>): string {
  // 生成基础 ID
  const baseId = text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '');

  // 如果 ID 没有重复，直接使用
  if (!usedIds.has(baseId)) {
    usedIds.add(baseId);
    return baseId;
  }

  // 如果重复，添加数字后缀
  let counter = 1;
  let uniqueId = `${baseId}-${counter}`;
  while (usedIds.has(uniqueId)) {
    counter++;
    uniqueId = `${baseId}-${counter}`;
  }
  usedIds.add(uniqueId);
  return uniqueId;
}

/**
 * 将 Markdown 转换为 HTML
 * @param markdown Markdown 文本
 * @param catalog 目录项数组（用于同步 ID）
 * @returns HTML 字符串
 */
export async function markdownToHtml(markdown: string, catalog: CatalogItem[]): Promise<string> {
  // 创建标题文本到 ID 的映射
  const headingIdMap = new Map<string, string>();
  catalog.forEach(item => {
    headingIdMap.set(item.text, item.id);
  });

  // 使用 rehype-slug 的默认行为，但通过自定义插件设置我们的 ID
  const result = await remark()
    .use(remarkGfm) // 支持 GitHub 风格 Markdown
    .use(remarkRehype) // 将 Markdown AST 转换为 HTML AST
    .use(() => (tree: any) => {
      // 遍历 HTML AST，为标题节点设置 ID
      const visit = (node: any) => {
        if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
          // 提取标题文本
          const getText = (n: any): string => {
            if (n.type === 'text') return n.value;
            if (n.children) return n.children.map(getText).join('');
            return '';
          };
          const text = getText(node).trim();
          
          // 从映射中获取对应的 ID
          const id = headingIdMap.get(text);
          if (id) {
            node.properties = node.properties || {};
            node.properties.id = id;
          }
        }
        
        if (node.children) {
          node.children.forEach(visit);
        }
      };
      visit(tree);
    })
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
export function extractCatalog(markdown: string): CatalogItem[] {
  const catalog: CatalogItem[] = [];
  const lines = markdown.split('\n');
  const idCounts = new Map<string, number>(); // 记录每个 ID 出现的次数

  for (const line of lines) {
    // 匹配标题行 (# 、## 、### 等)
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      // 生成基础 id：转小写，替换空格为短横线，移除特殊字符
      let baseId = text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u4e00-\u9fa5-]/g, '');

      // 处理重复的 ID
      let id = baseId;
      const count = idCounts.get(baseId) || 0;
      if (count > 0) {
        id = `${baseId}-${count}`;
      }
      idCounts.set(baseId, count + 1);

      catalog.push({ level, text, id });
    }
  }

  return catalog;
}

/**
 * 解析 Markdown 文件
 * @param fileContent 文件内容
 * @returns 解析后的文档
 */
export async function parseMarkdown(fileContent: string): Promise<ParsedPost> {
  const { data, content } = matter(fileContent);
  const metadata = data as PostMetadata;

  // 先提取目录（生成唯一的 ID）
  const catalog = extractCatalog(content);

  // 使用 Catalog 中的 ID 转换 Markdown 为 HTML
  const htmlContent = await markdownToHtml(content, catalog);

  return {
    metadata,
    content: htmlContent,
    catalog,
  };
}

