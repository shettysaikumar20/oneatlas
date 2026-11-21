import * as React from "react";
import { Metadata } from "next";
import { CompareView } from "@/components/compare/compare-view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Compare AI Models Side-by-Side — OneAtlas",
  description:
    "Directly compare pricing, latency, context windows, and benchmark scores across 2 to 4 state-of-the-art AI models.",
};

export default function ComparePage() {
  return (
    <React.Suspense
      fallback={
        <div className="container py-8 space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      }
    >
      <CompareView />
    </React.Suspense>
  );
}
