'use client';

import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils/tools';
import { useAppStore, colorSchemePresets } from '@/store/app';
import Icon from '../Icon';
import Button from '../Button';

export interface SelectOption {
  /** 选项值 */
  value: string;
  /** 选项标签 */
  label: string;
  /** 选项渲染 */
  render?: (option: SelectOption) => React.ReactNode;
  [key: string]: any;
}

export interface SelectProps {
  /** 选项列表 */
  options: SelectOption[];
  /** 当前选中值 */
  value?: string;
  /** 值变化回调 */
  onChange?: (option: SelectOption) => void;
  /** 自定义类名 */
  className?: string;
  /** 占位符 */
  placeholder?: string;
  /** 默认值 */
  defaultValue?: string;
}

export interface SelectRef {
  handleSelect?: (optionValue: string) => void;
}

/**
 * 下拉框组件
 */
const Select = React.forwardRef<SelectRef, SelectProps>(
  ({ options, value, onChange, className, placeholder, defaultValue }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentOption, setCurrentOption] = useState<SelectOption | null>(
      options.find(opt => opt.value === defaultValue) || null
    );
    const [currentValue, setCurrentValue] = useState<string | null>(defaultValue);

    const handleSelect = (optionValue: string) => {
      const currentOption = options.find(opt => opt.value === optionValue);
      if (currentOption) {
        setCurrentOption(currentOption);
        setCurrentValue(optionValue);
        onChange?.(currentOption);
        setIsOpen(false);
      }
    };

    useImperativeHandle(ref, () => ({
      handleSelect,
    }));

    return (
      <div ref={containerRef} className={cn('relative', className)}>
        {/* 触发按钮 */}
        <Button type="default" size="sm" onClick={() => setIsOpen(!isOpen)}>
          <span>{currentOption?.render ? currentOption.render(currentOption) : currentOption?.label}</span>
          <Icon
            type="icon-expand"
            style={{
              fontSize: '12px',
              marginLeft: '8px',
              transition: 'transform 0.2s ease',
              transform: isOpen ? 'rotate(270deg)' : 'rotate(180deg)',
            }}
          />
        </Button>

        {/* 下拉选项 */}
        {isOpen && (
          <div
            className={cn(
              'absolute z-50 mt-1 rounded-lg shadow-lg border overflow-hidden max-h-200px overflow-y-auto',
              'min-w-full custom-scrollbar'
            )}
            style={{
              backgroundColor: 'var(--color-background)',
            }}
          >
            {options.map(option => (
              <div key={option.value} className="mb-1">
                {option.render ? (
                  option.render(option)
                ) : (
                  <Button
                    type={option.value === currentValue ? 'default' : 'text'}
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
