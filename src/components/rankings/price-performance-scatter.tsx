"use client";

import * as React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import { LeaderboardItem, Benchmark } from "@/types";
import { formatPrice } from "@/lib/utils";

interface PricePerformanceScatterProps {
  items: LeaderboardItem[];
  benchmark: Benchmark;
}

export function PricePerformanceScatter({ items, benchmark }: PricePerformanceScatterProps) {
  if (!items || items.length === 0) return null;

  // Transform data for scatter plot: X = Blended Price ($/1M), Y = Score
  const data = items.map((item) => {
    const m = item.model || (item as any);
    const inPrice = m.inputPricePerM ?? (item as any).inputPricePerM ?? 1;
    const outPrice = m.outputPricePerM ?? (item as any).outputPricePerM ?? 1;
    const price = +(inPrice + outPrice).toFixed(3);
    const labName = m.lab?.name ?? (item as any).lab?.name ?? "AI Lab";
    const labColor = m.lab?.color ?? (item as any).lab?.color ?? "#3b82f6";
    const modelName = m.name ?? (item as any).name ?? "Model";
    const license = m.license ?? (item as any).license ?? "open";

    return {
      name: modelName,
      labName,
      price: Math.max(0.01, price),
      score: item.score,
      valueScore: item.valueScore,
      color: labColor,
      license,
    };
  });

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-base font-semibold tracking-tight">
              Price vs. Performance Frontier
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Evaluating {benchmark.name} score relative to blended token pricing ($/1M tokens). Top-left quadrant represents maximum cost efficiency.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Open Weights
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Proprietary
          </span>
        </div>
      </div>

      <div className="h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis
              type="number"
              dataKey="price"
              name="Price"
              unit=" $"
              tick={{ fontSize: 11, fill: "currentColor" }}
              domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
            />
            <YAxis
              type="number"
              dataKey="score"
              name="Score"
              tick={{ fontSize: 11, fill: "currentColor" }}
              domain={[(dataMin: number) => Math.floor(dataMin * 0.9), (dataMax: number) => Math.ceil(dataMax * 1.05)]}
            />
            <ZAxis range={[60, 60]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-border bg-popover p-3 shadow-xl text-xs space-y-1">
                      <div className="font-bold text-foreground">{pt.name}</div>
                      <div className="text-[11px] text-muted-foreground">by {pt.labName}</div>
                      <div className="pt-1 flex items-center justify-between gap-4 font-mono">
                        <span className="text-muted-foreground">Score:</span>
                        <span className="font-bold text-primary">{pt.score} {benchmark.metricUnit}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 font-mono">
                        <span className="text-muted-foreground">Blended Price:</span>
                        <span className="font-bold">{formatPrice(pt.price)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 font-mono text-emerald-500 font-semibold">
                        <span>Value Score:</span>
                        <span>{pt.valueScore} pts/$</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter
              name="Models"
              data={data}
              fill="hsl(var(--primary))"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
