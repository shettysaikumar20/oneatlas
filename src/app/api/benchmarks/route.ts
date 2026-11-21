import { NextResponse } from "next/server";
import { createErrorResponse } from "@/lib/validators";
import { dbRepository } from "@/lib/data/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const benchmarks = await dbRepository.getBenchmarks();
    return NextResponse.json({
      benchmarks,
    });
  } catch (error) {
    console.error("Error in GET /api/benchmarks:", error);
    return createErrorResponse(500, "INTERNAL_SERVER_ERROR", "Failed to retrieve benchmarks");
  }
}
