"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Home, Loader2 } from "lucide-react";
import { CourseDetailView } from "./course-detail-view";
import { apiUrl } from "@/lib/api/base-url";
import { transformBackendCourse } from "@/lib/data/courses-api";
import type { Course } from "@/lib/data/courses";

interface CourseDetailResolverProps {
  slug: string;
  initialCourse?: Course;
}

export function CourseDetailResolver({ slug, initialCourse }: CourseDetailResolverProps) {
  const [course, setCourse] = useState<Course | undefined>(initialCourse);
  const [loading, setLoading] = useState<boolean>(!initialCourse);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (initialCourse) return;

    let isMounted = true;
    async function resolveCourse() {
      const cleanSlug = decodeURIComponent(slug).trim();
      const urlsToTry = [apiUrl(`/courses/${encodeURIComponent(cleanSlug)}`)];
      if (window.location.hostname === "localhost" && !urlsToTry[0].includes("localhost:4000")) {
        urlsToTry.push(`http://localhost:4000/courses/${encodeURIComponent(cleanSlug)}`);
      }

      for (const url of urlsToTry) {
        try {
          const res = await fetch(url, {
            cache: "no-store",
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(10000),
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.slug && isMounted) {
              setCourse(transformBackendCourse(data));
              setLoading(false);
              return;
            }
          }
        } catch {
          // try next
        }
      }

      // Fallback: fetch all courses to match by case-insensitive slug or id
      try {
        const catalogUrl = apiUrl("/courses");
        const res = await fetch(catalogUrl, {
          cache: "no-store",
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(10000),
        });
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list)) {
            const match = list.find(
              (item: any) =>
                item.slug?.toLowerCase() === cleanSlug.toLowerCase() ||
                item.id === cleanSlug
            );
            if (match && isMounted) {
              setCourse(transformBackendCourse(match));
              setLoading(false);
              return;
            }
          }
        }
      } catch {
        // ignore
      }

      if (isMounted) {
        setLoading(false);
        setError(true);
      }
    }

    resolveCourse();

    return () => {
      isMounted = false;
    };
  }, [slug, initialCourse]);

  if (course) {
    return <CourseDetailView course={course} />;
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          Loading course curriculum...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold text-2xl border border-blue-100 dark:border-blue-900">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Course Not Found
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            The requested course could not be located in our published catalog.
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
