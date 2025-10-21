import {
  defineConfig,
  presetUno,
  presetWebFonts,
  presetTypography,
} from "unocss";

export default defineConfig({
  presets: [
    presetUno({
      dark: "class", // 启用 class 模式的深色主题
    }),
    presetTypography(), // Typography 预设用于 prose 样式
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: "Geist:400,500,600,700",
        mono: "Geist Mono:400,500",
      },
    }),
  ],
});
