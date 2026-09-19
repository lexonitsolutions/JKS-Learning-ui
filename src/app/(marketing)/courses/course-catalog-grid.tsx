"use client";

import React, { useEffect, useState } from "react";
import { CourseCard } from "@/components/marketing/course-card";
import { Reveal } from "@/lib/motion/reveal";
import { transformBackendCourse } from "@/lib/data/courses-api";
import { apiUrl } from "@/lib/api/base-url";
import type { Course } from "@/lib/data/courses";

interface CourseCatalogGridProps {
  initialCourses: Course[];
  track?: string;
}

export function CourseCatalogGrid({ initialCourses, track }: CourseCatalogGridProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isLoading, setIsLoading] = useState<boolean>(initialCourses.length === 0);

  useEffect(() => {
    // If we already have courses from SSR, we can quietly re-validate in background
    let isMounted = true;

    async function loadLiveCourses() {
      const urls = [apiUrl("/courses")];
      if (!urls[0].includes("localhost:4000") && window.location.hostname === "localhost") {
        urls.push("http://localhost:4000/courses");
      }

      for (const url of urls) {
        try {
          const res = await fetch(url, {
            cache: "no-store",
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(10000),
          });

          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && isMounted) {
              const live = data.map((item) => transformBackendCourse(item));
              setCourses(live);
              setIsLoading(false);
              return;
            }
          }
        } catch {
          // try next url
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    // Always fetch client-side if initial list was empty, or sync on mount
    loadLiveCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = track ? courses.filter((c) => c.track === track) : courses;

  if (isLoading && courses.length === 0) {
    return (
      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-72 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-100/70 dark:bg-slate-900/60 animate-pulse p-4 flex flex-col justify-between"
          >
            <div className="h-36 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-2.5">
              <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="mt-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
        <p className="text-base font-bold text-slate-800 dark:text-white">No courses currently published</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Courses published in the database will appear here in real-time.
        </p>
      </div>
    );
  }

  return (
    <Reveal
      key={track ?? "all"}
      variant="stagger"
      className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {filtered.map((course) => (
        <div key={course.slug}>
          <CourseCard course={course} />
        </div>
      ))}
    </Reveal>
  );
}
