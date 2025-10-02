import React from 'react'
import { cn, colorUtils } from '@/utils/tools'
import { useAppStore, themePresets } from '@/store/app'

export interface ButtonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** 按钮类型 */
  type?: 'primary' | 'text' | 'link' | 'default'
  /** 按钮尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 是否加载中 */
  loading?: boolean
  /** 点击事件 */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  /** 子元素 */
  children: React.ReactNode
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
}

const Button = React.forwardRef<HTMLDivElement, ButtonProps>(
  ({ 
    className, 
    type = 'primary', 
    size = 'md', 
    loading = false,
    children, 
    onClick,
    ...props 
  }, ref) => {
    const { currentTheme } = useAppStore()
    const primaryColor = themePresets[currentTheme]
    
    const baseStyles = `inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none`
    
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    }

    // 根据当前主题生成颜色变体
    const getColorVariants = (primaryColor: string) => {
      return {
        primary: primaryColor,
        light: colorUtils.adjustBrightness(primaryColor, 40),
        dark: colorUtils.adjustBrightness(primaryColor, -40),
        lighter: colorUtils.adjustBrightness(primaryColor, 80)
      }
    }

    const colorVariants = getColorVariants(primaryColor)

    // 按钮样式配置
    const getTypeStyles = (type: string) => {
      switch (type) {
        case 'primary':
          return {
            className: 'text-white active:scale-95',
            style: {
              background: `linear-gradient(to right, ${colorVariants.primary}, ${colorVariants.dark})`
            }
          }
        
        case 'text':
          return {
            className: 'hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95',
            style: {
              color: colorVariants.primary
            }
          }
        
        case 'link':
          return {
            className: 'underline hover:no-underline active:scale-95',
            style: {
              color: colorVariants.primary
            }
          }
        
        case 'default':
          return {
            className: 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95',
            style: {}
          }
        
        default:
          return { className: '', style: {} }
      }
    }

    const typeConfig = getTypeStyles(type)

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          sizeStyles[size],
          typeConfig.className,
          className
        )}
        style={{
          ...typeConfig.style,
          ...props.style
        }}
        role="button"
        tabIndex={loading ? -1 : 0}
        aria-disabled={loading}
        onClick={loading ? undefined : onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (!loading && onClick) {
              onClick(e as unknown as React.MouseEvent<HTMLDivElement>)
            }
          }
        }}
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
    )
  }
)

Button.displayName = 'Button'

export default Button