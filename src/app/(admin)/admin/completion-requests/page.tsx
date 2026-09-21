import { redirect } from "next/navigation";

export default function AdminCompletionRequestsRedirect() {
  redirect("/admin/certificates?tab=pending");
}
