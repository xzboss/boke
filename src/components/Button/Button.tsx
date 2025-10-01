import React from 'react'
import { cn } from '@/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮变体样式 */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'text' | 'destructive'
  /** 按钮尺寸 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** 是否显示加载状态 */
  loading?: boolean
  /** 左侧图标 */
  leftIcon?: React.ReactNode
  /** 右侧图标 */
  rightIcon?: React.ReactNode
  /** 按钮内容 */
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    leftIcon,
    rightIcon,
    disabled,
    children, 
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
    
    const sizeStyles = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl'
    }

    // 颜色主题配置
    const colorTheme = {
      primary: {
        text: 'text-white',
        bg: 'bg-gradient-to-r from-purple-500 to-purple-700',
        hover: 'hover:from-purple-600 hover:to-purple-800',
        shadow: 'shadow-lg hover:shadow-purple-500/25',
        border: 'border-0'
      },
      secondary: {
        text: 'text-gray-700',
        bg: 'bg-gray-100',
        hover: 'hover:bg-gray-200 active:bg-gray-300',
        shadow: 'shadow-sm hover:shadow-md',
        border: 'border-0'
      },
      outline: {
        text: 'text-purple-600',
        bg: 'bg-transparent',
        hover: 'hover:bg-purple-50 active:bg-purple-100',
        shadow: '',
        border: 'border-0'
      },
      ghost: {
        text: 'text-purple-600',
        bg: 'bg-transparent',
        hover: 'hover:bg-purple-50 active:bg-purple-100',
        shadow: '',
        border: 'border-0'
      },
      text: {
        text: 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700',
        bg: 'bg-transparent',
        hover: 'hover:from-purple-600 hover:to-purple-800 hover:bg-purple-50 active:bg-purple-100',
        shadow: '',
        border: 'border-0'
      },
      destructive: {
        text: 'text-white',
        bg: 'bg-gradient-to-r from-red-500 to-red-600',
        hover: 'hover:from-red-600 hover:to-red-700',
        shadow: 'shadow-lg hover:shadow-red-500/25',
        border: 'border-0'
      }
    }

    const variantStyles = {
      primary: `${colorTheme.primary.text} ${colorTheme.primary.bg} ${colorTheme.primary.hover} ${colorTheme.primary.shadow} ${colorTheme.primary.border} active:scale-95`,
      secondary: `${colorTheme.secondary.text} ${colorTheme.secondary.bg} ${colorTheme.secondary.hover} ${colorTheme.secondary.shadow} ${colorTheme.secondary.border} active:scale-95`,
      outline: `${colorTheme.outline.text} ${colorTheme.outline.bg} ${colorTheme.outline.hover} ${colorTheme.outline.shadow} ${colorTheme.outline.border} active:scale-95`,
      ghost: `${colorTheme.ghost.text} ${colorTheme.ghost.bg} ${colorTheme.ghost.hover} ${colorTheme.ghost.shadow} ${colorTheme.ghost.border} active:scale-95`,
      text: `${colorTheme.text.text} ${colorTheme.text.bg} ${colorTheme.text.hover} ${colorTheme.text.shadow} ${colorTheme.text.border} active:scale-95`,
      destructive: `${colorTheme.destructive.text} ${colorTheme.destructive.bg} ${colorTheme.destructive.hover} ${colorTheme.destructive.shadow} ${colorTheme.destructive.border} active:scale-95`
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        disabled={disabled || loading}
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
        {!loading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
