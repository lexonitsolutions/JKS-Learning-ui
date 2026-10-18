import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import { fetchBlogArticle } from "@/lib/data/blog-api";
import { BlogCardView, Cover, Meta, formatPostDate } from "@/components/blog/blog-ui";
import { ShareButtons } from "@/components/blog/share-buttons";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogArticle(slug);
  if (!post) return { title: "Article not found | JKS Learning", robots: { index: false } };

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || undefined;
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: `${title} | JKS Learning`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: "JKS Learning",
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: post.authorName ? [post.authorName] : undefined,
      tags: post.tags,
      images: post.coverImageUrl ? [{ url: post.coverImageUrl, alt: post.coverImageAlt || title }] : undefined,
    },
    twitter: {
      card: post.coverImageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await fetchBlogArticle(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.seoDescription || post.excerpt || undefined,
      image: post.coverImageUrl ? [post.coverImageUrl] : undefined,
      datePublished: post.publishedAt ?? undefined,
      dateModified: post.updatedAt,
      author: post.authorName ? { "@type": "Person", name: post.authorName } : undefined,
      publisher: { "@type": "Organization", name: "JKS Learning", url: SITE_URL },
      mainEntityOfPage: url,
      articleSection: post.category?.name,
      keywords: post.tags.length ? post.tags.join(", ") : undefined,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        ...(post.category
          ? [{ "@type": "ListItem", position: 3, name: post.category.name, item: `${SITE_URL}/blog?category=${post.category.slug}` }]
          : []),
        { "@type": "ListItem", position: post.category ? 4 : 3, name: post.title, item: url },
      ],
    },
  ];
  // "<" is escaped so article text can never close the script element.
  const jsonLdText = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  const updated = post.updatedAt && post.publishedAt && new Date(post.updatedAt).getTime() - new Date(post.publishedAt).getTime() > 86_400_000;

  return (
    <div className="bg-[#F5F8FF] dark:bg-transparent">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdText }} />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[#696969] dark:text-slate-400">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/blog" className="hover:underline">Blog</Link></li>
            {post.category && (
              <>
                <li aria-hidden>/</li>
                <li><Link href={`/blog?category=${post.category.slug}`} className="hover:underline">{post.category.name}</Link></li>
              </>
            )}
            <li aria-hidden>/</li>
            <li aria-current="page" className="max-w-[16rem] truncate font-medium text-[#222222] dark:text-slate-200">{post.title}</li>
          </ol>
        </nav>

        <header>
          {post.category && (
            <Link href={`/blog?category=${post.category.slug}`} className="inline-flex rounded-full bg-[#1E5EFF]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#1A52E0] dark:bg-[#1E5EFF]/20 dark:text-blue-300">
              {post.category.name}
            </Link>
          )}
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#0B1F3A] dark:text-white sm:text-[2.6rem]">{post.title}</h1>
          {post.excerpt && <p className="mt-4 text-lg leading-relaxed text-[#696969] dark:text-slate-400">{post.excerpt}</p>}
          <div className="mt-5 border-y border-[#E5E7EB] py-3 dark:border-slate-800">
            <Meta post={post} />
            {updated && <p className="mt-1 text-xs text-[#696969] dark:text-slate-400">Updated {formatPostDate(post.updatedAt)}</p>}
          </div>
        </header>

        {post.coverImageUrl && (
          <figure className="mt-8 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
            <div className="aspect-[16/9]"><Cover post={post} priority /></div>
          </figure>
        )}

        {/* `content` was sanitised against an allow-list by the API when it was saved. */}
        {post.content.trim() ? (
          <div className="article-prose mt-8" dangerouslySetInnerHTML={{ __html: post.content }} />
        ) : (
          <p className="mt-8 text-[#696969]">This article has no content yet.</p>
        )}

        {post.tags.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Tags">
            {post.tags.map((t) => (
              <li key={t}>
                <Link href={`/blog?tag=${encodeURIComponent(t)}`} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#222222] ring-1 ring-[#E5E7EB] hover:bg-slate-50 dark:bg-surface-elevated dark:text-slate-200 dark:ring-slate-700">#{t}</Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 border-t border-[#E5E7EB] pt-6 dark:border-slate-800">
          <ShareButtons url={url} title={post.title} />
        </div>
      </article>

      {post.related.length > 0 && (
        <section className="border-t border-[#E5E7EB] bg-white/60 dark:border-slate-800 dark:bg-transparent" aria-labelledby="related-h">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h2 id="related-h" className="mb-6 text-xl font-bold text-[#0B1F3A] dark:text-white">Keep reading</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {post.related.map((p) => <BlogCardView key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
