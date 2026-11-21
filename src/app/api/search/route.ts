import { NextRequest, NextResponse } from "next/server";
import { searchQuerySchema, createErrorResponse } from "@/lib/validators";
import { dbRepository } from "@/lib/data/repository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawParams = Object.fromEntries(searchParams.entries());

    const parseResult = searchQuerySchema.safeParse(rawParams);
    if (!parseResult.success) {
      return createErrorResponse(
        400,
        "INVALID_SEARCH_PARAMS",
        "Invalid search parameters",
        parseResult.error.flatten()
      );
    }

    const results = await dbRepository.searchGlobal(parseResult.data.q);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in GET /api/search:", error);
    return createErrorResponse(500, "INTERNAL_SERVER_ERROR", "Search query failed");
  }
}
