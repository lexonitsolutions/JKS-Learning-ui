import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ChunkErrorHandler } from "@/components/common/chunk-error-handler";
import { PageTransitionProvider } from "@/components/common/page-transition-provider";
import { WebsiteChatbot } from "@/components/common/website-chatbot";
import { ClerkSessionSync } from "@/components/common/clerk-session-sync";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg-light text-text-heading">
        <ClerkProvider afterSignOutUrl="/login">
          <ClerkSessionSync />
          <ChunkErrorHandler />
          <PageTransitionProvider>
            {children}
            <WebsiteChatbot />
          </PageTransitionProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}