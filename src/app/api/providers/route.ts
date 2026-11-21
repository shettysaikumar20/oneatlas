import { NextResponse } from "next/server";
import { createErrorResponse } from "@/lib/validators";
import { dbRepository } from "@/lib/data/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const providers = await dbRepository.getProviders();
    return NextResponse.json({
      providers,
      total: providers.length,
    });
  } catch (error) {
    console.error("Error in GET /api/providers:", error);
    return createErrorResponse(500, "INTERNAL_SERVER_ERROR", "Failed to retrieve providers");
  }
}
