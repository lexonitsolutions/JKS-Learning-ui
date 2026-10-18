"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Link2, Share2 } from "lucide-react";

const linkCls =
  "inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-2 text-xs font-semibold text-[#222222] transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  // false on the server and during hydration, then the real capability.
  const canShare = useSyncExternalStore(
    () => () => {},
    () => "share" in navigator,
    () => false,
  );
  const enc = encodeURIComponent;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  async function native() {
    try {
      await navigator.share({ title, url });
    } catch {
      /* dismissed */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Share this article">
      <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-[#696969] dark:text-slate-400">Share</span>
      <a className={linkCls} target="_blank" rel="noopener noreferrer" href={`https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`}>X</a>
      <a className={linkCls} target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`}>LinkedIn</a>
      <a className={linkCls} target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${enc(`${title} ${url}`)}`}>WhatsApp</a>
      <button type="button" onClick={copy} className={linkCls}>
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Link2 className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy link"}
      </button>
      {canShare && (
        <button type="button" onClick={native} className={linkCls}><Share2 className="h-3.5 w-3.5" /> More</button>
      )}
    </div>
  );
}
