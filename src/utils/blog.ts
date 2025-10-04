import fs from 'fs';
import path from 'path';
import { parseMarkdown, ParsedPost } from './markdown';

/** 博客内容目录路径 */
const BLOG_CONTENT_DIR = path.join(process.cwd(), 'content/blog');

/**
 * 获取所有博客文章的文件名（不含扩展名）
 * @returns 文件名数组
 */
export function getAllPostSlugs(): string[] {
  const files = fs.readdirSync(BLOG_CONTENT_DIR);
  return files
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
}

/**
 * 根据 slug 获取博客文章
 * @param slug 文章标识（文件名）
 * @returns 解析后的文章数据
 */
export async function getPostBySlug(slug: string): Promise<ParsedPost | null> {
  try {
    const filePath = path.join(BLOG_CONTENT_DIR, `${slug}.md`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return await parseMarkdown(fileContent);
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

/**
 * 获取所有博客文章
 * @returns 所有文章数据数组
 */
export async function getAllPosts(): Promise<ParsedPost[]> {
  const slugs = getAllPostSlugs();
  const posts = await Promise.all(
    slugs.map((slug) => getPostBySlug(slug))
  );
  return posts.filter((post): post is ParsedPost => post !== null);
}

/**
 * 根据标签筛选文章
 * @param tag 标签名
 * @returns 包含该标签的文章数组
 */
export async function getPostsByTag(tag: string): Promise<ParsedPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) =>
    post.metadata.tags.includes(tag)
  );
}

/**
 * 根据分类筛选文章
 * @param category 分类名
 * @returns 属于该分类的文章数组
 */
export async function getPostsByCategory(category: string): Promise<ParsedPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) =>
    post.metadata.category === category
  );
}

