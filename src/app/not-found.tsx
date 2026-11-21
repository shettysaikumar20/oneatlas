import Link from "next/link";
import { Compass, ArrowLeft, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/80 text-muted-foreground mb-6 shadow-sm border border-border">
        <Compass className="h-8 w-8 text-primary" />
      </div>
      <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold mb-2">
        404 — Page Not Found
      </span>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
        Lost in the AI Model Universe?
      </h1>
      <p className="text-muted-foreground max-w-md mb-8 text-sm">
        The model, provider, or page you are looking for doesn&apos;t exist or has been moved to another location.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="default" className="gap-2">
          <Link href="/models">
            <Search className="h-4 w-4" />
            Explore Models
          </Link>
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
