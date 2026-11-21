import { Suspense } from "react";
import type { Metadata } from "next";
import { ProviderDetailView } from "@/components/providers/provider-detail-view";
import { Skeleton } from "@/components/ui/skeleton";
import { dbRepository } from "@/lib/data/repository";

interface ProviderPageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProviderPageProps): Promise<Metadata> {
  try {
    const provider = await dbRepository.getProviderBySlug(params.slug);
    if (!provider) {
      return {
        title: "Provider Not Found | OneAtlas",
      };
    }
    return {
      title: `${provider.name} Hosted AI Models & Pricing | OneAtlas`,
      description:
        provider.description ||
        `Compare inference pricing, latency, throughput, and hosted LLM models on ${provider.name}.`,
    };
  } catch {
    return {
      title: "Inference Provider Profile | OneAtlas",
      description: "Compare inference pricing, latency, and hosted LLM models on OneAtlas.",
    };
  }
}

export default function ProviderPage({ params }: ProviderPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="space-y-8">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        }
      >
        <ProviderDetailView slug={params.slug} />
      </Suspense>
    </div>
  );
}
