"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Plus, ArrowUpRight, Scale, Sparkles } from "lucide-react";
import { ModelListItem } from "@/types";
import { LabAvatar } from "@/components/shared/lab-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCompareStore } from "@/hooks/use-compare";
import { formatContext, formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ModelTableProps {
  models: ModelListItem[];
}

export function ModelTable({ models }: ModelTableProps) {
  const router = useRouter();
  const { hasSlug, addSlug, removeSlug } = useCompareStore();

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
            <th className="py-3 px-4">Model & Lab</th>
            <th className="py-3 px-3">Type</th>
            <th className="py-3 px-3">License</th>
            <th className="py-3 px-3">Context</th>
            <th className="py-3 px-3">Prompt / 1M</th>
            <th className="py-3 px-3">Completion / 1M</th>
            <th className="py-3 px-3">Arena / MMLU</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {models.map((model) => {
            const isCompared = hasSlug(model.slug);
            const elo = model.benchmarkScores.find(
              (b) => b.benchmark?.slug === "arena-elo" || b.benchmark?.name?.includes("Arena")
            );
            const mmlu = model.benchmarkScores.find(
              (b) => b.benchmark?.slug === "mmlu"
            );
            const score = elo || mmlu || model.benchmarkScores[0];

            return (
              <tr
                key={model.id}
                onMouseEnter={() => router.prefetch(`/models/${model.slug}`)}
                className="group hover:bg-muted/40 transition-colors"
              >
                {/* 1. Name & Lab */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <LabAvatar name={model.lab?.name || "AI Lab"} color={model.lab?.color} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/models/${model.slug}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors truncate"
                        >
                          {model.name}
                        </Link>
                        {model.isFeatured && (
                          <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
                        )}
                      </div>
                      <Link
                        href={`/labs/${model.lab?.slug || ""}`}
                        className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {model.lab?.name || "AI Lab"}
                      </Link>
                    </div>
                  </div>
                </td>

                {/* 2. Type */}
                <td className="py-3.5 px-3 capitalize text-muted-foreground">
                  {model.modelType}
                </td>

                {/* 3. License */}
                <td className="py-3.5 px-3">
                  <Badge
                    variant={model.license === "open" ? "success" : "secondary"}
                    className="text-[10px] uppercase font-mono px-1.5 py-0"
                  >
                    {model.license}
                  </Badge>
                </td>

                {/* 4. Context */}
                <td className="py-3.5 px-3 font-mono text-foreground font-medium">
                  {formatContext(model.contextWindow)}
                </td>

                {/* 5. Input Price */}
                <td className="py-3.5 px-3 font-mono text-foreground font-medium">
                  {formatPrice(model.inputPricePerM)}
                </td>

                {/* 6. Output Price */}
                <td className="py-3.5 px-3 font-mono text-muted-foreground">
                  {formatPrice(model.outputPricePerM)}
                </td>

                {/* 7. Benchmark Score */}
                <td className="py-3.5 px-3 font-mono font-semibold text-primary">
                  {score ? (
                    <span>
                      {score.score}
                      {score.benchmark?.metricUnit === "%" ? "%" : ""}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>

                {/* 8. Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant={isCompared ? "secondary" : "ghost"}
                      size="icon"
                      className={cn(
                        "h-7 w-7",
                        isCompared && "bg-primary/10 text-primary border border-primary/20"
                      )}
                      onClick={() =>
                        isCompared ? removeSlug(model.slug) : addSlug(model.slug)
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
                      <Link href={`/models/${model.slug}`} title="View model details">
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
  );
}
