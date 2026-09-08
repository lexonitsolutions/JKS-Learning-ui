import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ChunkErrorHandler } from "@/components/common/chunk-error-handler";
import { PageTransitionProvider } from "@/components/common/page-transition-provider";
import { WebsiteChatbot } from "@/components/common/website-chatbot";
import { ClerkSessionSync } from "@/components/common/clerk-session-sync";
import { ThemeProvider } from "@/lib/theme/theme-context";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JKS Learning — Career-Ready IT Upskilling",
  description:
    "AI-powered learning platform for Java Full Stack, Frontend, and SAP professionals — structured courses, AI mock interviews, and verified certification.",
  icons: {
    icon: [
      { url: "/images/jks-logo.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/images/jks-logo.png",
    apple: "/images/jks-logo.png",
  },
};

const CLERK_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_ZWFzeS1jb3VnYXItMzY0MC5jbGVyay5hY2NvdW50cy5kZXYk";

// Anti-FOUC script: Immediately initializes dark theme before React mounts
const themeInitScript = `
  (function() {
    try {
      var stored = localStorage.getItem('jks-theme');
      var isDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.style.colorScheme = 'light';
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${manrope.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <ThemeProvider>
          <ClerkProvider
            publishableKey={CLERK_PUBLISHABLE_KEY}
            signInUrl="/login"
            signUpUrl="/register"
            afterSignOutUrl="/login"
          >
            <ClerkSessionSync />
            <ChunkErrorHandler />
            <PageTransitionProvider>
              {children}
              <WebsiteChatbot />
            </PageTransitionProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}