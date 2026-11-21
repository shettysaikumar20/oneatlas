import * as React from "react";
import { formatPrice } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface PricingBadgeProps {
  inputPrice: number;
  outputPrice?: number;
  className?: string;
  showOutput?: boolean;
}

export function PricingBadge({
  inputPrice,
  outputPrice,
  className,
  showOutput = false,
}: PricingBadgeProps) {
  const isFree = inputPrice === 0 && (!outputPrice || outputPrice === 0);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "inline-flex items-center gap-1 font-mono text-xs rounded border px-2 py-0.5 transition-colors cursor-help",
            isFree
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
              : "border-border bg-muted/40 text-foreground",
            className
          )}
        >
          {isFree ? (
            <span>Free</span>
          ) : (
            <>
              <span>{formatPrice(inputPrice)}</span>
              {showOutput && outputPrice !== undefined && (
                <span className="text-muted-foreground">/ {formatPrice(outputPrice)}</span>
              )}
            </>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-sans font-medium">Token Pricing (per 1M tokens)</p>
        <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
          Prompt: {formatPrice(inputPrice)} • Completion:{" "}
          {outputPrice !== undefined ? formatPrice(outputPrice) : "N/A"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
