import { NextRequest, NextResponse } from "next/server";
import { modelsQuerySchema, createErrorResponse } from "@/lib/validators";
import { dbRepository } from "@/lib/data/repository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawParams = Object.fromEntries(searchParams.entries());

    const parseResult = modelsQuerySchema.safeParse(rawParams);
    if (!parseResult.success) {
      return createErrorResponse(
        400,
        "INVALID_QUERY_PARAMS",
        "Invalid query parameters provided",
        parseResult.error.flatten()
      );
    }

    const { items, total, facets } = await dbRepository.getModels(parseResult.data);
    const totalPages = Math.ceil(total / parseResult.data.limit) || 1;

    return NextResponse.json({
      items,
      total,
      page: parseResult.data.page,
      totalPages,
      facets,
    });
  } catch (error) {
    console.error("Error in GET /api/models:", error);
    return createErrorResponse(500, "INTERNAL_SERVER_ERROR", "Failed to retrieve models");
  }
}
