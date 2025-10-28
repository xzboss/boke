import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { colorUtils } from '@/lib/utils/tools';
import { getLocalStorage } from '@/lib/utils/localStorage';

/**
 * 色调预设配置
 * 每个色调只定义主色调，组件内部自行处理深浅变化
 */
export const colorSchemePresets = {
  black: '#111827',
  white: '#f9fafb',
  purple: '#a855f7',
  blue: '#3b82f6',
  green: '#10b981',
  red: '#ef4444',
  orange: '#f97316',
  pink: '#ec4899',
  indigo: '#6366f1',
  teal: '#14b8a6',
} as const;

export type ColorSchemeKey = keyof typeof colorSchemePresets;
export type Theme = 'light' | 'dark';

interface AppState {
  // 色调相关
  colorScheme: ColorSchemeKey;
  theme: Theme;
  mounted: boolean;

  // 主题操作
  setColorScheme: (scheme: ColorSchemeKey) => void;
  toggleTheme: () => void;
  setMounted: (mounted: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始状态
      colorScheme: 'white',
      theme: 'dark',
      mounted: false,
      ...(getLocalStorage('x_app_options') as Partial<AppState>),

      /**
       * 设置色调
       * @param scheme 色调
       * @returns void
       */
      setColorScheme: (scheme: ColorSchemeKey) => {
        set({ colorScheme: scheme });
        // 更新 CSS 变量（为了兼容性保留）
        if (typeof window !== 'undefined') {
          const root = document.documentElement;
          root.style.setProperty('--color-primary', colorSchemePresets[scheme]);
          root.style.setProperty('--color-primary-50', colorUtils.withAlpha(colorSchemePresets[scheme], 0.05));
          root.style.setProperty('--color-primary-100', colorUtils.withAlpha(colorSchemePresets[scheme], 0.1));
          root.style.setProperty('--color-primary-200', colorUtils.withAlpha(colorSchemePresets[scheme], 0.2));
          root.style.setProperty('--color-primary-300', colorUtils.withAlpha(colorSchemePresets[scheme], 0.3));
          root.style.setProperty('--color-primary-400', colorUtils.withAlpha(colorSchemePresets[scheme], 0.4));
          root.style.setProperty('--color-primary-500', colorUtils.withAlpha(colorSchemePresets[scheme], 0.5));
          root.style.setProperty('--color-primary-600', colorUtils.withAlpha(colorSchemePresets[scheme], 0.6));
          root.style.setProperty('--color-primary-700', colorUtils.withAlpha(colorSchemePresets[scheme], 0.7));
          root.style.setProperty('--color-primary-900', colorUtils.withAlpha(colorSchemePresets[scheme], 0.9));
        }
      },

      /**
       * 切换主题（黑夜/白天）
       * @param _theme 主题
       * @returns void
       */
      toggleTheme: (_theme?: Theme) => {
        const { theme } = get();
        const newTheme: Theme = _theme ?? theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });

        // 设置 DOM 的 dark class 和 colorScheme
        if (typeof window !== 'undefined') {
          const rootStyle = document.documentElement.style;
          if (newTheme === 'dark') {
            rootStyle.setProperty('--color-background', colorSchemePresets.black);
            rootStyle.setProperty('--color-text', colorSchemePresets.white);
            document.documentElement.classList.add('dark');
          } else {
            rootStyle.setProperty('--color-background', colorSchemePresets.white);
            rootStyle.setProperty('--color-text', colorSchemePresets.black);
            document.documentElement.classList.remove('dark');
          }
        }
      },

      /**
       * 设置是否已挂载
       * @param mounted 是否已挂载
       * @returns void
       */
      setMounted: (mounted: boolean) => {
        set({ mounted });
      },
    }),
    {
      name: 'x_app_options',
      partialize: state => ({
        colorScheme: state.colorScheme,
        theme: state.theme,
      }),
    }
  )
);

/**
 * 获取色调名称
 */
export const getColorSchemeName = (key: ColorSchemeKey): string => {
  const names: Record<ColorSchemeKey, string> = {
    black: '黑色',
    white: '白色',
    purple: '紫色',
    blue: '蓝色',
    green: '绿色',
    red: '红色',
    orange: '橙色',
    pink: '粉色',
    indigo: '靛蓝',
    teal: '青色',
  };
  return names[key] || key;
};
