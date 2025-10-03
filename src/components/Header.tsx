"use client";

import { useEffect } from "react";
import Button from "./Button";
import Icon from "./Icon";
import {
  useAppStore,
  getAvailableColorSchemes,
  ColorSchemeKey,
} from "@/store/app";

/**
 * 网站头部组件
 * 包含 Logo、导航菜单、主题切换功能
 */
export default function Header() {
  const {
    colorScheme,
    theme,
    mounted,
    setColorScheme,
    toggleTheme,
    setMounted,
  } = useAppStore();
  const availableColorSchemes = getAvailableColorSchemes();

  /**
   * 切换主题（黑夜/白天）
   */
  const handleThemeChange = () => {
    console.log("handleThemeChange", theme, colorScheme);
    // 黑白色调互换
    if (colorScheme === "white" || colorScheme === "black") {
      setColorScheme(theme === "dark" ? "black" : "white");
    }
    toggleTheme();
  };

  // 设置 mounted 状态
  useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  // 防止水合错误
  if (!mounted) {
    return null;
  }

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 左侧首页按钮 */}
          <div className="flex-shrink-0">
            <Button type="text" size="lg" href="/" className="p-0">
              xushilong
            </Button>
          </div>

          {/* 右侧导航菜单和操作区域 */}
          <div className="flex items-center space-x-2">
            {/* 桌面端导航菜单 */}
            <nav className="hidden md:flex items-center space-x-2">
              <Button type="text" size="sm" href="/blog">
                博客
              </Button>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button type="text" size="sm">
                  <Icon
                    type="icon-github"
                    style={{ fontSize: "16px", marginRight: "4px" }}
                  />
                  GitHub
                </Button>
              </a>

              <Button type="text" size="sm" href="/ui">
                演练场
              </Button>

              <Button type="text" size="sm" href="/about">
                关于
              </Button>
            </nav>

            {/* 主题颜色选择器 */}
            <div className="relative">
              <select
                value={colorScheme}
                onChange={(e) =>
                  setColorScheme(e.target.value as ColorSchemeKey)
                }
                className="appearance-none bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {availableColorSchemes.map((scheme) => (
                  <option key={scheme.key} value={scheme.key}>
                    {scheme.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* 深色模式切换按钮 */}
            <Button
              type="text"
              size="sm"
              onClick={handleThemeChange}
              aria-label="切换深色模式"
            >
              {theme === "dark" ? (
                <Icon type="icon-sun" style={{ fontSize: "20px" }} />
              ) : (
                <Icon type="icon-moon" style={{ fontSize: "20px" }} />
              )}
            </Button>

            {/* 移动端菜单按钮 */}
            <Button type="text" size="sm" className="md:hidden">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
