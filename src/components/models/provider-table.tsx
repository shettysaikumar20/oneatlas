import * as React from "react";
import Link from "next/link";
import { ExternalLink, Zap, ShieldCheck, DollarSign, Activity } from "lucide-react";
import { ModelProvider } from "@/types";
import { formatPrice, formatLatency, formatThroughput } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProviderTableProps {
  providers: ModelProvider[];
}

export function ProviderTable({ providers }: ProviderTableProps) {
  if (!providers || providers.length === 0) {
    return (
      <div className="flex h-36 items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
        No active provider endpoints configured.
      </div>
    );
  }

  // Find lowest price and lowest latency
  const lowestPrice = Math.min(...providers.map((p) => p.inputPricePerM));
  const lowestLatency = Math.min(...providers.map((p) => p.latencyMs));
  const highestThroughput = Math.max(...providers.map((p) => p.throughput));

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
            <th className="py-3 px-4">Inference Provider</th>
            <th className="py-3 px-3 font-mono">Prompt / 1M</th>
            <th className="py-3 px-3 font-mono">Completion / 1M</th>
            <th className="py-3 px-3 font-mono">TTFT Latency</th>
            <th className="py-3 px-3 font-mono">Throughput</th>
            <th className="py-3 px-3 font-mono">Uptime (SLA)</th>
            <th className="py-3 px-4 text-right">Endpoint</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {providers.map((item) => {
            const isCheapest = item.inputPricePerM === lowestPrice;
            const isFastest = item.latencyMs === lowestLatency;
            const isHighestTps = item.throughput === highestThroughput && providers.length > 1;

            return (
              <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                {/* 1. Provider */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/providers/${item.provider.slug}`}
                      className="font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {item.provider.name}
                    </Link>
                    {item.isDefault && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        Default
                      </Badge>
                    )}
                    {isCheapest && (
                      <Badge variant="success" className="gap-1 text-[10px] px-1.5 py-0 font-medium">
                        <DollarSign className="h-2.5 w-2.5" />
                        Cheapest
                      </Badge>
                    )}
                    {isFastest && (
                      <Badge variant="accent" className="gap-1 text-[10px] px-1.5 py-0 font-medium">
                        <Zap className="h-2.5 w-2.5" />
                        Lowest Latency
                      </Badge>
                    )}
                  </div>
                </td>

                {/* 2. Input Price */}
                <td className="py-3 px-3 font-mono font-medium text-foreground">
                  {formatPrice(item.inputPricePerM)}
                </td>

                {/* 3. Output Price */}
                <td className="py-3 px-3 font-mono text-muted-foreground">
                  {formatPrice(item.outputPricePerM)}
                </td>

                {/* 4. Latency */}
                <td className="py-3 px-3 font-mono text-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Activity className="h-3 w-3 text-amber-500 opacity-70" />
                    {formatLatency(item.latencyMs)}
                  </span>
                </td>

                {/* 5. Throughput */}
                <td className="py-3 px-3 font-mono font-semibold text-foreground">
                  {formatThroughput(item.throughput)}
                  {isHighestTps && (
                    <span className="ml-1 text-[10px] text-emerald-500 font-normal">
                      (Peak)
                    </span>
                  )}
                </td>

                {/* 6. Uptime */}
                <td className="py-3 px-3 font-mono text-muted-foreground">
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-3 w-3" />
                    {item.uptimePercent}%
                  </span>
                </td>

                {/* 7. Action Link */}
                <td className="py-3 px-4 text-right">
                  {item.provider.apiDocUrl ? (
                    <a
                      href={item.provider.apiDocUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                    >
                      <span>Docs</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
