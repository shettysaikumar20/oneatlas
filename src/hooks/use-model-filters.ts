"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import * as React from "react";

export function useModelFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse state from URL search params
  const q = searchParams.get("q") || "";
  const lab = (searchParams.get("lab") || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const provider = (searchParams.get("provider") || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const capability = (searchParams.get("capability") || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const modelType = (searchParams.get("modelType") || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const license = (searchParams.get("license") as "open" | "closed") || undefined;
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const minContext = searchParams.get("minContext") ? Number(searchParams.get("minContext")) : undefined;
  const maxContext = searchParams.get("maxContext") ? Number(searchParams.get("maxContext")) : undefined;
  const sort = (searchParams.get("sort") as "price" | "context" | "releaseDate" | "name") || "releaseDate";
  const order = (searchParams.get("order") as "asc" | "desc") || "desc";
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
  const viewMode = (searchParams.get("view") as "grid" | "list") || "grid";

  // Helper to commit new URL state
  const updateParams = React.useCallback(
    (updates: Record<string, string | number | undefined | null>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, val]) => {
        if (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0)) {
          params.delete(key);
        } else if (Array.isArray(val)) {
          params.set(key, val.join(","));
        } else {
          params.set(key, String(val));
        }
      });

      if (resetPage && updates.page === undefined) {
        params.delete("page");
      }

      const queryString = params.toString();
      router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const setQuery = React.useCallback(
    (query: string) => {
      updateParams({ q: query.trim() || undefined });
    },
    [updateParams]
  );

  const toggleArrayFilter = React.useCallback(
    (key: string, currentList: string[], item: string) => {
      const lower = item.toLowerCase();
      const updated = currentList.includes(lower)
        ? currentList.filter((s) => s !== lower)
        : [...currentList, lower];

      updateParams({ [key]: updated.length > 0 ? updated.join(",") : undefined });
    },
    [updateParams]
  );

  const toggleLab = (slug: string) => toggleArrayFilter("lab", lab, slug);
  const toggleProvider = (slug: string) => toggleArrayFilter("provider", provider, slug);
  const toggleCapability = (slug: string) => toggleArrayFilter("capability", capability, slug);
  const toggleModelType = (type: string) => toggleArrayFilter("modelType", modelType, type);

  const setLicense = (val: "open" | "closed" | undefined) => {
    updateParams({ license: val });
  };

  const setPriceRange = (min?: number, max?: number) => {
    updateParams({ minPrice: min, maxPrice: max });
  };

  const setContextRange = (min?: number, max?: number) => {
    updateParams({ minContext: min, maxContext: max });
  };

  const setSort = (newSort: "price" | "context" | "releaseDate" | "name", newOrder?: "asc" | "desc") => {
    const determinedOrder = newOrder || (newSort === "price" || newSort === "name" ? "asc" : "desc");
    updateParams({ sort: newSort, order: determinedOrder }, false);
  };

  const setPage = (newPage: number) => {
    updateParams({ page: newPage > 1 ? newPage : undefined }, false);
  };

  const setViewMode = (mode: "grid" | "list") => {
    updateParams({ view: mode === "list" ? "list" : undefined }, false);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (viewMode === "list") params.set("view", "list");
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const hasActiveFilters = Boolean(
    q ||
      lab.length > 0 ||
      provider.length > 0 ||
      capability.length > 0 ||
      modelType.length > 0 ||
      license ||
      minPrice !== undefined ||
      maxPrice !== undefined ||
      minContext !== undefined ||
      maxContext !== undefined
  );

  const activeFilterCount =
    (q ? 1 : 0) +
    lab.length +
    provider.length +
    capability.length +
    modelType.length +
    (license ? 1 : 0) +
    (minPrice !== undefined || maxPrice !== undefined ? 1 : 0) +
    (minContext !== undefined || maxContext !== undefined ? 1 : 0);

  return {
    filters: {
      q,
      lab,
      provider,
      capability,
      modelType,
      license,
      minPrice,
      maxPrice,
      minContext,
      maxContext,
      sort,
      order,
      page,
      viewMode,
    },
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
  };
}
