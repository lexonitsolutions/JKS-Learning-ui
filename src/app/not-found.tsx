import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold text-2xl border border-blue-100 dark:border-blue-900">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Page not found
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or updated.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-sm active:scale-95"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm transition-all border border-slate-200 dark:border-slate-700 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Explore Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
