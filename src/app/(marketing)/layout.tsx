import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { LenisProvider } from "@/lib/motion/lenis-provider";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LenisProvider>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </LenisProvider>
  );
}
