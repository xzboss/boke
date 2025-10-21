/**
 * 目录项（扁平化结构，包含父子关系和状态）
 */
export interface CatalogNode {
  /** 标题层级 (1-6) */
  level: number;
  /** 标题文本 */
  title: string;
  /** 标题 id（用于锚点跳转） */
  id: string;
  /** 父节点，顶级节点为null */
  parent: CatalogNode | null;
  /** 子节点列表（方便查找） */
  children: CatalogNode[];
  /** 是否展开（有子节点时才有意义） */
  isExpanded: boolean;
}
