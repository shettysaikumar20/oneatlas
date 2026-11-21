"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Trophy,
  Medal,
  Sparkles,
  TrendingUp,
  Scale,
  Check,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { api } from "@/lib/api";
import { PricePerformanceScatter } from "./price-performance-scatter";
import { LabAvatar } from "@/components/shared/lab-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useCompareStore } from "@/hooks/use-compare";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function RankingsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hasSlug, addSlug, removeSlug } = useCompareStore();

  const benchmarkSlug = searchParams.get("benchmark") || "arena-elo";
  const category = searchParams.get("category") || "all";

  // Query rankings from /api/rankings
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["rankings", benchmarkSlug, category],
    queryFn: () => api.getRankings({ benchmark: benchmarkSlug, category }),
  });

  const benchmark = data?.benchmark;
  const benchmarks = data?.benchmarks || [];
  const items = data?.items || [];

  const handleBenchmarkSelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("benchmark", slug);
    router.replace(`/rankings?${params.toString()}`, { scroll: false });
  };

  const handleCategorySelect = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "all") params.delete("category");
    else params.set("category", cat);
    router.replace(`/rankings?${params.toString()}`, { scroll: false });
  };

  // Find max score for progress bar scaling
  const maxScore = items.length > 0 ? Math.max(...items.map((i) => i.score)) : 100;

  // Best value threshold (top 20% valueScore)
  const sortedByValue = [...items].sort((a, b) => b.valueScore - a.valueScore);
  const bestValueThreshold = sortedByValue[Math.min(3, sortedByValue.length - 1)]?.valueScore || 999;

  return (
    <div className="container py-8 space-y-8 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
            <Trophy className="h-4 w-4" />
            <span>Leaderboard & Evals</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">AI Model Leaderboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comparative performance rankings across Chatbot Arena, MMLU, coding, and mathematical evaluations.
          </p>
        </div>
      </div>

      {/* Benchmark Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {benchmarks.map((bm) => {
          const isSelected = bm.slug.toLowerCase() === benchmarkSlug.toLowerCase();
          return (
            <button
              key={bm.id}
              onClick={() => handleBenchmarkSelect(bm.slug)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors border",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground"
              )}
            >
              <span>{bm.name}</span>
              <span className="ml-1.5 text-[10px] opacity-75">({bm.category})</span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      ) : isError || !benchmark ? (
        <ErrorState
          title="Failed to Load Rankings"
          message="Could not load leaderboard data for this benchmark."
          onRetry={() => refetch()}
        />
      ) : (
        <div className="space-y-8">
          {/* Scatter Chart: Price vs. Performance (Step 10 Original Touch) */}
          <PricePerformanceScatter items={items} benchmark={benchmark} />

          {/* Leaderboard Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold tracking-tight">
                  {benchmark.name} Rankings
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {benchmark.description || "Ranked from highest performing to lowest."}
                </p>
              </div>

              {/* Model Category Filters */}
              <div className="flex items-center gap-1.5 text-xs">
                {["all", "chat", "code", "multimodal"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={cn(
                      "px-2.5 py-1 rounded-md capitalize transition-colors text-xs",
                      category === cat
                        ? "bg-muted text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
                    <th className="py-3 px-3 w-16 text-center">Rank</th>
                    <th className="py-3 px-4">Model & Lab</th>
                    <th className="py-3 px-3 font-mono text-right">Score</th>
                    <th className="py-3 px-4 w-44">Relative Score</th>
                    <th className="py-3 px-3 font-mono">Input / 1M</th>
                    <th className="py-3 px-3 font-mono">Value Metric</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item) => {
                    const m = item.model || (item as any);
                    const modelId = m.id || (item as any).modelId || m.slug;
                    const modelSlug = m.slug || (item as any).slug;
                    const modelName = m.name || (item as any).name;
                    const labName = m.lab?.name || (item as any).lab?.name || "AI Lab";
                    const labColor = m.lab?.color || (item as any).lab?.color;
                    const inputPrice = m.inputPricePerM ?? (item as any).inputPricePerM ?? 0;

                    const isCompared = hasSlug(modelSlug);
                    const isTopValue = item.valueScore >= bestValueThreshold && item.valueScore > 10;
                    const percentOfMax = Math.round((item.score / maxScore) * 100);

                    return (
                      <tr
                        key={modelId}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        {/* 1. Rank */}
                        <td className="py-3.5 px-3 text-center">
                          {item.rank === 1 ? (
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/15 text-amber-500 font-bold text-xs border border-amber-500/30">
                              1
                            </span>
                          ) : item.rank === 2 ? (
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-300/20 text-slate-400 font-bold text-xs border border-slate-400/30">
                              2
                            </span>
                          ) : item.rank === 3 ? (
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-700/15 text-amber-600 font-bold text-xs border border-amber-700/30">
                              3
                            </span>
                          ) : (
                            <span className="font-mono text-muted-foreground">
                              {item.rank}
                            </span>
                          )}
                        </td>

                        {/* 2. Model & Lab */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <LabAvatar
                              name={labName}
                              color={labColor}
                              size="sm"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <Link
                                  href={`/models/${modelSlug}`}
                                  className="font-semibold text-foreground hover:text-primary transition-colors"
                                >
                                  {modelName}
                                </Link>
                                {isTopValue && (
                                  <Badge
                                    variant="success"
                                    className="gap-0.5 text-[10px] px-1 py-0 font-medium"
                                  >
                                    <Sparkles className="h-2.5 w-2.5" />
                                    Best Value
                                  </Badge>
                                )}
                              </div>
                              <span className="text-[11px] text-muted-foreground">
                                {labName}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 3. Score */}
                        <td className="py-3.5 px-3 font-mono font-bold text-sm text-right text-primary">
                          {item.score}
                        </td>

                        {/* 4. Score Bar */}
                        <td className="py-3.5 px-4">
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentOfMax}%` }}
                            />
                          </div>
                        </td>

                        {/* 5. Input Price */}
                        <td className="py-3.5 px-3 font-mono text-foreground">
                          {formatPrice(inputPrice)}
                        </td>

                        {/* 6. Value Metric */}
                        <td className="py-3.5 px-3 font-mono">
                          <span className={cn(isTopValue ? "text-emerald-500 font-bold" : "text-muted-foreground")}>
                            {item.valueScore} pts/$
                          </span>
                        </td>

                        {/* 7. Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant={isCompared ? "secondary" : "ghost"}
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                isCompared
                                  ? removeSlug(modelSlug)
                                  : addSlug(modelSlug)
                              }
                              title={isCompared ? "Remove from compare" : "Add to compare"}
                            >
                              {isCompared ? (
                                <Check className="h-3.5 w-3.5 text-primary" />
                              ) : (
                                <Scale className="h-3.5 w-3.5" />
                              )}
                            </Button>

                            <Button asChild variant="outline" size="icon" className="h-7 w-7">
                              <Link href={`/models/${modelSlug}`} title="View details">
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
