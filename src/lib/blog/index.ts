import type { BlogItem, RawBlogItem, Tags } from '@/types/blog';
import type { MenuNode } from '@/types/menu';
import { MENU_NODE_TYPE } from '@/types/menu';
import { loadRawBlogList, maintainMetadata } from './loader';
import { markdownToHtml, buildCatalog, buildMetadata } from './processor';
import { generateSlug } from '../utils/tools';

const { MENU, LEAF } = MENU_NODE_TYPE;

export interface BlogInterface {
  /** 原始博客 Markdown 列表 */
  rawBlogList: RawBlogItem[];
  /** 博客解析后的数据列表 */
  blogList: BlogItem[];
  /** 标签到博客的映射 */
  tag2BlogMap: Map<string, BlogItem[]>;
  /** 菜单数据结构 */
  menuTree: MenuNode[];
  /** 标签集合 */
  tagSet: Set<string>;
  /** 标签列表 */
  tagList: string[];
  /** slug到博客映射 */
  slug2Blog: Map<string, BlogItem>;
  /** 初始化 */
  init(): Promise<void>;
  /** 生成原始博客 Markdown 列表 */
  generateRawBlogList(): Promise<void>;
  /** 生成博客解析后的数据列表 */
  generateBlogList(): Promise<void>;
  /** 生成标签集合 */
  generateTagSet(): void;
  /** 生成标签列表 */
  generateTagList(): void;
  /** 生成标签到博客的映射 */
  generateTag2BlogMap(): void;
  /** 设置菜单树 */
  setMenuTree(menuTree: MenuNode[]): void;
  /** 生成slug到博客的映射 */
  generateSlug2BlogMap(): void;
  /** 根据slug获取文章 */
  getBlogBySlug(slug: string): BlogItem | null;
}

class Blog implements BlogInterface {
  /** 原始博客 Markdown 列表 */
  rawBlogList: RawBlogItem[] = [];
  /** 博客解析后的数据列表 */
  blogList: BlogItem[] = [];
  /** 标签到博客的映射 */
  tag2BlogMap: Map<Tags, BlogItem[]> = new Map();
  /** 菜单数据结构 */
  menuTree: MenuNode[] = [];
  /**标签集合 */
  tagSet: Set<Tags> = new Set();
  /**标签列表 */
  tagList: Tags[] = [];
  /** slug到博客映射 */
  slug2Blog = new Map<string, BlogItem>();
  constructor() {
    this.init();
  }

  async init() {
    try {
      await maintainMetadata();

      await this.generateRawBlogList();
      await this.generateBlogList();

      this.generateTagSet();
      this.generateTagList();
      this.generateTag2BlogMap();
      this.generateSlug2BlogMap();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * 生成原始博客 Markdown 列表
   */
  async generateRawBlogList() {
    const { rawBlogList, menuTree } = await loadRawBlogList();
    this.rawBlogList = rawBlogList;
    this.menuTree = menuTree;
  }

  /**
   * 生成博客解析后的数据列表
   */
  async generateBlogList() {
    await Promise.allSettled(
      this.rawBlogList.map(async (item: RawBlogItem) => {
        const { content, title } = item;
        const { metadata, mdContent } = buildMetadata(content);
        const htmlContent = await markdownToHtml(mdContent);
        const catalogTree = buildCatalog(mdContent);

        this.blogList.push({
          slug: generateSlug(metadata.title),
          metadata: {
            ...metadata,
            title: metadata.title || title,
          },
          content: htmlContent,
          catalogTree,
        });
      })
    ).catch(error => {
      throw error;
    });
  }

  /**
   * 生成标签集合
   */
  generateTagSet() {
    this.tagSet = new Set(this.blogList?.flatMap(item => item.metadata?.tags || []));
  }

  /**
   * 生成标签列表
   */
  generateTagList() {
    this.tagList = Array.from(this.tagSet);
  }

  /**
   * 生成标签到博客的映射
   */
  generateTag2BlogMap() {
    this.blogList.forEach(item => {
      item.metadata?.tags?.forEach(tag => {
        if (!this.tag2BlogMap.has(tag)) {
          this.tag2BlogMap.set(tag, []);
        }
        this.tag2BlogMap.get(tag)?.push(item);
      });
    });
  }

  /**
   * 生成slug到博客的映射
   */
  generateSlug2BlogMap() {
    this.blogList.forEach(item => {
      this.slug2Blog.set(item.slug, item);
    });
  }

  /**
   * 填充菜单树
   * 填充逻辑：已有的menus结构已经给出，tagToBlogMap也已经存在，所有有菜单项tag的文章都添加到该菜单项的children中
   */
  setMenuTree(menuTree: MenuNode[]): void {
    this.menuTree = menuTree;
  }

  /**
   * 根据slug获取文章
   */
  getBlogBySlug(slug: string): BlogItem | null {
    return this.slug2Blog.get(decodeURIComponent(slug)) || null;
  }
}

export const blog = new Blog();

// 一些客户端组件可以直接用的静态数据
export const staticBlogData = {
  menuTree: blog.menuTree,
  blogList: blog.blogList,
  tagList: blog.tagList,
};

export default Blog;
