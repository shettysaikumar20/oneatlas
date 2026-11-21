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
      return createErrorResponse(400, "INVALID_SLUG", "Lab slug is required");
    }

    const lab = await dbRepository.getLabBySlug(slug);

    if (!lab) {
      return createErrorResponse(404, "LAB_NOT_FOUND", `Lab with slug '${slug}' was not found`);
    }

    return NextResponse.json({
      lab,
    });
  } catch (error) {
    console.error("Error in GET /api/labs/[slug]:", error);
    return createErrorResponse(500, "INTERNAL_SERVER_ERROR", "Failed to retrieve lab details");
  }
}
