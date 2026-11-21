import { Suspense } from "react";
import type { Metadata } from "next";
import { LabDetailView } from "@/components/labs/lab-detail-view";
import { Skeleton } from "@/components/ui/skeleton";
import { dbRepository } from "@/lib/data/repository";

interface LabPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: LabPageProps): Promise<Metadata> {
  const lab = await dbRepository.getLabBySlug(params.slug);
  if (!lab) {
    return {
      title: "Lab Not Found | OneAtlas",
    };
  }
  return {
    title: `${lab.name} AI Models & Timeline | OneAtlas`,
    description: lab.description || `Explore ${lab.name} models, benchmarks, and release history on OneAtlas.`,
  };
}

export default function LabPage({ params }: LabPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="space-y-8">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-44 w-full rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          </div>
        }
      >
        <LabDetailView slug={params.slug} />
      </Suspense>
    </div>
  );
}
