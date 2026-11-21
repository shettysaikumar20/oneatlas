"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Scale, X, Trash2 } from "lucide-react";
import { useCompareStore } from "@/hooks/use-compare";
import { Button } from "@/components/ui/button";

export function CompareTray() {
  const { selectedSlugs, removeSlug, clearSlugs } = useCompareStore();
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || selectedSlugs.length === 0 || pathname === "/compare") {
    return null;
  }

  const compareUrl = `/compare?models=${selectedSlugs.join(",")}`;

  return (
    <aside aria-label="Compare Models Tray" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/95 backdrop-blur-md p-3 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Scale className="h-4 w-4" />
          </div>
          <div className="hidden sm:block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Compare Tray
            </span>
            <div className="text-sm font-medium">
              {selectedSlugs.length} of 4 models selected
            </div>
          </div>
        </div>

        {/* Selected model chips */}
        <div className="flex items-center gap-1.5 flex-1 max-w-sm overflow-x-auto py-1 scrollbar-none">
          {selectedSlugs.map((slug) => (
            <div
              key={slug}
              className="flex items-center gap-1.5 rounded-md border border-border bg-muted/60 px-2 py-1 text-xs font-medium text-foreground shrink-0"
            >
              <span className="max-w-[100px] truncate">{slug}</span>
              <button
                onClick={() => removeSlug(slug)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`Remove ${slug}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={clearSlugs}
            title="Clear compare tray"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>

          <Button asChild size="sm" className="gap-1.5">
            <Link href={compareUrl}>
              <span>Compare</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
