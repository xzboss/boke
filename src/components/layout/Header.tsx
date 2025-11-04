'use client';

import { useMemo, useRef } from 'react';
import Button from '../Button';
import Icon from '../Icon';
import Select, { SelectRef } from '../Select';
import { useAppStore } from '@/store/app';

/**
 * 网站头部组件
 * 包含网站名称、导航菜单、色调选择器、主题切换按钮
 * 固定在页面顶部
 */
export default function Header() {
  const { colorScheme, theme, colorSchemePresets, setColorScheme, toggleTheme } = useAppStore();
  const selectRef = useRef<SelectRef>(null);
  /**
   * 切换主题（light/dark）
   * 如果当前是黑白色调，切换主题时自动切换为对应色调
   */
  const handleThemeChange = () => {
    // 黑白色调自动切换：黑色色调配深色主题，白色色调配浅色主题
    if (colorScheme === 'white' || colorScheme === 'black') {
      setColorScheme(theme === 'dark' ? 'black' : 'white');
    }
    toggleTheme();
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 w-full z-1000 px-4 py-2"
      style={{
        backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
        boxShadow: `0 -17px 20px ${colorSchemePresets[colorScheme]?.color}`,
      }}
    >
      <div className="flex items-center justify-between">
        {/* 左侧首页按钮 */}
        <Button type="text" size="lg" href="/">
          xushilong
        </Button>

        {/* 右侧导航菜单和操作区域 */}
        <div className="flex items-center gap-2">
          <Button type="text" size="sm" href="/blog">
            测试
          </Button>

          <Button type="text" size="sm" href="https://github.com">
            <Icon type="icon-github" style={{ fontSize: '16px' }} />
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
            ref={selectRef}
            className="w-70px"
            options={Object.values(colorSchemePresets).map(preset => ({
              ...preset,
              render: option => {
                return (
                  <Button
                    key={option.value}
                    type="primary"
                    color={option.value}
                    className="w-15px h-15px rounded-full p-0 mx-auto"
                    onClick={() => selectRef.current?.handleSelect(option.value)}
                  />
                );
              },
            }))}
            value={colorScheme}
            onChange={option => setColorScheme(option.value)}
          />

          {/* 深色模式切换按钮 */}
          <Button type="text" size="sm" onClick={handleThemeChange}>
            {theme === 'dark' ? (
              <Icon type="icon-sun" style={{ fontSize: '20px' }} />
            ) : (
              <Icon type="icon-moon" style={{ fontSize: '20px' }} />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
