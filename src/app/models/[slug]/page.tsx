import { Metadata } from "next";
import { ModelDetailView } from "@/components/models/model-detail-view";
import { dbRepository } from "@/lib/data/repository";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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
}

export default function ModelDetailPage({ params }: PageProps) {
  return <ModelDetailView slug={params.slug} />;
}
