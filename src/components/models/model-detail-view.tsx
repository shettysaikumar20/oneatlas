"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Check,
  Scale,
  Sparkles,
  Calendar,
  Layers,
  Cpu,
  Share2,
  ExternalLink,
  SlidersHorizontal,
  DollarSign,
  Activity,
  ArrowRight,
  Database,
  Eye,
  Brain,
  Wrench,
  CodeXml,
  Zap,
} from "lucide-react";
import { api } from "@/lib/api";
import { LabAvatar } from "@/components/shared/lab-avatar";
import { CapabilityBadge } from "@/components/shared/capability-badge";
import { BenchmarkChart } from "./benchmark-chart";
import { ProviderTable } from "./provider-table";
import { ModelCard } from "./model-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { useCompareStore } from "@/hooks/use-compare";
import { formatContext, formatPrice, formatDate } from "@/lib/utils";

interface ModelDetailViewProps {
  slug: string;
}

export function ModelDetailView({ slug }: ModelDetailViewProps) {
  const { hasSlug, addSlug, removeSlug } = useCompareStore();
  const [copied, setCopied] = React.useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["model-detail", slug],
    queryFn: () => api.getModel(slug),
  });

  const model = data?.model;
  const similarModels = data?.similarModels || [];
  const isCompared = model ? hasSlug(model.slug) : false;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (isError || !model) {
    return (
      <div className="container py-12">
        <ErrorState
          title="Model Not Found"
          message={`We could not load specifications for model '${slug}'.`}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. MODEL HERO HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-border">
        <div className="flex items-start gap-4">
          <LabAvatar
            name={model.lab.name}
            color={model.lab.color}
            size="lg"
            className="h-14 w-14 text-xl rounded-xl shadow-md"
          />

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <Link
                href={`/labs/${model.lab.slug}`}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {model.lab.name}
              </Link>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground font-mono">
                Released {formatDate(model.releaseDate)}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <span>{model.name}</span>
              {model.isFeatured && (
                <Sparkles className="h-5 w-5 text-amber-500 shrink-0" />
              )}
            </h1>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge
                variant={model.license === "open" ? "success" : "secondary"}
                className="text-xs font-mono uppercase"
              >
                {model.license} Weights
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {model.modelType}
              </Badge>
              {model.parameters && (
                <Badge variant="outline" className="text-xs font-mono">
                  {model.parameters}
                </Badge>
              )}
              {model.lab.websiteUrl && (
                <a
                  href={model.lab.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Official Lab</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-1.5 text-xs"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </>
            )}
          </Button>

          <Button
            variant={isCompared ? "secondary" : "default"}
            size="sm"
            onClick={() =>
              isCompared ? removeSlug(model.slug) : addSlug(model.slug)
            }
            className="gap-1.5 text-xs font-medium"
          >
            {isCompared ? (
              <>
                <Check className="h-3.5 w-3.5 text-primary" />
                <span>Added to Compare</span>
              </>
            ) : (
              <>
                <Scale className="h-3.5 w-3.5" />
                <span>Add to Compare</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 2. SPECIFICATION CARDS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
            Context Window
          </span>
          <div className="font-mono text-2xl font-bold text-foreground">
            {formatContext(model.contextWindow)}
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {model.contextWindow.toLocaleString()} tokens
          </span>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
            Max Output
          </span>
          <div className="font-mono text-2xl font-bold text-foreground">
            {model.maxOutputTokens ? formatContext(model.maxOutputTokens) : "8K"}
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            Generation limit
          </span>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
            Input Pricing
          </span>
          <div className="font-mono text-2xl font-bold text-foreground">
            {formatPrice(model.inputPricePerM)}
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            Per 1 Million tokens
          </span>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
            Output Pricing
          </span>
          <div className="font-mono text-2xl font-bold text-foreground">
            {formatPrice(model.outputPricePerM)}
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            Per 1 Million tokens
          </span>
        </div>
      </div>

      {/* 3. TABS SECTION */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="providers">
            Providers ({model.providers.length})
          </TabsTrigger>
          <TabsTrigger value="benchmarks">
            Benchmarks ({model.benchmarkScores.length})
          </TabsTrigger>
          <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-semibold mb-3">Model Architecture & Scope</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {model.description}
                </p>
              </div>

              {/* Technical Specifications Table */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-semibold mb-4">Detailed Specifications</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <dt className="text-muted-foreground">Model Identifier (Slug)</dt>
                    <dd className="font-mono font-medium text-foreground">{model.slug}</dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <dt className="text-muted-foreground">Organization / Lab</dt>
                    <dd className="font-medium text-foreground">{model.lab.name}</dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <dt className="text-muted-foreground">Parameter Scale</dt>
                    <dd className="font-mono font-medium text-foreground">{model.parameters || "N/A"}</dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <dt className="text-muted-foreground">Release Date</dt>
                    <dd className="font-mono font-medium text-foreground">{formatDate(model.releaseDate, true)}</dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <dt className="text-muted-foreground">Context Window</dt>
                    <dd className="font-mono font-medium text-foreground">{model.contextWindow.toLocaleString()} tokens</dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <dt className="text-muted-foreground">Max Output Capacity</dt>
                    <dd className="font-mono font-medium text-foreground">
                      {model.maxOutputTokens ? `${model.maxOutputTokens.toLocaleString()} tokens` : "N/A"}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <dt className="text-muted-foreground">Weight Distribution</dt>
                    <dd className="capitalize font-medium text-foreground">{model.license}</dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <dt className="text-muted-foreground">Model Category</dt>
                    <dd className="capitalize font-medium text-foreground">{model.modelType}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Sidebar Column: Modalities & Quick Links */}
            <div className="space-y-6">
              {/* Modalities */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-semibold mb-3">Supported Modalities</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                      Input Channels
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {model.modalities
                        .filter((m) => m.direction === "input")
                        .map((m) => (
                          <Badge key={m.id} variant="outline" className="capitalize text-xs">
                            {m.modalityType}
                          </Badge>
                        ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                      Output Channels
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {model.modalities
                        .filter((m) => m.direction === "output")
                        .map((m) => (
                          <Badge key={m.id} variant="outline" className="capitalize text-xs">
                            {m.modalityType}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Benchmark Summary */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-semibold mb-3">Key Benchmarks</h3>
                <div className="space-y-2.5">
                  {model.benchmarkScores.slice(0, 4).map((bs) => (
                    <div key={bs.id} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{bs.benchmark.name}</span>
                      <span className="font-mono font-bold text-primary">
                        {bs.score} {bs.benchmark.metricUnit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: PRICING & PROVIDERS */}
        <TabsContent value="providers" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Hosting & Inference Telemetry</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time provider endpoints, pricing variance, and measured latency metrics.
              </p>
            </div>
          </div>
          <ProviderTable providers={model.providers} />
        </TabsContent>

        {/* TAB 3: BENCHMARKS */}
        <TabsContent value="benchmarks" className="space-y-6">
          <BenchmarkChart scores={model.benchmarkScores} />

          {/* Benchmark Details List */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h4 className="text-sm font-semibold mb-4">Detailed Evaluation Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {model.benchmarkScores.map((score) => (
                <div
                  key={score.id}
                  className="rounded-lg border border-border/80 bg-muted/20 p-4 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-foreground">
                      {score.benchmark.name}
                    </span>
                    <span className="font-mono text-base font-bold text-primary">
                      {score.score} {score.benchmark.metricUnit}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Domain: <span className="font-medium text-foreground">{score.benchmark.category}</span>
                  </div>
                  {score.benchmark.description && (
                    <p className="text-xs text-muted-foreground pt-1">
                      {score.benchmark.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* TAB 4: CAPABILITIES */}
        <TabsContent value="capabilities" className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-base font-semibold mb-2">Supported Capabilities</h3>
            <p className="text-xs text-muted-foreground mb-6">
              Verified functional primitives and developer APIs supported by {model.name}.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {model.capabilities.map(({ capability }) => (
                <div
                  key={capability.id}
                  className="flex items-start gap-3 rounded-lg border border-border p-3.5 bg-muted/20"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
                    <CapabilityBadge slug={capability.slug} name={capability.name} compact />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm text-foreground">{capability.name}</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {capability.description || "Active production capability supported natively."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* 4. SIMILAR MODELS SECTION */}
      {similarModels.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold tracking-tight">Similar AI Models</h3>
              <p className="text-xs text-muted-foreground">
                Alternative foundation models in the same capability or lab tier.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similarModels.map((sim) => (
              <ModelCard key={sim.id} model={sim} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
