import React from "react";
import Link from "next/link";
import { cn, colorUtils } from "@/utils/tools";
import { useAppStore, colorSchemePresets, Theme } from "@/store/app";

export interface ButtonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** 按钮类型 */
  type?: "primary" | "text" | "link" | "default";
  /** 按钮尺寸 */
  size?: "sm" | "md" | "lg";
  /** 是否加载中 */
  loading?: boolean;
  /** 点击事件 */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** 链接地址（支持所有类型） */
  href?: string;
  /** 子元素 */
  children: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

// 基础按钮组件
const BaseButton = React.forwardRef<HTMLDivElement, ButtonProps>(
  (
    { className, size = "md", loading = false, children, onClick, ...props },
    ref
  ) => {
    const baseStyles = `inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none`;

    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, sizeStyles[size], className)}
        role="button"
        tabIndex={loading ? -1 : 0}
        aria-disabled={loading}
        onClick={loading ? undefined : onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!loading && onClick) {
              onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
            }
          }
        }}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </div>
    );
  }
);

BaseButton.displayName = "BaseButton";

// Primary 按钮 - 主色调背景白字
const PrimaryButton = React.forwardRef<
  HTMLDivElement,
  Omit<ButtonProps, "type"> & { theme: Theme }
>(({ href, ...props }, ref) => {
  const { colorScheme } = useAppStore();
  const primaryColor = colorSchemePresets[colorScheme];
  const lightColor = colorUtils.adjustBrightness(primaryColor, 40);

  // 白色色调用黑色文字，其他色调用白色文字
  let textColor: string = colorSchemePresets.white;
  if (colorScheme === "white") {
    textColor = colorSchemePresets.black;
  }

  const buttonContent = (
    <BaseButton
      ref={ref}
      className="active:scale-95 hover:opacity-90"
      style={{
        background: `linear-gradient(to right, ${primaryColor}, ${lightColor})`,
        color: textColor,
      }}
      {...props}
    />
  );

  if (href) {
    return <Link href={href}>{buttonContent}</Link>;
  }

  return buttonContent;
});

PrimaryButton.displayName = "PrimaryButton";

// Text 按钮 - 无背景主色调字，hover后有灰背景
const TextButton = React.forwardRef<
  HTMLDivElement,
  Omit<ButtonProps, "type"> & { theme: Theme }
>(({ theme, href, ...props }, ref) => {
  const { colorScheme } = useAppStore();
  const primaryColor = colorSchemePresets[colorScheme];

  // 暗黑主题用深色背景，浅色主题用浅色背景
  const hoverClass =
    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";

  const buttonContent = (
    <BaseButton
      ref={ref}
      className={`active:scale-95 ${hoverClass}`}
      style={{
        color: primaryColor,
      }}
      {...props}
    />
  );

  if (href) {
    return <Link href={href}>{buttonContent}</Link>;
  }

  return buttonContent;
});

TextButton.displayName = "TextButton";

// Link 按钮 - 无背景主色调字和下划线
const LinkButton = React.forwardRef<
  HTMLDivElement,
  Omit<ButtonProps, "type"> & { theme: Theme }
>(({ href, ...props }, ref) => {
  const { colorScheme } = useAppStore();
  const primaryColor = colorSchemePresets[colorScheme];

  const buttonContent = (
    <BaseButton
      ref={ref}
      className="underline hover:no-underline active:scale-95 hover:opacity-80"
      style={{
        color: primaryColor,
      }}
      {...props}
    />
  );

  // 如果有 href，使用 Link 包裹
  if (href) {
    return <Link href={href}>{buttonContent}</Link>;
  }

  return buttonContent;
});

LinkButton.displayName = "LinkButton";

// Default 按钮 - 灰背景主色调字
const DefaultButton = React.forwardRef<
  HTMLDivElement,
  Omit<ButtonProps, "type"> & { theme: Theme }
>(({ theme, href, ...props }, ref) => {
  const { colorScheme } = useAppStore();
  const primaryColor = colorSchemePresets[colorScheme];

  // 暗黑主题用深色背景，浅色主题用浅色背景
  const bgClass =
    theme === "dark"
      ? "bg-gray-800 hover:bg-gray-700"
      : "bg-gray-100 hover:bg-gray-200";

  const buttonContent = (
    <BaseButton
      ref={ref}
      className={`active:scale-95 ${bgClass}`}
      style={{
        color: primaryColor,
      }}
      {...props}
    />
  );

  if (href) {
    return <Link href={href}>{buttonContent}</Link>;
  }

  return buttonContent;
});

DefaultButton.displayName = "DefaultButton";

// 主按钮组件
const Button = React.forwardRef<HTMLDivElement, ButtonProps>(
  ({ type = "primary", href, ...props }, ref) => {
    const { theme } = useAppStore();

    switch (type) {
      case "primary":
        return <PrimaryButton ref={ref} theme={theme} href={href} {...props} />;
      case "text":
        return <TextButton ref={ref} theme={theme} href={href} {...props} />;
      case "link":
        return <LinkButton ref={ref} theme={theme} href={href} {...props} />;
      case "default":
        return <DefaultButton ref={ref} theme={theme} href={href} {...props} />;
      default:
        return <PrimaryButton ref={ref} theme={theme} href={href} {...props} />;
    }
  }
);

Button.displayName = "Button";

export default Button;
