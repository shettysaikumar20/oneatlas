import { HomeView } from "@/components/home/home-view";
import { dbRepository } from "@/lib/data/repository";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let initialModels;
  let initialLabs;
  let initialProviders;

  try {
    const [modelsRes, labsRes, providersRes] = await Promise.all([
      dbRepository.getModels({
        sort: "releaseDate",
        order: "desc",
        page: 1,
        limit: 60,
      }),
      dbRepository.getLabs(),
      dbRepository.getProviders(),
    ]);

    initialModels = {
      items: modelsRes.items,
      total: modelsRes.total,
      facets: modelsRes.facets,
      page: 1,
      totalPages: Math.ceil(modelsRes.total / 60),
    };
    initialLabs = { labs: labsRes as any, total: labsRes.length };
    initialProviders = { providers: providersRes as any, total: providersRes.length };
  } catch {
    // If DB is offline, graceful fallback to client-side hydration
  }

  return (
    <HomeView
      initialModels={initialModels}
      initialLabs={initialLabs}
      initialProviders={initialProviders}
    />
  );
}
