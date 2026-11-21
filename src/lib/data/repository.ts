import { prisma } from "@/lib/db/prisma";
import {
  MOCK_MODELS,
  MOCK_LABS,
  MOCK_PROVIDERS,
  MOCK_BENCHMARKS,
  MOCK_CAPABILITIES,
} from "./mock-catalog";
import {
  ModelListItem,
  ModelDetail,
  ModelFacets,
  Benchmark,
  Lab,
  Provider,
  GlobalSearchResult,
} from "@/types";

function isConnectionError(err: unknown): boolean {
  if (!err) return false;
  const msg = String((err as any)?.message || "");
  return (
    msg.includes("Can't reach database server") ||
    msg.includes("PrismaClientInitializationError") ||
    msg.includes("connect ECONNREFUSED") ||
    msg.includes("DATABASE_URL")
  );
}

export const dbRepository = {
  async getModels(params: {
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
    sort: "price" | "context" | "releaseDate" | "name";
    order: "asc" | "desc";
    page: number;
    limit: number;
  }): Promise<{ items: ModelListItem[]; total: number; facets: ModelFacets }> {
    try {
      // 1. Try Prisma DB query
      const where: any = {};
      if (params.q) {
        where.OR = [
          { name: { contains: params.q, mode: "insensitive" } },
          { slug: { contains: params.q, mode: "insensitive" } },
          { description: { contains: params.q, mode: "insensitive" } },
          { lab: { name: { contains: params.q, mode: "insensitive" } } },
        ];
      }
      if (params.lab) {
        const labSlugs = params.lab.split(",").map((s) => s.trim().toLowerCase());
        where.lab = { slug: { in: labSlugs } };
      }
      if (params.provider) {
        const pSlugs = params.provider.split(",").map((s) => s.trim().toLowerCase());
        where.providers = { some: { provider: { slug: { in: pSlugs } } } };
      }
      if (params.capability) {
        const cSlugs = params.capability.split(",").map((s) => s.trim().toLowerCase());
        where.capabilities = { some: { capability: { slug: { in: cSlugs } } } };
      }
      if (params.modelType) {
        const types = params.modelType.split(",").map((s) => s.trim().toLowerCase());
        where.modelType = { in: types };
      }
      if (params.license) {
        where.license = params.license;
      }
      if (params.minPrice !== undefined || params.maxPrice !== undefined) {
        where.inputPricePerM = {};
        if (params.minPrice !== undefined) where.inputPricePerM.gte = params.minPrice;
        if (params.maxPrice !== undefined) where.inputPricePerM.lte = params.maxPrice;
      }
      if (params.minContext !== undefined || params.maxContext !== undefined) {
        where.contextWindow = {};
        if (params.minContext !== undefined) where.contextWindow.gte = params.minContext;
        if (params.maxContext !== undefined) where.contextWindow.lte = params.maxContext;
      }

      let orderBy: any = { releaseDate: params.order };
      if (params.sort === "price") orderBy = { inputPricePerM: params.order };
      if (params.sort === "context") orderBy = { contextWindow: params.order };
      if (params.sort === "name") orderBy = { name: params.order };

      const skip = (params.page - 1) * params.limit;
      const [dbItems, total, allLabs, allProviders, allCaps] = await Promise.all([
        prisma.model.findMany({
          where,
          orderBy,
          skip,
          take: params.limit,
          include: {
            lab: true,
            capabilities: { include: { capability: true } },
            modalities: true,
            providers: { include: { provider: true }, orderBy: { inputPricePerM: "asc" } },
            benchmarkScores: { include: { benchmark: true }, orderBy: { score: "desc" } },
          },
        }),
        prisma.model.count({ where }),
        prisma.lab.findMany({ select: { slug: true, name: true, _count: { select: { models: true } } } }),
        prisma.provider.findMany({ select: { slug: true, name: true, _count: { select: { models: true } } } }),
        prisma.capability.findMany({ select: { slug: true, name: true, _count: { select: { models: true } } } }),
      ]);

      const facets: ModelFacets = {
        labs: allLabs.map((l) => ({ slug: l.slug, name: l.name, count: l._count.models })),
        providers: allProviders.map((p) => ({ slug: p.slug, name: p.name, count: p._count.models })),
        capabilities: allCaps.map((c) => ({ slug: c.slug, name: c.name, count: c._count.models })),
        modelTypes: [
          { type: "chat", count: 0 },
          { type: "multimodal", count: 0 },
          { type: "code", count: 0 },
          { type: "embedding", count: 0 },
        ],
        licenses: [
          { license: "open", count: 0 },
          { license: "closed", count: 0 },
        ],
        minPrice: 0,
        maxPrice: 60,
        minContext: 4096,
        maxContext: 2097152,
      };

      return { items: dbItems as unknown as ModelListItem[], total, facets };
    } catch (err) {
      if (!isConnectionError(err)) throw err;

      // Fallback in-memory query
      let filtered = [...MOCK_MODELS];

      if (params.q) {
        const query = params.q.toLowerCase().trim();
        filtered = filtered.filter(
          (m) =>
            m.name.toLowerCase().includes(query) ||
            m.slug.toLowerCase().includes(query) ||
            m.description.toLowerCase().includes(query) ||
            m.lab.name.toLowerCase().includes(query)
        );
      }

      if (params.lab) {
        const labSlugs = params.lab.split(",").map((s) => s.trim().toLowerCase());
        filtered = filtered.filter((m) => labSlugs.includes(m.lab.slug.toLowerCase()));
      }

      if (params.provider) {
        const pSlugs = params.provider.split(",").map((s) => s.trim().toLowerCase());
        filtered = filtered.filter((m) => m.providers.some((p) => pSlugs.includes(p.provider.slug.toLowerCase())));
      }

      if (params.capability) {
        const cSlugs = params.capability.split(",").map((s) => s.trim().toLowerCase());
        filtered = filtered.filter((m) => m.capabilities.some((c) => cSlugs.includes(c.capability.slug.toLowerCase())));
      }

      if (params.modelType) {
        const types = params.modelType.split(",").map((s) => s.trim().toLowerCase());
        filtered = filtered.filter((m) => types.includes(m.modelType.toLowerCase()));
      }

      if (params.license) {
        filtered = filtered.filter((m) => m.license === params.license);
      }

      if (params.minPrice !== undefined) {
        filtered = filtered.filter((m) => m.inputPricePerM >= params.minPrice!);
      }
      if (params.maxPrice !== undefined) {
        filtered = filtered.filter((m) => m.inputPricePerM <= params.maxPrice!);
      }

      if (params.minContext !== undefined) {
        filtered = filtered.filter((m) => m.contextWindow >= params.minContext!);
      }
      if (params.maxContext !== undefined) {
        filtered = filtered.filter((m) => m.contextWindow <= params.maxContext!);
      }

      // Sort
      filtered.sort((a, b) => {
        let diff = 0;
        if (params.sort === "price") diff = a.inputPricePerM - b.inputPricePerM;
        else if (params.sort === "context") diff = a.contextWindow - b.contextWindow;
        else if (params.sort === "name") diff = a.name.localeCompare(b.name);
        else diff = new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        return params.order === "asc" ? diff : -diff;
      });

      const total = filtered.length;
      const skip = (params.page - 1) * params.limit;
      const items = filtered.slice(skip, skip + params.limit);

      const facets: ModelFacets = {
        labs: MOCK_LABS.map((l) => ({ slug: l.slug, name: l.name, count: MOCK_MODELS.filter((m) => m.lab.slug === l.slug).length })),
        providers: MOCK_PROVIDERS.map((p) => ({ slug: p.slug, name: p.name, count: MOCK_MODELS.filter((m) => m.providers.some((pr) => pr.provider.slug === p.slug)).length })),
        capabilities: MOCK_CAPABILITIES.map((c) => ({ slug: c.slug, name: c.name, count: MOCK_MODELS.filter((m) => m.capabilities.some((cp) => cp.capability.slug === c.slug)).length })),
        modelTypes: [
          { type: "chat", count: MOCK_MODELS.filter((m) => m.modelType === "chat").length },
          { type: "multimodal", count: MOCK_MODELS.filter((m) => m.modelType === "multimodal").length },
          { type: "code", count: MOCK_MODELS.filter((m) => m.modelType === "code").length },
        ],
        licenses: [
          { license: "open", count: MOCK_MODELS.filter((m) => m.license === "open").length },
          { license: "closed", count: MOCK_MODELS.filter((m) => m.license === "closed").length },
        ],
        minPrice: 0,
        maxPrice: 60,
        minContext: 4096,
        maxContext: 2097152,
      };

      return { items, total, facets };
    }
  },

  async getModelBySlug(slug: string): Promise<{ model: ModelDetail | null; similarModels: ModelListItem[] }> {
    try {
      const model = await prisma.model.findUnique({
        where: { slug: slug.toLowerCase() },
        include: {
          lab: true,
          capabilities: { include: { capability: true } },
          modalities: true,
          providers: { include: { provider: true }, orderBy: { inputPricePerM: "asc" } },
          benchmarkScores: { include: { benchmark: true }, orderBy: { score: "desc" } },
        },
      });

      if (!model) return { model: null, similarModels: [] };

      const similarModels = await prisma.model.findMany({
        where: {
          AND: [
            { id: { not: model.id } },
            { OR: [{ labId: model.labId }, { modelType: model.modelType }] },
          ],
        },
        take: 4,
        include: {
          lab: true,
          capabilities: { include: { capability: true } },
          providers: { include: { provider: true } },
          benchmarkScores: { include: { benchmark: true } },
        },
      });

      return {
        model: model as unknown as ModelDetail,
        similarModels: similarModels as unknown as ModelListItem[],
      };
    } catch (err) {
      if (!isConnectionError(err)) throw err;

      const found = MOCK_MODELS.find((m) => m.slug.toLowerCase() === slug.toLowerCase());
      if (!found) return { model: null, similarModels: [] };

      const similar = MOCK_MODELS.filter(
        (m) => m.slug !== found.slug && (m.lab.slug === found.lab.slug || m.modelType === found.modelType)
      ).slice(0, 4);

      return {
        model: { ...found, createdAt: found.releaseDate, updatedAt: found.releaseDate } as ModelDetail,
        similarModels: similar,
      };
    }
  },

  async getCompare(slugs: string[]): Promise<{ models: ModelDetail[]; benchmarks: Benchmark[] }> {
    try {
      const [models, benchmarks] = await Promise.all([
        prisma.model.findMany({
          where: { slug: { in: slugs } },
          include: {
            lab: true,
            capabilities: { include: { capability: true } },
            modalities: true,
            providers: { include: { provider: true } },
            benchmarkScores: { include: { benchmark: true } },
          },
        }),
        prisma.benchmark.findMany({ orderBy: { name: "asc" } }),
      ]);

      const ordered = slugs
        .map((s) => models.find((m) => m.slug.toLowerCase() === s.toLowerCase()))
        .filter((m): m is NonNullable<typeof m> => Boolean(m));

      return { models: ordered as unknown as ModelDetail[], benchmarks };
    } catch (err) {
      if (!isConnectionError(err)) throw err;

      const ordered = slugs
        .map((s) => MOCK_MODELS.find((m) => m.slug.toLowerCase() === s.toLowerCase()))
        .filter((m): m is NonNullable<typeof m> => Boolean(m))
        .map((m) => ({ ...m, createdAt: m.releaseDate, updatedAt: m.releaseDate } as ModelDetail));

      return { models: ordered, benchmarks: MOCK_BENCHMARKS };
    }
  },

  async getRankings(benchmarkSlug?: string, category?: string, limit = 50) {
    try {
      const allBenchmarks = await prisma.benchmark.findMany({ orderBy: { name: "asc" } });
      const target =
        allBenchmarks.find((b) => b.slug.toLowerCase() === (benchmarkSlug || "").toLowerCase()) ||
        allBenchmarks.find((b) => b.slug === "arena-elo") ||
        allBenchmarks[0];

      if (!target) return { benchmark: null, benchmarks: [], categories: [], items: [] };

      const where: any = { benchmarkId: target.id };
      if (category && category !== "all") {
        where.model = { modelType: category.toLowerCase() };
      }

      const scores = await prisma.benchmarkScore.findMany({
        where,
        orderBy: { score: target.higherIsBetter ? "desc" : "asc" },
        take: limit,
        include: {
          model: {
            include: {
              lab: true,
              capabilities: { include: { capability: true } },
              providers: { include: { provider: true } },
              benchmarkScores: { include: { benchmark: true } },
            },
          },
        },
      });

      const categories = Array.from(new Set(allBenchmarks.map((b) => b.category)));
      const items = scores.map((s, idx) => ({
        rank: idx + 1,
        model: s.model as unknown as ModelListItem,
        score: s.score,
        valueScore: +(s.score / Math.max(0.05, s.model.inputPricePerM + s.model.outputPricePerM)).toFixed(1),
      }));

      return { benchmark: target, benchmarks: allBenchmarks, categories, items };
    } catch (err) {
      if (!isConnectionError(err)) throw err;

      const target =
        MOCK_BENCHMARKS.find((b) => b.slug.toLowerCase() === (benchmarkSlug || "").toLowerCase()) ||
        MOCK_BENCHMARKS.find((b) => b.slug === "arena-elo") ||
        MOCK_BENCHMARKS[0];

      let models = [...MOCK_MODELS];
      if (category && category !== "all") {
        models = models.filter((m) => m.modelType.toLowerCase() === category.toLowerCase());
      }

      const scored = models
        .map((m) => {
          const bs = m.benchmarkScores.find((b) => b.benchmark.slug === target.slug);
          return {
            model: m,
            score: bs ? bs.score : 0,
            valueScore: +(
              (bs ? bs.score : 0) / Math.max(0.05, m.inputPricePerM + m.outputPricePerM)
            ).toFixed(1),
          };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((item, idx) => ({
          rank: idx + 1,
          ...item,
        }));

      const categories = Array.from(new Set(MOCK_BENCHMARKS.map((b) => b.category)));
      return { benchmark: target, benchmarks: MOCK_BENCHMARKS, categories, items: scored };
    }
  },

  async getBenchmarks() {
    try {
      const bms = await prisma.benchmark.findMany({
        orderBy: [{ category: "asc" }, { name: "asc" }],
      });
      return bms;
    } catch (err) {
      if (!isConnectionError(err)) throw err;
      return MOCK_BENCHMARKS;
    }
  },

  async getLabs() {
    try {
      const labs = await prisma.lab.findMany({
        orderBy: { models: { _count: "desc" } },
        include: { _count: { select: { models: true } } },
      });
      return labs;
    } catch (err) {
      if (!isConnectionError(err)) throw err;
      return MOCK_LABS;
    }
  },

  async getLabBySlug(slug: string) {
    try {
      const lab = await prisma.lab.findUnique({
        where: { slug: slug.toLowerCase() },
        include: {
          models: {
            orderBy: { releaseDate: "desc" },
            include: {
              capabilities: { include: { capability: true } },
              modalities: true,
              providers: { include: { provider: true } },
              benchmarkScores: { include: { benchmark: true } },
            },
          },
        },
      });
      return lab;
    } catch (err) {
      if (!isConnectionError(err)) throw err;
      const lab = MOCK_LABS.find((l) => l.slug.toLowerCase() === slug.toLowerCase());
      if (!lab) return null;
      const models = MOCK_MODELS.filter((m) => m.lab.slug.toLowerCase() === lab.slug.toLowerCase());
      return { ...lab, models };
    }
  },

  async getProviders() {
    try {
      const providers = await prisma.provider.findMany({
        orderBy: { models: { _count: "desc" } },
        include: {
          _count: { select: { models: true } },
          models: { select: { latencyMs: true, throughput: true, uptimePercent: true } },
        },
      });
      return providers.map((p) => {
        const count = p.models.length;
        const avgLatency = count > 0 ? Math.round(p.models.reduce((a, m) => a + m.latencyMs, 0) / count) : 0;
        const avgThroughput = count > 0 ? Math.round(p.models.reduce((a, m) => a + m.throughput, 0) / count) : 0;
        const avgUptime = count > 0 ? +(p.models.reduce((a, m) => a + m.uptimePercent, 0) / count).toFixed(2) : 99.9;
        const { models: _, ...rest } = p;
        return { ...rest, avgLatency, avgThroughput, avgUptime };
      });
    } catch (err) {
      if (!isConnectionError(err)) throw err;
      return MOCK_PROVIDERS.map((p) => ({
        ...p,
        avgLatency: 280,
        avgThroughput: 140,
        avgUptime: 99.96,
      }));
    }
  },

  async getProviderBySlug(slug: string) {
    try {
      const provider = await prisma.provider.findUnique({
        where: { slug: slug.toLowerCase() },
        include: {
          models: {
            orderBy: { inputPricePerM: "asc" },
            include: {
              model: {
                include: {
                  lab: true,
                  capabilities: { include: { capability: true } },
                  modalities: true,
                  benchmarkScores: { include: { benchmark: true } },
                },
              },
            },
          },
        },
      });
      return provider;
    } catch (err) {
      if (!isConnectionError(err)) throw err;
      const provider = MOCK_PROVIDERS.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
      if (!provider) return null;
      const hostedModels = MOCK_MODELS.filter((m) => m.providers.some((pr) => pr.provider.slug === provider.slug)).map((m) => {
        const mp = m.providers.find((pr) => pr.provider.slug === provider.slug)!;
        return {
          id: mp.id,
          modelId: m.id,
          providerId: provider.id,
          inputPricePerM: mp.inputPricePerM,
          outputPricePerM: mp.outputPricePerM,
          latencyMs: mp.latencyMs,
          throughput: mp.throughput,
          uptimePercent: mp.uptimePercent,
          isDefault: mp.isDefault,
          contextWindow: mp.contextWindow,
          model: m,
        };
      });
      return { ...provider, models: hostedModels };
    }
  },

  async searchGlobal(q: string): Promise<GlobalSearchResult> {
    const query = q.trim().toLowerCase();

    if (!query) {
      const featured = MOCK_MODELS.filter((m) => m.isFeatured).slice(0, 5);
      return {
        models: featured.map((m) => ({
          id: m.id,
          slug: m.slug,
          name: m.name,
          labName: m.lab.name,
          modelType: m.modelType,
          inputPricePerM: m.inputPricePerM,
          contextWindow: m.contextWindow,
        })),
        labs: MOCK_LABS.slice(0, 5).map((l) => ({ id: l.id, slug: l.slug, name: l.name, modelCount: l._count?.models || 0 })),
        providers: MOCK_PROVIDERS.slice(0, 5).map((p) => ({ id: p.id, slug: p.slug, name: p.name, modelCount: p._count?.models || 0 })),
      };
    }

    try {
      const [models, labs, providers] = await Promise.all([
        prisma.model.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { slug: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { lab: { name: { contains: query, mode: "insensitive" } } },
            ],
          },
          take: 5,
          select: {
            id: true,
            slug: true,
            name: true,
            modelType: true,
            inputPricePerM: true,
            contextWindow: true,
            lab: { select: { name: true } },
          },
        }),
        prisma.lab.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { slug: { contains: query, mode: "insensitive" } },
            ],
          },
          take: 5,
          select: { id: true, slug: true, name: true, _count: { select: { models: true } } },
        }),
        prisma.provider.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { slug: { contains: query, mode: "insensitive" } },
            ],
          },
          take: 5,
          select: { id: true, slug: true, name: true, _count: { select: { models: true } } },
        }),
      ]);

      return {
        models: models.map((m) => ({
          id: m.id,
          slug: m.slug,
          name: m.name,
          labName: m.lab.name,
          modelType: m.modelType,
          inputPricePerM: m.inputPricePerM,
          contextWindow: m.contextWindow,
        })),
        labs: labs.map((l) => ({ id: l.id, slug: l.slug, name: l.name, modelCount: l._count.models })),
        providers: providers.map((p) => ({ id: p.id, slug: p.slug, name: p.name, modelCount: p._count.models })),
      };
    } catch (err) {
      if (!isConnectionError(err)) throw err;

      const models = MOCK_MODELS.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.slug.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.lab.name.toLowerCase().includes(query)
      ).slice(0, 5);

      const labs = MOCK_LABS.filter(
        (l) => l.name.toLowerCase().includes(query) || l.slug.toLowerCase().includes(query)
      ).slice(0, 5);

      const providers = MOCK_PROVIDERS.filter(
        (p) => p.name.toLowerCase().includes(query) || p.slug.toLowerCase().includes(query)
      ).slice(0, 5);

      return {
        models: models.map((m) => ({
          id: m.id,
          slug: m.slug,
          name: m.name,
          labName: m.lab.name,
          modelType: m.modelType,
          inputPricePerM: m.inputPricePerM,
          contextWindow: m.contextWindow,
        })),
        labs: labs.map((l) => ({ id: l.id, slug: l.slug, name: l.name, modelCount: l._count?.models || 0 })),
        providers: providers.map((p) => ({ id: p.id, slug: p.slug, name: p.name, modelCount: p._count?.models || 0 })),
      };
    }
  },
};
