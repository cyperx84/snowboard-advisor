"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ShareButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/gear/${slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Snowboard Recommendations", url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // user cancelled share or clipboard denied
    }
  }

  return (
    <Button onClick={handleShare} variant="outline" className="w-full sm:w-auto">
      {copied ? "Link copied!" : "Share Results"}
    </Button>
  );
}
