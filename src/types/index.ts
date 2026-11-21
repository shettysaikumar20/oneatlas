export interface Lab {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  color: string | null;
  _count?: {
    models: number;
  };
}

export interface Provider {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  apiDocUrl: string | null;
  _count?: {
    models: number;
  };
}

export interface Capability {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
}

export interface Modality {
  id: string;
  modelId: string;
  modalityType: string;
  direction: string;
}

export interface Benchmark {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  metricUnit: string;
  maxScore: number | null;
  higherIsBetter: boolean;
}

export interface BenchmarkScore {
  id: string;
  modelId: string;
  benchmarkId: string;
  score: number;
  sourceUrl: string | null;
  verified: boolean;
  benchmark: Benchmark;
}

export interface ModelProvider {
  id: string;
  modelId: string;
  providerId: string;
  inputPricePerM: number;
  outputPricePerM: number;
  latencyMs: number;
  throughput: number;
  uptimePercent: number;
  isDefault: boolean;
  contextWindow: number | null;
  provider: Provider;
}

export interface ModelCapability {
  id: string;
  modelId: string;
  capabilityId: string;
  capability: Capability;
}

export interface ModelListItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  labId: string;
  modelType: string;
  contextWindow: number;
  maxOutputTokens: number | null;
  inputPricePerM: number;
  outputPricePerM: number;
  releaseDate: string | Date;
  license: string;
  parameters: string | null;
  isFeatured: boolean;
  lab: Lab;
  capabilities: { capability: Capability }[];
  modalities: Modality[];
  providers: ModelProvider[];
  benchmarkScores: BenchmarkScore[];
}

export interface ModelDetail extends ModelListItem {
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface FacetCount {
  slug: string;
  name: string;
  count: number;
}

export interface ModelFacets {
  labs: FacetCount[];
  providers: FacetCount[];
  capabilities: FacetCount[];
  modelTypes: { type: string; count: number }[];
  licenses: { license: string; count: number }[];
  minPrice: number;
  maxPrice: number;
  minContext: number;
  maxContext: number;
}

export interface ModelsApiResponse {
  items: ModelListItem[];
  total: number;
  page: number;
  totalPages: number;
  facets: ModelFacets;
}

export interface CompareApiResponse {
  models: ModelDetail[];
  benchmarks: Benchmark[];
  benchmarkComparison: {
    benchmark: Benchmark;
    scores: Record<string, number | null>;
  }[];
}

export interface LeaderboardItem {
  rank: number;
  model: ModelListItem;
  score: number;
  valueScore: number; // Benchmark score per dollar (e.g. score / (inputPrice + outputPrice))
}

export interface RankingsApiResponse {
  benchmark: Benchmark;
  benchmarks: Benchmark[];
  category: string;
  categories: string[];
  items: LeaderboardItem[];
}

export interface GlobalSearchResult {
  models: {
    id: string;
    slug: string;
    name: string;
    labName: string;
    modelType: string;
    inputPricePerM: number;
    contextWindow: number;
  }[];
  labs: {
    id: string;
    slug: string;
    name: string;
    modelCount: number;
  }[];
  providers: {
    id: string;
    slug: string;
    name: string;
    modelCount: number;
  }[];
}
