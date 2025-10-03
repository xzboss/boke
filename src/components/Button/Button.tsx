import React from "react";
import Link from "next/link";
import { cn, colorUtils } from "@/utils/tools";
import { useAppStore, colorSchemePresets, ColorSchemeKey } from "@/store/app";

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
  /** 自定义色调（优先级高于全局色调） */
  color?: ColorSchemeKey;
  /** 子元素 */
  children: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

/**
 * 基础按钮组件
 */
const BaseButton = React.forwardRef<HTMLDivElement, ButtonProps>(
  (
    { className, size = "md", loading = false, children, onClick, ...props },
    ref
  ) => {
    const baseStyles = `flex items-center gap-2 font-medium rounded-lg transition-all duration-200 cursor-pointer select-none active:scale-95`;

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

/**
 * Primary 按钮 - 色调背景白字
 */
const PrimaryButton = React.forwardRef<
  HTMLDivElement,
  Omit<ButtonProps, "type">
>(({ href, color, className, style, ...props }, ref) => {
  const { colorScheme } = useAppStore();
  const finalColorScheme = color || colorScheme;
  const primaryColor = colorSchemePresets[finalColorScheme];
  const textColor =
    colorScheme === "white"
      ? colorSchemePresets.black
      : colorSchemePresets.white;

  const buttonContent = (
    <BaseButton
      ref={ref}
      className={cn("hover:opacity-80", className)}
      style={{
        backgroundColor: primaryColor,
        color: textColor,
        ...style,
      }}
      {...props}
    />
  );

  if (href) {
    return (
      <Link
        href={href}
        className="whitespace-nowrap"
        style={{ textDecoration: "none" }}
      >
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
});

PrimaryButton.displayName = "PrimaryButton";

/**
 * Default 按钮 - 浅色背景色调字，hover背景加重
 */
const DefaultButton = React.forwardRef<
  HTMLDivElement,
  Omit<ButtonProps, "type">
>(({ href, color, className, style, ...props }, ref) => {
  const { colorScheme } = useAppStore();
  const finalColorScheme = color || colorScheme;
  const primaryColor = colorSchemePresets[finalColorScheme];
  const bgColor = colorUtils.withAlpha(primaryColor, 0.05);
  const hoverBg = colorUtils.withAlpha(primaryColor, 0.1);

  const buttonContent = (
    <BaseButton
      ref={ref}
      className={cn(
        "bg-[var(--bg-color)] hover:bg-[var(--hover-bg)]",
        className
      )}
      style={
        {
          color: primaryColor,
          "--bg-color": bgColor,
          "--hover-bg": hoverBg,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );

  if (href) {
    return (
      <Link
        href={href}
        className="whitespace-nowrap"
        style={{ textDecoration: "none" }}
      >
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
});

DefaultButton.displayName = "DefaultButton";

/**
 * Text 按钮 - 黑字/白字无背景，hover有浅色背景和色调字
 */
const TextButton = React.forwardRef<HTMLDivElement, Omit<ButtonProps, "type">>(
  ({ href, color, className, style, ...props }, ref) => {
    const { colorScheme, theme } = useAppStore();
    const finalColorScheme = color || colorScheme;
    const primaryColor = colorSchemePresets[finalColorScheme];
    const textColor =
      theme === "light" ? colorSchemePresets.black : colorSchemePresets.white;
    const hoverBg = colorUtils.withAlpha(primaryColor, 0.05);

    const buttonContent = (
      <BaseButton
        ref={ref}
        className={cn(
          "hover:bg-[var(--hover-bg)] hover:!text-[var(--hover-text)]",
          className
        )}
        style={
          {
            color: textColor,
            "--hover-bg": hoverBg,
            "--hover-text": primaryColor,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    );

    if (href) {
      return (
        <Link
          href={href}
          className="whitespace-nowrap"
          style={{ textDecoration: "none" }}
        >
          {buttonContent}
        </Link>
      );
    }

    return buttonContent;
  }
);

TextButton.displayName = "TextButton";

/**
 * Link 按钮 - 黑字/白字无背景，hover字色变色调
 */
const LinkButton = React.forwardRef<HTMLDivElement, Omit<ButtonProps, "type">>(
  ({ href, color, className, style, ...props }, ref) => {
    const { colorScheme, theme } = useAppStore();
    const finalColorScheme = color || colorScheme;
    const primaryColor = colorSchemePresets[finalColorScheme];
    const textColor =
      theme === "light" ? colorSchemePresets.black : colorSchemePresets.white;

    const buttonContent = (
      <BaseButton
        ref={ref}
        className={cn("hover:!text-[var(--hover-text)]", className)}
        style={
          {
            color: textColor,
            "--hover-text": primaryColor,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
    );

    if (href) {
      return (
        <Link
          href={href}
          className="whitespace-nowrap"
          style={{ textDecoration: "none" }}
        >
          {buttonContent}
        </Link>
      );
    }

    return buttonContent;
  }
);

LinkButton.displayName = "LinkButton";

/**
 * 主按钮组件
 */
const Button = React.forwardRef<HTMLDivElement, ButtonProps>(
  ({ type = "primary", ...props }, ref) => {
    switch (type) {
      case "primary":
        return <PrimaryButton ref={ref} {...props} />;
      case "default":
        return <DefaultButton ref={ref} {...props} />;
      case "text":
        return <TextButton ref={ref} {...props} />;
      case "link":
        return <LinkButton ref={ref} {...props} />;
      default:
        return <PrimaryButton ref={ref} {...props} />;
    }
  }
);

Button.displayName = "Button";

export default Button;
