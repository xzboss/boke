/**
 * 静态博客工具 - 用于在构建时生成静态内容
 */
import fs from 'fs';
import path from 'path';
import { parseMarkdown, type ParsedPost } from './markdown';
import { categories, type Category } from '@/config/categories';

const BLOG_CONTENT_DIR = path.join(process.cwd(), 'src/content/blog');

/**
 * 获取所有文章的 slug（叶子节点）
 */
export function getAllArticleSlugs(): string[] {
  const slugs: string[] = [];
  
  const traverse = (cats: Category[]) => {
    for (const cat of cats) {
      // 叶子节点才是文章
      if (cat.children.length === 0) {
        slugs.push(cat.id);
      } else {
        traverse(cat.children);
      }
    }
  };
  
  traverse(categories);
  return slugs;
}

/**
 * 根据 slug 获取文章静态数据（SSG 专用）
 */
export async function getStaticPostBySlug(slug: string): Promise<ParsedPost | null> {
  try {
    const filePath = path.join(BLOG_CONTENT_DIR, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Markdown file not found: ${slug}.md`);
      return null;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return await parseMarkdown(fileContent);
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

/**
 * 获取所有文章的静态数据（用于 getStaticProps）
 */
export async function getAllStaticPosts(): Promise<Array<{ slug: string; post: ParsedPost }>> {
  const slugs = getAllArticleSlugs();
  const posts: Array<{ slug: string; post: ParsedPost }> = [];
  
  for (const slug of slugs) {
    const post = await getStaticPostBySlug(slug);
    if (post) {
      posts.push({ slug, post });
    }
  }
  
  return posts;
}

