import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import dayjs from 'dayjs';
import type { CatalogNode } from '@/types/catalog';
import type { BlogItem } from '@/types/blog';
import { generateSlug } from '../utils/tools';
import { DATE_FORMAT } from '@/constants';

/**
 * rehype 插件：为 img 标签添加 referrerPolicy 属性
 */
function rehypeImageReferrer() {
  return (tree: any) => {
    function visit(node: any) {
      if (node.type === 'element' && node.tagName === 'img') {
        // 添加 referrerPolicy 属性， 防止第三方防盗链
        node.properties = node.properties || {};
        node.properties.referrerPolicy = 'no-referrer';
        node.properties.width = '100%';
      }

      // 递归处理子节点
      if (node.children) {
        node.children.forEach(visit);
      }
    }

    visit(tree);
  };
}

/**
 * rehype 插件：自定义标题 ID 生成
 */
function rehypeCustomSlug() {
  return (tree: any) => {
    const idCounter = new Map<string, number>();

    function visit(node: any) {
      if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
        // 获取标题文本
        let titleText = '';
        function extractText(n: any) {
          if (n.type === 'text') {
            titleText += n.value;
          } else if (n.children) {
            n.children.forEach(extractText);
          }
        }
        extractText(node);

        // 使用 generateSlug 生成 ID
        const baseId = generateSlug(titleText);
        const count = idCounter.get(baseId) || 0;
        const id = count === 0 ? baseId : `${baseId}-${count}`;
        idCounter.set(baseId, count + 1);

        // 设置 ID 属性
        node.properties = node.properties || {};
        node.properties.id = id;
      }

      // 递归处理子节点
      if (node.children) {
        node.children.forEach(visit);
      }
    }

    visit(tree);
  };
}

/**
 * 通过md生成HTML，标题带锚点
 * @param mdStr md文本（不带元信息的Markdown文本）
 * @returns HTML字符串
 */
export const markdownToHtml = async (mdStr: string): Promise<string> => {
  try {
    const result = await remark()
      .use(remarkGfm) // 支持 GitHub 风格 Markdown
      .use(remarkMath) // 支持数学公式
      .use(remarkRehype, {
        allowDangerousHtml: true, // 允许HTML标签和内联样式
      }) // 转换为 HTML AST
      .use(rehypeKatex) // 处理数学公式为HTML
      .use(rehypeCustomSlug) // 自定义标题 ID 生成
      .use(rehypeImageReferrer) // 为 img 标签添加 referrerPolicy
      .use(rehypeStringify, {
        allowDangerousHtml: true, // 允许输出HTML标签
      }) // 转换为 HTML 字符串
      .process(mdStr);

    return result.toString();
  } catch (error) {
    console.error('Markdown 转 HTML 失败:', error);
    throw new Error(`Markdown 转换失败: ${error}`);
  }
};

/**
 * 通过md生成目录树
 * @param mdStr md文本（不带元信息的Markdown文本）
 * @returns CatalogNode[] 目录树数组
 */
export const buildCatalog = (mdStr: string): CatalogNode[] => {
  const catalogNodes: CatalogNode[] = [];
  const lines = mdStr.split('\n');
  const idCounter = new Map<string, number>(); // 处理重复ID
  const nodeStack: CatalogNode[] = []; // 用于构建层级关系的栈

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (!headingMatch) continue;

    const level = headingMatch[1].length;
    const title = headingMatch[2].trim();

    // 生成唯一ID
    const baseId = generateSlug(title);

    const count = idCounter.get(baseId) || 0;
    const id = count === 0 ? baseId : `${baseId}-${count}`;
    idCounter.set(baseId, count + 1);

    // 创建目录节点
    const catalogNode: CatalogNode = {
      level,
      title,
      id,
      parent: null,
      children: [],
      isExpanded: true,
    };

    // 维护节点栈，移除比当前级别高或相等的节点
    while (nodeStack.length > 0 && nodeStack[nodeStack.length - 1].level >= level) {
      nodeStack.pop();
    }

    // 设置父子关系
    if (nodeStack.length > 0) {
      const parent = nodeStack[nodeStack.length - 1];
      catalogNode.parent = parent;
      parent.children.push(catalogNode);
    } else {
      // 顶级节点
      catalogNodes.push(catalogNode);
    }

    // 将当前节点压入栈
    nodeStack.push(catalogNode);
  }

  return catalogNodes;
};

/**
 * 通过md生成元数据
 * @param fileContent md文本（带元信息的Markdown文本）
 * @returns ParsedBlog['metadata'] 解析后的元数据
 */
export const buildMetadata = (fileContent: string): { metadata: BlogItem['metadata']; mdContent: string } => {
  const { data, content } = matter(fileContent);
  try {
    // 提供默认值并进行类型转换
    const metadata: BlogItem['metadata'] = {
      title: data.title || '',
      description: data.description,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt,
      tags: Array.from(new Set(Array.isArray(data.tags) ? data.tags : [])),
    };

    // 格式化日期字段
    if (metadata.createdAt) {
      metadata.createdAt = dayjs(metadata.createdAt).format(DATE_FORMAT);
    }

    if (metadata.updatedAt) {
      metadata.updatedAt = dayjs(metadata.updatedAt).format(DATE_FORMAT);
    }

    return { metadata, mdContent: content };
  } catch (error) {
    throw new Error(`元数据解析失败: ${error}`);
  }
};
