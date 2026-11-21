import { prisma } from "@/lib/db/prisma";
import {
  ModelListItem,
  ModelDetail,
  ModelFacets,
  Benchmark,
  Lab,
  Provider,
  GlobalSearchResult,
} from "@/types";

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
    const where: Record<string, unknown> = {};

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
      const priceFilter: { gte?: number; lte?: number } = {};
      if (params.minPrice !== undefined) priceFilter.gte = params.minPrice;
      if (params.maxPrice !== undefined) priceFilter.lte = params.maxPrice;
      where.inputPricePerM = priceFilter;
    }
    if (params.minContext !== undefined || params.maxContext !== undefined) {
      const contextFilter: { gte?: number; lte?: number } = {};
      if (params.minContext !== undefined) contextFilter.gte = params.minContext;
      if (params.maxContext !== undefined) contextFilter.lte = params.maxContext;
      where.contextWindow = contextFilter;
    }

    let orderBy: Record<string, "asc" | "desc"> = { releaseDate: params.order };
    if (params.sort === "price") orderBy = { inputPricePerM: params.order };
    if (params.sort === "context") orderBy = { contextWindow: params.order };
    if (params.sort === "name") orderBy = { name: params.order };

    const skip = (params.page - 1) * params.limit;

    const [dbItems, total, allLabs, allProviders, allCaps, modelTypeGroups, licenseGroups] =
      await Promise.all([
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
        prisma.lab.findMany({
          select: { slug: true, name: true, _count: { select: { models: true } } },
          orderBy: { name: "asc" },
        }),
        prisma.provider.findMany({
          select: { slug: true, name: true, _count: { select: { models: true } } },
          orderBy: { name: "asc" },
        }),
        prisma.capability.findMany({
          select: { slug: true, name: true, _count: { select: { models: true } } },
          orderBy: { name: "asc" },
        }),
        prisma.model.groupBy({
          by: ["modelType"],
          _count: { modelType: true },
        }),
        prisma.model.groupBy({
          by: ["license"],
          _count: { license: true },
        }),
      ]);

    const facets: ModelFacets = {
      labs: allLabs.map((l) => ({ slug: l.slug, name: l.name, count: l._count.models })),
      providers: allProviders.map((p) => ({ slug: p.slug, name: p.name, count: p._count.models })),
      capabilities: allCaps.map((c) => ({ slug: c.slug, name: c.name, count: c._count.models })),
      modelTypes: modelTypeGroups.map((g) => ({
        type: g.modelType,
        count: g._count.modelType,
      })),
      licenses: licenseGroups.map((g) => ({
        license: g.license,
        count: g._count.license,
      })),
      minPrice: 0,
      maxPrice: 60,
      minContext: 4096,
      maxContext: 2097152,
    };

    return { items: dbItems as unknown as ModelListItem[], total, facets };
  },

  async getModelBySlug(
    slug: string
  ): Promise<{ model: ModelDetail | null; similarModels: ModelListItem[] }> {
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

    if (!model) {
      return { model: null, similarModels: [] };
    }

    const similarModels = await prisma.model.findMany({
      where: {
        labId: model.labId,
        slug: { not: model.slug },
      },
      take: 3,
      include: {
        lab: true,
        capabilities: { include: { capability: true } },
        modalities: true,
        providers: { include: { provider: true }, orderBy: { inputPricePerM: "asc" } },
        benchmarkScores: { include: { benchmark: true }, orderBy: { score: "desc" } },
      },
    });

    return {
      model: model as unknown as ModelDetail,
      similarModels: similarModels as unknown as ModelListItem[],
    };
  },

  async getCompare(
    slugs: string[]
  ): Promise<{ models: ModelDetail[]; benchmarks: Benchmark[] }> {
    const cleanSlugs = slugs.map((s) => s.toLowerCase());

    const [models, benchmarks] = await Promise.all([
      prisma.model.findMany({
        where: { slug: { in: cleanSlugs } },
        include: {
          lab: true,
          capabilities: { include: { capability: true } },
          modalities: true,
          providers: { include: { provider: true }, orderBy: { inputPricePerM: "asc" } },
          benchmarkScores: { include: { benchmark: true } },
        },
      }),
      prisma.benchmark.findMany({
        orderBy: [{ category: "asc" }, { name: "asc" }],
      }),
    ]);

    // Keep exact order requested by user
    const ordered = cleanSlugs
      .map((s) => models.find((m) => m.slug.toLowerCase() === s))
      .filter(Boolean) as unknown as ModelDetail[];

    return { models: ordered, benchmarks };
  },

  async getRankings(benchmarkSlug?: string, category?: string, limit = 50) {
    const allBenchmarks = await prisma.benchmark.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    let target = allBenchmarks.find(
      (b) => b.slug.toLowerCase() === (benchmarkSlug || "").toLowerCase()
    );
    if (!target) {
      target =
        allBenchmarks.find((b) => b.slug === "arena-elo") ||
        allBenchmarks[0];
    }

    if (!target) {
      return {
        benchmark: null,
        benchmarks: [],
        categories: [],
        items: [],
      };
    }

    const models = await prisma.model.findMany({
      where: {
        benchmarkScores: {
          some: { benchmarkId: target.id },
        },
      },
      include: {
        lab: true,
        benchmarkScores: {
          where: { benchmarkId: target.id },
          include: { benchmark: true },
        },
      },
    });

    // Score and rank models
    const scored = models
      .map((m) => {
        const score = m.benchmarkScores[0]?.score ?? 0;
        const totalCostPerM = m.inputPricePerM + m.outputPricePerM;
        const valueScore = totalCostPerM > 0 ? +(score / totalCostPerM).toFixed(2) : 0;
        return {
          modelId: m.id,
          slug: m.slug,
          name: m.name,
          modelType: m.modelType,
          license: m.license,
          parameters: m.parameters,
          inputPricePerM: m.inputPricePerM,
          outputPricePerM: m.outputPricePerM,
          contextWindow: m.contextWindow,
          lab: m.lab,
          score,
          valueScore,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item, idx) => ({
        rank: idx + 1,
        ...item,
      }));

    const categories = Array.from(new Set(allBenchmarks.map((b) => b.category)));
    return { benchmark: target, benchmarks: allBenchmarks, categories, items: scored };
  },

  async getBenchmarks() {
    return prisma.benchmark.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
  },

  async getLabs() {
    return prisma.lab.findMany({
      orderBy: { models: { _count: "desc" } },
      include: { _count: { select: { models: true } } },
    });
  },

  async getLabBySlug(slug: string) {
    return prisma.lab.findUnique({
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
  },

  async getProviders() {
    const providers = await prisma.provider.findMany({
      orderBy: { models: { _count: "desc" } },
      include: {
        _count: { select: { models: true } },
        models: { select: { latencyMs: true, throughput: true, uptimePercent: true } },
      },
    });

    return providers.map((p) => {
      const count = p.models.length;
      const avgLatency =
        count > 0 ? Math.round(p.models.reduce((a, m) => a + m.latencyMs, 0) / count) : 0;
      const avgThroughput =
        count > 0 ? Math.round(p.models.reduce((a, m) => a + m.throughput, 0) / count) : 0;
      const avgUptime =
        count > 0 ? +(p.models.reduce((a, m) => a + m.uptimePercent, 0) / count).toFixed(2) : 99.9;
      const { models: _, ...rest } = p;
      return { ...rest, avgLatency, avgThroughput, avgUptime };
    });
  },

  async getProviderBySlug(slug: string) {
    return prisma.provider.findUnique({
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
  },

  async searchGlobal(q: string): Promise<GlobalSearchResult> {
    const query = q.trim();

    const [models, labs, providers] = await Promise.all([
      prisma.model.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: {
          id: true,
          slug: true,
          name: true,
          modelType: true,
          contextWindow: true,
          inputPricePerM: true,
          outputPricePerM: true,
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
        contextWindow: m.contextWindow,
        inputPricePerM: m.inputPricePerM,
        outputPricePerM: m.outputPricePerM,
      })),
      labs: labs.map((l) => ({
        id: l.id,
        slug: l.slug,
        name: l.name,
        modelCount: l._count.models,
      })),
      providers: providers.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        modelCount: p._count.models,
      })),
    };
  },
};
