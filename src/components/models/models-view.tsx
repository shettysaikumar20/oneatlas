"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { api } from "@/lib/api";
import { useModelFilters } from "@/hooks/use-model-filters";
import { ModelCard } from "./model-card";
import { ModelTable } from "./model-table";
import { FilterSidebar } from "./filter-sidebar";
import { FilterChips } from "./filter-chips";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function ModelsView() {
  const {
    filters,
    setQuery,
    toggleLab,
    toggleProvider,
    toggleCapability,
    toggleModelType,
    setLicense,
    setPriceRange,
    setContextRange,
    setSort,
    setPage,
    setViewMode,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  } = useModelFilters();

  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  // Debounced query state for smooth typing
  const [searchInput, setSearchInput] = React.useState(filters.q);

  React.useEffect(() => {
    setSearchInput(filters.q);
  }, [filters.q]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== filters.q) {
        setQuery(searchInput);
      }
    }, 250);
    return () => clearTimeout(handler);
  }, [searchInput, filters.q, setQuery]);

  // Query models via TanStack Query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      "models",
      filters.q,
      filters.lab.join(","),
      filters.provider.join(","),
      filters.capability.join(","),
      filters.modelType.join(","),
      filters.license,
      filters.minPrice,
      filters.maxPrice,
      filters.minContext,
      filters.maxContext,
      filters.sort,
      filters.order,
      filters.page,
    ],
    queryFn: () =>
      api.getModels({
        q: filters.q || undefined,
        lab: filters.lab.length > 0 ? filters.lab.join(",") : undefined,
        provider: filters.provider.length > 0 ? filters.provider.join(",") : undefined,
        capability: filters.capability.length > 0 ? filters.capability.join(",") : undefined,
        modelType: filters.modelType.length > 0 ? filters.modelType.join(",") : undefined,
        license: filters.license,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minContext: filters.minContext,
        maxContext: filters.maxContext,
        sort: filters.sort,
        order: filters.order,
        page: filters.page,
        limit: 18,
      }),
  });

  const models = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const facets = data?.facets;

  const sortValue = `${filters.sort}-${filters.order}`;

  const handleSortChange = (val: string) => {
    const [newSort, newOrder] = val.split("-") as [
      "price" | "context" | "releaseDate" | "name",
      "asc" | "desc"
    ];
    setSort(newSort, newOrder);
  };

  return (
    <div className="container py-8 space-y-6">
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Model Discovery</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Explore and filter {total > 0 ? total : 88} frontier models by price, context window, capabilities, and providers.
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="p-6">
              <SheetHeader className="mb-4">
                <SheetTitle>Filter Models</SheetTitle>
              </SheetHeader>
              <FilterSidebar
                facets={facets}
                selectedLabs={filters.lab}
                selectedProviders={filters.provider}
                selectedCapabilities={filters.capability}
                selectedModelTypes={filters.modelType}
                selectedLicense={filters.license}
                minPrice={filters.minPrice}
                maxPrice={filters.maxPrice}
                minContext={filters.minContext}
                maxContext={filters.maxContext}
                onToggleLab={toggleLab}
                onToggleProvider={toggleProvider}
                onToggleCapability={toggleCapability}
                onToggleModelType={toggleModelType}
                onSetLicense={setLicense}
                onSetPriceRange={setPriceRange}
                onSetContextRange={setContextRange}
                onClearAll={clearFilters}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 rounded-xl border border-border bg-card p-5 shadow-sm sticky top-20">
          <FilterSidebar
            facets={facets}
            selectedLabs={filters.lab}
            selectedProviders={filters.provider}
            selectedCapabilities={filters.capability}
            selectedModelTypes={filters.modelType}
            selectedLicense={filters.license}
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            minContext={filters.minContext}
            maxContext={filters.maxContext}
            onToggleLab={toggleLab}
            onToggleProvider={toggleProvider}
            onToggleCapability={toggleCapability}
            onToggleModelType={toggleModelType}
            onSetLicense={setLicense}
            onSetPriceRange={setPriceRange}
            onSetContextRange={setContextRange}
            onClearAll={clearFilters}
          />
        </div>

        {/* Right Listing Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Controls Bar: Search + Sort + View Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search models by name, slug, or lab..."
                className="h-9 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Sort & View Mode */}
            <div className="flex items-center gap-2 shrink-0">
              <Select value={sortValue} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[170px] h-9 text-xs">
                  <SelectValue placeholder="Sort models" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="releaseDate-desc">Newest First</SelectItem>
                  <SelectItem value="releaseDate-asc">Oldest First</SelectItem>
                  <SelectItem value="price-asc">Lowest Price</SelectItem>
                  <SelectItem value="price-desc">Highest Price</SelectItem>
                  <SelectItem value="context-desc">Largest Context</SelectItem>
                  <SelectItem value="name-asc">Alphabetical</SelectItem>
                </SelectContent>
              </Select>

              {/* Grid / List View Toggle */}
              <div className="flex items-center rounded-md border border-border bg-card p-0.5">
                <Button
                  variant={filters.viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={filters.viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode("list")}
                  title="List view"
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          <FilterChips
            filters={filters}
            onRemoveLab={toggleLab}
            onRemoveProvider={toggleProvider}
            onRemoveCapability={toggleCapability}
            onRemoveModelType={toggleModelType}
            onRemoveLicense={() => setLicense(undefined)}
            onRemovePrice={() => setPriceRange(undefined, undefined)}
            onRemoveContext={() => setContextRange(undefined, undefined)}
            onRemoveQuery={() => setQuery("")}
            onClearAll={clearFilters}
          />

          {/* Results count & status */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span>
              Showing {models.length} of {total} models
            </span>
            {hasActiveFilters && (
              <span className="font-mono text-[11px] text-primary">
                Filtered
              </span>
            )}
          </div>

          {/* Content: Skeletons, Error, Empty, or Models */}
          {isLoading ? (
            filters.viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 rounded-lg" />
                ))}
              </div>
            )
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : models.length === 0 ? (
            <EmptyState onAction={clearFilters} />
          ) : filters.viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {models.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          ) : (
            <ModelTable models={models} />
          )}

          {/* Pagination */}
          <div className="pt-6">
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
