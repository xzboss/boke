import type { CatalogNode } from "@/types/catalog";

export const BLOG_TYPE = {
  MD: "md",
  HTML: "html",
} as const;

export type BlogType = (typeof BLOG_TYPE)[keyof typeof BLOG_TYPE];

export type Tags = string

/**
 * 原始博客 Markdown 文件信息
 */
export interface RawBlogItem {
  /** 博客标题 */
  title: string;
  /** 博客原始内容 */
  content: string;
  /** 博客类型 */
  type: BlogType;
}

/**
 * 解析后的 Markdown 文档
 */
export interface BlogItem {
  /** 博客slug */
  slug: string;
  /** 元数据 */
  metadata: {
    /** 博客标题 */
    title: string;
    /** 博客描述 */
    description?: string;
    /** 博客创建时间 */
    createdAt: string;
    /** 博客更新时间 */
    updatedAt?: string;
    /** 博客标签列表 */
    tags: Tags[];
  };
  /** HTML 内容 */
  content: string;
  /** 目录树 */
  catalogTree: CatalogNode[];
}
