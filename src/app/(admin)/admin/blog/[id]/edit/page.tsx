import { BlogEditor } from "@/components/admin/blog-editor";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BlogEditor articleId={id} />;
}
