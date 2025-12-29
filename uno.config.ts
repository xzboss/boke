import {
  defineConfig,
  presetUno,
  presetTypography,
} from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography(), // Typography 预设用于 prose 样式
  ],
});
