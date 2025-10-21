"use client";

import { Layout } from "@/components/layout";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { Empty } from "@/components/Empty";

export default function UIPlaygroundPage() {
  return (
    <Layout>
      <div className="flex">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">UI 演练场</h1>
            <p className="text-gray-600">组件库演示和测试页面</p>
          </div>

          {/* Button Component */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              Button 按钮
            </h2>

            {/* All Types */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                所有类型
              </h3>
              <div className="flex flex-wrap gap-4 mb-6">
                <Button type="primary">Primary</Button>
                <Button type="default">Default</Button>
                <Button type="text">Text</Button>
                <Button type="link">Link</Button>
              </div>
            </div>

            {/* All Sizes */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                所有尺寸
              </h3>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Button type="primary" size="sm">
                  SM
                </Button>
                <Button type="primary" size="md">
                  MD
                </Button>
                <Button type="primary" size="lg">
                  LG
                </Button>
              </div>
            </div>

            {/* Interactive Examples */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                交互示例
              </h3>
              <div className="flex flex-wrap gap-4 mb-6">
                <Button
                  type="primary"
                  onClick={() => alert("主要按钮被点击！")}
                >
                  点击我
                </Button>
                <Button
                  type="text"
                  onClick={() => console.log("文本按钮被点击！")}
                >
                  查看控制台
                </Button>
                <Button type="link" onClick={() => confirm("确定要跳转吗？")}>
                  跳转链接
                </Button>
              </div>
            </div>

            {/* States */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">状态</h3>
              <div className="flex flex-wrap gap-4 mb-6">
                <Button
                  type="primary"
                  style={{ opacity: 0.5, cursor: "not-allowed" }}
                >
                  禁用状态
                </Button>
                <Button type="primary" loading>
                  加载中
                </Button>
                <Button
                  type="default"
                  style={{ opacity: 0.5, cursor: "not-allowed" }}
                >
                  默认禁用
                </Button>
              </div>
            </div>
          </section>

          {/* Icon Component */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              Icon 图标
            </h2>

            {/* Iconfont Examples */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Iconfont 图标
              </h3>
              <div className="flex flex-wrap gap-4 mb-6">
                <Icon
                  type="icon-sun"
                  style={{ fontSize: "24px", color: "#a855f7" }}
                />
                <Icon
                  type="icon-moon"
                  style={{ fontSize: "24px", color: "#3b82f6" }}
                />
                <Icon
                  type="icon-github"
                  style={{ fontSize: "24px", color: "#22c55e" }}
                />
              </div>
              <p className="text-sm text-gray-600">
                使用方式：&lt;Icon type=&quot;icon-name&quot; /&gt;
              </p>
            </div>
          </section>

          {/* Empty Component */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              Empty 空状态
            </h2>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                基础空状态
              </h3>
              <div className="border rounded-lg p-4 mb-4">
                <Empty className="text-106px" />
              </div>
              <p className="text-sm text-gray-600">使用方式：&lt;Empty /&gt;</p>
            </div>
          </section>
        </div>
        <div>ri</div>
      </div>
    </Layout>
  );
}
