import { SuccessStoryForm } from "@/components/admin/success-story-form";

export default async function EditSuccessStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SuccessStoryForm storyId={id} />;
}
