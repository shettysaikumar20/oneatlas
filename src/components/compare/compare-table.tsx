"use client";

import * as React from "react";
import Link from "next/link";
import { Check, X, Trophy, DollarSign, Maximize2, Trash2, ArrowUpRight } from "lucide-react";
import { ModelDetail, Benchmark } from "@/types";
import { LabAvatar } from "@/components/shared/lab-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatContext, formatPrice, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CompareTableProps {
  models: ModelDetail[];
  benchmarks: Benchmark[];
  onRemoveModel: (slug: string) => void;
}

export function CompareTable({
  models,
  benchmarks,
  onRemoveModel,
}: CompareTableProps) {
  if (models.length === 0) return null;

  // Best value calculations
  const minInputPrice = Math.min(...models.map((m) => m.inputPricePerM));
  const minOutputPrice = Math.min(...models.map((m) => m.outputPricePerM));
  const maxContext = Math.max(...models.map((m) => m.contextWindow));

  // Best score per benchmark
  const bestScores: Record<string, number> = {};
  benchmarks.forEach((bm) => {
    let best = -Infinity;
    models.forEach((m) => {
      const bs = m.benchmarkScores.find((s) => s.benchmark.slug === bm.slug);
      if (bs && bs.score > best) best = bs.score;
    });
    if (best !== -Infinity) bestScores[bm.slug] = best;
  });

  const coreCapabilities = [
    { slug: "vision", name: "Vision / Multimodal" },
    { slug: "reasoning", name: "Deep Reasoning / CoT" },
    { slug: "tool-calling", name: "Tool / Function Calling" },
    { slug: "json-mode", name: "Structured JSON Mode" },
    { slug: "streaming", name: "Token Streaming" },
    { slug: "code-interpreter", name: "Code Execution" },
    { slug: "caching", name: "Prompt Caching" },
  ];

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="py-4 px-4 w-48 font-semibold text-muted-foreground">
              Metric / Feature
            </th>
            {models.map((model) => (
              <th key={model.id} className="py-4 px-4 min-w-[200px] align-top">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <LabAvatar name={model.lab.name} color={model.lab.color} size="md" />
                    <div>
                      <Link
                        href={`/models/${model.slug}`}
                        className="font-bold text-sm text-foreground hover:text-primary transition-colors block"
                      >
                        {model.name}
                      </Link>
                      <span className="text-[11px] text-muted-foreground">{model.lab.name}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => onRemoveModel(model.slug)}
                    title={`Remove ${model.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {/* SECTION: PRICING */}
          <tr className="bg-muted/20 font-semibold text-foreground">
            <td colSpan={models.length + 1} className="py-2 px-4 text-[11px] uppercase tracking-wider text-muted-foreground">
              Token Pricing (per 1M tokens)
            </td>
          </tr>

          <tr>
            <td className="py-3 px-4 font-medium text-muted-foreground">Input / Prompt Price</td>
            {models.map((m) => {
              const isBest = m.inputPricePerM === minInputPrice && models.length > 1;
              return (
                <td key={m.id} className="py-3 px-4 font-mono font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span>{formatPrice(m.inputPricePerM)}</span>
                    {isBest && (
                      <Badge variant="success" className="text-[10px] px-1 py-0 gap-0.5">
                        <DollarSign className="h-2.5 w-2.5" />
                        Cheapest
                      </Badge>
                    )}
                  </div>
                </td>
              );
            })}
          </tr>

          <tr>
            <td className="py-3 px-4 font-medium text-muted-foreground">Output / Completion Price</td>
            {models.map((m) => {
              const isBest = m.outputPricePerM === minOutputPrice && models.length > 1;
              return (
                <td key={m.id} className="py-3 px-4 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span>{formatPrice(m.outputPricePerM)}</span>
                    {isBest && (
                      <Badge variant="success" className="text-[10px] px-1 py-0 gap-0.5">
                        <DollarSign className="h-2.5 w-2.5" />
                        Cheapest
                      </Badge>
                    )}
                  </div>
                </td>
              );
            })}
          </tr>

          {/* SECTION: SPECIFICATIONS */}
          <tr className="bg-muted/20 font-semibold text-foreground">
            <td colSpan={models.length + 1} className="py-2 px-4 text-[11px] uppercase tracking-wider text-muted-foreground">
              Technical Specifications
            </td>
          </tr>

          <tr>
            <td className="py-3 px-4 font-medium text-muted-foreground">Context Window</td>
            {models.map((m) => {
              const isBest = m.contextWindow === maxContext && models.length > 1;
              return (
                <td key={m.id} className="py-3 px-4 font-mono font-medium">
                  <div className="flex items-center gap-1.5">
                    <span>{formatContext(m.contextWindow)}</span>
                    {isBest && (
                      <Badge variant="accent" className="text-[10px] px-1 py-0 gap-0.5">
                        <Maximize2 className="h-2.5 w-2.5" />
                        Largest
                      </Badge>
                    )}
                  </div>
                </td>
              );
            })}
          </tr>

          <tr>
            <td className="py-3 px-4 font-medium text-muted-foreground">Max Output Tokens</td>
            {models.map((m) => (
              <td key={m.id} className="py-3 px-4 font-mono">
                {m.maxOutputTokens ? formatContext(m.maxOutputTokens) : "8K"}
              </td>
            ))}
          </tr>

          <tr>
            <td className="py-3 px-4 font-medium text-muted-foreground">License</td>
            {models.map((m) => (
              <td key={m.id} className="py-3 px-4 capitalize">
                <Badge variant={m.license === "open" ? "success" : "secondary"}>
                  {m.license}
                </Badge>
              </td>
            ))}
          </tr>

          <tr>
            <td className="py-3 px-4 font-medium text-muted-foreground">Parameters</td>
            {models.map((m) => (
              <td key={m.id} className="py-3 px-4 font-mono">
                {m.parameters || "Confidential"}
              </td>
            ))}
          </tr>

          <tr>
            <td className="py-3 px-4 font-medium text-muted-foreground">Release Date</td>
            {models.map((m) => (
              <td key={m.id} className="py-3 px-4 font-mono text-muted-foreground">
                {formatDate(m.releaseDate)}
              </td>
            ))}
          </tr>

          {/* SECTION: BENCHMARKS */}
          <tr className="bg-muted/20 font-semibold text-foreground">
            <td colSpan={models.length + 1} className="py-2 px-4 text-[11px] uppercase tracking-wider text-muted-foreground">
              Benchmark Scores
            </td>
          </tr>

          {benchmarks.map((bm) => (
            <tr key={bm.id}>
              <td className="py-3 px-4 font-medium text-foreground">
                <span>{bm.name}</span>
                <span className="block text-[10px] text-muted-foreground font-normal">
                  {bm.category} ({bm.metricUnit})
                </span>
              </td>
              {models.map((m) => {
                const bs = m.benchmarkScores.find((s) => s.benchmark.slug === bm.slug);
                const isBest =
                  bs && bestScores[bm.slug] && bs.score === bestScores[bm.slug] && models.length > 1;

                return (
                  <td key={m.id} className="py-3 px-4 font-mono">
                    {bs ? (
                      <div className="flex items-center gap-1.5">
                        <span className={cn("font-medium", isBest && "font-bold text-primary")}>
                          {bs.score} {bm.metricUnit}
                        </span>
                        {isBest && (
                          <Badge variant="accent" className="text-[10px] px-1 py-0 gap-0.5">
                            <Trophy className="h-2.5 w-2.5 text-amber-500" />
                            Best
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}

          {/* SECTION: CAPABILITIES */}
          <tr className="bg-muted/20 font-semibold text-foreground">
            <td colSpan={models.length + 1} className="py-2 px-4 text-[11px] uppercase tracking-wider text-muted-foreground">
              Core Capabilities
            </td>
          </tr>

          {coreCapabilities.map((cap) => (
            <tr key={cap.slug}>
              <td className="py-3 px-4 font-medium text-muted-foreground">{cap.name}</td>
              {models.map((m) => {
                const hasCap = m.capabilities.some(
                  (c) => c.capability.slug.toLowerCase() === cap.slug
                );
                return (
                  <td key={m.id} className="py-3 px-4">
                    {hasCap ? (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Check className="h-3 w-3" />
                      </span>
                    ) : (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground/40">
                        <X className="h-3 w-3" />
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}

          {/* ROW: DETAILS BUTTON */}
          <tr className="bg-muted/10">
            <td className="py-4 px-4 font-medium text-muted-foreground">Full Profile</td>
            {models.map((m) => (
              <td key={m.id} className="py-4 px-4">
                <Button asChild variant="outline" size="sm" className="h-8 gap-1 text-xs">
                  <Link href={`/models/${m.slug}`}>
                    <span>View Model</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
