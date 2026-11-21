"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Plus, ArrowUpRight, Scale, Sparkles, Cpu } from "lucide-react";
import { ModelListItem } from "@/types";
import { cn, formatContext, formatPrice } from "@/lib/utils";
import { LabAvatar } from "@/components/shared/lab-avatar";
import { CapabilityBadge } from "@/components/shared/capability-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCompareStore } from "@/hooks/use-compare";

export interface ModelCardProps {
  model: ModelListItem;
  className?: string;
}

export function ModelCard({ model, className }: ModelCardProps) {
  const router = useRouter();
  const { hasSlug, addSlug, removeSlug } = useCompareStore();
  const isCompared = hasSlug(model.slug);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCompared) {
      removeSlug(model.slug);
    } else {
      addSlug(model.slug);
    }
  };

  // Find featured benchmark score (Arena Elo or MMLU)
  const eloScore = model.benchmarkScores.find(
    (b) => b.benchmark?.slug === "arena-elo" || b.benchmark?.name?.includes("Arena")
  );
  const mmluScore = model.benchmarkScores.find(
    (b) => b.benchmark?.slug === "mmlu"
  );
  const primaryScore = eloScore || mmluScore || model.benchmarkScores[0];

  return (
    <div
      onMouseEnter={() => router.prefetch(`/models/${model.slug}`)}
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md",
        model.isFeatured && "border-primary/30 bg-gradient-to-b from-card to-primary/[0.02]",
        className
      )}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <LabAvatar name={model.lab.name} color={model.lab.color} size="md" />
            <div className="min-w-0">
              <Link
                href={`/labs/${model.lab.slug}`}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium block truncate"
              >
                {model.lab.name}
              </Link>
              <h3 className="text-base font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                <Link href={`/models/${model.slug}`}>
                  {model.name}
                </Link>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {model.isFeatured && (
              <Badge variant="accent" className="gap-1 text-[10px] px-1.5 py-0 font-medium">
                <Sparkles className="h-3 w-3" />
                Featured
              </Badge>
            )}
            <Badge
              variant={model.license === "open" ? "success" : "secondary"}
              className="text-[10px] px-1.5 py-0 uppercase tracking-wider"
            >
              {model.license}
            </Badge>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {model.description}
        </p>

        {/* Capabilities Chips */}
        {model.capabilities.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            {model.capabilities.slice(0, 3).map(({ capability }) => (
              <CapabilityBadge
                key={capability.id}
                slug={capability.slug}
                name={capability.name}
                compact
              />
            ))}
            {model.capabilities.length > 3 && (
              <span className="text-[10px] text-muted-foreground font-mono">
                +{model.capabilities.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <div>
        {/* Specs Metric Row */}
        <div className="grid grid-cols-3 gap-2 rounded-lg border border-border/60 bg-muted/30 p-2.5 mb-4 text-center">
          <div>
            <span className="block text-[10px] uppercase font-medium text-muted-foreground">
              Context
            </span>
            <span className="font-mono text-xs font-semibold text-foreground">
              {formatContext(model.contextWindow)}
            </span>
          </div>

          <div>
            <span className="block text-[10px] uppercase font-medium text-muted-foreground">
              Input / 1M
            </span>
            <span className="font-mono text-xs font-semibold text-foreground">
              {formatPrice(model.inputPricePerM)}
            </span>
          </div>

          <div>
            <span className="block text-[10px] uppercase font-medium text-muted-foreground">
              {primaryScore ? primaryScore.benchmark.name : "Params"}
            </span>
            <span className="font-mono text-xs font-semibold text-primary">
              {primaryScore
                ? `${primaryScore.score}${primaryScore.benchmark.metricUnit === "%" ? "%" : ""}`
                : model.parameters || "N/A"}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
          <Button
            type="button"
            variant={isCompared ? "secondary" : "ghost"}
            size="sm"
            onClick={handleCompareClick}
            className={cn(
              "h-8 gap-1.5 text-xs font-medium px-2.5",
              isCompared && "bg-primary/10 text-primary border border-primary/20"
            )}
          >
            {isCompared ? (
              <>
                <Check className="h-3.5 w-3.5 text-primary" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Scale className="h-3.5 w-3.5 opacity-70" />
                <span>Compare</span>
              </>
            )}
          </Button>

          <Button asChild variant="outline" size="sm" className="h-8 gap-1 text-xs">
            <Link href={`/models/${model.slug}`}>
              <span>Details</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
