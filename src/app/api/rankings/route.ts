import { NextRequest, NextResponse } from "next/server";
import { rankingsQuerySchema, createErrorResponse } from "@/lib/validators";
import { dbRepository } from "@/lib/data/repository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawParams = Object.fromEntries(searchParams.entries());

    const parseResult = rankingsQuerySchema.safeParse(rawParams);
    if (!parseResult.success) {
      return createErrorResponse(
        400,
        "INVALID_QUERY_PARAMS",
        "Invalid ranking parameters",
        parseResult.error.flatten()
      );
    }

    const { benchmark: benchmarkSlug, category, limit } = parseResult.data;
    const { benchmark, benchmarks, categories, items } = await dbRepository.getRankings(
      benchmarkSlug,
      category,
      limit
    );

    return NextResponse.json({
      benchmark,
      benchmarks,
      category: category || "all",
      categories,
      items,
    });
  } catch (error) {
    console.error("Error in GET /api/rankings:", error);
    return createErrorResponse(500, "INTERNAL_SERVER_ERROR", "Failed to retrieve rankings");
  }
}
