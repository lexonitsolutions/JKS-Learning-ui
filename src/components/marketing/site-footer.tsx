import Link from "next/link";

const COLUMNS = [
  {
    title: "Tracks",
    links: [
      { href: "/courses?track=full-stack", label: "Full Stack" },
      { href: "/courses?track=frontend", label: "Frontend" },
      { href: "/courses?track=sap", label: "SAP" },
    ],
  },
  {
    title: "Product",
    links: [
      { href: "/ai-mock-interview", label: "AI Mock Interview" },
      { href: "/success-stories", label: "Success Stories" },
      { href: "/certificate/verify", label: "Verify Certificate" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-primary-dark text-white/70">
      <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <span className="text-h3 font-bold text-white">
              JKS<span className="text-primary-blue"> Learning</span>
            </span>
            <p className="mt-4 max-w-xs text-sm">
              Career-focused IT upskilling with structured courses and AI-powered
              interview readiness for Full Stack, Frontend, and SAP professionals.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-label text-white/50">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm sm:flex-row">
          <p>&copy; {new Date().getFullYear()} JKS Learning. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
