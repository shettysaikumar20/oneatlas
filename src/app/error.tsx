"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-6 border border-destructive/20">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <span className="font-mono text-xs uppercase tracking-widest text-destructive font-semibold mb-2">
        Application Error
      </span>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
        Something went wrong
      </h1>
      <p className="text-muted-foreground max-w-md mb-8 text-sm">
        An unexpected error occurred while processing this page. You can try refreshing the component or return to safety.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} variant="default" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            Home Page
          </Link>
        </Button>
      </div>
    </div>
  );
}
