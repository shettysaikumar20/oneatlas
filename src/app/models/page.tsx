import * as React from "react";
import { Metadata } from "next";
import { ModelsView } from "@/components/models/models-view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "AI Models Discovery & Filtering — OneAtlas",
  description:
    "Filter and explore 80+ AI models by pricing, context window, benchmark scores, modalities, and hosting providers.",
};

export default function ModelsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="container py-8 space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <Skeleton className="h-96 rounded-xl hidden lg:block" />
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ModelsView />
    </React.Suspense>
  );
}
