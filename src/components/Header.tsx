"use client";

import { useEffect, useMemo } from "react";
import Button from "./Button";
import Icon from "./Icon";
import Select, { SelectOption } from "./Select";
import {
  useAppStore,
  getColorSchemeName,
  ColorSchemeKey,
  colorSchemePresets,
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

  // 只开放紫色和黑色两种色调
  const availableColorSchemes: SelectOption[] = useMemo(() => {
    const schemes: ColorSchemeKey[] = ["purple", "black", "white", "blue"];
    return schemes.map((key) => ({
      value: key,
      label: getColorSchemeName(key),
    }));
  }, []);

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

  // 初始化主题和 mounted 状态
  useEffect(() => {
    // 同步 DOM 的 dark class
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // 同步 CSS 变量
    const primaryColor = colorSchemePresets[colorScheme];
    document.documentElement.style.setProperty("--color-primary", primaryColor);
    
    setMounted(true);
  }, [setMounted, theme, colorScheme]);

  // 防止水合错误
  if (!mounted) {
    return null;
  }

  return (
    <header className="w-full border-b">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 左侧首页按钮 */}
          <Button type="text" size="lg" href="/">
            xushilong
          </Button>

          {/* 右侧导航菜单和操作区域 */}
          <div className="flex items-center gap-2">
            <Button type="text" size="sm" href="/blog">
              博客
            </Button>

            <Button type="text" size="sm" href="https://github.com">
              <Icon type="icon-github" style={{ fontSize: "16px" }} />
              GitHub
            </Button>

            <Button type="text" size="sm" href="/ui">
              演练场
            </Button>

            <Button type="text" size="sm" href="/about">
              关于
            </Button>

            {/* 主题颜色选择器 */}
            <Select
              placeholder="色调"
              options={availableColorSchemes}
              value={colorScheme}
              onChange={(value) => setColorScheme(value as ColorSchemeKey)}
            />

            {/* 深色模式切换按钮 */}
            <Button type="text" size="sm" onClick={handleThemeChange}>
              {theme === "dark" ? (
                <Icon type="icon-sun" style={{ fontSize: "20px" }} />
              ) : (
                <Icon type="icon-moon" style={{ fontSize: "20px" }} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
