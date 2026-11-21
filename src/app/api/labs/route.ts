import { NextResponse } from "next/server";
import { createErrorResponse } from "@/lib/validators";
import { dbRepository } from "@/lib/data/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const labs = await dbRepository.getLabs();
    return NextResponse.json({
      labs,
      total: labs.length,
    });
  } catch (error) {
    console.error("Error in GET /api/labs:", error);
    return createErrorResponse(500, "INTERNAL_SERVER_ERROR", "Failed to retrieve labs");
  }
}
