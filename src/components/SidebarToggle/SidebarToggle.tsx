'use client';

import React from 'react';
import Button from '../Button';
import Icon from '../Icon';

/**
 * 位置配置接口
 */
interface Position {
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
}

/**
 * 侧边栏展开收起按钮组件 Props
 */
interface SidebarToggleProps {
  /** 是否展开状态 */
  isOpen: boolean;
  /** 切换展开收起的回调函数 */
  onToggle: (isOpen: boolean) => void;
  /** 方向：left 表示左侧侧边栏，right 表示右侧侧边栏 */
  direction: 'left' | 'right' | 'top' | 'bottom';
  /** 展开状态时的按钮位置 */
  expandedPosition: Position;
  /** 收起状态时的按钮位置 */
  collapsedPosition: Position;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 侧边栏展开收起按钮组件
 * 根据方向和状态自动调整图标朝向和圆角样式
 */
export function SidebarToggle({
  isOpen,
  onToggle,
  direction,
  expandedPosition,
  collapsedPosition,
  className,
  style,
  ...rest
}: SidebarToggleProps) {
  // 根据方向和状态计算图标旋转角度
  const getIconTransform = () => {
    switch (direction) {
      case 'left':
        return isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
      case 'right':
        return isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
      case 'top':
        return isOpen ? 'rotate(90deg)' : 'rotate(-90deg)';
      case 'bottom':
        return isOpen ? 'rotate(-90deg)' : 'rotate(90deg)';
    }
  };

  // 根据方向和状态计算圆角样式
  const getBorderRadius = () => {
    switch (direction) {
      case 'left':
        return isOpen ? 'rounded-full' : 'rounded-r-full';
      case 'right':
        return isOpen ? 'rounded-full' : 'rounded-l-full';
      case 'top':
        return isOpen ? 'rounded-full' : 'rounded-b-none';
      case 'bottom':
        return isOpen ? 'rounded-full' : 'rounded-t-none';
    }
  };

  // 获取当前状态对应的位置
  const currentPosition = isOpen ? expandedPosition : collapsedPosition;

  return (
    <div
      {...rest}
      className={`absolute z-10 ${className || ''}`}
      style={{
        top: currentPosition.top,
        bottom: currentPosition.bottom,
        left: currentPosition.left,
        right: currentPosition.right,
        ...style,
      }}
    >
      <Button
        type="default"
        size="sm"
        onClick={() => onToggle(!isOpen)}
        className={`${getBorderRadius()} w-8 h-8 p-0 flex items-center justify-center`}
      >
        <Icon
          type="icon-expand"
          style={{
            fontSize: '12px',
            transform: getIconTransform(),
          }}
        />
      </Button>
    </div>
  );
}
