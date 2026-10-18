import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { fetchBlogSlugs } from "@/lib/data/blog-api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/about", "/courses", "/events", "/blog", "/success-stories", "/privacy-policy", "/terms"].map(
    (path) => ({ url: `${SITE_URL}${path}` }),
  );
  // Published articles only; if the API is unreachable the static pages still list.
  const posts = (await fetchBlogSlugs()) ?? [];
  return [
    ...pages,
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: new Date(p.updatedAt) })),
  ];
}
