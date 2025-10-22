import { Layout } from "@/components/layout";
import { ErrorPage404, ErrorPage403 } from "@/components/ErrorPage";

interface ErrorPageProps {
  params: { error: string };
}

/**
 * 通用错误页面
 * 根据路径参数渲染不同的错误页面
 */
export default function ErrorPage({ params }: ErrorPageProps) {
  const { error } = params;

  const renderErrorPage = () => {
    switch (error) {
      case '404':
        return <ErrorPage404 />;
      case '403':
        return <ErrorPage403 />;
      default:
        return <ErrorPage404 />;
    }
  };

  return (
    <Layout>
      {renderErrorPage()}
    </Layout>
  );
}
