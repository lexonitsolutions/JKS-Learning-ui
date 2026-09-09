import { Suspense } from "react";
import { ForgotPasswordCard } from "@/components/ui/forgot-password-card";

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordCard />
    </Suspense>
  );
}
