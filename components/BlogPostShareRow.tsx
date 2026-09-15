"use client";

// Row of small colored share badges under a blog post's body copy. Facebook/X open the
// platform's real share-intent URL for this page; Share uses the Web Share API where available
// and falls back to copying the link, same as the dedicated Copy Link badge.
//
// The shared URL is built from the canonical origin plus the current pathname, not from
// window.location. That keeps it correct on the server render (window does not exist there, and
// building the intent URL inline shipped `?u=` with an empty value) and it means what gets
// shared is always the canonical address - never a preview hostname or a URL carrying campaign
// parameters from however the visitor arrived.
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SITE_URL } from "./seo";
import ShareIcon from "./icons/ShareIcon";
import SocialIcon from "./icons/SocialIcon";
import LinkIcon from "./icons/LinkIcon";

const BADGE = "flex h-8 w-8 items-center justify-center rounded";

export default function BlogPostShareRow() {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}${pathname}`;
  const encoded = encodeURIComponent(url);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API refused - insecure context, or permission denied. A selection copy is what
      // still works in that case.
      const field = document.createElement("textarea");
      field.value = url;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.append(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url, title: document.title });
        return;
      } catch {
        // Native sheet dismissed: fall through to copying.
      }
    }
    await copyLink();
  };

  return (
    <div className="flex leading-8">
      <button type="button" onClick={share} aria-label="Share" className="px-0.5 leading-4 text-brand">
        <span className={`${BADGE} bg-share-badge`}>
          <ShareIcon className="h-4 w-4 text-white" />
        </span>
      </button>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
        aria-label="Share on Facebook"
        className="px-0.5 leading-4 text-brand"
      >
        <span className={`${BADGE} bg-facebook-badge`}>
          <SocialIcon name="facebook" className="h-4 w-4 text-white" />
        </span>
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
        aria-label="Share on X"
        className="px-0.5 leading-4 text-brand"
      >
        <span className={`${BADGE} bg-x-badge`}>
          <SocialIcon name="x" className="h-4 w-4 text-white" />
        </span>
      </a>

      <button
        type="button"
        onClick={copyLink}
        aria-label={copied ? "Copied" : "Copy Link"}
        className="px-0.5 leading-4 text-brand"
      >
        <span className={`${BADGE} bg-copylink-badge`}>
          <LinkIcon className="h-4 w-4 text-white" />
        </span>
      </button>
    </div>
  );
}
