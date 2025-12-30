import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 类名合并工具
 * 合并 clsx 和 tailwind-merge 的功能
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 颜色工具函数
 */
export const colorUtils = {
  /** 将十六进制颜色转换为 RGB */
  hexToRgb: (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },

  /** 将 RGB 转换为十六进制 */
  rgbToHex: (r: number, g: number, b: number) => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },

  /** 调整颜色亮度 */
  adjustBrightness: (hex: string, amount: number) => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return hex;

    const { r, g, b } = rgb;
    const newR = Math.max(0, Math.min(255, r + amount));
    const newG = Math.max(0, Math.min(255, g + amount));
    const newB = Math.max(0, Math.min(255, b + amount));

    return colorUtils.rgbToHex(newR, newG, newB);
  },

  /**
   * 将颜色转换为带透明度的 rgba 格式
   * @param hex 十六进制颜色值
   * @param alpha 透明度，0-1 之间的值
   * @returns rgba 颜色字符串
   */
  withAlpha: (hex: string, alpha: number) => {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return hex;

    const { r, g, b } = rgb;
    const clampedAlpha = Math.max(0, Math.min(1, alpha));

    return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
  },
};

/**
 * 生成URL友好字符串（slug）
 * @param title 标题
 * @returns URL友好字符串
 */
export const generateSlug = (title: string) => {
  // return title
  //   .toLowerCase()
  //   .trim()
  //   .replace(/\s+/g, "-")
  //   .replace(/[^\w\u4e00-\u9fa5\uff5e~-]/g, "");
  return title.trim();
};

/**
 * 生成唯一标识符
 * @returns 唯一标识符
 */
export const generateId = () => {
  return crypto.randomUUID();
};
