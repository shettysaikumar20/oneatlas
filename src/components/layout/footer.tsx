import Link from "next/link";
import { Compass, Github, Twitter, Cpu, Zap, Database } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40 mt-auto">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Compass className="h-4 w-4" />
              </div>
              <span className="text-base font-semibold">OneAtlas</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              The open, independent intelligence platform for discovering, evaluating, and routing between frontier AI models.
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5 text-primary" /> 88+ Models
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-amber-500" /> 10 Providers
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Database className="h-3.5 w-3.5 text-emerald-500" /> Neon PostgreSQL
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/models" className="hover:text-foreground transition-colors">
                  Model Discovery
                </Link>
              </li>
              <li>
                <Link href="/rankings" className="hover:text-foreground transition-colors">
                  Arena Leaderboards
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-foreground transition-colors">
                  Model Comparator
                </Link>
              </li>
              <li>
                <Link href="/models?modelType=multimodal" className="hover:text-foreground transition-colors">
                  Vision & Multimodal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/labs" className="hover:text-foreground transition-colors">
                  AI Labs Directory
                </Link>
              </li>
              <li>
                <Link href="/providers" className="hover:text-foreground transition-colors">
                  Inference Providers
                </Link>
              </li>
              <li>
                <Link href="/labs/openai" className="hover:text-foreground transition-colors">
                  OpenAI Models
                </Link>
              </li>
              <li>
                <Link href="/labs/anthropic" className="hover:text-foreground transition-colors">
                  Anthropic Models
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Developers
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/api/models" className="hover:text-foreground transition-colors font-mono text-xs">
                  GET /api/models
                </Link>
              </li>
              <li>
                <Link href="/api/rankings" className="hover:text-foreground transition-colors font-mono text-xs">
                  GET /api/rankings
                </Link>
              </li>
              <li>
                <Link href="/api/compare?slugs=openai-gpt-4o,anthropic-claude-3-5-sonnet" className="hover:text-foreground transition-colors font-mono text-xs">
                  GET /api/compare
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <Github className="h-3.5 w-3.5" />
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} OneAtlas Inc. Built with Next.js 14, TailwindCSS & Prisma ORM.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-500 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
