import { z } from "zod";

export const modelsQuerySchema = z.object({
  q: z.string().optional(),
  lab: z.string().optional(), // can be comma-separated slugs e.g. "openai,anthropic"
  provider: z.string().optional(),
  capability: z.string().optional(),
  modelType: z.string().optional(),
  modality: z.string().optional(),
  license: z.enum(["open", "closed"]).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minContext: z.coerce.number().min(0).optional(),
  maxContext: z.coerce.number().min(0).optional(),
  sort: z.enum(["price", "context", "releaseDate", "name"]).default("releaseDate"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const compareQuerySchema = z.object({
  slugs: z.string().min(1, "The 'slugs' parameter is required"),
}).transform((data, ctx) => {
  const parts = data.slugs
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (parts.length < 2 || parts.length > 4) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Compare requires between 2 and 4 model slugs (e.g. ?slugs=a,b,c)",
      path: ["slugs"],
    });
  }

  return { slugs: parts };
});

export const rankingsQuerySchema = z.object({
  benchmark: z.string().optional(),
  category: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const searchQuerySchema = z.object({
  q: z.string().default(""),
});

export interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function createErrorResponse(
  status: number,
  code: string,
  message: string,
  details?: unknown
) {
  return Response.json(
    {
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}
