"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CompareStore {
  selectedSlugs: string[];
  addSlug: (slug: string) => boolean; // returns true if added, false if max reached
  removeSlug: (slug: string) => void;
  clearSlugs: () => void;
  hasSlug: (slug: string) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      selectedSlugs: [],

      addSlug: (slug: string) => {
        const clean = slug.trim().toLowerCase();
        const current = get().selectedSlugs;
        if (current.includes(clean)) return true;
        if (current.length >= 4) return false;

        set({ selectedSlugs: [...current, clean] });
        return true;
      },

      removeSlug: (slug: string) => {
        const clean = slug.trim().toLowerCase();
        set({ selectedSlugs: get().selectedSlugs.filter((s) => s !== clean) });
      },

      clearSlugs: () => {
        set({ selectedSlugs: [] });
      },

      hasSlug: (slug: string) => {
        return get().selectedSlugs.includes(slug.trim().toLowerCase());
      },
    }),
    {
      name: "oneatlas_compare",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
          clear: () => {},
          key: () => null,
          length: 0,
        };
      }),
    }
  )
);
