"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import { useAppStore, colorSchemePresets } from "@/store/app";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

/**
 * 网站布局组件
 * 包含头部、主体内容
 * 负责全局主题初始化
 */
export default function Layout({ children, showFooter = false }: LayoutProps) {
  const { theme, mounted, colorScheme, setMounted, setColorScheme } =
    useAppStore();

  /**
   * 初始化主题和 mounted 状态
   */
  useEffect(() => {
    // 同步 DOM 的 dark class
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    setMounted(true);
  }, [theme, colorScheme, setMounted]);

  useEffect(() => {
    if (mounted) {
      setColorScheme(colorScheme);
    }
  }, [mounted, colorScheme, setColorScheme]);

  return (
    <div>
      <Header />
      <main className="pt-17">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
