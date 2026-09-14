import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, Homemade_Apple } from "next/font/google";
import "./globals.css";
import { ChunkErrorHandler } from "@/components/common/chunk-error-handler";
import { PageTransitionProvider } from "@/components/common/page-transition-provider";
import { WebsiteChatbot } from "@/components/common/website-chatbot";
import { ClerkSessionSync } from "@/components/common/clerk-session-sync";
import { ThemeProvider } from "@/lib/theme/theme-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const homemadeApple = Homemade_Apple({
  weight: "400",
  variable: "--font-homemade-apple",
  subsets: ["latin"],
  display: "swap",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${homemadeApple.variable} font-sans h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Homemade+Apple&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
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