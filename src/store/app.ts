import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {colorUtils} from '@/lib/utils/tools'

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
  teal: '#14b8a6'
} as const

export type ColorSchemeKey = keyof typeof colorSchemePresets
export type Theme = 'light' | 'dark'

interface AppState {
  // 色调相关
  colorScheme: ColorSchemeKey
  theme: Theme
  mounted: boolean
  
  // 主题操作
  setColorScheme: (scheme: ColorSchemeKey) => void
  toggleTheme: () => void
  setMounted: (mounted: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始状态
      colorScheme: 'black',
      theme: 'light',
      mounted: false,
      
      // 色调操作
      setColorScheme: (scheme: ColorSchemeKey) => {
        set({ colorScheme: scheme })
        // 更新 CSS 变量（为了兼容性保留）
        if (typeof window !== 'undefined') {
          const root = document.documentElement
          root.style.setProperty('--color-primary', colorSchemePresets[scheme])
          root.style.setProperty('--color-primary-100', colorUtils.withAlpha(colorSchemePresets[scheme], 0.1))
          root.style.setProperty('--color-primary-200', colorUtils.withAlpha(colorSchemePresets[scheme], 0.2))
          root.style.setProperty('--color-primary-300', colorUtils.withAlpha(colorSchemePresets[scheme], 0.3))
          root.style.setProperty('--color-primary-400', colorUtils.withAlpha(colorSchemePresets[scheme], 0.4))
          root.style.setProperty('--color-primary-500', colorUtils.withAlpha(colorSchemePresets[scheme], 0.5))
          root.style.setProperty('--color-primary-600', colorUtils.withAlpha(colorSchemePresets[scheme], 0.6))
          root.style.setProperty('--color-primary-700', colorUtils.withAlpha(colorSchemePresets[scheme], 0.7))
          root.style.setProperty('--color-primary-900', colorUtils.withAlpha(colorSchemePresets[scheme], 0.9))
        }
      },
      
      // 主题切换（黑夜/白天）
      toggleTheme: () => {
        const { theme } = get()
        const newTheme: Theme = theme === 'dark' ? 'light' : 'dark'
        set({ theme: newTheme })
        
        // 更新 DOM
        if (typeof window !== 'undefined') {
          if (newTheme === 'dark') {
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
        colorScheme: state.colorScheme,
        theme: state.theme
      })
    }
  )
)

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
    teal: '青色'
  }
  return names[key] || key
}

/**
 * 获取可用色调列表
 */
export const getAvailableColorSchemes = () => {
  return Object.entries(colorSchemePresets).map(([key, color]) => ({
    key: key as ColorSchemeKey,
    name: getColorSchemeName(key as ColorSchemeKey),
    color
  }))
}