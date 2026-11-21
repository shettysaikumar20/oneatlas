import {
  ModelsApiResponse,
  ModelDetail,
  ModelListItem,
  CompareApiResponse,
  RankingsApiResponse,
  Benchmark,
  Lab,
  Provider,
  ModelProvider,
  GlobalSearchResult,
} from "@/types";

export interface ModelsQueryParams {
  q?: string;
  lab?: string;
  provider?: string;
  capability?: string;
  modelType?: string;
  modality?: string;
  license?: "open" | "closed";
  minPrice?: number;
  maxPrice?: number;
  minContext?: number;
  maxContext?: number;
  sort?: "price" | "context" | "releaseDate" | "name";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

class ApiError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    let errBody: { error?: { code?: string; message?: string; details?: unknown } } = {};
    try {
      errBody = await res.json();
    } catch {
      // ignore
    }
    throw new ApiError(
      res.status,
      errBody.error?.code || "HTTP_ERROR",
      errBody.error?.message || `Request failed with status ${res.status}`,
      errBody.error?.details
    );
  }

  return res.json();
}

export const api = {
  /**
   * Discovery query with full facet aggregation
   */
  async getModels(params: ModelsQueryParams = {}): Promise<ModelsApiResponse> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.set(key, String(val));
      }
    });
    const qs = searchParams.toString();
    return fetchJson<ModelsApiResponse>(`/api/models${qs ? `?${qs}` : ""}`);
  },

  /**
   * Single model full specification & providers
   */
  async getModel(slug: string): Promise<{ model: ModelDetail; similarModels: ModelListItem[] }> {
    return fetchJson<{ model: ModelDetail; similarModels: ModelListItem[] }>(
      `/api/models/${encodeURIComponent(slug)}`
    );
  },

  /**
   * Compare 2-4 models side-by-side
   */
  async getCompare(slugs: string[]): Promise<CompareApiResponse> {
    const qs = slugs.map((s) => encodeURIComponent(s.trim())).join(",");
    return fetchJson<CompareApiResponse>(`/api/compare?slugs=${qs}`);
  },

  /**
   * Leaderboard rankings
   */
  async getRankings(params: { benchmark?: string; category?: string; limit?: number } = {}): Promise<RankingsApiResponse> {
    const searchParams = new URLSearchParams();
    if (params.benchmark) searchParams.set("benchmark", params.benchmark);
    if (params.category && params.category !== "all") searchParams.set("category", params.category);
    if (params.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString();
    return fetchJson<RankingsApiResponse>(`/api/rankings${qs ? `?${qs}` : ""}`);
  },

  /**
   * All benchmark definitions
   */
  async getBenchmarks(): Promise<{ benchmarks: Benchmark[] }> {
    return fetchJson<{ benchmarks: Benchmark[] }>("/api/benchmarks");
  },

  /**
   * Labs directory
   */
  async getLabs(): Promise<{ labs: Lab[]; total: number }> {
    return fetchJson<{ labs: Lab[]; total: number }>("/api/labs");
  },

  /**
   * Single lab profile with models
   */
  async getLab(slug: string): Promise<{ lab: Lab & { models: ModelListItem[] } }> {
    return fetchJson<{ lab: Lab & { models: ModelListItem[] } }>(
      `/api/labs/${encodeURIComponent(slug)}`
    );
  },

  /**
   * Providers directory
   */
  async getProviders(): Promise<{
    providers: (Provider & { avgLatency: number; avgThroughput: number; avgUptime: number })[];
    total: number;
  }> {
    return fetchJson<{
      providers: (Provider & { avgLatency: number; avgThroughput: number; avgUptime: number })[];
      total: number;
    }>("/api/providers");
  },

  /**
   * Single provider profile with hosted models
   */
  async getProvider(slug: string): Promise<{
    provider: Provider & { models: (ModelProvider & { model: ModelListItem })[] };
  }> {
    return fetchJson<{
      provider: Provider & { models: (ModelProvider & { model: ModelListItem })[] };
    }>(`/api/providers/${encodeURIComponent(slug)}`);
  },

  /**
   * Global fast search for Cmd+K command palette
   */
  async searchGlobal(q: string): Promise<GlobalSearchResult> {
    return fetchJson<GlobalSearchResult>(
      `/api/search?q=${encodeURIComponent(q.trim())}`
    );
  },
};
