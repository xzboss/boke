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
 * 包含网站名称、导航菜单、色调选择器、主题切换按钮
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

  /** 可选的色调列表 */
  const availableColorSchemes: SelectOption[] = useMemo(() => {
    const schemes: ColorSchemeKey[] = ["purple", "black", "white", "blue"];
    return schemes.map((key) => ({
      value: key,
      label: getColorSchemeName(key),
    }));
  }, []);

  /**
   * 切换主题（light/dark）
   * 如果当前是黑白色调，切换主题时自动切换为对应色调
   */
  const handleThemeChange = () => {
    // 黑白色调自动切换：黑色色调配深色主题，白色色调配浅色主题
    if (colorScheme === "white" || colorScheme === "black") {
      setColorScheme(theme === "dark" ? "black" : "white");
    }
    toggleTheme();
  };

  /**
   * 初始化主题和 mounted 状态
   * 同步 DOM 的 dark class 和 CSS 变量
   */
  useEffect(() => {
    // 同步 DOM 的 dark class，用于 UnoCSS 的 dark: 前缀
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // 同步 CSS 变量，用于动态颜色
    const primaryColor = colorSchemePresets[colorScheme];
    document.documentElement.style.setProperty("--color-primary", primaryColor);

    setMounted(true);
  }, [setMounted, theme, colorScheme]);

  /** 防止服务端渲染时的水合错误 */
  if (!mounted) {
    return null;
  }

  return (
    <header
      className="w-full"
      style={{ boxShadow: "0 0 1px 1px var(--color-primary)" }}
    >
      <div className="px-4 py-2">
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
