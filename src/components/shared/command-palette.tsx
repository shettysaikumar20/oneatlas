"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Search,
  Sparkles,
  Building2,
  Server,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { GlobalSearchResult } from "@/types";
import { formatContext, formatPrice } from "@/lib/utils";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<GlobalSearchResult>({
    models: [],
    labs: [],
    providers: [],
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  // Handle Cmd+K / Ctrl+K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Debounced search
  React.useEffect(() => {
    if (!open) return;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await api.searchGlobal(query);
        setResults(data);
      } catch (err) {
        console.error("Command palette search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query, open]);

  const handleSelect = (url: string) => {
    setOpen(false);
    setQuery("");
    router.push(url);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-full max-w-[280px] items-center justify-between rounded-md border border-input bg-muted/40 px-3 py-1 text-xs text-muted-foreground transition-all hover:bg-muted/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-64"
        aria-label="Search models and labs (Cmd+K)"
      >
        <div className="flex items-center gap-2">
          <Search className="h-3.5 w-3.5 opacity-60" />
          <span>Search models, labs...</span>
        </div>
        <kbd className="pointer-events-none hidden select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium opacity-80 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 max-w-xl border-border bg-popover shadow-2xl">
          <Command
            className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-1.5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:flex [&_[cmdk-item]]:items-center [&_[cmdk-item]]:gap-2.5 [&_[cmdk-item]]:rounded-md [&_[cmdk-item]]:px-2.5 [&_[cmdk-item]]:py-2 [&_[cmdk-item]]:text-sm [&_[cmdk-item]]:cursor-pointer [&_[cmdk-item][data-selected=true]]:bg-accent [&_[cmdk-item][data-selected=true]]:text-accent-foreground"
            shouldFilter={false}
          >
            <div className="flex items-center border-b border-border px-3.5">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Command.Input
                placeholder="Type a model (e.g. Claude 3.5, GPT-4o, DeepSeek-R1) or lab..."
                value={query}
                onValueChange={setQuery}
                className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
              {isLoading && (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              )}
            </div>

            <Command.List className="max-h-[360px] overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                No matching models, labs, or providers found.
              </Command.Empty>

              {/* Quick links when query is empty */}
              {!query && (
                <Command.Group heading="Quick Navigation">
                  <Command.Item onSelect={() => handleSelect("/models")}>
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                    <span>Explore All Models</span>
                  </Command.Item>
                  <Command.Item onSelect={() => handleSelect("/rankings")}>
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>LMSYS Chatbot Arena Leaderboard</span>
                  </Command.Item>
                  <Command.Item onSelect={() => handleSelect("/compare?models=openai-gpt-4o,anthropic-claude-3-5-sonnet")}>
                    <ArrowRight className="h-4 w-4 text-emerald-500" />
                    <span>Compare GPT-4o vs Claude 3.5 Sonnet</span>
                  </Command.Item>
                </Command.Group>
              )}

              {/* Models */}
              {results.models.length > 0 && (
                <Command.Group heading="AI Models">
                  {results.models.map((model) => (
                    <Command.Item
                      key={model.id}
                      onSelect={() => handleSelect(`/models/${model.slug}`)}
                    >
                      <Sparkles className="h-4 w-4 text-primary shrink-0" />
                      <div className="flex flex-1 items-center justify-between min-w-0">
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-medium text-foreground">{model.name}</span>
                          <span className="text-xs text-muted-foreground">by {model.labName}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground shrink-0">
                          <span>{formatPrice(model.inputPricePerM)}</span>
                          <span>•</span>
                          <span>{formatContext(model.contextWindow)}</span>
                        </div>
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {/* Labs */}
              {results.labs.length > 0 && (
                <Command.Group heading="AI Research Labs">
                  {results.labs.map((lab) => (
                    <Command.Item
                      key={lab.id}
                      onSelect={() => handleSelect(`/labs/${lab.slug}`)}
                    >
                      <Building2 className="h-4 w-4 text-amber-500 shrink-0" />
                      <div className="flex flex-1 items-center justify-between">
                        <span className="font-medium text-foreground">{lab.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {lab.modelCount} models
                        </span>
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {/* Providers */}
              {results.providers.length > 0 && (
                <Command.Group heading="Inference Providers">
                  {results.providers.map((prov) => (
                    <Command.Item
                      key={prov.id}
                      onSelect={() => handleSelect(`/providers/${prov.slug}`)}
                    >
                      <Server className="h-4 w-4 text-emerald-500 shrink-0" />
                      <div className="flex flex-1 items-center justify-between">
                        <span className="font-medium text-foreground">{prov.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {prov.modelCount} models
                        </span>
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
            </Command.List>

            <div className="flex items-center justify-between border-t border-border px-3 py-2 text-[11px] text-muted-foreground bg-muted/20">
              <div className="flex items-center gap-2">
                <span>Use arrows to navigate</span>
                <span>•</span>
                <span>ESC to close</span>
              </div>
              <span className="font-mono text-[10px]">OneAtlas v1.0</span>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
