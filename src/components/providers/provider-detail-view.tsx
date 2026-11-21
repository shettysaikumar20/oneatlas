"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ExternalLink,
  Server,
  Zap,
  Clock,
  Activity,
  Search,
  ArrowRight,
  ShieldCheck,
  Coins,
} from "lucide-react";
import { api } from "@/lib/api";
import { LabAvatar } from "@/components/shared/lab-avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import {
  formatPrice,
  formatContext,
  formatLatency,
  formatThroughput,
} from "@/lib/utils";

interface ProviderDetailViewProps {
  slug: string;
}

export function ProviderDetailView({ slug }: ProviderDetailViewProps) {
  const [search, setSearch] = React.useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["provider", slug],
    queryFn: () => api.getProvider(slug),
  });

  const provider = data?.provider;
  const models = provider?.models || [];

  const filteredModels = React.useMemo(() => {
    const list = provider?.models || [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (mp) =>
        mp.model.name.toLowerCase().includes(q) ||
        mp.model.slug.toLowerCase().includes(q) ||
        mp.model.lab.name.toLowerCase().includes(q)
    );
  }, [provider?.models, search]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !provider) {
    return (
      <ErrorState
        title="Provider Not Found"
        message={`We could not find an inference provider with slug "${slug}".`}
        onRetry={() => refetch()}
      />
    );
  }

  // Calculate provider averages
  const count = models.length;
  const avgLatency =
    count > 0 ? Math.round(models.reduce((a, m) => a + m.latencyMs, 0) / count) : 0;
  const avgThroughput =
    count > 0 ? Math.round(models.reduce((a, m) => a + m.throughput, 0) / count) : 0;
  const avgUptime =
    count > 0
      ? +(models.reduce((a, m) => a + m.uptimePercent, 0) / count).toFixed(2)
      : 99.9;

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground hover:text-foreground">
          <Link href="/providers">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Providers Directory
          </Link>
        </Button>
      </div>

      {/* Provider Header Profile */}
      <div className="relative overflow-hidden rounded-2xl border bg-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold font-mono text-2xl shadow-sm shrink-0">
              {provider.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{provider.name}</h1>
                <Badge variant="outline" className="font-mono text-xs">
                  {provider.slug}
                </Badge>
              </div>

              {provider.websiteUrl && (
                <a
                  href={provider.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1.5 mt-1 font-medium"
                >
                  <span>{provider.websiteUrl.replace(/^https?:\/\//, "")}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <p className="text-sm text-muted-foreground mt-3 max-w-3xl leading-relaxed">
                {provider.description || "High-performance inference API platform providing hosted LLM endpoints."}
              </p>
            </div>
          </div>

          {/* Quick Telemetry Strip */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-muted/40 border border-border/50 text-center font-mono shrink-0">
            <div>
              <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground mb-1">
                <Clock className="w-3 h-3 text-amber-500" />
                <span>Avg Latency</span>
              </div>
              <span className="text-sm font-bold">{formatLatency(avgLatency)}</span>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground mb-1">
                <Zap className="w-3 h-3 text-primary" />
                <span>Throughput</span>
              </div>
              <span className="text-sm font-bold">{formatThroughput(avgThroughput)}</span>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground mb-1">
                <Activity className="w-3 h-3 text-emerald-500" />
                <span>Avg SLA</span>
              </div>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {avgUptime}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Models Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Supported Models ({models.length})</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Available models hosted on {provider.name} with live token rates and benchmarked performance.
            </p>
          </div>

          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hosted models..."
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        {/* Table of Models */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 text-xs text-muted-foreground uppercase font-mono border-b">
                <tr>
                  <th className="py-3 px-4">Model</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Context</th>
                  <th className="py-3 px-4">Input / 1M</th>
                  <th className="py-3 px-4">Output / 1M</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Throughput</th>
                  <th className="py-3 px-4">Uptime</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredModels.map((item) => {
                  const m = item.model;
                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <LabAvatar
                            name={m.lab.name}
                            color={m.lab.color}
                            size="sm"
                          />
                          <div>
                            <Link
                              href={`/models/${m.slug}`}
                              className="font-medium text-foreground hover:text-primary transition-colors block"
                            >
                              {m.name}
                            </Link>
                            <span className="text-xs text-muted-foreground">{m.lab.name}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[11px] capitalize">
                          {m.modelType}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                        {formatContext(m.contextWindow)}
                      </td>

                      <td className="py-3 px-4 font-mono text-xs font-semibold text-foreground">
                        {formatPrice(item.inputPricePerM)}
                      </td>

                      <td className="py-3 px-4 font-mono text-xs font-semibold text-foreground">
                        {formatPrice(item.outputPricePerM)}
                      </td>

                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-500" />
                          {formatLatency(item.latencyMs)}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-xs font-semibold text-primary">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {formatThroughput(item.throughput)}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-xs text-emerald-600 dark:text-emerald-400">
                        {item.uptimePercent}%
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" asChild className="h-8 text-xs">
                          <Link href={`/models/${m.slug}`}>
                            Details &rarr;
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredModels.length === 0 && (
            <div className="text-center py-12 text-sm text-muted-foreground">
              No models match your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
