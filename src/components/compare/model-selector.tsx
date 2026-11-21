"use client";

import * as React from "react";
import { Plus, Search, Check, Sparkles } from "lucide-react";
import { ModelListItem } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LabAvatar } from "@/components/shared/lab-avatar";
import { formatPrice } from "@/lib/utils";

interface ModelSelectorProps {
  availableModels: ModelListItem[];
  selectedSlugs: string[];
  onAddSlug: (slug: string) => void;
  disabled?: boolean;
}

export function ModelSelector({
  availableModels,
  selectedSlugs,
  onAddSlug,
  disabled = false,
}: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filtered = availableModels.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.slug.toLowerCase().includes(search.toLowerCase()) ||
      m.lab.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (slug: string) => {
    onAddSlug(slug);
    setOpen(false);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || selectedSlugs.length >= 4}
          className="gap-1.5 text-xs h-9"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Model {selectedSlugs.length < 4 ? `(${selectedSlugs.length}/4)` : "(Max 4)"}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-border">
          <DialogTitle className="text-base">Select Model to Compare</DialogTitle>
        </DialogHeader>

        <div className="p-3 border-b border-border bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by model or lab..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-xs outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto p-2 divide-y divide-border/50">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No matching models found.
            </div>
          ) : (
            filtered.map((m) => {
              const isSelected = selectedSlugs.includes(m.slug.toLowerCase());
              return (
                <button
                  key={m.id}
                  onClick={() => !isSelected && handleSelect(m.slug)}
                  disabled={isSelected}
                  className="flex w-full items-center justify-between p-2 rounded-md hover:bg-muted text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <LabAvatar name={m.lab.name} color={m.lab.color} size="sm" />
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground truncate">{m.name}</div>
                      <div className="text-[11px] text-muted-foreground">{m.lab.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-muted-foreground">
                      {formatPrice(m.inputPricePerM)}
                    </span>
                    {isSelected ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3 w-3" />
                      </span>
                    ) : (
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
