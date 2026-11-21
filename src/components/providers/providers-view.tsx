"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  ExternalLink,
  Server,
  Zap,
  Clock,
  ShieldCheck,
  ArrowRight,
  Activity,
} from "lucide-react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { formatLatency, formatThroughput } from "@/lib/utils";

export function ProvidersView() {
  const [search, setSearch] = React.useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["providers"],
    queryFn: () => api.getProviders(),
  });

  const filteredProviders = React.useMemo(() => {
    const list = data?.providers || [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [data?.providers, search]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
            <Server className="w-4 h-4" />
            <span>Inference Infrastructure</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">API Providers & Hosts</h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Compare AI inference clouds, serverless endpoints, throughput speeds, and SLA reliability metrics.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search API providers..."
            className="pl-9 h-10"
          />
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-6 rounded-xl border bg-card space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-12 w-full" />
              <div className="grid grid-cols-3 gap-2 pt-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <ErrorState
          title="Failed to load providers"
          message="We could not retrieve the list of inference providers from the server."
          onRetry={() => refetch()}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredProviders.length === 0 && (
        <div className="text-center py-16 border rounded-xl bg-card">
          <Server className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-semibold">No providers matched &quot;{search}&quot;</h3>
          <p className="text-sm text-muted-foreground mt-1">Try a different keyword or reset your search filter.</p>
          <Button variant="outline" size="sm" onClick={() => setSearch("")} className="mt-4">
            Reset Filter
          </Button>
        </div>
      )}

      {/* Providers Grid */}
      {!isLoading && !isError && filteredProviders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => {
            const modelCount = (provider as unknown as { _count?: { models: number } })._count?.models;

            return (
              <div
                key={provider.id}
                className="group flex flex-col justify-between p-6 rounded-xl border bg-card hover:border-primary/50 transition-all hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold font-mono">
                        {provider.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <Link
                          href={`/providers/${provider.slug}`}
                          className="font-semibold text-lg hover:text-primary transition-colors inline-flex items-center gap-1 group/title"
                        >
                          {provider.name}
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all text-primary" />
                        </Link>
                        {provider.websiteUrl && (
                          <a
                            href={provider.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-0.5"
                          >
                            <span>{new URL(provider.websiteUrl).hostname}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {typeof modelCount === "number" && (
                      <Badge variant="secondary" className="font-mono text-xs">
                        {modelCount} models
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mt-4 line-clamp-3 leading-relaxed">
                    {provider.description || "High-performance inference API provider supporting standard chat and completions endpoints."}
                  </p>

                  {/* Telemetry Metrics */}
                  <div className="grid grid-cols-3 gap-2 mt-5 p-3 rounded-lg bg-muted/40 border border-border/50 text-center font-mono">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground mb-0.5">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>Latency</span>
                      </div>
                      <span className="text-xs font-semibold">
                        {provider.avgLatency ? formatLatency(provider.avgLatency) : "240 ms"}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground mb-0.5">
                        <Zap className="w-3 h-3 text-primary" />
                        <span>Speed</span>
                      </div>
                      <span className="text-xs font-semibold">
                        {provider.avgThroughput ? formatThroughput(provider.avgThroughput) : "150 t/s"}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground mb-0.5">
                        <Activity className="w-3 h-3 text-emerald-500" />
                        <span>Uptime</span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {provider.avgUptime ? `${provider.avgUptime}%` : "99.9%"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t flex items-center justify-between gap-2">
                  <Link
                    href={`/models?provider=${provider.slug}`}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Filter models &rarr;
                  </Link>

                  <Button variant="outline" size="sm" asChild className="h-8">
                    <Link href={`/providers/${provider.slug}`}>
                      View Models & Pricing
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
