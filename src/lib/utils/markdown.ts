import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";



/**
 * 将 Markdown 转换为 HTML
 * @param markdown Markdown 文本
 * @param catalog 目录项数组（用于同步 ID）
 * @returns HTML 字符串
 */
export async function markdownToHtml(
  markdown: string,
  catalog: CatalogItem[]
): Promise<string> {
  // 创建标题文本到 ID 的映射（需要遍历树形结构）
  const headingIdMap = new Map<string, string>();

  // 递归遍历树形catalog结构
  const flattenCatalog = (items: CatalogItem[]) => {
    items.forEach((item) => {
      headingIdMap.set(item.title, item.id);
      if (item.children.length > 0) {
        flattenCatalog(item.children);
      }
    });
  };

  flattenCatalog(catalog);

  // 使用 rehype-slug 的默认行为，但通过自定义插件设置我们的 ID
  const result = await remark()
    .use(remarkGfm) // 支持 GitHub 风格 Markdown
    .use(remarkRehype) // 将 Markdown AST 转换为 HTML AST
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .use(() => (tree: any) => {
      // 遍历 HTML AST，为标题节点设置 ID
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const visit = (node: any) => {
        if (node.type === "element" && /^h[1-6]$/.test(node.tagName)) {
          // 提取标题文本
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const getText = (n: any): string => {
            if (n.type === "text") return n.value;
            if (n.children) return n.children.map(getText).join("");
            return "";
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
    .use(rehypeAutolinkHeadings, { behavior: "wrap" }) // 为标题添加锚点链接
    .use(rehypeStringify) // 将 HTML AST 转换为字符串
    .process(markdown);

  return result.toString();
}

/**
 * 构建树形目录结构（包含父子关系和状态）
 * @param flatItems 平铺的标题数组
 * @returns 树形的目录数组，顶级节点数组
 */
function buildTreeCatalog(
  flatItems: Array<{ level: number; title: string; id: string }>
): CatalogItem[] {
  const allItems: CatalogItem[] = [];
  const itemMap = new Map<string, CatalogItem>();
  const stack: CatalogItem[] = [];

  for (const item of flatItems) {
    // 创建目录项
    const catalogItem: CatalogItem = {
      level: item.level,
      title: item.title,
      id: item.id,
      parent: null, // 初始化，后续会设置
      children: [],
      isExpanded: true, // 默认展开
    };

    allItems.push(catalogItem);
    itemMap.set(item.id, catalogItem);

    // 找到正确的父节点
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }

    // 设置父子关系
    if (stack.length > 0) {
      const parent = stack[stack.length - 1];
      catalogItem.parent = parent;
      parent.children.push(catalogItem);
    }

    stack.push(catalogItem);
  }

  // 返回顶级节点（parent为null的节点）
  return allItems.filter((item) => item.parent === null);
}

/**
 * 从 Markdown 内容中提取目录
 * @param markdown Markdown 文本
 * @returns 树形的目录项数组
 */
export function extractCatalog(markdown: string): CatalogItem[] {
  const flatItems: Array<{ level: number; title: string; id: string }> = [];
  const lines = markdown.split("\n");
  const idCounts = new Map<string, number>(); // 记录每个 ID 出现的次数

  // 第一步：提取所有标题，生成平铺数组
  for (const line of lines) {
    // 匹配标题行 (# 、## 、### 等)
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const title = match[2].trim();
      // 生成基础 id：转小写，替换空格为短横线，移除特殊字符
      const baseId = title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\u4e00-\u9fa5-]/g, "");

      // 处理重复的 ID
      let id = baseId;
      const count = idCounts.get(baseId) || 0;
      if (count > 0) {
        id = `${baseId}-${count}`;
      }
      idCounts.set(baseId, count + 1);

      flatItems.push({ level, title, id });
    }
  }

  // 第二步：构建树形目录结构
  return buildTreeCatalog(flatItems);
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
