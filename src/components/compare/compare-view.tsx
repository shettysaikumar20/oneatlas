"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Scale,
  Share2,
  Check,
  RotateCcw,
  Sparkles,
  BarChart3,
  Layers,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { api } from "@/lib/api";
import { useCompareStore } from "@/hooks/use-compare";
import { CompareTable } from "./compare-table";
import { ModelSelector } from "./model-selector";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899"];

export function CompareView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedSlugs, addSlug, removeSlug, clearSlugs } = useCompareStore();

  const [copied, setCopied] = React.useState(false);

  // Read slugs from URL query param (?models=a,b or ?slugs=a,b)
  const urlParam = searchParams.get("models") || searchParams.get("slugs") || "";
  const querySlugs = urlParam
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  // Sync state: If URL has models, update Zustand; otherwise use Zustand or defaults
  const effectiveSlugs = React.useMemo(() => {
    if (querySlugs.length >= 2) return querySlugs;
    if (selectedSlugs.length >= 2) return selectedSlugs;
    return ["openai-gpt-4o", "anthropic-claude-3-5-sonnet"];
  }, [querySlugs, selectedSlugs]);

  // Keep URL in sync with effectiveSlugs
  React.useEffect(() => {
    const currentParam = searchParams.get("models") || searchParams.get("slugs");
    const newParam = effectiveSlugs.join(",");
    if (currentParam !== newParam) {
      router.replace(`/compare?models=${newParam}`, { scroll: false });
    }
  }, [effectiveSlugs, router, searchParams]);

  // Fetch comparison data from /api/compare
  const {
    data: compareData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["compare-data", effectiveSlugs.join(",")],
    queryFn: () => api.getCompare(effectiveSlugs),
    enabled: effectiveSlugs.length >= 2,
  });

  // Fetch all models for the selector
  const { data: allModelsData } = useQuery({
    queryKey: ["all-models-list"],
    queryFn: () => api.getModels({ limit: 100 }),
  });

  const models = compareData?.models || [];
  const benchmarks = compareData?.benchmarks || [];

  const handleAddModel = (slug: string) => {
    addSlug(slug);
    const updated = Array.from(new Set([...effectiveSlugs, slug])).slice(0, 4);
    router.replace(`/compare?models=${updated.join(",")}`, { scroll: false });
  };

  const handleRemoveModel = (slug: string) => {
    removeSlug(slug);
    const updated = effectiveSlugs.filter((s) => s.toLowerCase() !== slug.toLowerCase());
    router.replace(`/compare?models=${updated.join(",")}`, { scroll: false });
  };

  const handleClear = () => {
    clearSlugs();
    router.replace(`/compare?models=openai-gpt-4o,anthropic-claude-3-5-sonnet`, { scroll: false });
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Build Recharts comparison dataset
  const chartData = benchmarks.map((bm) => {
    const row: Record<string, string | number> = {
      benchmark: bm.name,
      unit: bm.metricUnit,
    };
    models.forEach((m) => {
      const bs = m.benchmarkScores.find((s) => s.benchmark.slug === bm.slug);
      row[m.name] = bs ? bs.score : 0;
    });
    return row;
  });

  return (
    <div className="container py-8 space-y-8 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <Scale className="h-4 w-4" />
            <span>Side-by-Side Analysis</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Compare AI Models</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Evaluate specifications, pricing, benchmarks, and capabilities across 2 to 4 frontier models.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <ModelSelector
            availableModels={allModelsData?.items || []}
            selectedSlugs={effectiveSlugs}
            onAddSlug={handleAddModel}
            disabled={effectiveSlugs.length >= 4}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-1.5 text-xs h-9"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span>Share URL</span>
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="gap-1.5 text-xs h-9 text-muted-foreground hover:text-foreground"
            title="Reset to default comparison"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      ) : isError || models.length < 2 ? (
        <ErrorState
          title="Comparison Failed"
          message="Could not compare the selected models. Make sure at least 2 valid model slugs are provided."
          onRetry={() => refetch()}
        />
      ) : (
        <div className="space-y-10">
          {/* 1. Comparison Table */}
          <CompareTable
            models={models}
            benchmarks={benchmarks}
            onRemoveModel={handleRemoveModel}
          />

          {/* 2. Recharts Multi-Model Benchmark Chart Overlay */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold tracking-tight">
                  Benchmark Score Comparison
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Direct evaluation metrics across standardized tests.
                </p>
              </div>
            </div>

            <div className="h-96 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="benchmark"
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={40}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "currentColor" }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-border bg-popover p-3 shadow-xl text-xs space-y-1.5">
                            <div className="font-semibold text-foreground border-b border-border pb-1">
                              {label}
                            </div>
                            {payload.map((entry, idx) => (
                              <div key={idx} className="flex items-center justify-between gap-4">
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                  <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span>{entry.name}:</span>
                                </span>
                                <span className="font-mono font-bold text-foreground">
                                  {entry.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  {models.map((m, idx) => (
                    <Bar
                      key={m.id}
                      dataKey={m.name}
                      fill={CHART_COLORS[idx % CHART_COLORS.length]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
