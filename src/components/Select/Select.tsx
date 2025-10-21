"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils/tools";
import { useAppStore, colorSchemePresets } from "@/store/app";
import Icon from "../Icon";

export interface SelectOption {
  /** 选项值 */
  value: string;
  /** 选项标签 */
  label: string;
}

export interface SelectProps {
  /** 选项列表 */
  options: SelectOption[];
  /** 当前选中值 */
  value?: string;
  /** 值变化回调 */
  onChange?: (value: string) => void;
  /** 自定义类名 */
  className?: string;
  /** 占位符 */
  placeholder?: string;
}

/**
 * 下拉框组件
 */
const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ options, value, onChange, className, placeholder }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme, colorScheme } = useAppStore();
    const primaryColor = colorSchemePresets[colorScheme];

    // 获取当前选中项的标签
    const selectedLabel =
      options.find((opt) => opt.value === value)?.label ||
      placeholder ||
      "请选择";

    // 点击外部关闭下拉框
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue);
      setIsOpen(false);
    };

    // 根据主题选择样式
    const triggerBgClass = theme === "dark" ? "bg-gray-800" : "bg-gray-100";
    const triggerHoverClass =
      theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200";
    const dropdownBgClass = theme === "dark" ? "bg-gray-800" : "bg-white";
    const dropdownBorderClass =
      theme === "dark" ? "border-gray-700" : "border-gray-200";
    const optionHoverClass =
      theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";

    return (
      <div
        ref={(node) => {
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          containerRef.current = node;
        }}
        className={cn("relative", className)}
      >
        {/* 触发按钮 */}
        <div
          className={cn(
            "flex items-center justify-between cursor-pointer select-none w-full",
            "px-3 py-1.5 text-sm rounded-lg",
            triggerBgClass,
            triggerHoverClass
          )}
          style={{ color: primaryColor }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedLabel}</span>
          <Icon
            type="icon-expand"
            style={{
              fontSize: "12px",
              marginLeft: "8px",
              transition: "transform 0.2s ease",
              transform: isOpen ? "rotate(270deg)" : "rotate(180deg)",
            }}
          />
        </div>

        {/* 下拉选项 */}
        {isOpen && (
          <div
            className={cn(
              "absolute z-50 mt-1 rounded-lg shadow-lg border overflow-hidden",
              "min-w-full",
              dropdownBgClass,
              dropdownBorderClass
            )}
            style={{
              top: "100%",
              left: 0,
            }}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <div
                  key={option.value}
                  className={cn(
                    "px-3 py-2 cursor-pointer select-none transition-colors duration-150 text-sm",
                    optionHoverClass,
                    isSelected && "font-medium"
                  )}
                  style={{
                    color: isSelected ? primaryColor : "inherit",
                  }}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
