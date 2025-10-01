'use client'

import Layout from '@/components/Layout'
import Button from '@/components/Button'

export default function UIPlaygroundPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">UI 演练场</h1>
          <p className="text-gray-600">组件库演示和测试页面</p>
        </div>

        {/* Button Component */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Button 按钮</h2>
          
          {/* All Variants */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">所有变体</h3>
            <div className="flex flex-wrap gap-4 mb-6">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="text">Text</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>

          {/* All Sizes */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">所有尺寸</h3>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Button variant="primary" size="xs">XS</Button>
              <Button variant="primary" size="sm">SM</Button>
              <Button variant="primary" size="md">MD</Button>
              <Button variant="primary" size="lg">LG</Button>
              <Button variant="primary" size="xl">XL</Button>
            </div>
          </div>

          {/* With Icons */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">带图标</h3>
            <div className="flex flex-wrap gap-4 mb-6">
              <Button 
                variant="primary" 
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                添加
              </Button>
              <Button 
                variant="outline" 
                rightIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                }
              >
                下一步
              </Button>
              <Button 
                variant="ghost" 
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                }
                rightIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                }
              >
                收藏
              </Button>
            </div>
          </div>

          {/* States */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">状态</h3>
            <div className="flex flex-wrap gap-4 mb-6">
              <Button variant="primary" disabled>
                禁用状态
              </Button>
              <Button variant="primary" loading>
                加载中
              </Button>
              <Button variant="destructive" disabled>
                危险禁用
              </Button>
            </div>
          </div>

          {/* Interactive Examples */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">交互示例</h3>
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="primary" 
                onClick={() => alert('主要按钮被点击！')}
              >
                点击我
              </Button>
              <Button 
                variant="outline"
                onClick={() => console.log('轮廓按钮被点击！')}
              >
                查看控制台
              </Button>
              <Button 
                variant="destructive"
                onClick={() => confirm('确定要删除吗？')}
              >
                删除
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
