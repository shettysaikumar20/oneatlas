import { Metadata } from "next";
import { ModelDetailView } from "@/components/models/model-detail-view";
import { dbRepository } from "@/lib/data/repository";

interface PageProps {
  params: {
    slug: string;
  };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { model } = await dbRepository.getModelBySlug(params.slug);

    if (!model) {
      return {
        title: "Model Not Found — OneAtlas",
        description: "The requested model could not be found.",
      };
    }

    return {
      title: `${model.name} Specs, Pricing & Benchmarks — OneAtlas`,
      description: `${model.name} by ${model.lab.name}. Context: ${model.contextWindow.toLocaleString()} tokens, Input: $${model.inputPricePerM}/1M tokens. Compare providers, latency, and benchmarks.`,
      openGraph: {
        title: `${model.name} — OneAtlas Intelligence`,
        description: model.description,
        type: "website",
      },
    };
  } catch {
    return {
      title: "Model Intelligence — OneAtlas",
      description: "Explore model specs, latency, throughput, and benchmark scores.",
    };
  }
}

export default async function ModelDetailPage({ params }: PageProps) {
  let initialData;
  try {
    const res = await dbRepository.getModelBySlug(params.slug);
    if (res?.model) {
      initialData = res as unknown as { model: any; similarModels: any[] };
    }
  } catch {
    // Falls back gracefully to client-side fetching if server DB is unreachable
  }

  return <ModelDetailView slug={params.slug} initialData={initialData} />;
}
