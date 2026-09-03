import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ChunkErrorHandler } from "@/components/common/chunk-error-handler";
import { PageTransitionProvider } from "@/components/common/page-transition-provider";
import { WebsiteChatbot } from "@/components/common/website-chatbot";

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

const chunkErrorScript = `
(function() {
  var KEY = 'jks_chunk_load_retry_ts';
  function handleRetry(msg) {
    try {
      var isChunk = /Loading chunk|ChunkLoadError|Failed to fetch dynamically imported module|Importing a module script failed|dynamically imported module/i.test(msg || '');
      if (!isChunk) return;
      var last = sessionStorage.getItem(KEY);
      var now = Date.now();
      if (!last || now - parseInt(last, 10) > 10000) {
        sessionStorage.setItem(KEY, String(now));
        window.location.reload();
      }
    } catch(e) {}
  }
  window.addEventListener('error', function(e) {
    handleRetry(e.message || (e.error && e.error.message));
  }, true);
  window.addEventListener('unhandledrejection', function(e) {
    handleRetry((e.reason && (e.reason.message || e.reason)) || '');
  });
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: chunkErrorScript,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-light text-text-heading">
        <ChunkErrorHandler />
        <PageTransitionProvider>
          {children}
          <WebsiteChatbot />
        </PageTransitionProvider>
      </body>
    </html>
  );
}



