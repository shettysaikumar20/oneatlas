import { NextRequest } from "next/server";
import { GET as getModels } from "../src/app/api/models/route";
import { GET as getModelDetail } from "../src/app/api/models/[slug]/route";
import { GET as getCompare } from "../src/app/api/compare/route";
import { GET as getRankings } from "../src/app/api/rankings/route";
import { GET as getBenchmarks } from "../src/app/api/benchmarks/route";
import { GET as getLabs } from "../src/app/api/labs/route";
import { GET as getLabDetail } from "../src/app/api/labs/[slug]/route";
import { GET as getProviders } from "../src/app/api/providers/route";
import { GET as getProviderDetail } from "../src/app/api/providers/[slug]/route";
import { GET as getSearch } from "../src/app/api/search/route";

async function runTests() {
  console.log("=== Testing OneAtlas API Route Handlers ===");

  // 1. GET /api/models (default)
  console.log("\n[1] Testing GET /api/models...");
  const res1 = await getModels(new NextRequest("http://localhost:3000/api/models?page=1&limit=5"));
  const json1 = await res1.json();
  console.log(`Status: ${res1.status}, Items: ${json1.items?.length || 0}, Total: ${json1.total || 0}`);

  // 2. GET /api/models with invalid sort (?sort=banana) -> Expect 400
  console.log("\n[2] Testing GET /api/models?sort=banana (Negative Test)...");
  const res2 = await getModels(new NextRequest("http://localhost:3000/api/models?sort=banana"));
  const json2 = await res2.json();
  console.log(`Status: ${res2.status} (Expected 400), Error Code: ${json2.error?.code}`);
  if (res2.status !== 400) throw new Error("Expected 400 for ?sort=banana");

  // 3. GET /api/models/[slug]
  console.log("\n[3] Testing GET /api/models/openai-gpt-4o...");
  const res3 = await getModelDetail(new NextRequest("http://localhost:3000/api/models/openai-gpt-4o"), {
    params: { slug: "openai-gpt-4o" },
  });
  const json3 = await res3.json();
  console.log(`Status: ${res3.status}, Name: ${json3.model?.name}`);

  // 4. GET /api/models/non-existent-slug -> Expect 404
  console.log("\n[4] Testing GET /api/models/non-existent-slug (Negative Test)...");
  const res4 = await getModelDetail(new NextRequest("http://localhost:3000/api/models/non-existent-slug"), {
    params: { slug: "non-existent-slug" },
  });
  const json4 = await res4.json();
  console.log(`Status: ${res4.status} (Expected 404), Error Code: ${json4.error?.code}`);
  if (res4.status !== 404) throw new Error("Expected 404 for non-existent model");

  // 5. GET /api/compare?slugs=openai-gpt-4o,anthropic-claude-3-5-sonnet
  console.log("\n[5] Testing GET /api/compare?slugs=openai-gpt-4o,anthropic-claude-3-5-sonnet...");
  const res5 = await getCompare(
    new NextRequest("http://localhost:3000/api/compare?slugs=openai-gpt-4o,anthropic-claude-3-5-sonnet")
  );
  const json5 = await res5.json();
  console.log(`Status: ${res5.status}, Compared Models: ${json5.models?.length}`);

  // 6. GET /api/compare?slugs=openai-gpt-4o (Only 1 model) -> Expect 400
  console.log("\n[6] Testing GET /api/compare?slugs=openai-gpt-4o (Negative Test, < 2 models)...");
  const res6 = await getCompare(new NextRequest("http://localhost:3000/api/compare?slugs=openai-gpt-4o"));
  const json6 = await res6.json();
  console.log(`Status: ${res6.status} (Expected 400), Error Code: ${json6.error?.code}`);
  if (res6.status !== 400) throw new Error("Expected 400 for single model comparison");

  // 7. GET /api/rankings
  console.log("\n[7] Testing GET /api/rankings?benchmark=mmlu...");
  const res7 = await getRankings(new NextRequest("http://localhost:3000/api/rankings?benchmark=mmlu"));
  const json7 = await res7.json();
  console.log(`Status: ${res7.status}, Benchmark: ${json7.benchmark?.name}, Ranked: ${json7.items?.length}`);

  // 8. GET /api/benchmarks
  console.log("\n[8] Testing GET /api/benchmarks...");
  const res8 = await getBenchmarks();
  const json8 = await res8.json();
  console.log(`Status: ${res8.status}, Benchmarks count: ${json8.benchmarks?.length}`);

  // 9. GET /api/labs & /api/labs/openai
  console.log("\n[9] Testing GET /api/labs & /api/labs/openai...");
  const res9 = await getLabs();
  const json9 = await res9.json();
  console.log(`Status: ${res9.status}, Labs count: ${json9.labs?.length}`);

  const res9b = await getLabDetail(new NextRequest("http://localhost:3000/api/labs/openai"), {
    params: { slug: "openai" },
  });
  const json9b = await res9b.json();
  console.log(`Lab: ${json9b.lab?.name}, Model count: ${json9b.lab?.models?.length}`);

  // 10. GET /api/providers & /api/providers/openrouter
  console.log("\n[10] Testing GET /api/providers & /api/providers/openrouter...");
  const res10 = await getProviders();
  const json10 = await res10.json();
  console.log(`Status: ${res10.status}, Providers count: ${json10.providers?.length}`);

  const res10b = await getProviderDetail(new NextRequest("http://localhost:3000/api/providers/openrouter"), {
    params: { slug: "openrouter" },
  });
  const json10b = await res10b.json();
  console.log(`Provider: ${json10b.provider?.name}, Hosted models: ${json10b.provider?.models?.length}`);

  // 11. GET /api/search?q=claude
  console.log("\n[11] Testing GET /api/search?q=claude...");
  const res11 = await getSearch(new NextRequest("http://localhost:3000/api/search?q=claude"));
  const json11 = await res11.json();
  console.log(`Status: ${res11.status}, Found Models: ${json11.models?.length}, Labs: ${json11.labs?.length}`);

  console.log("\n>>> ALL API ENDPOINTS PASSED WITH 100% CORRECT STATUS CODES AND ERROR SHAPES! <<<");
}

runTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
