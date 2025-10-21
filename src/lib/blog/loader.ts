import fs from "fs";
import path from "path";
import type { BlogType, RawBlogItem } from "@/types/blog";
import { BLOG_TYPE } from "@/types/blog";

const BLOG_CONTENT_DIR = path.join(process.cwd(), "src/content/blogs");

/**
 * 加载原始博客 Markdown 列表
 */
export async function loadRawBlogList(): Promise<RawBlogItem[]> {
  const rawBlogList: RawBlogItem[] = [];

  try {
    if (!fs.existsSync(BLOG_CONTENT_DIR)) {
      console.warn(`博客内容目录不存在: ${BLOG_CONTENT_DIR}`);
      return rawBlogList;
    }

    const files = fs.readdirSync(BLOG_CONTENT_DIR);
    const blogTypes = Object.values(BLOG_TYPE);

    // 获取所有博客文件，并过滤掉不支持的文件类型
    const blogFiles = files.filter((file) =>
      blogTypes.some((type) => file.endsWith(type))
    ) as string[];

    for (const fileName of blogFiles) {
      const filePath = path.join(BLOG_CONTENT_DIR, fileName);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const nameSplit = fileName.split(".");
      const type = nameSplit.pop()?.toLowerCase() as BlogType;

      const rawBlogItem: RawBlogItem = {
        title: nameSplit.join("."),
        content: fileContent,
        type,
      };

      rawBlogList.push(rawBlogItem);
    }
  } catch (error) {
    console.error("加载博客列表时发生错误:", error);
  }

  return rawBlogList;
}
