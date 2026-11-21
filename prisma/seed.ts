import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LABS = [
  {
    slug: 'openai',
    name: 'OpenAI',
    description: 'Pioneering AI research laboratory known for GPT-4, o1 reasoning models, and ChatGPT.',
    websiteUrl: 'https://openai.com',
    logoUrl: '/logos/openai.svg',
    color: '#10A37F',
  },
  {
    slug: 'anthropic',
    name: 'Anthropic',
    description: 'AI safety and research company building reliable, steerable, and honest AI systems including Claude 3.5.',
    websiteUrl: 'https://anthropic.com',
    logoUrl: '/logos/anthropic.svg',
    color: '#D97706',
  },
  {
    slug: 'google',
    name: 'Google DeepMind',
    description: 'World-leading AI research group developing the multimodal Gemini series and foundational models.',
    websiteUrl: 'https://deepmind.google',
    logoUrl: '/logos/google.svg',
    color: '#4285F4',
  },
  {
    slug: 'meta',
    name: 'Meta AI',
    description: 'Open-science advocate driving frontier open-weight models through the Llama family.',
    websiteUrl: 'https://ai.meta.com',
    logoUrl: '/logos/meta.svg',
    color: '#0668E1',
  },
  {
    slug: 'mistral',
    name: 'Mistral AI',
    description: 'European AI champion creating high-efficiency open and commercial models like Mistral Large and Codestral.',
    websiteUrl: 'https://mistral.ai',
    logoUrl: '/logos/mistral.svg',
    color: '#FA5252',
  },
  {
    slug: 'deepseek',
    name: 'DeepSeek',
    description: 'Innovator in ultra-efficient mixture-of-experts architectures and reasoning models like DeepSeek-R1 and V3.',
    websiteUrl: 'https://deepseek.com',
    logoUrl: '/logos/deepseek.svg',
    color: '#4DABF7',
  },
  {
    slug: 'xai',
    name: 'xAI',
    description: 'AI company building Grok, focused on maximum truth-seeking and deep mathematical reasoning.',
    websiteUrl: 'https://x.ai',
    logoUrl: '/logos/xai.svg',
    color: '#1E293B',
  },
  {
    slug: 'cohere',
    name: 'Cohere',
    description: 'Enterprise AI platform specializing in retrieval-augmented generation (RAG), multilingual models, and rerankers.',
    websiteUrl: 'https://cohere.com',
    logoUrl: '/logos/cohere.svg',
    color: '#D946EF',
  },
  {
    slug: 'qwen',
    name: 'Alibaba (Qwen)',
    description: 'Alibaba Cloud frontier open-weight models excelling in math, coding, and multilingual reasoning.',
    websiteUrl: 'https://qwenlm.github.io',
    logoUrl: '/logos/qwen.svg',
    color: '#FF6A00',
  },
  {
    slug: 'microsoft',
    name: 'Microsoft',
    description: 'Creator of the high-performance small language model (SLM) Phi series and Copilot systems.',
    websiteUrl: 'https://microsoft.com',
    logoUrl: '/logos/microsoft.svg',
    color: '#00A4EF',
  },
  {
    slug: '01-ai',
    name: '01.AI (Yi)',
    description: 'Kai-Fu Lee-founded AI lab known for high-performing bilingual foundation models and Yi-Lightning.',
    websiteUrl: 'https://01.ai',
    logoUrl: '/logos/01ai.svg',
    color: '#10B981',
  },
  {
    slug: 'amazon',
    name: 'Amazon Web Services',
    description: 'Cloud pioneer delivering the enterprise-ready Amazon Nova and Titan foundation models on AWS Bedrock.',
    websiteUrl: 'https://aws.amazon.com/bedrock',
    logoUrl: '/logos/amazon.svg',
    color: '#FF9900',
  },
];

const PROVIDERS = [
  {
    slug: 'openrouter',
    name: 'OpenRouter',
    description: 'Unified AI API routing across 200+ models with competitive fallback, latency matching, and global credits.',
    websiteUrl: 'https://openrouter.ai',
    logoUrl: '/providers/openrouter.svg',
    apiDocUrl: 'https://openrouter.ai/docs',
  },
  {
    slug: 'together',
    name: 'Together AI',
    description: 'High-speed cloud platform for inference and fine-tuning open-source models with dedicated endpoints.',
    websiteUrl: 'https://together.ai',
    logoUrl: '/providers/together.svg',
    apiDocUrl: 'https://docs.together.ai',
  },
  {
    slug: 'fireworks',
    name: 'Fireworks AI',
    description: 'Ultra-fast production inference platform specialized in compound AI systems and sub-second latencies.',
    websiteUrl: 'https://fireworks.ai',
    logoUrl: '/providers/fireworks.svg',
    apiDocUrl: 'https://docs.fireworks.ai',
  },
  {
    slug: 'groq',
    name: 'Groq',
    description: 'Creator of the LPU (Language Processing Unit) inference engine offering breakthrough speeds of 300-800 tps.',
    websiteUrl: 'https://groq.com',
    logoUrl: '/providers/groq.svg',
    apiDocUrl: 'https://console.groq.com/docs',
  },
  {
    slug: 'azure',
    name: 'Microsoft Azure AI',
    description: 'Enterprise-grade hosting with SLA guarantees, compliance certifications, and private VNet connectivity.',
    websiteUrl: 'https://azure.microsoft.com/products/ai-services',
    logoUrl: '/providers/azure.svg',
    apiDocUrl: 'https://learn.microsoft.com/azure/ai-services',
  },
  {
    slug: 'bedrock',
    name: 'AWS Bedrock',
    description: 'Fully managed AWS service offering leading foundation models alongside enterprise security and VPC peering.',
    websiteUrl: 'https://aws.amazon.com/bedrock',
    logoUrl: '/providers/bedrock.svg',
    apiDocUrl: 'https://docs.aws.amazon.com/bedrock',
  },
  {
    slug: 'deepinfra',
    name: 'DeepInfra',
    description: 'Low-cost serverless inference platform for open-source AI models with pay-per-token pricing.',
    websiteUrl: 'https://deepinfra.com',
    logoUrl: '/providers/deepinfra.svg',
    apiDocUrl: 'https://deepinfra.com/docs',
  },
  {
    slug: 'perplexity',
    name: 'Perplexity AI',
    description: 'Online LLM inference enriched with live web search citations and index grounding.',
    websiteUrl: 'https://perplexity.ai',
    logoUrl: '/providers/perplexity.svg',
    apiDocUrl: 'https://docs.perplexity.ai',
  },
  {
    slug: 'cloudflare',
    name: 'Cloudflare Workers AI',
    description: 'Serverless GPU inference running on Cloudflare global edge network across 300+ cities.',
    websiteUrl: 'https://ai.cloudflare.com',
    logoUrl: '/providers/cloudflare.svg',
    apiDocUrl: 'https://developers.cloudflare.com/workers-ai',
  },
  {
    slug: 'vertex',
    name: 'Google Cloud Vertex AI',
    description: 'Enterprise platform for building with Gemini, PaLM, and third-party models on Google Cloud infrastructure.',
    websiteUrl: 'https://cloud.google.com/vertex-ai',
    logoUrl: '/providers/vertex.svg',
    apiDocUrl: 'https://cloud.google.com/vertex-ai/docs',
  },
];

const CAPABILITIES = [
  { slug: 'vision', name: 'Vision / Multimodal', description: 'Understands images, diagrams, charts, and visual media.', icon: 'Eye' },
  { slug: 'tool-calling', name: 'Tool / Function Calling', description: 'Can reliably trigger schema-defined functions and external APIs.', icon: 'Wrench' },
  { slug: 'reasoning', name: 'Deep Reasoning / CoT', description: 'Performs chain-of-thought exploration and step-by-step verification.', icon: 'Brain' },
  { slug: 'json-mode', name: 'Structured JSON Mode', description: 'Guarantees strictly valid JSON output matching specified JSON schemas.', icon: 'CodeXml' },
  { slug: 'streaming', name: 'Token Streaming', description: 'Supports low-latency Server-Sent Events (SSE) token generation.', icon: 'Zap' },
  { slug: 'code-interpreter', name: 'Code Execution', description: 'Generates and validates Python/bash code in sandbox environments.', icon: 'Terminal' },
  { slug: 'system-prompt', name: 'System Instructions', description: 'Accepts customizable developer system prompts with high adherence.', icon: 'Sliders' },
  { slug: 'caching', name: 'Prompt Caching', description: 'Offers cached token pricing discounts for long context prefixes.', icon: 'Layers' },
];

const BENCHMARKS = [
  { slug: 'mmlu', name: 'MMLU', category: 'General Knowledge', description: 'Massive Multitask Language Understanding across 57 academic and professional subjects.', metricUnit: '%', maxScore: 100 },
  { slug: 'gpqa', name: 'GPQA Diamond', category: 'Reasoning', description: 'Graduate-level Google-proof Q&A benchmark designed by domain PhDs.', metricUnit: '%', maxScore: 100 },
  { slug: 'humaneval', name: 'HumanEval', category: 'Coding', description: 'Standard benchmark measuring Python coding problem pass@1 rate.', metricUnit: '%', maxScore: 100 },
  { slug: 'swe-bench', name: 'SWE-bench Verified', category: 'Agentic', description: 'Evaluates models on resolving real GitHub issues from popular open-source repositories.', metricUnit: '%', maxScore: 100 },
  { slug: 'math-500', name: 'MATH-500', category: 'Math', description: 'Challenging high school and collegiate competition mathematics problems.', metricUnit: '%', maxScore: 100 },
  { slug: 'arc-challenge', name: 'ARC Challenge', category: 'Reasoning', description: 'AI2 Reasoning Challenge measuring grade-school science question reasoning.', metricUnit: '%', maxScore: 100 },
  { slug: 'arena-elo', name: 'Chatbot Arena Elo', category: 'Human Preference', description: 'LMSYS community crowd-sourced pairwise blind comparison Elo rating.', metricUnit: 'Elo', maxScore: 1500 },
  { slug: 'gsm8k', name: 'GSM8K', category: 'Math', description: 'Grade School Math 8K word problems assessing multi-step arithmetic.', metricUnit: '%', maxScore: 100 },
];

// Helper to generate a large catalog of models
interface SeedModelDef {
  slug: string;
  name: string;
  description: string;
  labSlug: string;
  modelType: string;
  contextWindow: number;
  maxOutputTokens: number;
  inputPricePerM: number;
  outputPricePerM: number;
  releaseDate: string;
  license: string;
  parameters: string;
  isFeatured: boolean;
  capabilities: string[];
  modalities: { type: string; direction: string }[];
  scores: Record<string, number>;
  providers: { slug: string; inputPriceMultiplier?: number; outputPriceMultiplier?: number; latencyMs: number; throughput: number; uptime: number; isDefault?: boolean }[];
}

const RAW_MODELS: SeedModelDef[] = [
  // OpenAI
  {
    slug: 'openai-gpt-4o',
    name: 'GPT-4o (Omni)',
    description: 'Flagship multimodal model integrating text, visual and audio understanding with high speed and broad capabilities.',
    labSlug: 'openai',
    modelType: 'multimodal',
    contextWindow: 128000,
    maxOutputTokens: 16384,
    inputPricePerM: 2.50,
    outputPricePerM: 10.00,
    releaseDate: '2024-05-13T00:00:00Z',
    license: 'closed',
    parameters: 'MoE ~200B',
    isFeatured: true,
    capabilities: ['vision', 'tool-calling', 'json-mode', 'streaming', 'code-interpreter', 'system-prompt', 'caching'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }, { type: 'audio', direction: 'input' }, { type: 'audio', direction: 'output' }],
    scores: { mmlu: 88.7, gpqa: 53.6, humaneval: 90.2, 'swe-bench': 38.8, 'math-500': 76.6, 'arc-challenge': 96.7, 'arena-elo': 1286, gsm8k: 95.8 },
    providers: [
      { slug: 'openrouter', latencyMs: 380, throughput: 95, uptime: 99.98, isDefault: true },
      { slug: 'azure', latencyMs: 320, throughput: 110, uptime: 99.99 },
    ]
  },
  {
    slug: 'openai-gpt-4o-mini',
    name: 'GPT-4o mini',
    description: 'Fast, lightweight and cost-efficient multimodal small model outperforming GPT-3.5 at a fraction of the cost.',
    labSlug: 'openai',
    modelType: 'multimodal',
    contextWindow: 128000,
    maxOutputTokens: 16384,
    inputPricePerM: 0.15,
    outputPricePerM: 0.60,
    releaseDate: '2024-07-18T00:00:00Z',
    license: 'closed',
    parameters: 'MoE ~15B',
    isFeatured: true,
    capabilities: ['vision', 'tool-calling', 'json-mode', 'streaming', 'system-prompt', 'caching'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }],
    scores: { mmlu: 82.0, gpqa: 40.2, humaneval: 87.2, 'swe-bench': 24.5, 'math-500': 70.2, 'arc-challenge': 93.4, 'arena-elo': 1228, gsm8k: 91.3 },
    providers: [
      { slug: 'openrouter', latencyMs: 220, throughput: 135, uptime: 99.99, isDefault: true },
      { slug: 'azure', latencyMs: 200, throughput: 150, uptime: 99.99 },
    ]
  },
  {
    slug: 'openai-o1',
    name: 'OpenAI o1',
    description: 'Frontier reasoning model trained with reinforcement learning to think before answering complex scientific and coding questions.',
    labSlug: 'openai',
    modelType: 'chat',
    contextWindow: 200000,
    maxOutputTokens: 100000,
    inputPricePerM: 15.00,
    outputPricePerM: 60.00,
    releaseDate: '2024-12-05T00:00:00Z',
    license: 'closed',
    parameters: 'Confidential',
    isFeatured: true,
    capabilities: ['reasoning', 'vision', 'tool-calling', 'json-mode', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }],
    scores: { mmlu: 91.8, gpqa: 75.7, humaneval: 92.4, 'swe-bench': 48.9, 'math-500': 96.4, 'arc-challenge': 97.8, 'arena-elo': 1342, gsm8k: 97.5 },
    providers: [
      { slug: 'openrouter', latencyMs: 1450, throughput: 65, uptime: 99.95, isDefault: true },
      { slug: 'azure', latencyMs: 1300, throughput: 70, uptime: 99.98 },
    ]
  },
  {
    slug: 'openai-o1-mini',
    name: 'OpenAI o1-mini',
    description: 'Fast, cost-effective reasoning model specialized in STEM, competitive programming, and math problem solving.',
    labSlug: 'openai',
    modelType: 'chat',
    contextWindow: 128000,
    maxOutputTokens: 65536,
    inputPricePerM: 1.10,
    outputPricePerM: 4.40,
    releaseDate: '2024-09-12T00:00:00Z',
    license: 'closed',
    parameters: 'Confidential',
    isFeatured: false,
    capabilities: ['reasoning', 'streaming', 'code-interpreter'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 85.2, gpqa: 60.0, humaneval: 92.4, 'swe-bench': 41.6, 'math-500': 90.0, 'arc-challenge': 94.1, 'arena-elo': 1275, gsm8k: 94.8 },
    providers: [
      { slug: 'openrouter', latencyMs: 780, throughput: 90, uptime: 99.97, isDefault: true },
      { slug: 'azure', latencyMs: 690, throughput: 105, uptime: 99.98 },
    ]
  },
  {
    slug: 'openai-o3-mini',
    name: 'OpenAI o3-mini',
    description: 'OpenAI latest state-of-the-art cost-effective reasoning model, providing exceptional STEM, competitive math, and coding abilities with adjustable reasoning effort.',
    labSlug: 'openai',
    modelType: 'chat',
    contextWindow: 200000,
    maxOutputTokens: 100000,
    inputPricePerM: 1.10,
    outputPricePerM: 4.40,
    releaseDate: '2025-01-31T00:00:00Z',
    license: 'closed',
    parameters: 'Confidential',
    isFeatured: true,
    capabilities: ['reasoning', 'tool-calling', 'json-mode', 'streaming', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 92.5, gpqa: 79.7, humaneval: 94.6, 'swe-bench': 49.3, 'math-500': 97.9, 'arc-challenge': 98.2, 'arena-elo': 1358, gsm8k: 98.2 },
    providers: [
      { slug: 'openrouter', latencyMs: 850, throughput: 110, uptime: 99.98, isDefault: true },
      { slug: 'azure', latencyMs: 780, throughput: 125, uptime: 99.99 },
    ]
  },
  {
    slug: 'openai-gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'High-capability predecessor to GPT-4o with robust instruction-following and 128K context window.',
    labSlug: 'openai',
    modelType: 'chat',
    contextWindow: 128000,
    maxOutputTokens: 4096,
    inputPricePerM: 10.00,
    outputPricePerM: 30.00,
    releaseDate: '2024-04-09T00:00:00Z',
    license: 'closed',
    parameters: 'MoE ~1.8T',
    isFeatured: false,
    capabilities: ['vision', 'tool-calling', 'json-mode', 'streaming', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }],
    scores: { mmlu: 86.5, gpqa: 48.0, humaneval: 87.1, 'swe-bench': 33.2, 'math-500': 73.4, 'arc-challenge': 95.3, 'arena-elo': 1255, gsm8k: 92.2 },
    providers: [
      { slug: 'openrouter', latencyMs: 550, throughput: 65, uptime: 99.95, isDefault: true },
      { slug: 'azure', latencyMs: 480, throughput: 75, uptime: 99.99 },
    ]
  },
  {
    slug: 'openai-gpt-3-5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Legacy workhorse model for simple chat, classification, and text transformation pipelines.',
    labSlug: 'openai',
    modelType: 'chat',
    contextWindow: 16385,
    maxOutputTokens: 4096,
    inputPricePerM: 0.50,
    outputPricePerM: 1.50,
    releaseDate: '2023-03-01T00:00:00Z',
    license: 'closed',
    parameters: '20B',
    isFeatured: false,
    capabilities: ['tool-calling', 'json-mode', 'streaming', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 70.0, gpqa: 28.1, humaneval: 48.1, 'swe-bench': 11.2, 'math-500': 52.8, 'arc-challenge': 85.2, 'arena-elo': 1115, gsm8k: 80.5 },
    providers: [
      { slug: 'openrouter', latencyMs: 250, throughput: 110, uptime: 99.99, isDefault: true },
      { slug: 'azure', latencyMs: 220, throughput: 125, uptime: 99.99 },
    ]
  },
  {
    slug: 'openai-text-embedding-3-large',
    name: 'text-embedding-3-large',
    description: 'OpenAI most capable embedding model supporting up to 3072 dimensions and shortened vectors.',
    labSlug: 'openai',
    modelType: 'embedding',
    contextWindow: 8191,
    maxOutputTokens: 3072,
    inputPricePerM: 0.13,
    outputPricePerM: 0.00,
    releaseDate: '2024-01-25T00:00:00Z',
    license: 'closed',
    parameters: 'Confidential',
    isFeatured: false,
    capabilities: ['streaming'],
    modalities: [{ type: 'text', direction: 'input' }],
    scores: { mmlu: 64.6, gpqa: 32.0, humaneval: 40.0, 'swe-bench': 15.0, 'math-500': 45.0, 'arc-challenge': 75.0, 'arena-elo': 980, gsm8k: 60.0 },
    providers: [
      { slug: 'openrouter', latencyMs: 120, throughput: 450, uptime: 99.99, isDefault: true },
      { slug: 'azure', latencyMs: 95, throughput: 550, uptime: 99.99 },
    ]
  },

  // Anthropic
  {
    slug: 'anthropic-claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'State-of-the-art model setting industry standards in code generation, agentic tasks, and vision comprehension.',
    labSlug: 'anthropic',
    modelType: 'chat',
    contextWindow: 200000,
    maxOutputTokens: 8192,
    inputPricePerM: 3.00,
    outputPricePerM: 15.00,
    releaseDate: '2024-10-22T00:00:00Z',
    license: 'closed',
    parameters: 'MoE ~175B',
    isFeatured: true,
    capabilities: ['vision', 'tool-calling', 'json-mode', 'streaming', 'code-interpreter', 'system-prompt', 'caching'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }],
    scores: { mmlu: 88.7, gpqa: 65.0, humaneval: 93.7, 'swe-bench': 49.0, 'math-500': 78.3, 'arc-challenge': 96.7, 'arena-elo': 1308, gsm8k: 96.4 },
    providers: [
      { slug: 'openrouter', latencyMs: 420, throughput: 85, uptime: 99.97, isDefault: true },
      { slug: 'bedrock', latencyMs: 380, throughput: 90, uptime: 99.99 },
      { slug: 'vertex', latencyMs: 410, throughput: 82, uptime: 99.96 },
    ]
  },
  {
    slug: 'anthropic-claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    description: 'Fastest model in Claude 3.5 family, matching Claude 3 Opus intelligence on coding benchmarks at blazing speeds.',
    labSlug: 'anthropic',
    modelType: 'chat',
    contextWindow: 200000,
    maxOutputTokens: 8192,
    inputPricePerM: 0.80,
    outputPricePerM: 4.00,
    releaseDate: '2024-11-04T00:00:00Z',
    license: 'closed',
    parameters: 'Confidential',
    isFeatured: true,
    capabilities: ['tool-calling', 'json-mode', 'streaming', 'system-prompt', 'caching'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 82.5, gpqa: 41.6, humaneval: 88.9, 'swe-bench': 40.6, 'math-500': 75.1, 'arc-challenge': 93.8, 'arena-elo': 1240, gsm8k: 92.5 },
    providers: [
      { slug: 'openrouter', latencyMs: 210, throughput: 130, uptime: 99.98, isDefault: true },
      { slug: 'bedrock', latencyMs: 190, throughput: 145, uptime: 99.99 },
    ]
  },
  {
    slug: 'anthropic-claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Anthropic deep reasoning model known for exceptional writing eloquence, nuance, and complex research analysis.',
    labSlug: 'anthropic',
    modelType: 'chat',
    contextWindow: 200000,
    maxOutputTokens: 4096,
    inputPricePerM: 15.00,
    outputPricePerM: 75.00,
    releaseDate: '2024-03-04T00:00:00Z',
    license: 'closed',
    parameters: 'Confidential',
    isFeatured: false,
    capabilities: ['vision', 'tool-calling', 'json-mode', 'streaming', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }],
    scores: { mmlu: 86.8, gpqa: 50.4, humaneval: 84.9, 'swe-bench': 28.7, 'math-500': 60.1, 'arc-challenge': 96.4, 'arena-elo': 1248, gsm8k: 95.0 },
    providers: [
      { slug: 'openrouter', latencyMs: 650, throughput: 55, uptime: 99.95, isDefault: true },
      { slug: 'bedrock', latencyMs: 590, throughput: 62, uptime: 99.98 },
    ]
  },
  {
    slug: 'anthropic-claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Compact, rapid response model optimized for near-instant customer interactions and content filtering.',
    labSlug: 'anthropic',
    modelType: 'chat',
    contextWindow: 200000,
    maxOutputTokens: 4096,
    inputPricePerM: 0.25,
    outputPricePerM: 1.25,
    releaseDate: '2024-03-07T00:00:00Z',
    license: 'closed',
    parameters: 'Confidential',
    isFeatured: false,
    capabilities: ['vision', 'tool-calling', 'json-mode', 'streaming', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }],
    scores: { mmlu: 75.2, gpqa: 33.3, humaneval: 75.9, 'swe-bench': 20.3, 'math-500': 48.2, 'arc-challenge': 89.2, 'arena-elo': 1180, gsm8k: 88.9 },
    providers: [
      { slug: 'openrouter', latencyMs: 230, throughput: 125, uptime: 99.98, isDefault: true },
      { slug: 'bedrock', latencyMs: 200, throughput: 140, uptime: 99.99 },
    ]
  },

  // Google DeepMind
  {
    slug: 'google-gemini-2-0-flash',
    name: 'Gemini 2.0 Flash',
    description: 'Next-generation multimodal model delivering real-time streaming speeds, native tool usage, and agentic workflows.',
    labSlug: 'google',
    modelType: 'multimodal',
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    inputPricePerM: 0.10,
    outputPricePerM: 0.40,
    releaseDate: '2024-12-11T00:00:00Z',
    license: 'closed',
    parameters: 'MoE ~35B',
    isFeatured: true,
    capabilities: ['vision', 'tool-calling', 'reasoning', 'json-mode', 'streaming', 'code-interpreter', 'system-prompt', 'caching'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }, { type: 'audio', direction: 'input' }, { type: 'video', direction: 'input' }],
    scores: { mmlu: 89.4, gpqa: 62.1, humaneval: 89.8, 'swe-bench': 42.0, 'math-500': 85.0, 'arc-challenge': 97.0, 'arena-elo': 1315, gsm8k: 96.0 },
    providers: [
      { slug: 'openrouter', latencyMs: 280, throughput: 140, uptime: 99.97, isDefault: true },
      { slug: 'vertex', latencyMs: 240, throughput: 165, uptime: 99.99 },
    ]
  },
  {
    slug: 'google-gemini-2-0-flash-thinking',
    name: 'Gemini 2.0 Flash Thinking',
    description: 'Experimental reasoning edition of Gemini 2.0 that generates visible chain-of-thought traces before final answers.',
    labSlug: 'google',
    modelType: 'chat',
    contextWindow: 1048576,
    maxOutputTokens: 65536,
    inputPricePerM: 0.20,
    outputPricePerM: 0.80,
    releaseDate: '2024-12-19T00:00:00Z',
    license: 'closed',
    parameters: 'MoE ~35B',
    isFeatured: true,
    capabilities: ['reasoning', 'vision', 'tool-calling', 'json-mode', 'streaming', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }],
    scores: { mmlu: 90.2, gpqa: 71.4, humaneval: 91.5, 'swe-bench': 45.2, 'math-500': 91.8, 'arc-challenge': 97.4, 'arena-elo': 1334, gsm8k: 97.1 },
    providers: [
      { slug: 'openrouter', latencyMs: 650, throughput: 100, uptime: 99.92, isDefault: true },
      { slug: 'vertex', latencyMs: 580, throughput: 120, uptime: 99.98 },
    ]
  },
  {
    slug: 'google-gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Industry-leading 2 million token context window model excelling in processing full codebases, hours of audio, and video.',
    labSlug: 'google',
    modelType: 'multimodal',
    contextWindow: 2097152,
    maxOutputTokens: 8192,
    inputPricePerM: 1.25,
    outputPricePerM: 5.00,
    releaseDate: '2024-05-14T00:00:00Z',
    license: 'closed',
    parameters: 'MoE Confidential',
    isFeatured: true,
    capabilities: ['vision', 'tool-calling', 'json-mode', 'streaming', 'code-interpreter', 'system-prompt', 'caching'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }, { type: 'audio', direction: 'input' }, { type: 'video', direction: 'input' }],
    scores: { mmlu: 85.9, gpqa: 54.1, humaneval: 84.1, 'swe-bench': 32.5, 'math-500': 67.7, 'arc-challenge': 94.8, 'arena-elo': 1262, gsm8k: 91.7 },
    providers: [
      { slug: 'openrouter', latencyMs: 580, throughput: 75, uptime: 99.96, isDefault: true },
      { slug: 'vertex', latencyMs: 490, throughput: 85, uptime: 99.99 },
    ]
  },
  {
    slug: 'google-gemini-1-5-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Lightweight workhorse optimized for high-volume tasks, fast summaries, and low-latency multimodal retrieval.',
    labSlug: 'google',
    modelType: 'multimodal',
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    inputPricePerM: 0.075,
    outputPricePerM: 0.30,
    releaseDate: '2024-05-14T00:00:00Z',
    license: 'closed',
    parameters: 'MoE Confidential',
    isFeatured: false,
    capabilities: ['vision', 'tool-calling', 'json-mode', 'streaming', 'system-prompt', 'caching'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }, { type: 'audio', direction: 'input' }, { type: 'video', direction: 'input' }],
    scores: { mmlu: 78.9, gpqa: 39.5, humaneval: 74.3, 'swe-bench': 21.0, 'math-500': 55.5, 'arc-challenge': 91.2, 'arena-elo': 1215, gsm8k: 88.0 },
    providers: [
      { slug: 'openrouter', latencyMs: 250, throughput: 140, uptime: 99.99, isDefault: true },
      { slug: 'vertex', latencyMs: 210, throughput: 160, uptime: 99.99 },
    ]
  },
  {
    slug: 'google-gemini-1-5-flash-8b',
    name: 'Gemini 1.5 Flash-8B',
    description: 'Ultra-small 8B density variant tailored for high-frequency chat, classification, and edge batch jobs at minimal cost.',
    labSlug: 'google',
    modelType: 'chat',
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    inputPricePerM: 0.0375,
    outputPricePerM: 0.15,
    releaseDate: '2024-10-03T00:00:00Z',
    license: 'closed',
    parameters: '8B',
    isFeatured: false,
    capabilities: ['vision', 'tool-calling', 'json-mode', 'streaming', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }],
    scores: { mmlu: 72.0, gpqa: 31.0, humaneval: 68.4, 'swe-bench': 14.8, 'math-500': 45.0, 'arc-challenge': 86.5, 'arena-elo': 1162, gsm8k: 82.5 },
    providers: [
      { slug: 'openrouter', latencyMs: 180, throughput: 180, uptime: 99.98, isDefault: true },
      { slug: 'vertex', latencyMs: 150, throughput: 210, uptime: 99.99 },
    ]
  },

  // DeepSeek
  {
    slug: 'deepseek-v3',
    name: 'DeepSeek-V3',
    description: 'Breakthrough 671B Mixture-of-Experts model rivaling top closed frontier models with extreme inference cost-efficiency.',
    labSlug: 'deepseek',
    modelType: 'chat',
    contextWindow: 128000,
    maxOutputTokens: 8192,
    inputPricePerM: 0.27,
    outputPricePerM: 1.10,
    releaseDate: '2024-12-26T00:00:00Z',
    license: 'open',
    parameters: 'MoE 671B (37B active)',
    isFeatured: true,
    capabilities: ['tool-calling', 'json-mode', 'streaming', 'code-interpreter', 'system-prompt', 'caching'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 88.5, gpqa: 59.1, humaneval: 82.6, 'swe-bench': 42.0, 'math-500': 89.3, 'arc-challenge': 96.5, 'arena-elo': 1310, gsm8k: 95.3 },
    providers: [
      { slug: 'openrouter', latencyMs: 390, throughput: 65, uptime: 99.92, isDefault: true },
      { slug: 'together', latencyMs: 340, throughput: 78, uptime: 99.95 },
      { slug: 'fireworks', latencyMs: 310, throughput: 90, uptime: 99.96 },
      { slug: 'deepinfra', latencyMs: 360, throughput: 70, uptime: 99.90 },
    ]
  },
  {
    slug: 'deepseek-r1',
    name: 'DeepSeek-R1',
    description: 'Groundbreaking open reasoning model utilizing large-scale RL, competitive with OpenAI o1 across math, code, and science.',
    labSlug: 'deepseek',
    modelType: 'chat',
    contextWindow: 128000,
    maxOutputTokens: 65536,
    inputPricePerM: 0.55,
    outputPricePerM: 2.19,
    releaseDate: '2025-01-20T00:00:00Z',
    license: 'open',
    parameters: 'MoE 671B (37B active)',
    isFeatured: true,
    capabilities: ['reasoning', 'streaming', 'code-interpreter'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 90.8, gpqa: 71.5, humaneval: 92.8, 'swe-bench': 49.2, 'math-500': 97.3, 'arc-challenge': 97.2, 'arena-elo': 1348, gsm8k: 97.8 },
    providers: [
      { slug: 'openrouter', latencyMs: 950, throughput: 45, uptime: 99.88, isDefault: true },
      { slug: 'together', latencyMs: 820, throughput: 55, uptime: 99.92 },
      { slug: 'fireworks', latencyMs: 760, throughput: 62, uptime: 99.94 },
      { slug: 'groq', latencyMs: 420, throughput: 110, uptime: 99.90 },
    ]
  },
  {
    slug: 'deepseek-coder-v2-0724',
    name: 'DeepSeek Coder V2 0724',
    description: 'MoE coding model trained on 338+ programming languages with exceptional competitive programming benchmarks.',
    labSlug: 'deepseek',
    modelType: 'code',
    contextWindow: 128000,
    maxOutputTokens: 8192,
    inputPricePerM: 0.14,
    outputPricePerM: 0.28,
    releaseDate: '2024-07-24T00:00:00Z',
    license: 'open',
    parameters: 'MoE 236B (21B active)',
    isFeatured: false,
    capabilities: ['tool-calling', 'json-mode', 'streaming', 'code-interpreter'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 79.2, gpqa: 41.5, humaneval: 90.2, 'swe-bench': 36.4, 'math-500': 75.7, 'arc-challenge': 92.1, 'arena-elo': 1235, gsm8k: 92.0 },
    providers: [
      { slug: 'openrouter', latencyMs: 310, throughput: 90, uptime: 99.95, isDefault: true },
      { slug: 'together', latencyMs: 280, throughput: 105, uptime: 99.96 },
    ]
  },

  // Meta AI
  {
    slug: 'meta-llama-3-3-70b-instruct',
    name: 'Llama 3.3 70B Instruct',
    description: 'Flagship open-weight 70B model matching the performance of the earlier 405B model at 5x lower hardware requirements.',
    labSlug: 'meta',
    modelType: 'chat',
    contextWindow: 128000,
    maxOutputTokens: 8192,
    inputPricePerM: 0.40,
    outputPricePerM: 0.70,
    releaseDate: '2024-12-06T00:00:00Z',
    license: 'open',
    parameters: '70B',
    isFeatured: true,
    capabilities: ['tool-calling', 'json-mode', 'streaming', 'code-interpreter', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 88.6, gpqa: 52.8, humaneval: 87.8, 'swe-bench': 38.0, 'math-500': 78.4, 'arc-challenge': 96.0, 'arena-elo': 1290, gsm8k: 94.6 },
    providers: [
      { slug: 'groq', latencyMs: 140, throughput: 280, uptime: 99.98, isDefault: true },
      { slug: 'together', latencyMs: 250, throughput: 120, uptime: 99.96 },
      { slug: 'fireworks', latencyMs: 210, throughput: 140, uptime: 99.97 },
      { slug: 'openrouter', latencyMs: 280, throughput: 100, uptime: 99.95 },
      { slug: 'bedrock', latencyMs: 310, throughput: 95, uptime: 99.99 },
    ]
  },
  {
    slug: 'meta-llama-3-1-405b-instruct',
    name: 'Llama 3.1 405B Instruct',
    description: 'World first frontier-class openly available foundation model with 405 billion parameters, ideal for distillation and synthetic data.',
    labSlug: 'meta',
    modelType: 'chat',
    contextWindow: 128000,
    maxOutputTokens: 4096,
    inputPricePerM: 2.00,
    outputPricePerM: 2.00,
    releaseDate: '2024-07-23T00:00:00Z',
    license: 'open',
    parameters: '405B',
    isFeatured: true,
    capabilities: ['tool-calling', 'json-mode', 'streaming', 'code-interpreter', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 88.6, gpqa: 51.1, humaneval: 89.0, 'swe-bench': 38.8, 'math-500': 73.8, 'arc-challenge': 96.9, 'arena-elo': 1284, gsm8k: 96.8 },
    providers: [
      { slug: 'fireworks', latencyMs: 480, throughput: 65, uptime: 99.94, isDefault: true },
      { slug: 'together', latencyMs: 520, throughput: 60, uptime: 99.92 },
      { slug: 'openrouter', latencyMs: 560, throughput: 55, uptime: 99.90 },
      { slug: 'bedrock', latencyMs: 510, throughput: 62, uptime: 99.98 },
    ]
  },
  {
    slug: 'meta-llama-3-1-70b-instruct',
    name: 'Llama 3.1 70B Instruct',
    description: 'High-utility 70B foundation model fine-tuned for multilingual conversations, agentic tool workflows, and summarization.',
    labSlug: 'meta',
    modelType: 'chat',
    contextWindow: 128000,
    maxOutputTokens: 4096,
    inputPricePerM: 0.35,
    outputPricePerM: 0.40,
    releaseDate: '2024-07-23T00:00:00Z',
    license: 'open',
    parameters: '70B',
    isFeatured: false,
    capabilities: ['tool-calling', 'json-mode', 'streaming', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 86.0, gpqa: 48.3, humaneval: 80.5, 'swe-bench': 32.0, 'math-500': 68.0, 'arc-challenge': 94.8, 'arena-elo': 1258, gsm8k: 93.0 },
    providers: [
      { slug: 'groq', latencyMs: 150, throughput: 270, uptime: 99.98, isDefault: true },
      { slug: 'together', latencyMs: 270, throughput: 110, uptime: 99.96 },
      { slug: 'openrouter', latencyMs: 290, throughput: 95, uptime: 99.95 },
    ]
  },
  {
    slug: 'meta-llama-3-1-8b-instruct',
    name: 'Llama 3.1 8B Instruct',
    description: 'High-speed compact open model capable of edge deployment, rapid classification, and local inference.',
    labSlug: 'meta',
    modelType: 'chat',
    contextWindow: 128000,
    maxOutputTokens: 4096,
    inputPricePerM: 0.05,
    outputPricePerM: 0.08,
    releaseDate: '2024-07-23T00:00:00Z',
    license: 'open',
    parameters: '8B',
    isFeatured: false,
    capabilities: ['tool-calling', 'json-mode', 'streaming', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 73.0, gpqa: 32.8, humaneval: 72.6, 'swe-bench': 18.0, 'math-500': 51.9, 'arc-challenge': 88.5, 'arena-elo': 1175, gsm8k: 84.5 },
    providers: [
      { slug: 'groq', latencyMs: 80, throughput: 480, uptime: 99.99, isDefault: true },
      { slug: 'cloudflare', latencyMs: 110, throughput: 220, uptime: 99.98 },
      { slug: 'together', latencyMs: 140, throughput: 200, uptime: 99.97 },
      { slug: 'openrouter', latencyMs: 160, throughput: 180, uptime: 99.95 },
    ]
  },

  // Mistral AI
  {
    slug: 'mistral-large-2411',
    name: 'Mistral Large 2 (2411)',
    description: 'Top-tier commercial flagship from Mistral AI with 128K context, high-end reasoning, and native support for 80+ coding languages.',
    labSlug: 'mistral',
    modelType: 'chat',
    contextWindow: 128000,
    maxOutputTokens: 8192,
    inputPricePerM: 2.00,
    outputPricePerM: 6.00,
    releaseDate: '2024-11-18T00:00:00Z',
    license: 'closed',
    parameters: '123B',
    isFeatured: true,
    capabilities: ['tool-calling', 'json-mode', 'streaming', 'code-interpreter', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 88.1, gpqa: 54.0, humaneval: 91.5, 'swe-bench': 38.0, 'math-500': 76.8, 'arc-challenge': 96.0, 'arena-elo': 1278, gsm8k: 93.8 },
    providers: [
      { slug: 'openrouter', latencyMs: 360, throughput: 85, uptime: 99.96, isDefault: true },
      { slug: 'azure', latencyMs: 310, throughput: 95, uptime: 99.98 },
      { slug: 'bedrock', latencyMs: 340, throughput: 90, uptime: 99.99 },
    ]
  },
  {
    slug: 'mistral-pixtral-large',
    name: 'Pixtral Large (124B)',
    description: 'Multimodal frontier model combining Mistral Large reasoning with state-of-the-art visual understanding of charts and documents.',
    labSlug: 'mistral',
    modelType: 'multimodal',
    contextWindow: 128000,
    maxOutputTokens: 8192,
    inputPricePerM: 2.00,
    outputPricePerM: 6.00,
    releaseDate: '2024-11-18T00:00:00Z',
    license: 'closed',
    parameters: '124B',
    isFeatured: false,
    capabilities: ['vision', 'tool-calling', 'json-mode', 'streaming'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }],
    scores: { mmlu: 87.5, gpqa: 51.5, humaneval: 89.0, 'swe-bench': 35.5, 'math-500': 74.0, 'arc-challenge': 95.5, 'arena-elo': 1265, gsm8k: 92.5 },
    providers: [
      { slug: 'openrouter', latencyMs: 440, throughput: 75, uptime: 99.95, isDefault: true },
    ]
  },
  {
    slug: 'mistral-codestral-2501',
    name: 'Codestral 2501',
    description: 'Dedicated generative coding model optimized for fill-in-the-middle code completion, test generation, and refactoring.',
    labSlug: 'mistral',
    modelType: 'code',
    contextWindow: 256000,
    maxOutputTokens: 8192,
    inputPricePerM: 0.30,
    outputPricePerM: 0.90,
    releaseDate: '2025-01-14T00:00:00Z',
    license: 'open',
    parameters: '22B',
    isFeatured: false,
    capabilities: ['tool-calling', 'json-mode', 'streaming', 'code-interpreter'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 81.2, gpqa: 43.0, humaneval: 88.4, 'swe-bench': 36.2, 'math-500': 71.5, 'arc-challenge': 92.0, 'arena-elo': 1238, gsm8k: 90.0 },
    providers: [
      { slug: 'together', latencyMs: 220, throughput: 130, uptime: 99.96, isDefault: true },
      { slug: 'openrouter', latencyMs: 260, throughput: 110, uptime: 99.95 },
    ]
  },
  {
    slug: 'mistral-nemo-12b',
    name: 'Mistral NeMo 12B',
    description: 'Collaborative model developed with NVIDIA boasting 128K context and trained using FP8 quantization primitives.',
    labSlug: 'mistral',
    modelType: 'chat',
    contextWindow: 128000,
    maxOutputTokens: 4096,
    inputPricePerM: 0.15,
    outputPricePerM: 0.15,
    releaseDate: '2024-07-18T00:00:00Z',
    license: 'open',
    parameters: '12B',
    isFeatured: false,
    capabilities: ['tool-calling', 'json-mode', 'streaming', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 76.5, gpqa: 35.8, humaneval: 74.0, 'swe-bench': 22.0, 'math-500': 55.4, 'arc-challenge': 89.5, 'arena-elo': 1195, gsm8k: 86.0 },
    providers: [
      { slug: 'openrouter', latencyMs: 190, throughput: 160, uptime: 99.98, isDefault: true },
      { slug: 'together', latencyMs: 160, throughput: 180, uptime: 99.97 },
    ]
  },

  // xAI
  {
    slug: 'xai-grok-2',
    name: 'Grok-2',
    description: 'Frontier AI model developed by xAI, excelling in reasoning, real-time knowledge synthesis, and coding tasks.',
    labSlug: 'xai',
    modelType: 'chat',
    contextWindow: 131072,
    maxOutputTokens: 8192,
    inputPricePerM: 2.00,
    outputPricePerM: 10.00,
    releaseDate: '2024-08-13T00:00:00Z',
    license: 'closed',
    parameters: 'MoE Confidential',
    isFeatured: true,
    capabilities: ['tool-calling', 'json-mode', 'streaming', 'code-interpreter', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 87.5, gpqa: 56.0, humaneval: 88.4, 'swe-bench': 37.5, 'math-500': 76.1, 'arc-challenge': 95.8, 'arena-elo': 1292, gsm8k: 93.5 },
    providers: [
      { slug: 'openrouter', latencyMs: 410, throughput: 80, uptime: 99.94, isDefault: true },
    ]
  },
  {
    slug: 'xai-grok-2-vision',
    name: 'Grok-2 Vision',
    description: 'Multimodal Grok model analyzing complex technical schematics, screenshots, handwriting, and photographs.',
    labSlug: 'xai',
    modelType: 'multimodal',
    contextWindow: 32768,
    maxOutputTokens: 8192,
    inputPricePerM: 2.00,
    outputPricePerM: 10.00,
    releaseDate: '2024-08-13T00:00:00Z',
    license: 'closed',
    parameters: 'MoE Confidential',
    isFeatured: false,
    capabilities: ['vision', 'tool-calling', 'json-mode', 'streaming'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }],
    scores: { mmlu: 86.8, gpqa: 52.4, humaneval: 85.0, 'swe-bench': 33.0, 'math-500': 72.0, 'arc-challenge': 95.0, 'arena-elo': 1272, gsm8k: 91.0 },
    providers: [
      { slug: 'openrouter', latencyMs: 460, throughput: 75, uptime: 99.93, isDefault: true },
    ]
  },

  // Alibaba / Qwen
  {
    slug: 'qwen-2-5-72b-instruct',
    name: 'Qwen 2.5 72B Instruct',
    description: 'Leading open-weight instruction model outperforming many proprietary models in STEM, multilingual translation, and reasoning.',
    labSlug: 'qwen',
    modelType: 'chat',
    contextWindow: 131072,
    maxOutputTokens: 8192,
    inputPricePerM: 0.35,
    outputPricePerM: 0.40,
    releaseDate: '2024-09-19T00:00:00Z',
    license: 'open',
    parameters: '72B',
    isFeatured: true,
    capabilities: ['tool-calling', 'json-mode', 'streaming', 'code-interpreter', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 86.2, gpqa: 49.5, humaneval: 86.4, 'swe-bench': 35.8, 'math-500': 83.1, 'arc-challenge': 95.2, 'arena-elo': 1276, gsm8k: 95.2 },
    providers: [
      { slug: 'together', latencyMs: 240, throughput: 115, uptime: 99.96, isDefault: true },
      { slug: 'fireworks', latencyMs: 220, throughput: 130, uptime: 99.97 },
      { slug: 'openrouter', latencyMs: 280, throughput: 95, uptime: 99.95 },
      { slug: 'deepinfra', latencyMs: 290, throughput: 90, uptime: 99.91 },
    ]
  },
  {
    slug: 'qwen-2-5-coder-32b-instruct',
    name: 'Qwen 2.5 Coder 32B Instruct',
    description: 'Renowned open coding model capable of matching GPT-4o level performance on software engineering evaluations.',
    labSlug: 'qwen',
    modelType: 'code',
    contextWindow: 131072,
    maxOutputTokens: 8192,
    inputPricePerM: 0.18,
    outputPricePerM: 0.22,
    releaseDate: '2024-11-12T00:00:00Z',
    license: 'open',
    parameters: '32B',
    isFeatured: true,
    capabilities: ['tool-calling', 'json-mode', 'streaming', 'code-interpreter'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 82.5, gpqa: 44.0, humaneval: 92.7, 'swe-bench': 41.5, 'math-500': 78.5, 'arc-challenge': 93.0, 'arena-elo': 1252, gsm8k: 92.8 },
    providers: [
      { slug: 'together', latencyMs: 190, throughput: 145, uptime: 99.97, isDefault: true },
      { slug: 'fireworks', latencyMs: 170, throughput: 165, uptime: 99.98 },
      { slug: 'openrouter', latencyMs: 220, throughput: 125, uptime: 99.96 },
    ]
  },
  {
    slug: 'qwen-2-5-math-72b-instruct',
    name: 'Qwen 2.5 Math 72B Instruct',
    description: 'World-record specialized open math model utilizing CoT and tool-integrated reasoning (TIR).',
    labSlug: 'qwen',
    modelType: 'chat',
    contextWindow: 32768,
    maxOutputTokens: 4096,
    inputPricePerM: 0.35,
    outputPricePerM: 0.40,
    releaseDate: '2024-09-19T00:00:00Z',
    license: 'open',
    parameters: '72B',
    isFeatured: false,
    capabilities: ['reasoning', 'streaming', 'code-interpreter'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 84.0, gpqa: 46.2, humaneval: 81.0, 'swe-bench': 29.0, 'math-500': 92.5, 'arc-challenge': 94.0, 'arena-elo': 1230, gsm8k: 97.4 },
    providers: [
      { slug: 'together', latencyMs: 260, throughput: 105, uptime: 99.95, isDefault: true },
      { slug: 'openrouter', latencyMs: 310, throughput: 85, uptime: 99.92 },
    ]
  },
  {
    slug: 'qwen-2-5-vl-72b-instruct',
    name: 'Qwen 2.5 VL 72B Instruct',
    description: 'Vision-language model with native temporal video comprehension and fine-grained visual grounding.',
    labSlug: 'qwen',
    modelType: 'multimodal',
    contextWindow: 128000,
    maxOutputTokens: 8192,
    inputPricePerM: 0.50,
    outputPricePerM: 0.80,
    releaseDate: '2025-01-27T00:00:00Z',
    license: 'open',
    parameters: '72B',
    isFeatured: false,
    capabilities: ['vision', 'tool-calling', 'json-mode', 'streaming'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }, { type: 'video', direction: 'input' }],
    scores: { mmlu: 85.5, gpqa: 48.0, humaneval: 84.5, 'swe-bench': 33.0, 'math-500': 79.2, 'arc-challenge': 94.5, 'arena-elo': 1260, gsm8k: 93.0 },
    providers: [
      { slug: 'together', latencyMs: 320, throughput: 90, uptime: 99.94, isDefault: true },
      { slug: 'openrouter', latencyMs: 370, throughput: 75, uptime: 99.91 },
    ]
  },

  // Cohere
  {
    slug: 'cohere-command-r-plus-08-2024',
    name: 'Command R+ (08-2024)',
    description: 'Enterprise flagship optimized for multi-step agents, grounded RAG with citations, and 10 key global business languages.',
    labSlug: 'cohere',
    modelType: 'chat',
    contextWindow: 128000,
    maxOutputTokens: 4096,
    inputPricePerM: 2.50,
    outputPricePerM: 10.00,
    releaseDate: '2024-08-22T00:00:00Z',
    license: 'closed',
    parameters: '104B',
    isFeatured: false,
    capabilities: ['tool-calling', 'json-mode', 'streaming', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 83.2, gpqa: 43.1, humaneval: 78.4, 'swe-bench': 29.5, 'math-500': 64.0, 'arc-challenge': 92.4, 'arena-elo': 1238, gsm8k: 89.2 },
    providers: [
      { slug: 'azure', latencyMs: 290, throughput: 110, uptime: 99.99, isDefault: true },
      { slug: 'bedrock', latencyMs: 310, throughput: 105, uptime: 99.98 },
      { slug: 'openrouter', latencyMs: 340, throughput: 90, uptime: 99.96 },
    ]
  },
  {
    slug: 'cohere-command-r-08-2024',
    name: 'Command R (08-2024)',
    description: 'Fast, scalable model built for production RAG pipelines with verifiable citations and enterprise document connectors.',
    labSlug: 'cohere',
    modelType: 'chat',
    contextWindow: 128000,
    maxOutputTokens: 4096,
    inputPricePerM: 0.15,
    outputPricePerM: 0.60,
    releaseDate: '2024-08-22T00:00:00Z',
    license: 'closed',
    parameters: '35B',
    isFeatured: false,
    capabilities: ['tool-calling', 'json-mode', 'streaming', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 76.5, gpqa: 34.0, humaneval: 71.0, 'swe-bench': 21.0, 'math-500': 52.0, 'arc-challenge': 88.0, 'arena-elo': 1184, gsm8k: 84.0 },
    providers: [
      { slug: 'azure', latencyMs: 180, throughput: 155, uptime: 99.99, isDefault: true },
      { slug: 'bedrock', latencyMs: 195, throughput: 145, uptime: 99.98 },
      { slug: 'openrouter', latencyMs: 220, throughput: 130, uptime: 99.96 },
    ]
  },
  {
    slug: 'cohere-embed-v3-english',
    name: 'Embed v3 English',
    description: 'Enterprise leading embedding model tailored for dense semantic retrieval with compression support.',
    labSlug: 'cohere',
    modelType: 'embedding',
    contextWindow: 512,
    maxOutputTokens: 1024,
    inputPricePerM: 0.10,
    outputPricePerM: 0.00,
    releaseDate: '2023-11-02T00:00:00Z',
    license: 'closed',
    parameters: 'Confidential',
    isFeatured: false,
    capabilities: ['streaming'],
    modalities: [{ type: 'text', direction: 'input' }],
    scores: { mmlu: 62.0, gpqa: 30.0, humaneval: 35.0, 'swe-bench': 12.0, 'math-500': 40.0, 'arc-challenge': 72.0, 'arena-elo': 950, gsm8k: 55.0 },
    providers: [
      { slug: 'azure', latencyMs: 80, throughput: 600, uptime: 99.99, isDefault: true },
      { slug: 'bedrock', latencyMs: 85, throughput: 580, uptime: 99.99 },
    ]
  },

  // Microsoft
  {
    slug: 'microsoft-phi-4-14b',
    name: 'Phi-4 (14B)',
    description: 'Compact 14B parameter powerhouse achieving state-of-the-art synthetic reasoning, math, and STEM understanding.',
    labSlug: 'microsoft',
    modelType: 'chat',
    contextWindow: 16384,
    maxOutputTokens: 4096,
    inputPricePerM: 0.20,
    outputPricePerM: 0.40,
    releaseDate: '2024-12-12T00:00:00Z',
    license: 'open',
    parameters: '14B',
    isFeatured: true,
    capabilities: ['reasoning', 'tool-calling', 'json-mode', 'streaming', 'code-interpreter'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 84.8, gpqa: 46.5, humaneval: 82.5, 'swe-bench': 33.4, 'math-500': 80.4, 'arc-challenge': 93.8, 'arena-elo': 1245, gsm8k: 93.2 },
    providers: [
      { slug: 'azure', latencyMs: 160, throughput: 180, uptime: 99.99, isDefault: true },
      { slug: 'openrouter', latencyMs: 210, throughput: 140, uptime: 99.95 },
    ]
  },
  {
    slug: 'microsoft-phi-3-5-mini-instruct',
    name: 'Phi-3.5 Mini Instruct',
    description: 'Lightweight 3.8B model equipped with 128K context window capable of complex multilingual reasoning on mobile devices.',
    labSlug: 'microsoft',
    modelType: 'chat',
    contextWindow: 128000,
    maxOutputTokens: 4096,
    inputPricePerM: 0.05,
    outputPricePerM: 0.10,
    releaseDate: '2024-08-20T00:00:00Z',
    license: 'open',
    parameters: '3.8B',
    isFeatured: false,
    capabilities: ['tool-calling', 'json-mode', 'streaming'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 69.5, gpqa: 29.8, humaneval: 68.2, 'swe-bench': 14.5, 'math-500': 47.0, 'arc-challenge': 85.0, 'arena-elo': 1140, gsm8k: 81.2 },
    providers: [
      { slug: 'azure', latencyMs: 90, throughput: 340, uptime: 99.99, isDefault: true },
      { slug: 'openrouter', latencyMs: 140, throughput: 230, uptime: 99.96 },
    ]
  },
  {
    slug: 'microsoft-wizardlm-2-8x22b',
    name: 'WizardLM-2 8x22B',
    description: 'MoE model trained with synthetic evol-instruct methodologies matching proprietary frontier conversational quality.',
    labSlug: 'microsoft',
    modelType: 'chat',
    contextWindow: 65536,
    maxOutputTokens: 4096,
    inputPricePerM: 0.65,
    outputPricePerM: 1.00,
    releaseDate: '2024-04-15T00:00:00Z',
    license: 'open',
    parameters: 'MoE 8x22B',
    isFeatured: false,
    capabilities: ['tool-calling', 'json-mode', 'streaming', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 82.0, gpqa: 42.0, humaneval: 78.5, 'swe-bench': 28.0, 'math-500': 65.0, 'arc-challenge': 92.0, 'arena-elo': 1242, gsm8k: 88.5 },
    providers: [
      { slug: 'together', latencyMs: 310, throughput: 85, uptime: 99.94, isDefault: true },
      { slug: 'openrouter', latencyMs: 350, throughput: 75, uptime: 99.92 },
    ]
  },

  // 01.AI (Yi)
  {
    slug: '01-ai-yi-lightning',
    name: 'Yi-Lightning',
    description: 'High-speed flagship bilingual model from 01.AI offering world-class benchmark results on LMSYS Chatbot Arena.',
    labSlug: '01-ai',
    modelType: 'chat',
    contextWindow: 128000,
    maxOutputTokens: 8192,
    inputPricePerM: 0.14,
    outputPricePerM: 0.14,
    releaseDate: '2024-10-15T00:00:00Z',
    license: 'closed',
    parameters: 'MoE ~100B',
    isFeatured: true,
    capabilities: ['tool-calling', 'json-mode', 'streaming', 'code-interpreter', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 85.0, gpqa: 48.0, humaneval: 84.0, 'swe-bench': 34.0, 'math-500': 76.0, 'arc-challenge': 94.0, 'arena-elo': 1290, gsm8k: 92.0 },
    providers: [
      { slug: 'openrouter', latencyMs: 240, throughput: 130, uptime: 99.96, isDefault: true },
    ]
  },
  {
    slug: '01-ai-yi-1-5-34b-chat',
    name: 'Yi-1.5 34B Chat',
    description: 'Open-weights bilingual model delivering strong coding and mathematical problem solving performance.',
    labSlug: '01-ai',
    modelType: 'chat',
    contextWindow: 32768,
    maxOutputTokens: 4096,
    inputPricePerM: 0.18,
    outputPricePerM: 0.22,
    releaseDate: '2024-05-13T00:00:00Z',
    license: 'open',
    parameters: '34B',
    isFeatured: false,
    capabilities: ['tool-calling', 'json-mode', 'streaming'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 78.4, gpqa: 37.0, humaneval: 74.2, 'swe-bench': 22.5, 'math-500': 58.0, 'arc-challenge': 89.0, 'arena-elo': 1205, gsm8k: 86.4 },
    providers: [
      { slug: 'together', latencyMs: 190, throughput: 140, uptime: 99.97, isDefault: true },
      { slug: 'openrouter', latencyMs: 230, throughput: 115, uptime: 99.95 },
    ]
  },

  // Amazon AWS
  {
    slug: 'amazon-nova-pro',
    name: 'Amazon Nova Pro',
    description: 'Frontier multimodal model designed for complex agentic workflows, long context processing, and precision reasoning.',
    labSlug: 'amazon',
    modelType: 'multimodal',
    contextWindow: 300000,
    maxOutputTokens: 8192,
    inputPricePerM: 0.80,
    outputPricePerM: 3.20,
    releaseDate: '2024-12-03T00:00:00Z',
    license: 'closed',
    parameters: 'Confidential',
    isFeatured: true,
    capabilities: ['vision', 'tool-calling', 'json-mode', 'streaming', 'code-interpreter', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }, { type: 'video', direction: 'input' }],
    scores: { mmlu: 85.8, gpqa: 49.0, humaneval: 84.8, 'swe-bench': 34.0, 'math-500': 72.0, 'arc-challenge': 94.6, 'arena-elo': 1260, gsm8k: 91.5 },
    providers: [
      { slug: 'bedrock', latencyMs: 280, throughput: 115, uptime: 99.99, isDefault: true },
    ]
  },
  {
    slug: 'amazon-nova-lite',
    name: 'Amazon Nova Lite',
    description: 'Fast and low-cost multimodal model suited for processing images, video frames, and real-time document search.',
    labSlug: 'amazon',
    modelType: 'multimodal',
    contextWindow: 300000,
    maxOutputTokens: 8192,
    inputPricePerM: 0.06,
    outputPricePerM: 0.24,
    releaseDate: '2024-12-03T00:00:00Z',
    license: 'closed',
    parameters: 'Confidential',
    isFeatured: false,
    capabilities: ['vision', 'tool-calling', 'json-mode', 'streaming', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }, { type: 'video', direction: 'input' }],
    scores: { mmlu: 77.2, gpqa: 36.5, humaneval: 72.0, 'swe-bench': 20.0, 'math-500': 53.0, 'arc-challenge': 89.0, 'arena-elo': 1190, gsm8k: 85.0 },
    providers: [
      { slug: 'bedrock', latencyMs: 160, throughput: 180, uptime: 99.99, isDefault: true },
    ]
  },
  {
    slug: 'amazon-nova-micro',
    name: 'Amazon Nova Micro',
    description: 'Ultra-fast text-only model delivering lowest latency and cost on AWS Bedrock for text processing tasks.',
    labSlug: 'amazon',
    modelType: 'chat',
    contextWindow: 128000,
    maxOutputTokens: 4096,
    inputPricePerM: 0.035,
    outputPricePerM: 0.14,
    releaseDate: '2024-12-03T00:00:00Z',
    license: 'closed',
    parameters: 'Confidential',
    isFeatured: false,
    capabilities: ['tool-calling', 'json-mode', 'streaming', 'system-prompt'],
    modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
    scores: { mmlu: 71.5, gpqa: 30.0, humaneval: 64.0, 'swe-bench': 13.5, 'math-500': 44.0, 'arc-challenge': 85.5, 'arena-elo': 1145, gsm8k: 80.0 },
    providers: [
      { slug: 'bedrock', latencyMs: 90, throughput: 280, uptime: 99.99, isDefault: true },
    ]
  },
];

// Helper to expand models programmatically to reach 85-100 realistic models
function generateExtendedCatalog(): SeedModelDef[] {
  const models = [...RAW_MODELS];

  // DeepSeek-R1 Distill Series
  const distillR1Sizes = [
    { size: '70B', base: 'Llama-3.3-70B', params: '70B', inPrice: 0.25, outPrice: 0.85, mmlu: 88.2, gpqa: 65.2, he: 89.0, swe: 42.0, math: 94.5, elo: 1318 },
    { size: '32B', base: 'Qwen-2.5-32B', params: '32B', inPrice: 0.18, outPrice: 0.60, mmlu: 86.5, gpqa: 62.0, he: 87.5, swe: 39.0, math: 92.8, elo: 1295 },
    { size: '14B', base: 'Qwen-2.5-14B', params: '14B', inPrice: 0.10, outPrice: 0.35, mmlu: 82.0, gpqa: 55.4, he: 83.0, swe: 32.0, math: 88.0, elo: 1250 },
    { size: '8B', base: 'Llama-3.1-8B', params: '8B', inPrice: 0.06, outPrice: 0.20, mmlu: 78.5, gpqa: 49.0, he: 79.5, swe: 25.0, math: 84.2, elo: 1215 },
    { size: '1.5B', base: 'Qwen-2.5-1.5B', params: '1.5B', inPrice: 0.03, outPrice: 0.10, mmlu: 68.0, gpqa: 38.0, he: 65.0, swe: 15.0, math: 75.0, elo: 1120 },
  ];

  for (const item of distillR1Sizes) {
    models.push({
      slug: `deepseek-r1-distill-${item.base.toLowerCase()}`,
      name: `DeepSeek-R1-Distill-${item.base}`,
      description: `Fine-tuned on reasoning patterns synthesized by DeepSeek-R1, distilling high-tier mathematical and coding capabilities into ${item.params}.`,
      labSlug: 'deepseek',
      modelType: 'chat',
      contextWindow: 128000,
      maxOutputTokens: 16384,
      inputPricePerM: item.inPrice,
      outputPricePerM: item.outPrice,
      releaseDate: '2025-01-22T00:00:00Z',
      license: 'open',
      parameters: item.params,
      isFeatured: item.size === '70B' || item.size === '32B',
      capabilities: ['reasoning', 'streaming', 'code-interpreter', 'system-prompt'],
      modalities: [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
      scores: {
        mmlu: item.mmlu,
        gpqa: item.gpqa,
        humaneval: item.he,
        'swe-bench': item.swe,
        'math-500': item.math,
        'arc-challenge': 93.0,
        'arena-elo': item.elo,
        gsm8k: 94.0,
      },
      providers: [
        { slug: 'together', latencyMs: 180, throughput: 160, uptime: 99.95, isDefault: true },
        { slug: 'fireworks', latencyMs: 160, throughput: 180, uptime: 99.96 },
        { slug: 'groq', latencyMs: 90, throughput: 350, uptime: 99.98 },
        { slug: 'openrouter', latencyMs: 210, throughput: 140, uptime: 99.94 },
      ]
    });
  }

  // Additional Qwen Models
  const qwenExtra = [
    { slug: 'qwen-2-5-14b-instruct', name: 'Qwen 2.5 14B Instruct', params: '14B', inPrice: 0.12, outPrice: 0.16, ctx: 131072, elo: 1225, mmlu: 79.5 },
    { slug: 'qwen-2-5-7b-instruct', name: 'Qwen 2.5 7B Instruct', params: '7B', inPrice: 0.05, outPrice: 0.08, ctx: 131072, elo: 1180, mmlu: 74.2 },
    { slug: 'qwen-2-5-32b-instruct', name: 'Qwen 2.5 32B Instruct', params: '32B', inPrice: 0.18, outPrice: 0.22, ctx: 131072, elo: 1255, mmlu: 83.4 },
    { slug: 'qwen-2-5-coder-7b-instruct', name: 'Qwen 2.5 Coder 7B Instruct', params: '7B', inPrice: 0.06, outPrice: 0.10, ctx: 131072, elo: 1195, mmlu: 75.0 },
    { slug: 'qwen-2-vl-7b-instruct', name: 'Qwen 2 VL 7B Instruct', params: '7B', inPrice: 0.10, outPrice: 0.15, ctx: 32768, elo: 1185, mmlu: 76.0 },
  ];

  for (const q of qwenExtra) {
    models.push({
      slug: q.slug,
      name: q.name,
      description: `High-efficiency variant of the Qwen 2.5 series featuring advanced instruction following, coding, and bilingual prowess.`,
      labSlug: 'qwen',
      modelType: q.slug.includes('coder') ? 'code' : q.slug.includes('vl') ? 'multimodal' : 'chat',
      contextWindow: q.ctx,
      maxOutputTokens: 8192,
      inputPricePerM: q.inPrice,
      outputPricePerM: q.outPrice,
      releaseDate: '2024-09-19T00:00:00Z',
      license: 'open',
      parameters: q.params,
      isFeatured: false,
      capabilities: q.slug.includes('vl') ? ['vision', 'streaming', 'tool-calling'] : ['tool-calling', 'json-mode', 'streaming'],
      modalities: q.slug.includes('vl')
        ? [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }]
        : [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
      scores: {
        mmlu: q.mmlu,
        gpqa: q.mmlu - 30,
        humaneval: q.mmlu + 4,
        'swe-bench': 24.0,
        'math-500': 66.0,
        'arc-challenge': 90.0,
        'arena-elo': q.elo,
        gsm8k: 88.0,
      },
      providers: [
        { slug: 'together', latencyMs: 160, throughput: 190, uptime: 99.96, isDefault: true },
        { slug: 'openrouter', latencyMs: 200, throughput: 160, uptime: 99.95 },
      ]
    });
  }

  // Additional Mistral Models
  const mistralExtra = [
    { slug: 'mistral-7b-instruct-v0-3', name: 'Mistral 7B Instruct v0.3', params: '7.3B', inPrice: 0.06, outPrice: 0.06, ctx: 32768, elo: 1145, mmlu: 64.0 },
    { slug: 'mistral-mixtral-8x7b-instruct', name: 'Mixtral 8x7B Instruct', params: 'MoE 46.7B', inPrice: 0.24, outPrice: 0.24, ctx: 32768, elo: 1190, mmlu: 70.6 },
    { slug: 'mistral-mixtral-8x22b-instruct', name: 'Mixtral 8x22B Instruct', params: 'MoE 141B', inPrice: 0.65, outPrice: 0.65, ctx: 65536, elo: 1230, mmlu: 77.8 },
    { slug: 'mistral-small-24b-instruct', name: 'Mistral Small 24B Instruct', params: '24B', inPrice: 0.20, outPrice: 0.60, ctx: 32768, elo: 1220, mmlu: 79.0 },
    { slug: 'mistral-pixtral-12b', name: 'Pixtral 12B', params: '12B', inPrice: 0.15, outPrice: 0.15, ctx: 128000, elo: 1200, mmlu: 76.5 },
  ];

  for (const m of mistralExtra) {
    models.push({
      slug: m.slug,
      name: m.name,
      description: `Robust open weights from Mistral AI tuned for enterprise inference efficiency and function calling.`,
      labSlug: 'mistral',
      modelType: m.slug.includes('pixtral') ? 'multimodal' : 'chat',
      contextWindow: m.ctx,
      maxOutputTokens: 4096,
      inputPricePerM: m.inPrice,
      outputPricePerM: m.outPrice,
      releaseDate: '2024-05-22T00:00:00Z',
      license: 'open',
      parameters: m.params,
      isFeatured: false,
      capabilities: m.slug.includes('pixtral') ? ['vision', 'streaming', 'tool-calling'] : ['tool-calling', 'json-mode', 'streaming'],
      modalities: m.slug.includes('pixtral')
        ? [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }]
        : [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
      scores: {
        mmlu: m.mmlu,
        gpqa: m.mmlu - 28,
        humaneval: m.mmlu + 3,
        'swe-bench': 22.0,
        'math-500': 60.0,
        'arc-challenge': 89.0,
        'arena-elo': m.elo,
        gsm8k: 84.0,
      },
      providers: [
        { slug: 'openrouter', latencyMs: 230, throughput: 130, uptime: 99.95, isDefault: true },
        { slug: 'together', latencyMs: 190, throughput: 155, uptime: 99.96 },
      ]
    });
  }

  // Additional Meta Llama variants
  const llamaExtra = [
    { slug: 'meta-llama-3-70b-instruct', name: 'Llama 3 70B Instruct', params: '70B', inPrice: 0.35, outPrice: 0.40, ctx: 8192, elo: 1235, mmlu: 82.0 },
    { slug: 'meta-llama-3-8b-instruct', name: 'Llama 3 8B Instruct', params: '8B', inPrice: 0.05, outPrice: 0.08, ctx: 8192, elo: 1150, mmlu: 68.4 },
    { slug: 'meta-codellama-70b-instruct', name: 'CodeLlama 70B Instruct', params: '70B', inPrice: 0.40, outPrice: 0.50, ctx: 16384, elo: 1180, mmlu: 72.0 },
    { slug: 'meta-llama-guard-3-8b', name: 'Llama Guard 3 8B', params: '8B', inPrice: 0.05, outPrice: 0.08, ctx: 8192, elo: 1050, mmlu: 65.0 },
    { slug: 'meta-llama-3-2-11b-vision', name: 'Llama 3.2 11B Vision Instruct', params: '11B', inPrice: 0.16, outPrice: 0.20, ctx: 128000, elo: 1210, mmlu: 75.2 },
    { slug: 'meta-llama-3-2-90b-vision', name: 'Llama 3.2 90B Vision Instruct', params: '90B', inPrice: 0.70, outPrice: 0.90, ctx: 128000, elo: 1270, mmlu: 86.0 },
    { slug: 'meta-llama-3-2-3b-instruct', name: 'Llama 3.2 3B Instruct', params: '3.2B', inPrice: 0.04, outPrice: 0.06, ctx: 128000, elo: 1120, mmlu: 63.4 },
    { slug: 'meta-llama-3-2-1b-instruct', name: 'Llama 3.2 1B Instruct', params: '1.2B', inPrice: 0.02, outPrice: 0.04, ctx: 128000, elo: 1080, mmlu: 56.0 },
  ];

  for (const l of llamaExtra) {
    const isVision = l.slug.includes('vision');
    models.push({
      slug: l.slug,
      name: l.name,
      description: `Part of Meta AI Llama family delivering high efficiency open architecture for text, vision, and agentic workflows.`,
      labSlug: 'meta',
      modelType: isVision ? 'multimodal' : l.slug.includes('code') ? 'code' : 'chat',
      contextWindow: l.ctx,
      maxOutputTokens: 4096,
      inputPricePerM: l.inPrice,
      outputPricePerM: l.outPrice,
      releaseDate: '2024-09-25T00:00:00Z',
      license: 'open',
      parameters: l.params,
      isFeatured: l.slug.includes('90b'),
      capabilities: isVision ? ['vision', 'tool-calling', 'streaming'] : ['tool-calling', 'json-mode', 'streaming'],
      modalities: isVision
        ? [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }]
        : [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
      scores: {
        mmlu: l.mmlu,
        gpqa: Math.max(25, l.mmlu - 30),
        humaneval: l.mmlu + 5,
        'swe-bench': 20.0,
        'math-500': 55.0,
        'arc-challenge': 88.0,
        'arena-elo': l.elo,
        gsm8k: 82.0,
      },
      providers: [
        { slug: 'groq', latencyMs: 110, throughput: 310, uptime: 99.98, isDefault: true },
        { slug: 'together', latencyMs: 180, throughput: 160, uptime: 99.96 },
        { slug: 'openrouter', latencyMs: 220, throughput: 130, uptime: 99.95 },
      ]
    });
  }

  // Specialized Models (Google, Anthropic, Cohere, Microsoft, etc.)
  const additionalSpecialized = [
    { slug: 'openai-dall-e-3', name: 'DALL-E 3', lab: 'openai', type: 'image', ctx: 4096, inPrice: 40.0, outPrice: 0.0, desc: 'OpenAI advanced text-to-image synthesis engine with prompt nuance preservation.' },
    { slug: 'openai-whisper-large-v3', name: 'Whisper Large v3', lab: 'openai', type: 'audio', ctx: 4096, inPrice: 0.006, outPrice: 0.0, desc: 'General-purpose speech recognition model trained on diverse multilingual audio data.' },
    { slug: 'google-imagen-3', name: 'Imagen 3', lab: 'google', type: 'image', ctx: 4096, inPrice: 30.0, outPrice: 0.0, desc: 'Google highest quality text-to-image generator with realistic lighting and typography.' },
    { slug: 'google-text-embedding-004', name: 'text-embedding-004', lab: 'google', type: 'embedding', ctx: 2048, inPrice: 0.025, outPrice: 0.0, desc: 'Google next-generation multilingual text embedding model with 768 output dimensions.' },
    { slug: 'cohere-rerank-v3-5', name: 'Rerank v3.5', lab: 'cohere', type: 'chat', ctx: 4096, inPrice: 2.00, outPrice: 0.0, desc: 'State-of-the-art enterprise semantic document relevance reranker for high-precision search.' },
    { slug: 'microsoft-phi-3-medium-14b', name: 'Phi-3 Medium 14B', lab: 'microsoft', type: 'chat', ctx: 128000, inPrice: 0.15, outPrice: 0.30, desc: '14B parameter Phi foundation model with synthetic instruction tuning and 128K context.' },
    { slug: '01-ai-yi-large', name: 'Yi-Large', lab: '01-ai', type: 'chat', ctx: 32768, inPrice: 0.30, outPrice: 0.30, desc: '01.AI high-capability MoE bilingual LLM for complex text and translation workflows.' },
    { slug: 'amazon-titan-text-premier', name: 'Titan Text Premier', lab: 'amazon', type: 'chat', ctx: 32768, inPrice: 0.50, outPrice: 1.50, desc: 'AWS advanced foundational text model optimized for enterprise security and RAG on Bedrock.' },
    { slug: 'deepseek-v2-5', name: 'DeepSeek-V2.5', lab: 'deepseek', type: 'chat', ctx: 128000, inPrice: 0.14, outPrice: 0.28, desc: 'Predecessor to V3 unifying general conversation, coding, and mathematical reasoning.' },
    { slug: 'anthropic-claude-2-1', name: 'Claude 2.1', lab: 'anthropic', type: 'chat', ctx: 200000, inPrice: 8.00, outPrice: 24.00, desc: 'Anthropic earlier generation foundation model offering 200K context and strong hallucination reduction.' },
    { slug: 'openai-gpt-4o-realtime-preview', name: 'GPT-4o Realtime Audio', lab: 'openai', type: 'multimodal', ctx: 128000, inPrice: 5.00, outPrice: 20.00, desc: 'Ultra-low latency speech-to-speech foundation model with natural conversational interruptions.' },
  ];

  for (const s of additionalSpecialized) {
    models.push({
      slug: s.slug,
      name: s.name,
      description: s.desc,
      labSlug: s.lab,
      modelType: s.type,
      contextWindow: s.ctx,
      maxOutputTokens: 4096,
      inputPricePerM: s.inPrice,
      outputPricePerM: s.outPrice,
      releaseDate: '2024-06-15T00:00:00Z',
      license: s.lab === 'openai' || s.lab === 'anthropic' || s.lab === 'google' || s.lab === 'amazon' ? 'closed' : 'open',
      parameters: 'Variable',
      isFeatured: false,
      capabilities: ['streaming'],
      modalities: s.type === 'multimodal'
        ? [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'audio', direction: 'input' }, { type: 'audio', direction: 'output' }]
        : s.type === 'image'
        ? [{ type: 'text', direction: 'input' }, { type: 'image', direction: 'output' }]
        : [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
      scores: {
        mmlu: 75.0,
        gpqa: 38.0,
        humaneval: 70.0,
        'swe-bench': 20.0,
        'math-500': 55.0,
        'arc-challenge': 88.0,
        'arena-elo': 1180,
        gsm8k: 80.0,
      },
      providers: [
        { slug: 'openrouter', latencyMs: 250, throughput: 120, uptime: 99.95, isDefault: true },
      ]
    });
  }

  // Additional Specialized Models (to reach 85+ total models)
  const moreFrontier = [
    { slug: 'openai-o3-mini-high', name: 'OpenAI o3-mini (High Effort)', lab: 'openai', type: 'chat', ctx: 200000, inPrice: 1.10, outPrice: 4.40, desc: 'Next-generation cost-efficient reasoning model with maximum reasoning effort budget for complex mathematical Olympiad proofs.' },
    { slug: 'openai-gpt-4o-audio-preview', name: 'GPT-4o Audio Preview', lab: 'openai', type: 'multimodal', ctx: 128000, inPrice: 2.50, outPrice: 10.00, desc: 'Direct audio understanding and generation model with nuanced emotive inflection.' },
    { slug: 'anthropic-claude-3-opus-200k', name: 'Claude 3 Opus (Enterprise 200K)', lab: 'anthropic', type: 'chat', ctx: 200000, inPrice: 15.00, outPrice: 75.00, desc: 'Dedicated enterprise instance of Claude 3 Opus with custom telemetry and priority queues.' },
    { slug: 'google-gemini-2-0-pro-exp', name: 'Gemini 2.0 Pro Experimental', lab: 'google', type: 'multimodal', ctx: 2097152, inPrice: 1.50, outPrice: 6.00, desc: 'Frontier experimental version of Gemini 2.0 with superior multi-step agentic problem solving.' },
    { slug: 'meta-llama-3-3-70b-speculative', name: 'Llama 3.3 70B Speculative', lab: 'meta', type: 'chat', ctx: 128000, inPrice: 0.45, outPrice: 0.75, desc: 'Speculative decoding accelerated deployment of Llama 3.3 70B generating over 350 tokens/sec.' },
    { slug: 'mistral-codestral-mamba-7b', name: 'Codestral Mamba 7B', lab: 'mistral', type: 'code', ctx: 256000, inPrice: 0.15, outPrice: 0.15, desc: 'State-space architecture (Mamba2) coding model enabling lightning-fast linear-time long context generation.' },
    { slug: 'deepseek-math-7b-instruct', name: 'DeepSeek-Math 7B Instruct', lab: 'deepseek', type: 'chat', ctx: 16384, inPrice: 0.08, outPrice: 0.14, desc: 'Specialized 7B mathematical foundation model trained on web-scraped scientific corpora.' },
    { slug: 'qwen-2-5-0-5b-instruct', name: 'Qwen 2.5 0.5B Instruct', lab: 'qwen', type: 'chat', ctx: 32768, inPrice: 0.02, outPrice: 0.04, desc: 'Sub-billion parameter edge model running in client-side WebAssembly and microcontrollers.' },
    { slug: '01-ai-yi-vl-plus', name: 'Yi-VL Plus', lab: '01-ai', type: 'multimodal', ctx: 32768, inPrice: 0.25, outPrice: 0.50, desc: 'Multimodal bilingual vision-language model capable of reading complex Chinese and English documents.' },
    { slug: 'amazon-titan-image-generator-v2', name: 'Titan Image Generator G1 v2', lab: 'amazon', type: 'image', ctx: 4096, inPrice: 35.0, outPrice: 0.0, desc: 'AWS native image generation model supporting background removal, inpainting, and outpainting.' },
  ];

  for (const m of moreFrontier) {
    models.push({
      slug: m.slug,
      name: m.name,
      description: m.desc,
      labSlug: m.lab,
      modelType: m.type,
      contextWindow: m.ctx,
      maxOutputTokens: 4096,
      inputPricePerM: m.inPrice,
      outputPricePerM: m.outPrice,
      releaseDate: '2024-11-20T00:00:00Z',
      license: m.lab === 'openai' || m.lab === 'anthropic' || m.lab === 'google' || m.lab === 'amazon' ? 'closed' : 'open',
      parameters: 'Variable',
      isFeatured: m.slug === 'openai-o3-mini' || m.slug === 'google-gemini-2-0-pro-exp',
      capabilities: ['streaming', 'tool-calling'],
      modalities: m.type === 'multimodal'
        ? [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }, { type: 'image', direction: 'input' }]
        : m.type === 'image'
        ? [{ type: 'text', direction: 'input' }, { type: 'image', direction: 'output' }]
        : [{ type: 'text', direction: 'input' }, { type: 'text', direction: 'output' }],
      scores: {
        mmlu: 82.0,
        gpqa: 50.0,
        humaneval: 85.0,
        'swe-bench': 35.0,
        'math-500': 80.0,
        'arc-challenge': 93.0,
        'arena-elo': 1260,
        gsm8k: 91.0,
      },
      providers: [
        { slug: 'openrouter', latencyMs: 270, throughput: 110, uptime: 99.96, isDefault: true },
      ]
    });
  }

  return models;
}

async function seed() {
  console.log('--- Starting OneAtlas Database Seed ---');

  // 1. Clean existing records safely
  console.log('Clearing old records...');
  await prisma.modelProvider.deleteMany();
  await prisma.modelCapability.deleteMany();
  await prisma.modality.deleteMany();
  await prisma.benchmarkScore.deleteMany();
  await prisma.model.deleteMany();
  await prisma.benchmark.deleteMany();
  await prisma.capability.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.lab.deleteMany();

  // 2. Create Labs
  console.log(`Seeding ${LABS.length} Labs...`);
  const labMap = new Map<string, string>();
  for (const lab of LABS) {
    const created = await prisma.lab.create({
      data: lab,
    });
    labMap.set(lab.slug, created.id);
  }

  // 3. Create Providers
  console.log(`Seeding ${PROVIDERS.length} Providers...`);
  const providerMap = new Map<string, string>();
  for (const prov of PROVIDERS) {
    const created = await prisma.provider.create({
      data: prov,
    });
    providerMap.set(prov.slug, created.id);
  }

  // 4. Create Capabilities
  console.log(`Seeding ${CAPABILITIES.length} Capabilities...`);
  const capMap = new Map<string, string>();
  for (const cap of CAPABILITIES) {
    const created = await prisma.capability.create({
      data: cap,
    });
    capMap.set(cap.slug, created.id);
  }

  // 5. Create Benchmarks
  console.log(`Seeding ${BENCHMARKS.length} Benchmarks...`);
  const benchmarkMap = new Map<string, string>();
  for (const bm of BENCHMARKS) {
    const created = await prisma.benchmark.create({
      data: bm,
    });
    benchmarkMap.set(bm.slug, created.id);
  }

  // 6. Generate and Seed Models
  const catalog = generateExtendedCatalog();
  console.log(`Seeding ${catalog.length} AI Models with Benchmarks, Capabilities, and Providers...`);

  let seededCount = 0;
  for (const item of catalog) {
    const labId = labMap.get(item.labSlug);
    if (!labId) {
      console.warn(`Lab ${item.labSlug} not found for model ${item.slug}, skipping.`);
      continue;
    }

    const createdModel = await prisma.model.create({
      data: {
        slug: item.slug,
        name: item.name,
        description: item.description,
        labId: labId,
        modelType: item.modelType,
        contextWindow: item.contextWindow,
        maxOutputTokens: item.maxOutputTokens,
        inputPricePerM: item.inputPricePerM,
        outputPricePerM: item.outputPricePerM,
        releaseDate: new Date(item.releaseDate),
        license: item.license,
        parameters: item.parameters,
        isFeatured: item.isFeatured,
      },
    });

    // Seed Modalities
    if (item.modalities && item.modalities.length > 0) {
      await prisma.modality.createMany({
        data: item.modalities.map(m => ({
          modelId: createdModel.id,
          modalityType: m.type,
          direction: m.direction,
        })),
        skipDuplicates: true,
      });
    }

    // Seed Capabilities
    if (item.capabilities && item.capabilities.length > 0) {
      const capData = item.capabilities
        .map(slug => capMap.get(slug))
        .filter((id): id is string => Boolean(id))
        .map(capabilityId => ({
          modelId: createdModel.id,
          capabilityId,
        }));

      if (capData.length > 0) {
        await prisma.modelCapability.createMany({
          data: capData,
          skipDuplicates: true,
        });
      }
    }

    // Seed Benchmark Scores
    if (item.scores) {
      const scoreData: { modelId: string; benchmarkId: string; score: number; verified: boolean }[] = [];
      for (const [bmSlug, scoreVal] of Object.entries(item.scores)) {
        const benchmarkId = benchmarkMap.get(bmSlug);
        if (benchmarkId) {
          scoreData.push({
            modelId: createdModel.id,
            benchmarkId,
            score: scoreVal,
            verified: true,
          });
        }
      }
      if (scoreData.length > 0) {
        await prisma.benchmarkScore.createMany({
          data: scoreData,
          skipDuplicates: true,
        });
      }
    }

    // Seed Providers for this Model
    if (item.providers && item.providers.length > 0) {
      for (const p of item.providers) {
        const providerId = providerMap.get(p.slug);
        if (!providerId) continue;

        const inPrice = +(item.inputPricePerM * (p.inputPriceMultiplier || 1.0)).toFixed(4);
        const outPrice = +(item.outputPricePerM * (p.outputPriceMultiplier || 1.0)).toFixed(4);

        await prisma.modelProvider.create({
          data: {
            modelId: createdModel.id,
            providerId,
            inputPricePerM: inPrice,
            outputPricePerM: outPrice,
            latencyMs: p.latencyMs,
            throughput: p.throughput,
            uptimePercent: p.uptime,
            isDefault: Boolean(p.isDefault),
            contextWindow: item.contextWindow,
          },
        });
      }
    }

    seededCount++;
  }

  console.log(`\nSuccessfully seeded:`);
  console.log(` - ${LABS.length} Labs`);
  console.log(` - ${PROVIDERS.length} Providers`);
  console.log(` - ${CAPABILITIES.length} Capabilities`);
  console.log(` - ${BENCHMARKS.length} Benchmarks`);
  console.log(` - ${seededCount} Models with multi-provider pricing, modalities, capabilities & benchmark scores!`);
  console.log('--- OneAtlas Seed Complete ---');
}

seed()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
