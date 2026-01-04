import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import matter from 'gray-matter';
import type { BlogType, RawBlogItem } from '@/types/blog';
import { BLOG_TYPE } from '@/types/blog';
import type { MenuNode } from '@/types/menu';
import { MENU_NODE_TYPE } from '@/types/menu';
import { generateSlug, calculateHash } from '../utils/tools';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '@/constants';

const BLOG_CONTENT_DIR = path.join(process.cwd(), 'src/content/blogs');
const { MENU, LEAF } = MENU_NODE_TYPE;

/**
 * 递归读取目录结构，构建菜单树
 */
function readDirectoryRecursively(dirPath: string, relativePath: string = ''): MenuNode[] {
  const items: MenuNode[] = [];

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    // 先处理目录
    const directories = entries.filter(entry => entry.isDirectory());
    for (const dir of directories) {
      const fullPath = path.join(dirPath, dir.name);
      const children = readDirectoryRecursively(fullPath, path.join(relativePath, dir.name));

      const menuNode: MenuNode = {
        id: dir.name,
        name: dir.name,
        type: MENU,
        tags: [],
        children: children,
      };

      items.push(menuNode);
    }

    // 再处理文件
    const files = entries.filter(entry => entry.isFile());
    const blogTypes = Object.values(BLOG_TYPE);

    for (const file of files) {
      if (blogTypes.some(type => file.name.endsWith(`.${type}`))) {
        const nameSplit = file.name.split('.');
        const extension = nameSplit.pop()?.toLowerCase() as BlogType;
        const fileName = nameSplit.join('.');

        const menuNode: MenuNode = {
          id: file.name,
          name: fileName,
          type: LEAF,
          path: `/blog/${generateSlug(fileName)}`,
          tags: [],
          extension,
        };

        items.push(menuNode);
      }
    }

    // 按名称排序：目录在前，文件在后
    items.sort((a, b) => {
      if (a.type === MENU && b.type === LEAF) return -1;
      if (a.type === LEAF && b.type === MENU) return 1;
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error(`读取目录 ${dirPath} 时发生错误:`, error);
  }

  return items;
}

/**
 * 收集所有博客文件到 RawBlogItem 列表
 */
function collectBlogFiles(nodes: MenuNode[], dirPath: string, rawBlogList: RawBlogItem[]): void {
  for (const node of nodes) {
    if (node.type === MENU && node.children) {
      collectBlogFiles(node.children, path.join(dirPath, node.name), rawBlogList);
    } else if (node.type === LEAF && node.path) {
      try {
        const fileName = `${node.name}.${node.extension}`;
        const filePath = path.join(dirPath, fileName);
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        const rawBlogItem: RawBlogItem = {
          title: node.name,
          content: fileContent,
          type: node.extension,
        };

        rawBlogList.push(rawBlogItem);
      } catch (error) {
        console.error(`读取文件 ${node.name} 时发生错误:`, error);
      }
    }
  }
}

/**
 * 加载原始博客 Markdown 列表
 */
export async function loadRawBlogList(): Promise<{ rawBlogList: RawBlogItem[]; menuTree: MenuNode[] }> {
  const rawBlogList: RawBlogItem[] = [];
  let menuTree: MenuNode[] = [];

  try {
    if (!fs.existsSync(BLOG_CONTENT_DIR)) {
      console.warn(`博客内容目录不存在: ${BLOG_CONTENT_DIR}`);
      return { rawBlogList, menuTree: [] };
    }

    // 读取目录结构并构建菜单树
    menuTree = readDirectoryRecursively(BLOG_CONTENT_DIR);

    // 收集所有博客文件
    collectBlogFiles(menuTree, BLOG_CONTENT_DIR, rawBlogList);
  } catch (error) {
    console.error('加载博客列表时发生错误:', error);
  }

  return { rawBlogList, menuTree };
}

/**
 * 维护元数据
 */
export async function maintainMetadata(): Promise<void> {
  const hashFilePath = path.join(BLOG_CONTENT_DIR, '..', 'hash.json');

  // 读取现有的 hash 数据
  let hashData: Record<string, any> = {};
  try {
    if (fs.existsSync(hashFilePath)) {
      const hashContent = fs.readFileSync(hashFilePath, 'utf-8');
      hashData = JSON.parse(hashContent);
    }
  } catch (error) {
    console.warn('读取 hash.json 文件失败:', error);
  }

  // 递归扫描所有博客文件并维护元数据
  async function scanAndMaintain(dirPath: string): Promise<void> {
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          // 递归处理子目录
          await scanAndMaintain(fullPath);
        } else if (entry.isFile() && Object.values(BLOG_TYPE).some(type => entry.name.endsWith(`.${type}`))) {
          // 处理博客文件
          const fileContent = fs.readFileSync(fullPath, 'utf-8');
          const parsed = matter(fileContent);

          // 计算内容的 hash（不包含元数据）
          const contentHash = calculateHash(parsed.content);
          const slug = generateSlug(parsed.data.title || entry.name.replace(/\.[^/.]+$/, ''));

          const now = dayjs().format(DATE_FORMAT);

          if (!hashData[slug]) {
            // 新文件，添加元数据到文件开头
            const newMetadata = {
              title: parsed.data.title || parsed.data.title,
              description: parsed.data.description || '',
              createdAt: now,
              updatedAt: now,
              tags: parsed.data.tags || []
            };

            const newContent = matter.stringify(parsed.content, newMetadata);
            fs.writeFileSync(fullPath, newContent, 'utf-8');

            // 更新 hash 数据
            hashData[slug] = {
              hash: contentHash,
              title: newMetadata.title,
              description: newMetadata.description,
              createdAt: newMetadata.createdAt,
              updatedAt: newMetadata.updatedAt,
              tags: newMetadata.tags
            };

            console.log(`新增文件元数据: ${entry.name}`);
          } else if (hashData[slug].hash !== contentHash) {
            // 内容有变化，更新 updatedAt
            const existingMetadata = parsed.data;
            existingMetadata.updatedAt = now;

            const updatedContent = matter.stringify(parsed.content, existingMetadata);
            fs.writeFileSync(fullPath, updatedContent, 'utf-8');

            // 更新 hash 数据
            hashData[slug].hash = contentHash;
            hashData[slug].updatedAt = now;

            console.log(`更新文件元数据: ${entry.name}`);
          }
          // 如果 hash 相同，不进行操作
        }
      }
    } catch (error) {
      console.error(`扫描目录 ${dirPath} 时发生错误:`, error);
    }
  }

  // 扫描并维护元数据
  await scanAndMaintain(BLOG_CONTENT_DIR);

  // 保存更新后的 hash 数据
  try {
    fs.writeFileSync(hashFilePath, JSON.stringify(hashData, null, 2), 'utf-8');
    console.log('hash.json 已更新');
  } catch (error) {
    console.error('保存 hash.json 文件失败:', error);
  }
}