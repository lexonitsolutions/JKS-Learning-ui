import { Suspense } from "react";
import { TravelConnectSignIn } from "@/components/ui/travel-connect-signin-1";

export default function LoginPage() {
  return (
    <Suspense>
      <TravelConnectSignIn mode="login" />
    </Suspense>
  );
}
