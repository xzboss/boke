import type { BlogItem } from "./blog";
import type { Tags } from "./blog";
/**
 * 菜单类型
 */
export const MENU_NODE_TYPE = {
  MENU: "menu",
  LEAF: "leaf",
} as const;

export type MenuNodeType = (typeof MENU_NODE_TYPE)[keyof typeof MENU_NODE_TYPE];

/**
 * 菜单项
 */
export interface MenuNode {
  /** 菜单项ID */
  id: string;
  /** 菜单项名称 */
  name: string;
  /** 父菜单项ID */
  parentId: string | null;
  /** 类型*/
  type: MenuNodeType;
  /** 菜单项所包含的标签 */
  tags?: Tags[];
  /** 指定博客元数据 */
  metadata?: BlogItem["metadata"];
  /** 指定博客路径 */
  path?: string;
  /** 子菜单项 */
  children: MenuNode[];
}
