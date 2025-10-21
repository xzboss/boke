import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { PostMetadata } from './markdown';
import { categories, type Category } from '@/config/categories';

/**
 * 扫描所有文章，构建标签到文章的映射
 */
function buildTagToArticlesMap(): Map<string, PostMetadata[]> {
  const contentDir = path.join(process.cwd(), 'src/content/blog');
  const tagMap = new Map<string, PostMetadata[]>();
  
  try {
    const files = fs.readdirSync(contentDir);
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContent);
        const metadata = data as PostMetadata;
        
        // 为每个标签添加文章
        if (metadata.tags && Array.isArray(metadata.tags)) {
          metadata.tags.forEach(tag => {
            if (!tagMap.has(tag)) {
              tagMap.set(tag, []);
            }
            tagMap.get(tag)!.push(metadata);
          });
        }
      }
    }
  } catch (error) {
    console.error('Error reading blog content:', error);
  }
  
  return tagMap;
}

/**
 * 根据标签匹配填充分类结构
 */
function fillCategoriesWithArticles(
  categories: Category[], 
  tagMap: Map<string, PostMetadata[]>
): Category[] {
  return categories.map(category => {
    const newCategory: Category = { ...category, children: [] };
    
    if (category.type === 'menu') {
      // 对于menu类型，先处理子菜单
      if (category.children.length > 0) {
        newCategory.children = fillCategoriesWithArticles(category.children, tagMap);
      }
      
      // 然后添加匹配标签的文章
      const matchingArticles: Category[] = [];
      
      category.tags.forEach(tag => {
        const articles = tagMap.get(tag);
        if (articles) {
          articles.forEach(article => {
            // 避免重复添加同一篇文章
            const articleId = article.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '');
            if (!matchingArticles.some(a => a.id === articleId)) {
              matchingArticles.push({
                id: articleId,
                name: article.title,
                parentId: category.id,
                type: 'article',
                tags: article.tags || [],
                children: []
              });
            }
          });
        }
      });
      
      // 将文章添加到子项中
      newCategory.children = [...newCategory.children, ...matchingArticles];
    }
    
    return newCategory;
  });
}

/**
 * 获取完整的填充后的分类结构
 */
export function getFilledCategories(): Category[] {
  const tagMap = buildTagToArticlesMap();
  return fillCategoriesWithArticles(categories, tagMap);
}

/**
 * 获取所有文章的slug列表（用于静态路由生成）
 */
export function getAllArticleSlugs(): string[] {
  const contentDir = path.join(process.cwd(), 'src/content/blog');
  const slugs: string[] = [];
  
  try {
    const files = fs.readdirSync(contentDir);
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const slug = file.replace(/\.md$/, '');
        slugs.push(slug);
      }
    }
  } catch (error) {
    console.error('Error reading blog content:', error);
  }
  
  return slugs;
}

/**
 * 根据文章标题获取对应的slug
 */
export function getSlugByTitle(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '');
}
