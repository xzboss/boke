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
          
          {/* Primary Buttons */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">主要按钮（有背景白字）</h3>
            <div className="flex flex-wrap gap-4 mb-6">
              <Button variant="primary" size="sm">
                小号按钮
              </Button>
              <Button variant="primary" size="md">
                中号按钮
              </Button>
              <Button variant="primary" size="lg">
                大号按钮
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <Button variant="primary" disabled>
                禁用状态
              </Button>
              <Button variant="primary" loading>
                加载中
              </Button>
            </div>
          </div>

          {/* Text Buttons */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">文本按钮（无背景颜色字）</h3>
            <div className="flex flex-wrap gap-4 mb-6">
              <Button variant="text" size="sm">
                小号按钮
              </Button>
              <Button variant="text" size="md">
                中号按钮
              </Button>
              <Button variant="text" size="lg">
                大号按钮
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <Button variant="text" disabled>
                禁用状态
              </Button>
              <Button variant="text" loading>
                加载中
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
                variant="text"
                onClick={() => console.log('文本按钮被点击！')}
              >
                查看控制台
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
