import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { colorUtils } from '@/lib/utils/tools';
import { getLocalStorage } from '@/lib/utils/localStorage';

export type Theme = 'light' | 'dark';

interface AppState {
  /** 当前色调 */
  colorScheme: string;
  /** 主题 */
  theme: Theme;
  /** 色调预设配置 */
  colorSchemePresets: { [key: string]: { label: string; value: string; color: string } };
  /** 是否已挂载 */
  mounted: boolean;

  // 主题操作
  setColorScheme: (scheme: string) => void;
  toggleTheme: () => void;
  setMounted: (mounted: boolean) => void;
}

export const colorSchemePresets: AppState['colorSchemePresets'] = {
  black: { label: '黑色', value: 'black', color: '#111827' },
  white: { label: '白色', value: 'white', color: '#f9fafb' },
  purple: { label: '紫色', value: 'purple', color: '#a855f7' },
  blue: { label: '蓝色', value: 'blue', color: '#3b82f6' },
  green: { label: '绿色', value: 'green', color: '#10b981' },
  red: { label: '红色', value: 'red', color: '#ef4444' },
  orange: { label: '橙色', value: 'orange', color: '#f97316' },
  pink: { label: '粉色', value: 'pink', color: '#ec4899' },
  indigo: { label: '靛蓝', value: 'indigo', color: '#6366f1' },
  teal: { label: '青色', value: 'teal', color: '#14b8a6' },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      colorScheme: 'white',
      theme: 'dark',
      mounted: false,
      colorSchemePresets: colorSchemePresets,
      ...(getLocalStorage('app') as Partial<AppState>),

      /**
       * 设置色调
       * @param scheme 色调
       * @returns void
       */
      setColorScheme: (scheme: string) => {
        set({ colorScheme: scheme });
        if (typeof window !== 'undefined') {
          const { colorSchemePresets } = get();
          const root = document.documentElement;
          root.style.setProperty('--color-primary', colorSchemePresets[scheme].color);
          root.style.setProperty('--color-primary-50', colorUtils.withAlpha(colorSchemePresets[scheme].color, 0.05));
          root.style.setProperty('--color-primary-100', colorUtils.withAlpha(colorSchemePresets[scheme].color, 0.1));
          root.style.setProperty('--color-primary-200', colorUtils.withAlpha(colorSchemePresets[scheme].color, 0.2));
          root.style.setProperty('--color-primary-300', colorUtils.withAlpha(colorSchemePresets[scheme].color, 0.3));
          root.style.setProperty('--color-primary-400', colorUtils.withAlpha(colorSchemePresets[scheme].color, 0.4));
          root.style.setProperty('--color-primary-500', colorUtils.withAlpha(colorSchemePresets[scheme].color, 0.5));
          root.style.setProperty('--color-primary-600', colorUtils.withAlpha(colorSchemePresets[scheme].color, 0.6));
          root.style.setProperty('--color-primary-700', colorUtils.withAlpha(colorSchemePresets[scheme].color, 0.7));
          root.style.setProperty('--color-primary-900', colorUtils.withAlpha(colorSchemePresets[scheme].color, 0.9));
        }
      },

      /**
       * 切换主题（黑夜/白天）
       * @param _theme 主题
       * @returns void
       */
      toggleTheme: (_theme?: Theme) => {
        const { theme, colorSchemePresets } = get();
        const newTheme: Theme = _theme ?? theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });

        // 设置 DOM 的 dark class 和 colorScheme
        if (typeof window !== 'undefined') {
          const rootStyle = document.documentElement.style;
          if (newTheme === 'dark') {
            rootStyle.setProperty('--color-background', colorSchemePresets.black.color);
            rootStyle.setProperty('--color-text', colorSchemePresets.white.color);
            document.documentElement.classList.add('dark');
          } else {
            rootStyle.setProperty('--color-background', colorSchemePresets.white.color);
            rootStyle.setProperty('--color-text', colorSchemePresets.black.color);
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
      name: 'app',
      partialize: state => ({
        colorScheme: state.colorScheme,
        theme: state.theme,
      }),
    }
  )
);
