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
      return createErrorResponse(400, "INVALID_SLUG", "Model slug is required");
    }

    const { model, similarModels } = await dbRepository.getModelBySlug(slug);

    if (!model) {
      return createErrorResponse(404, "MODEL_NOT_FOUND", `Model with slug '${slug}' was not found`);
    }

    return NextResponse.json({
      model,
      similarModels,
    });
  } catch (error) {
    console.error("Error in GET /api/models/[slug]:", error);
    return createErrorResponse(500, "INTERNAL_SERVER_ERROR", "Failed to retrieve model details");
  }
}
