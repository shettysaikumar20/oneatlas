"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Sparkles,
  Zap,
  Cpu,
  Building2,
  Server,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Code2,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { api } from "@/lib/api";
import { ModelCard } from "@/components/models/model-card";
import { LabAvatar } from "@/components/shared/lab-avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { Badge } from "@/components/ui/badge";

const CATEGORY_LINKS = [
  { label: "Multimodal & Vision", href: "/models?modality=image", icon: Eye },
  { label: "Reasoning & STEM", href: "/models?capability=reasoning", icon: Sparkles },
  { label: "Coding & SWE", href: "/models?modelType=code", icon: Code2 },
  { label: "Open Weights", href: "/models?license=open", icon: Layers },
  { label: "Under $1.00 / 1M", href: "/models?maxPrice=1", icon: Zap },
];

import { ModelListItem, ModelFacets, Lab, Provider } from "@/types";

interface HomeViewProps {
  initialModels?: { items: ModelListItem[]; total: number; facets: ModelFacets; page: number; totalPages: number };
  initialLabs?: { labs: Lab[]; total: number };
  initialProviders?: { providers: (Provider & { avgLatency: number; avgThroughput: number; avgUptime: number })[]; total: number };
}

export function HomeView({ initialModels, initialLabs, initialProviders }: HomeViewProps = {}) {
  const router = useRouter();
  const [heroSearch, setHeroSearch] = React.useState("");

  // Fetch all models for discovery sections
  const {
    data: modelsData,
    isLoading: isModelsLoading,
    isError: isModelsError,
    refetch: refetchModels,
  } = useQuery({
    queryKey: ["home-models"],
    queryFn: () => api.getModels({ limit: 60 }),
    initialData: initialModels,
  });

  // Fetch labs for stats & directory strip
  const { data: labsData, isLoading: isLabsLoading } = useQuery({
    queryKey: ["home-labs"],
    queryFn: () => api.getLabs(),
    initialData: initialLabs,
  });

  // Fetch providers for stats
  const { data: providersData, isLoading: isProvidersLoading } = useQuery({
    queryKey: ["home-providers"],
    queryFn: () => api.getProviders(),
    initialData: initialProviders,
  });

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      router.push(`/models?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      router.push("/models");
    }
  };

  const models = modelsData?.items || [];
  const featuredModels = models.filter((m) => m.isFeatured).slice(0, 6);
  const newestModels = [...models]
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    .slice(0, 6);

  // Best value: high benchmark score per dollar
  const bestValueModels = [...models]
    .filter((m) => m.inputPricePerM < 2.0 && m.benchmarkScores.length > 0)
    .sort((a, b) => {
      const aScore = a.benchmarkScores[0]?.score || 0;
      const bScore = b.benchmarkScores[0]?.score || 0;
      const aVal = aScore / Math.max(0.05, a.inputPricePerM + a.outputPricePerM);
      const bVal = bScore / Math.max(0.05, b.inputPricePerM + b.outputPricePerM);
      return bVal - aVal;
    })
    .slice(0, 6);

  const totalModels = modelsData?.total || 88;
  const totalLabs = labsData?.total || 12;
  const totalProviders = providersData?.total || 10;

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-card via-background to-background py-16 md:py-24">
        {/* Subtle grid background */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="container relative z-10 flex flex-col items-center text-center max-w-4xl px-4">
          <Badge
            variant="accent"
            className="mb-6 gap-1.5 px-3 py-1 text-xs font-semibold tracking-wide uppercase border border-primary/20 bg-primary/10 text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            The AI Model Discovery & Intelligence Platform
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.15]">
            Discover, Compare & Route <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Frontier AI Models
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            Independent benchmark intelligence, multi-provider pricing ($/1M tokens), live latency telemetry, and comprehensive capability evaluation across 80+ state-of-the-art models.
          </p>

          {/* Large Hero Search Input */}
          <form
            onSubmit={handleHeroSubmit}
            className="relative flex w-full max-w-xl items-center rounded-xl border border-border bg-card p-1.5 shadow-lg transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
          >
            <Search className="ml-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by model, lab (e.g. OpenAI, DeepSeek, Claude 3.5), or capability..."
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <Button type="submit" size="sm" className="gap-1.5 px-4">
              <span>Explore</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Category Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-xs text-muted-foreground mr-1">Quick categories:</span>
            {CATEGORY_LINKS.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted hover:text-foreground"
                >
                  <Icon className="h-3 w-3 text-primary" />
                  <span>{cat.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. STATS STRIP */}
      <section className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono tracking-tight">{totalModels}</div>
              <div className="text-xs text-muted-foreground font-medium">Frontier AI Models</div>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono tracking-tight">{totalLabs}</div>
              <div className="text-xs text-muted-foreground font-medium">Pioneering AI Labs</div>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
              <Server className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono tracking-tight">{totalProviders}</div>
              <div className="text-xs text-muted-foreground font-medium">Inference Providers</div>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono tracking-tight">8 Benchmarks</div>
              <div className="text-xs text-muted-foreground font-medium">Standardized Evals</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED MODELS SECTION */}
      <section className="container space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Featured Flagship Models
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Industry-defining foundation models leading real-world coding, reasoning, and multimodal benchmarks.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="gap-1.5 self-start sm:self-auto">
            <Link href="/models">
              <span>View all {totalModels} models</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {isModelsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : isModelsError ? (
          <ErrorState onRetry={() => refetchModels()} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        )}
      </section>

      {/* 4. BEST VALUE (BENCHMARK PER DOLLAR) */}
      <section className="container space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span>Cost Efficiency Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Best Value Performers
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Exceptional benchmark score-to-cost ratio: maximum intelligence per dollar of blended token pricing.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="gap-1.5 self-start sm:self-auto">
            <Link href="/rankings">
              <span>Explore Leaderboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {isModelsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestValueModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        )}
      </section>

      {/* 5. NEWEST RELEASES */}
      <section className="container space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
              <Zap className="h-4 w-4" />
              <span>Fresh Off The Compute Cluster</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Newest Model Releases
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Recently published architectures, fine-tunes, and experimental reasoning releases.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="gap-1.5 self-start sm:self-auto">
            <Link href="/models?sort=releaseDate&order=desc">
              <span>Sort by release date</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {isModelsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newestModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        )}
      </section>

      {/* 6. LEADING AI LABS DIRECTORY STRIP */}
      <section className="container space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
              <Building2 className="h-4 w-4" />
              <span>Ecosystem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Leading AI Research Labs
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Discover foundational models built by the world&apos;s foremost research organizations.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/labs">
              <span>View all labs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {isLabsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {(labsData?.labs || []).slice(0, 6).map((lab) => (
              <Link
                key={lab.id}
                href={`/labs/${lab.slug}`}
                className="group flex flex-col items-center text-center p-5 rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <LabAvatar
                  name={lab.name}
                  color={lab.color}
                  size="lg"
                  className="mb-3 group-hover:scale-105 transition-transform"
                />
                <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {lab.name}
                </span>
                <span className="text-xs text-muted-foreground font-mono mt-1">
                  {lab._count?.models || 0} models
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
