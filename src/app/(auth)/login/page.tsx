import { Suspense } from "react";
import { TravelConnectSignIn } from "@/components/ui/travel-connect-signin-1";
import { AuthCardSkeleton } from "@/components/ui/auth-card-skeleton";

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton mode="login" />}>
      <TravelConnectSignIn mode="login" />
    </Suspense>
  );
}
