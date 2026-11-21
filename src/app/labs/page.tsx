import { Suspense } from "react";
import type { Metadata } from "next";
import { LabsView } from "@/components/labs/labs-view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "AI Research Labs Directory | OneAtlas",
  description:
    "Explore top AI labs and creators including OpenAI, Anthropic, Google DeepMind, Meta AI, Mistral, DeepSeek, and more.",
};

export default function LabsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="space-y-8">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-56 w-full rounded-xl" />
              ))}
            </div>
          </div>
        }
      >
        <LabsView />
      </Suspense>
    </div>
  );
}
