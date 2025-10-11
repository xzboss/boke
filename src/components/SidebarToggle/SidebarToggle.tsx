"use client";

import React from "react";
import Button from "../Button";
import Icon from "../Icon";

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
  direction: "left" | "right";
  /** 展开状态时的按钮位置 */
  expandedPosition: Position;
  /** 收起状态时的按钮位置 */
  collapsedPosition: Position;
  /** 自定义类名 */
  className?: string;
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
}: SidebarToggleProps) {
  // 根据方向和状态计算图标旋转角度
  const getIconTransform = () => {
    if (direction === "left") {
      // 左侧侧边栏：展开时右侧按钮不旋转，收起时左侧按钮旋转180度
      return isOpen ? "" : "rotate(180deg)";
    } else {
      // 右侧侧边栏：展开时左侧按钮旋转180度，收起时右侧按钮不旋转
      return isOpen ? "rotate(180deg)" : "";
    }
  };

  // 根据方向和状态计算圆角样式
  const getBorderRadius = () => {
    if (direction === "left") {
      // 左侧侧边栏：展开时右侧按钮全圆角，收起时左侧按钮右圆角
      return isOpen ? "rounded-full" : "rounded-r-full";
    } else {
      // 右侧侧边栏：展开时左侧按钮全圆角，收起时右侧按钮左圆角
      return isOpen ? "rounded-full" : "rounded-l-full";
    }
  };

  // 获取当前状态对应的位置
  const currentPosition = isOpen ? expandedPosition : collapsedPosition;

  return (
    <div
      className={`absolute z-10 ${className || ""}`}
      style={{
        top: currentPosition.top,
        bottom: currentPosition.bottom,
        left: currentPosition.left,
        right: currentPosition.right,
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
            fontSize: "12px",
            transform: getIconTransform(),
          }}
        />
      </Button>
    </div>
  );
}
