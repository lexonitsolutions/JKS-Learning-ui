import Link from "next/link";
import { Clock } from "lucide-react";
import type { BlogCard } from "@/lib/data/blog-api";

export function formatPostDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

/** Cover with a graceful, on-brand fallback when an article has no (or a missing) image. */
export function Cover({ post, className = "", priority = false }: { post: BlogCard; className?: string; priority?: boolean }) {
  if (post.coverImageUrl) {
    return (
      // Cover images come from arbitrary https hosts, outside next/image's allow-list.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={post.coverImageUrl}
        alt={post.coverImageAlt || ""}
        loading={priority ? "eager" : "lazy"}
        referrerPolicy="no-referrer"
        className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] ${className}`}
      />
    );
  }
  return (
    <div aria-hidden className={`flex h-full w-full items-end bg-gradient-to-br from-[#0B1F3A] via-[#12315a] to-[#1E5EFF] p-5 ${className}`}>
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">{post.category?.name ?? "JKS Learning"}</span>
    </div>
  );
}

export function Meta({ post }: { post: BlogCard }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#696969] dark:text-slate-400">
      {post.authorName && <span className="font-semibold text-[#222222] dark:text-slate-200">{post.authorName}</span>}
      {post.publishedAt && <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>}
      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readingMinutes} min read</span>
    </p>
  );
}

export function CategoryLabel({ post }: { post: BlogCard }) {
  if (!post.category) return null;
  return (
    <Link
      href={`/blog?category=${post.category.slug}`}
      className="relative z-10 inline-flex rounded-full bg-[#1E5EFF]/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#1A52E0] hover:bg-[#1E5EFF]/20 dark:bg-[#1E5EFF]/20 dark:text-blue-300"
    >
      {post.category.name}
    </Link>
  );
}

export function BlogCardView({ post }: { post: BlogCard }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-18px_rgba(11,31,58,0.3)] dark:border-slate-800 dark:bg-surface-elevated">
      <div className="aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Cover post={post} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <CategoryLabel post={post} />
        <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-[#0B1F3A] dark:text-white">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#696969] dark:text-slate-400">{post.excerpt}</p>}
        <div className="mt-auto pt-4">
          <Meta post={post} />
        </div>
      </div>
    </article>
  );
}
