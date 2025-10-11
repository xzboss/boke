import { Layout } from "@/components/layout";
import BlogLayout from "./layout";

/**
 * 博客首页
 */
export default function BlogPage() {
  return (
    <Layout>
      <BlogLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">欢迎来到测试站点</h1>
            <p className="text-lg text-gray-600 mb-8">
              请从左侧菜单选择一个测试用例查看详细内容
            </p>
            <div className="text-sm text-gray-500">
              <p>本站包含以下测试分类：</p>
              <ul className="mt-2 space-y-1">
                <li>• UI测试 - 前端相关测试用例</li>
                <li>• 接口测试 - 后端相关测试用例</li>
              </ul>
            </div>
          </div>
        </div>
      </BlogLayout>
    </Layout>
  );
}