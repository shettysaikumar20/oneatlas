import { NextRequest, NextResponse } from "next/server";
import { compareQuerySchema, createErrorResponse } from "@/lib/validators";
import { dbRepository } from "@/lib/data/repository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawParams = Object.fromEntries(searchParams.entries());

    const parseResult = compareQuerySchema.safeParse(rawParams);
    if (!parseResult.success) {
      return createErrorResponse(
        400,
        "INVALID_COMPARE_REQUEST",
        "Comparison requires between 2 and 4 valid model slugs",
        parseResult.error.flatten()
      );
    }

    const { slugs } = parseResult.data;
    const { models, benchmarks } = await dbRepository.getCompare(slugs);

    if (models.length < 2) {
      return createErrorResponse(
        400,
        "MODELS_NOT_FOUND",
        "At least 2 matching models must be found in the database to compare"
      );
    }

    // Build benchmark comparison matrix
    const benchmarkComparison = benchmarks.map((bm) => {
      const scores: Record<string, number | null> = {};
      models.forEach((m) => {
        const found = m.benchmarkScores.find((bs) => bs.benchmark.slug === bm.slug || bs.benchmarkId === bm.id);
        scores[m.slug] = found ? found.score : null;
      });
      return {
        benchmark: bm,
        scores,
      };
    });

    return NextResponse.json({
      models,
      benchmarks,
      benchmarkComparison,
    });
  } catch (error) {
    console.error("Error in GET /api/compare:", error);
    return createErrorResponse(500, "INTERNAL_SERVER_ERROR", "Failed to retrieve comparison");
  }
}
