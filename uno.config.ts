import { defineConfig, presetUno, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
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
    'btn-primary': 'btn bg-blue-600 text-white hover:bg-blue-700',
    'btn-secondary': 'btn bg-gray-200 text-gray-800 hover:bg-gray-300'
  }
})
