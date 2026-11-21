import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/lib/validators";
import { dbRepository } from "@/lib/data/repository";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug?.trim().toLowerCase();
    if (!slug) {
      return createErrorResponse(400, "INVALID_SLUG", "Provider slug is required");
    }

    const provider = await dbRepository.getProviderBySlug(slug);

    if (!provider) {
      return createErrorResponse(404, "PROVIDER_NOT_FOUND", `Provider with slug '${slug}' was not found`);
    }

    return NextResponse.json({
      provider,
    });
  } catch (error) {
    console.error("Error in GET /api/providers/[slug]:", error);
    return createErrorResponse(500, "INTERNAL_SERVER_ERROR", "Failed to retrieve provider details");
  }
}
