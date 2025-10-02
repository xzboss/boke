import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

/**
 * 网站布局组件
 * 包含头部、主体内容、底部，支持深色模式
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
