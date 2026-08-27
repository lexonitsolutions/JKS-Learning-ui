import Link from "next/link";

// See (admin)/layout.tsx — same reasoning, for /login and /register: only
// proxy.ts reads the session cookie, so without this Next can statically
// cache these pages (or a prefetch of them) from a moment when the auth
// state differed from what's active when the user actually lands here.
export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-light px-4 py-12">
      {/* The auth card's left panel carries its own JKS Learning branding
       * at md+ widths — showing this too would duplicate it. That panel is
       * hidden below md, so this fills in as the only brand mark on mobile. */}
      <Link href="/" className="text-h3 mb-8 font-bold text-primary-dark md:hidden">
        JKS<span className="text-primary-blue"> Learning</span>
      </Link>
      {children}
    </div>
  );
}
