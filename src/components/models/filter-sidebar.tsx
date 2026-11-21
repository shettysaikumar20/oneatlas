"use client";

import * as React from "react";
import { Check, RotateCcw, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { ModelFacets } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LabAvatar } from "@/components/shared/lab-avatar";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  facets?: ModelFacets;
  selectedLabs: string[];
  selectedProviders: string[];
  selectedCapabilities: string[];
  selectedModelTypes: string[];
  selectedLicense?: "open" | "closed";
  minPrice?: number;
  maxPrice?: number;
  minContext?: number;
  maxContext?: number;
  onToggleLab: (slug: string) => void;
  onToggleProvider: (slug: string) => void;
  onToggleCapability: (slug: string) => void;
  onToggleModelType: (type: string) => void;
  onSetLicense: (lic: "open" | "closed" | undefined) => void;
  onSetPriceRange: (min?: number, max?: number) => void;
  onSetContextRange: (min?: number, max?: number) => void;
  onClearAll: () => void;
  className?: string;
}

export function FilterSidebar({
  facets,
  selectedLabs,
  selectedProviders,
  selectedCapabilities,
  selectedModelTypes,
  selectedLicense,
  minPrice,
  maxPrice,
  minContext,
  maxContext,
  onToggleLab,
  onToggleProvider,
  onToggleCapability,
  onToggleModelType,
  onSetLicense,
  onSetPriceRange,
  onSetContextRange,
  onClearAll,
  className,
}: FilterSidebarProps) {
  const [labsExpanded, setLabsExpanded] = React.useState(false);
  const [capsExpanded, setCapsExpanded] = React.useState(false);
  const [provsExpanded, setProvsExpanded] = React.useState(false);

  const displayedLabs = labsExpanded
    ? facets?.labs || []
    : (facets?.labs || []).slice(0, 6);

  const displayedCaps = capsExpanded
    ? facets?.capabilities || []
    : (facets?.capabilities || []).slice(0, 5);

  const displayedProvs = provsExpanded
    ? facets?.providers || []
    : (facets?.providers || []).slice(0, 5);

  const hasAnyFilter =
    selectedLabs.length > 0 ||
    selectedProviders.length > 0 ||
    selectedCapabilities.length > 0 ||
    selectedModelTypes.length > 0 ||
    selectedLicense !== undefined ||
    minPrice !== undefined ||
    maxPrice !== undefined ||
    minContext !== undefined ||
    maxContext !== undefined;

  return (
    <aside className={cn("space-y-6 text-sm", className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2 font-semibold">
          <Filter className="h-4 w-4 text-primary" />
          <span>Filters</span>
        </div>
        {hasAnyFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-7 text-xs text-muted-foreground hover:text-foreground px-2 gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      {/* 1. LICENSE (OPEN VS CLOSED) */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          License
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => onSetLicense(selectedLicense === "open" ? undefined : "open")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-md border py-1.5 text-xs font-medium transition-colors",
              selectedLicense === "open"
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground"
            )}
          >
            {selectedLicense === "open" && <Check className="h-3 w-3" />}
            <span>Open Weights</span>
          </button>
          <button
            type="button"
            onClick={() => onSetLicense(selectedLicense === "closed" ? undefined : "closed")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-md border py-1.5 text-xs font-medium transition-colors",
              selectedLicense === "closed"
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground"
            )}
          >
            {selectedLicense === "closed" && <Check className="h-3 w-3" />}
            <span>Proprietary</span>
          </button>
        </div>
      </div>

      {/* 2. MODEL TYPE */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Model Type
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {["chat", "multimodal", "code", "embedding"].map((type) => {
            const isSelected = selectedModelTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => onToggleModelType(type)}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs capitalize transition-colors",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground"
                )}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PRICE RANGE PRESETS */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Input Price / 1M Tokens
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => {
              if (minPrice === 0 && maxPrice === 0) onSetPriceRange(undefined, undefined);
              else onSetPriceRange(0, 0);
            }}
            className={cn(
              "rounded-md border py-1 px-2 text-xs text-center transition-colors font-mono",
              minPrice === 0 && maxPrice === 0
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            Free Only
          </button>
          <button
            type="button"
            onClick={() => {
              if (maxPrice === 0.5) onSetPriceRange(undefined, undefined);
              else onSetPriceRange(0, 0.5);
            }}
            className={cn(
              "rounded-md border py-1 px-2 text-xs text-center transition-colors font-mono",
              maxPrice === 0.5
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            &lt; $0.50
          </button>
          <button
            type="button"
            onClick={() => {
              if (maxPrice === 2.0) onSetPriceRange(undefined, undefined);
              else onSetPriceRange(0, 2.0);
            }}
            className={cn(
              "rounded-md border py-1 px-2 text-xs text-center transition-colors font-mono",
              maxPrice === 2.0
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            &lt; $2.00
          </button>
          <button
            type="button"
            onClick={() => {
              if (minPrice === 5.0) onSetPriceRange(undefined, undefined);
              else onSetPriceRange(5.0, undefined);
            }}
            className={cn(
              "rounded-md border py-1 px-2 text-xs text-center transition-colors font-mono",
              minPrice === 5.0
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            $5.00+
          </button>
        </div>
      </div>

      {/* 4. CONTEXT WINDOW PRESETS */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Context Window
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => {
              if (minContext === 32768) onSetContextRange(undefined, undefined);
              else onSetContextRange(32768, undefined);
            }}
            className={cn(
              "rounded-md border py-1 px-2 text-xs text-center transition-colors font-mono",
              minContext === 32768
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            32K+
          </button>
          <button
            type="button"
            onClick={() => {
              if (minContext === 128000) onSetContextRange(undefined, undefined);
              else onSetContextRange(128000, undefined);
            }}
            className={cn(
              "rounded-md border py-1 px-2 text-xs text-center transition-colors font-mono",
              minContext === 128000
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            128K+
          </button>
          <button
            type="button"
            onClick={() => {
              if (minContext === 200000) onSetContextRange(undefined, undefined);
              else onSetContextRange(200000, undefined);
            }}
            className={cn(
              "rounded-md border py-1 px-2 text-xs text-center transition-colors font-mono",
              minContext === 200000
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            200K+
          </button>
          <button
            type="button"
            onClick={() => {
              if (minContext === 1048576) onSetContextRange(undefined, undefined);
              else onSetContextRange(1048576, undefined);
            }}
            className={cn(
              "rounded-md border py-1 px-2 text-xs text-center transition-colors font-mono",
              minContext === 1048576
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            1M+
          </button>
        </div>
      </div>

      {/* 5. AI LABS */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          AI Labs
        </h4>
        <div className="space-y-1">
          {displayedLabs.map((l) => {
            const isSelected = selectedLabs.includes(l.slug.toLowerCase());
            return (
              <label
                key={l.slug}
                className="flex items-center justify-between py-1 px-1.5 rounded-md hover:bg-muted/50 cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleLab(l.slug)}
                    className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                  <span className="truncate text-foreground font-medium">{l.name}</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {l.count}
                </span>
              </label>
            );
          })}
        </div>
        {(facets?.labs || []).length > 6 && (
          <button
            type="button"
            onClick={() => setLabsExpanded(!labsExpanded)}
            className="flex items-center gap-1 text-[11px] text-primary hover:underline font-medium pt-1"
          >
            {labsExpanded ? (
              <>
                <ChevronUp className="h-3 w-3" /> Show fewer
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" /> Show all ({(facets?.labs || []).length})
              </>
            )}
          </button>
        )}
      </div>

      {/* 6. CAPABILITIES */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Capabilities
        </h4>
        <div className="space-y-1">
          {displayedCaps.map((c) => {
            const isSelected = selectedCapabilities.includes(c.slug.toLowerCase());
            return (
              <label
                key={c.slug}
                className="flex items-center justify-between py-1 px-1.5 rounded-md hover:bg-muted/50 cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleCapability(c.slug)}
                    className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                  <span className="truncate text-foreground font-medium">{c.name}</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {c.count}
                </span>
              </label>
            );
          })}
        </div>
        {(facets?.capabilities || []).length > 5 && (
          <button
            type="button"
            onClick={() => setCapsExpanded(!capsExpanded)}
            className="flex items-center gap-1 text-[11px] text-primary hover:underline font-medium pt-1"
          >
            {capsExpanded ? (
              <>
                <ChevronUp className="h-3 w-3" /> Show fewer
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" /> Show all ({(facets?.capabilities || []).length})
              </>
            )}
          </button>
        )}
      </div>

      {/* 7. PROVIDERS */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Providers
        </h4>
        <div className="space-y-1">
          {displayedProvs.map((p) => {
            const isSelected = selectedProviders.includes(p.slug.toLowerCase());
            return (
              <label
                key={p.slug}
                className="flex items-center justify-between py-1 px-1.5 rounded-md hover:bg-muted/50 cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleProvider(p.slug)}
                    className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                  <span className="truncate text-foreground font-medium">{p.name}</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {p.count}
                </span>
              </label>
            );
          })}
        </div>
        {(facets?.providers || []).length > 5 && (
          <button
            type="button"
            onClick={() => setProvsExpanded(!provsExpanded)}
            className="flex items-center gap-1 text-[11px] text-primary hover:underline font-medium pt-1"
          >
            {provsExpanded ? (
              <>
                <ChevronUp className="h-3 w-3" /> Show fewer
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" /> Show all ({(facets?.providers || []).length})
              </>
            )}
          </button>
        )}
      </div>
    </aside>
  );
}
