import { defineConfig, presetUno, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
    presetUno({
      dark: 'class' // 启用 class 模式的深色主题
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Geist:400,500,600,700',
        mono: 'Geist Mono:400,500'
      }
    })
  ],
  shortcuts: {
    'btn': 'px-4 py-2 rounded transition-colors',
    'btn-primary': 'btn bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600',
    'btn-secondary': 'btn bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
  },
  theme: {
    colors: {
      primary: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7c3aed',
        800: '#6b21a8',
        900: '#581c87'
      }
    }
  }
})
