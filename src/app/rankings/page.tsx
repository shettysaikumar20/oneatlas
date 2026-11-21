import { Suspense } from "react";
import type { Metadata } from "next";
import { RankingsView } from "@/components/rankings/rankings-view";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "AI Model Rankings & Leaderboard | OneAtlas",
  description:
    "Explore the frontier AI model leaderboards across LMSYS Arena Elo, MMLU, GPQA Diamond, HumanEval, and SWE-bench with cost-efficiency analysis.",
};

export default function RankingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
            <Skeleton className="h-72 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        }
      >
        <RankingsView />
      </Suspense>
    </div>
  );
}
