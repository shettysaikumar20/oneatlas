"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Search, ExternalLink, Cpu, ArrowRight, Building2 } from "lucide-react";
import { api } from "@/lib/api";
import { LabAvatar } from "@/components/shared/lab-avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";

export function LabsView() {
  const [search, setSearch] = React.useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["labs"],
    queryFn: () => api.getLabs(),
  });

  const filteredLabs = React.useMemo(() => {
    const list = data?.labs || [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (lab) =>
        lab.name.toLowerCase().includes(q) ||
        lab.description?.toLowerCase().includes(q)
    );
  }, [data?.labs, search]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
            <Building2 className="w-4 h-4" />
            <span>AI Organizations</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AI Research Labs</h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Directory of frontier foundation model creators, frontier AI startups, and open-source intelligence research labs.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search AI labs..."
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
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-12 w-full" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <ErrorState
          title="Failed to load labs"
          message="We could not retrieve the list of AI labs from the server."
          onRetry={() => refetch()}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredLabs.length === 0 && (
        <div className="text-center py-16 border rounded-xl bg-card">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-semibold">No labs matched &quot;{search}&quot;</h3>
          <p className="text-sm text-muted-foreground mt-1">Try a different keyword or reset your search.</p>
          <Button variant="outline" size="sm" onClick={() => setSearch("")} className="mt-4">
            Clear Search
          </Button>
        </div>
      )}

      {/* Labs Grid */}
      {!isLoading && !isError && filteredLabs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLabs.map((lab) => {
            const modelCount = (lab as unknown as { _count?: { models: number } })._count?.models;

            return (
              <div
                key={lab.id}
                className="group flex flex-col justify-between p-6 rounded-xl border bg-card hover:border-primary/50 transition-all hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <LabAvatar
                        name={lab.name}
                        color={lab.color}
                        size="lg"
                        className="rounded-xl shadow-xs"
                      />
                      <div>
                        <Link
                          href={`/labs/${lab.slug}`}
                          className="font-semibold text-lg hover:text-primary transition-colors inline-flex items-center gap-1 group/title"
                        >
                          {lab.name}
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all text-primary" />
                        </Link>
                        {lab.websiteUrl && (
                          <a
                            href={lab.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-0.5"
                          >
                            <span>{new URL(lab.websiteUrl).hostname}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {typeof modelCount === "number" && (
                      <Badge variant="secondary" className="font-mono text-xs">
                        <Cpu className="w-3 h-3 mr-1" />
                        {modelCount} models
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mt-4 line-clamp-3 leading-relaxed">
                    {lab.description || "Leading artificial intelligence research laboratory creating state-of-the-art models."}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t flex items-center justify-between gap-2">
                  <Link
                    href={`/models?lab=${lab.slug}`}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Browse models &rarr;
                  </Link>

                  <Button variant="outline" size="sm" asChild className="h-8">
                    <Link href={`/labs/${lab.slug}`}>
                      View Lab Profile
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
