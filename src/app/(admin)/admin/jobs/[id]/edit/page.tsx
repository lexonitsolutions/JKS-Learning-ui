import { JobForm } from "@/components/admin/job-form";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <JobForm jobId={id} />;
}
