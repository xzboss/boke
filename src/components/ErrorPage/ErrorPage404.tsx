import { Empty } from "@/components/Empty";

/**
 * 404错误页面组件
 */
export const ErrorPage404 = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
      <div className="text-center">
        <Empty>
          <div className="text-6xl font-bold text-gray-400 mt-4">404</div>
        </Empty>
      </div>
    </div>
  );
};
