import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * 主题预设配置
 * 每个主题只定义主色调，组件内部自行处理深浅变化
 */
export const themePresets = {
  black: '#000000',
  purple: '#a855f7',
  blue: '#3b82f6',
  green: '#10b981',
  red: '#ef4444',
  orange: '#f97316',
  pink: '#ec4899',
  indigo: '#6366f1',
  teal: '#14b8a6'
} as const

export type ThemeKey = keyof typeof themePresets

interface AppState {
  // 主题相关
  currentTheme: ThemeKey
  isDark: boolean
  mounted: boolean
  
  // 主题操作
  setTheme: (theme: ThemeKey) => void
  toggleDarkMode: () => void
  setMounted: (mounted: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始状态
      currentTheme: 'black',
      isDark: false,
      mounted: false,
      
      // 主题操作
      setTheme: (theme: ThemeKey) => {
        set({ currentTheme: theme })
        // 更新 CSS 变量（为了兼容性保留）
        if (typeof window !== 'undefined') {
          const root = document.documentElement
          root.style.setProperty('--color-primary', themePresets[theme])
        }
      },
      
      toggleDarkMode: () => {
        const { isDark } = get()
        const newIsDark = !isDark
        set({ isDark: newIsDark })
        
        // 更新 DOM
        if (typeof window !== 'undefined') {
          if (newIsDark) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      },
      
      setMounted: (mounted: boolean) => {
        set({ mounted })
      }
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        isDark: state.isDark
      })
    }
  )
)

/**
 * 获取主题名称
 */
export const getThemeName = (key: ThemeKey): string => {
  const names: Record<ThemeKey, string> = {
    black: '黑色',
    purple: '紫色',
    blue: '蓝色',
    green: '绿色',
    red: '红色',
    orange: '橙色',
    pink: '粉色',
    indigo: '靛蓝',
    teal: '青色'
  }
  return names[key] || key
}

/**
 * 获取可用主题列表
 */
export const getAvailableThemes = () => {
  return Object.entries(themePresets).map(([key, color]) => ({
    key: key as ThemeKey,
    name: getThemeName(key as ThemeKey),
    color
  }))
}
