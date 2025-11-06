import { Layout } from '@/components/Layout';
import { staticBlogData } from '@/lib/blog';
import { TempHome } from './temphome';

export default function Home() {
  return (
    <Layout showFooter={false}>
      <TempHome blogList={staticBlogData.blogList} />
    </Layout>
  );
}
