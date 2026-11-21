"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Layers,
  Cpu,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { api } from "@/lib/api";
import { LabAvatar } from "@/components/shared/lab-avatar";
import { ModelCard } from "@/components/models/model-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { formatDate, formatContext, formatPrice } from "@/lib/utils";

interface LabDetailViewProps {
  slug: string;
}

export function LabDetailView({ slug }: LabDetailViewProps) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["lab", slug],
    queryFn: () => api.getLab(slug),
  });

  const lab = data?.lab;
  const models = lab?.models || [];

  // Sort models by releaseDate desc for timeline
  const timelineModels = React.useMemo(() => {
    const list = lab?.models || [];
    return [...list].sort((a, b) => {
      const dateA = new Date(a.releaseDate).getTime();
      const dateB = new Date(b.releaseDate).getTime();
      return dateB - dateA;
    });
  }, [lab?.models]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-6 w-32" />
        <div className="p-8 rounded-2xl border bg-card space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !lab) {
    return (
      <ErrorState
        title="Lab Not Found"
        message={`We could not find an AI lab with slug "${slug}".`}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground hover:text-foreground">
          <Link href="/labs">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Labs Directory
          </Link>
        </Button>
      </div>

      {/* Lab Header Profile */}
      <div className="relative overflow-hidden rounded-2xl border bg-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <LabAvatar
              name={lab.name}
              color={lab.color}
              size="lg"
              className="w-16 h-16 rounded-2xl text-2xl shadow-sm"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{lab.name}</h1>
                <Badge variant="outline" className="font-mono text-xs">
                  {lab.slug}
                </Badge>
              </div>

              {lab.websiteUrl && (
                <a
                  href={lab.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1.5 mt-1 font-medium"
                >
                  <span>{lab.websiteUrl.replace(/^https?:\/\//, "")}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <p className="text-sm text-muted-foreground mt-3 max-w-3xl leading-relaxed">
                {lab.description || "Leading AI research institution pioneering frontier models and intelligent compute systems."}
              </p>
            </div>
          </div>

          <div className="flex md:flex-col items-center md:items-end gap-3 shrink-0">
            <div className="text-right">
              <span className="text-2xl font-bold font-mono text-foreground">{models.length}</span>
              <p className="text-xs text-muted-foreground">Catalog Models</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/models?lab=${lab.slug}`}>
                Filter in Models Explorer
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs: Catalog vs Timeline */}
      <Tabs defaultValue="catalog" className="space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <TabsList className="bg-muted/60 p-1">
            <TabsTrigger value="catalog" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Models Catalog ({models.length})</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Release Timeline</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Catalog Tab */}
        <TabsContent value="catalog" className="space-y-6">
          {models.length === 0 ? (
            <div className="text-center py-16 border rounded-xl bg-card">
              <Cpu className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <h3 className="text-base font-semibold">No models cataloged yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Models for this lab are being indexed into the system.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <div className="relative pl-6 md:pl-8 border-l-2 border-border/80 space-y-8 my-4">
            {timelineModels.map((m) => (
              <div key={m.id} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-background bg-primary ring-4 ring-background" />

                <div className="rounded-xl border bg-card p-5 hover:border-primary/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/models/${m.slug}`}
                        className="font-bold text-base hover:text-primary transition-colors inline-flex items-center gap-1.5"
                      >
                        {m.name}
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                      <Badge variant="outline" className="text-[11px] capitalize">
                        {m.modelType}
                      </Badge>
                      <Badge variant="secondary" className="text-[11px] uppercase">
                        {m.license}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(m.releaseDate)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {m.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono pt-1 text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-foreground font-semibold">{formatContext(m.contextWindow)}</span> context
                      </div>
                      <div>
                        Input: <span className="text-foreground font-semibold">{formatPrice(m.inputPricePerM)}</span>
                      </div>
                      <div>
                        Output: <span className="text-foreground font-semibold">{formatPrice(m.outputPricePerM)}</span>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" asChild className="h-7 text-xs font-sans">
                      <Link href={`/models/${m.slug}`}>
                        Inspect Specs &rarr;
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
