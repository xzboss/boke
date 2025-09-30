export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="ml-2 text-xl font-semibold">Blog</span>
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              一个现代化的博客平台，分享技术见解和生活感悟。
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">导航</h3>
            <ul className="space-y-3">
              <li><a href="/" className="text-sm text-gray-600 hover:text-gray-900">首页</a></li>
              <li><a href="/docs" className="text-sm text-gray-600 hover:text-gray-900">文档</a></li>
              <li><a href="/blog" className="text-sm text-gray-600 hover:text-gray-900">博客</a></li>
              <li><a href="/about" className="text-sm text-gray-600 hover:text-gray-900">关于</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">关注我们</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">GitHub</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Twitter</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">微信公众号</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            © 2024 Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
