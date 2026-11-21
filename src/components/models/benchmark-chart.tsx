"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { BenchmarkScore } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface BenchmarkChartProps {
  scores: BenchmarkScore[];
}

export function BenchmarkChart({ scores }: BenchmarkChartProps) {
  const [chartType, setChartType] = React.useState<"bar" | "radar">("bar");

  if (!scores || scores.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
        No benchmark scores available for this model.
      </div>
    );
  }

  // Transform scores for charts
  const data = scores.map((s) => ({
    name: s.benchmark.name,
    slug: s.benchmark.slug,
    score: s.score,
    maxScore: s.benchmark.maxScore || 100,
    unit: s.benchmark.metricUnit,
    category: s.benchmark.category,
    // Normalized score for radar chart (0-100)
    normalizedScore:
      s.benchmark.slug === "arena-elo"
        ? Math.min(100, Math.max(0, ((s.score - 1000) / 400) * 100))
        : s.score,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold tracking-tight">Evaluations & Benchmarks</h4>
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setChartType("bar")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              chartType === "bar"
                ? "bg-primary text-primary-foreground font-semibold"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Bar Chart
          </button>
          <button
            type="button"
            onClick={() => setChartType("radar")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              chartType === "radar"
                ? "bg-primary text-primary-foreground font-semibold"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Radar View
          </button>
        </div>
      </div>

      <div className="h-80 w-full rounded-xl border border-border bg-card/60 p-4 shadow-sm">
        {chartType === "bar" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "currentColor" }}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={50}
              />
              <YAxis
                domain={[0, (dataMax: number) => (dataMax > 100 ? 1400 : 100)]}
                tick={{ fontSize: 11, fill: "currentColor" }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-border bg-popover p-2.5 shadow-lg text-xs">
                        <div className="font-semibold text-foreground">{item.name}</div>
                        <div className="text-[11px] text-muted-foreground mb-1">{item.category}</div>
                        <div className="font-mono font-bold text-primary text-sm">
                          {item.score} {item.unit}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid opacity={0.2} />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: "currentColor" }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar
                name="Score"
                dataKey="normalizedScore"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.4}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-border bg-popover p-2 shadow-md text-xs font-medium">
                        <div>{item.name}</div>
                        <div className="font-mono text-primary font-bold">
                          {item.score} {item.unit}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
