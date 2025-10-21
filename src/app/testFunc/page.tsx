import { loadRawBlogList } from "@/lib/blog/loader";
import { blog } from "@/lib/blog";

export default async function TestFuncPage() {
  // console.log(
  //   "\n原始博客 Markdown 列表:",
  //   blog.rawBlogList,
  //   "\n博客列表:",
  //   blog.BlogList,
  //   "\n标签到博客的映射:",
  //   blog.tag2BlogMap,
  //   "\n菜单数据结构:",
  //   blog.menuTree,
  //   "\n标签集合:",
  //   blog.tagSet,
  //   "\n标签列表:",
  //   blog.tagList
  // );
  console.log(blog.menuTree);
  return <div className="p-8 max-w-4xl mx-auto"></div>;
}
