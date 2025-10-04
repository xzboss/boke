/**
 * 网站底部组件
 * 包含品牌信息、导航链接、社交链接
 */
export default function Footer() {
  return (
    <footer className="border-t opacity-80">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌区域 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <span>X</span>
              </div>
              <span className="ml-2 text-xl font-semibold">xushilong</span>
            </div>
            <p className="text-sm opacity-60 max-w-md">
              一个现代化的博客平台，分享技术见解和生活感悟。
            </p>
          </div>

          {/* 导航链接 */}
          <div>
            <h3 className="text-sm font-semibold mb-4">导航</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-sm opacity-60 hover:opacity-100">
                  首页
                </a>
              </li>
              <li>
                <a href="/blog" className="text-sm opacity-60 hover:opacity-100">
                  博客
                </a>
              </li>
              <li>
                <a href="/ui" className="text-sm opacity-60 hover:opacity-100">
                  演练场
                </a>
              </li>
              <li>
                <a href="/about" className="text-sm opacity-60 hover:opacity-100">
                  关于
                </a>
              </li>
            </ul>
          </div>

          {/* 社交链接 */}
          <div>
            <h3 className="text-sm font-semibold mb-4">关注我们</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com"
                  className="text-sm opacity-60 hover:opacity-100"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-sm opacity-60 hover:opacity-100">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-sm opacity-60 hover:opacity-100">
                  微信公众号
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="mt-8 pt-8 border-t text-center text-sm opacity-60">
          <p>© 2024 xushilong. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

