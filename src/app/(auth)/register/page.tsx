import { Suspense } from "react";
import { TravelConnectSignIn } from "@/components/ui/travel-connect-signin-1";
import { AuthCardSkeleton } from "@/components/ui/auth-card-skeleton";

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton mode="register" />}>
      <TravelConnectSignIn mode="register" />
    </Suspense>
  );
}
