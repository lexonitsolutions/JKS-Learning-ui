import { Suspense } from "react";
import { TravelConnectSignIn } from "@/components/ui/travel-connect-signin-1";

export default function RegisterPage() {
  return (
    <Suspense>
      <TravelConnectSignIn mode="register" />
    </Suspense>
  );
}
