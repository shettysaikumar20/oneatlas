"use client";

import * as React from "react";
import { X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatContext, formatPrice } from "@/lib/utils";

interface FilterChipsProps {
  filters: {
    q: string;
    lab: string[];
    provider: string[];
    capability: string[];
    modelType: string[];
    license?: "open" | "closed";
    minPrice?: number;
    maxPrice?: number;
    minContext?: number;
    maxContext?: number;
  };
  onRemoveLab: (slug: string) => void;
  onRemoveProvider: (slug: string) => void;
  onRemoveCapability: (slug: string) => void;
  onRemoveModelType: (type: string) => void;
  onRemoveLicense: () => void;
  onRemovePrice: () => void;
  onRemoveContext: () => void;
  onRemoveQuery: () => void;
  onClearAll: () => void;
}

export function FilterChips({
  filters,
  onRemoveLab,
  onRemoveProvider,
  onRemoveCapability,
  onRemoveModelType,
  onRemoveLicense,
  onRemovePrice,
  onRemoveContext,
  onRemoveQuery,
  onClearAll,
}: FilterChipsProps) {
  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  if (filters.q) {
    chips.push({
      key: `q-${filters.q}`,
      label: `"${filters.q}"`,
      onRemove: onRemoveQuery,
    });
  }

  filters.lab.forEach((slug) => {
    chips.push({
      key: `lab-${slug}`,
      label: `Lab: ${slug}`,
      onRemove: () => onRemoveLab(slug),
    });
  });

  filters.provider.forEach((slug) => {
    chips.push({
      key: `prov-${slug}`,
      label: `Provider: ${slug}`,
      onRemove: () => onRemoveProvider(slug),
    });
  });

  filters.capability.forEach((slug) => {
    chips.push({
      key: `cap-${slug}`,
      label: `Capability: ${slug}`,
      onRemove: () => onRemoveCapability(slug),
    });
  });

  filters.modelType.forEach((type) => {
    chips.push({
      key: `type-${type}`,
      label: `Type: ${type}`,
      onRemove: () => onRemoveModelType(type),
    });
  });

  if (filters.license) {
    chips.push({
      key: `lic-${filters.license}`,
      label: `License: ${filters.license}`,
      onRemove: onRemoveLicense,
    });
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const minStr = filters.minPrice !== undefined ? formatPrice(filters.minPrice) : "$0";
    const maxStr = filters.maxPrice !== undefined ? formatPrice(filters.maxPrice) : "$60+";
    chips.push({
      key: "price-range",
      label: `Price: ${minStr} - ${maxStr}`,
      onRemove: onRemovePrice,
    });
  }

  if (filters.minContext !== undefined || filters.maxContext !== undefined) {
    const minC = filters.minContext !== undefined ? formatContext(filters.minContext) : "0";
    const maxC = filters.maxContext !== undefined ? formatContext(filters.maxContext) : "2M+";
    chips.push({
      key: "context-range",
      label: `Context: ${minC} - ${maxC}`,
      onRemove: onRemoveContext,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-1">
      <span className="text-xs text-muted-foreground mr-1">Active filters:</span>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/60 pl-2 pr-1.5 py-0.5 text-xs font-medium text-foreground transition-colors hover:border-border/80"
        >
          <span>{chip.label}</span>
          <button
            onClick={chip.onRemove}
            className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`Remove filter ${chip.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-6 gap-1 text-[11px] text-muted-foreground hover:text-foreground px-2"
      >
        <RotateCcw className="h-3 w-3" />
        <span>Clear all</span>
      </Button>
    </div>
  );
}
