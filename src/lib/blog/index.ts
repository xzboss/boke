import type { BlogItem, RawBlogItem, Tags } from "@/types/blog";
import type { MenuNode } from "@/types/menu";
import { MENU_NODE_TYPE } from "@/types/menu";
import { loadRawBlogList } from "./loader";
import { markdownToHtml, buildCatalog, buildMetadata } from "./processor";
import { generateSlug, generateId } from "../utils/tools";

/**
 * 博客文章菜单数据结构
 */
export const menuTree: MenuNode[] = [
  {
    id: "frontend",
    name: "qianduan",
    parentId: null,
    tags: [],
    type: MENU_NODE_TYPE.MENU,
    children: [
      {
        id: "vue",
        name: "Vue测试",
        parentId: "frontend",
        tags: ["vue", "vite", "vue-router"],
        type: MENU_NODE_TYPE.MENU,
        children: [],
      },
    ],
  },
  {
    id: "backend",
    name: "houduan",
    parentId: null,
    tags: [],
    type: MENU_NODE_TYPE.MENU,
    children: [
      {
        id: "nodejs",
        name: "Node.js测试",
        parentId: "backend",
        tags: ["nodejs", "node", "测试"],
        type: MENU_NODE_TYPE.MENU,
        children: [],
      },
    ],
  },
];

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
  /** 填充菜单树 */
  fillMenuTree(): void;
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
  menuTree: MenuNode[] = menuTree;
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
      await this.generateRawBlogList();
      await this.generateBlogList();

      this.generateTagSet();
      this.generateTagList();
      this.generateTag2BlogMap();
      this.generateSlug2BlogMap();
      this.fillMenuTree();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * 生成原始博客 Markdown 列表
   */
  async generateRawBlogList() {
    this.rawBlogList = await loadRawBlogList();
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
    ).catch((error) => {
      throw error;
    });
  }

  /**
   * 生成标签集合
   */
  generateTagSet() {
    this.tagSet = new Set(
      this.blogList?.flatMap((item) => item.metadata?.tags || [])
    );
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
    this.blogList.forEach((item) => {
      item.metadata?.tags?.forEach((tag) => {
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
    this.blogList.forEach((item) => {
      this.slug2Blog.set(item.slug, item);
    });
  }

  /**
   * 填充菜单树
   * 填充逻辑：已有的menus结构已经给出，tagToBlogMap也已经存在，所有有菜单项tag的文章都添加到该菜单项的children中
   */
  fillMenuTree() {
    // 将博客列表转换为菜单项列表
    const menuNodeList = this.blogList.map((item) => {
      const slug = generateSlug(item.metadata.title);
      return {
        id: slug,
        name: item.metadata.title,
        parentId: null,
        type: MENU_NODE_TYPE.LEAF,
        metadata: { ...item.metadata },
        path: `/blog/${slug}`,
        children: [],
      };
    });

    // 生成标签到博客菜单项的映射
    const tag2MenuNodeMap = new Map<Tags, MenuNode[]>();
    menuNodeList.forEach((item) => {
      item.metadata?.tags?.forEach((tag) => {
        if (!tag2MenuNodeMap.has(tag)) {
          tag2MenuNodeMap.set(tag, [item]);
        } else {
          tag2MenuNodeMap.get(tag)?.push(item);
        }
      });
    });

    // 处理菜单节点
    const fillNode = (nodes: MenuNode[]) => {
      for (const node of nodes) {
        // 递归处理子节点
        if (node.children.length > 0) {
          fillNode(node.children);
        }

        // 如果当前节点有标签，查找匹配的博客并添加到children中
        const tempSet = new Set<MenuNode>();
        if (node.tags && node.tags.length > 0) {
          node.tags.forEach((tag) => {
            const blogs = tag2MenuNodeMap.get(tag);
            blogs?.forEach((item) => tempSet.add(item));
          });
        }
        node.children.push(...(Array.from(tempSet) as MenuNode[]));
      }
    };

    // 开始填充
    fillNode(this.menuTree);
  }

  /**
   * 根据slug获取文章
   */
  getBlogBySlug(slug: string) {
    return this.slug2Blog.get(slug) || null;
  }
}

export const blog = new Blog();

export default Blog;
