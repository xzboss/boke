"use client";
import React from "react";
import { cn } from "@/lib/utils/tools";
import "./MdHtmlViewer.scss";

export interface MdHtmlViewerProps {
  /** HTML内容字符串 */
  htmlContent: string;
  [key: string]: unknown;
}

/**
 * Markdown内容渲染组件
 * 专门用于渲染Markdown转换后的HTML内容，提供统一的样式处理
 */
const MdHtmlViewer: React.FC<MdHtmlViewerProps> = ({
  htmlContent,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={cn("md-html-viewer-container", rest?.className as string)}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MdHtmlViewer;
