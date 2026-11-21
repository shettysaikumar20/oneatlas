import * as React from "react";
import {
  Eye,
  Brain,
  Wrench,
  CodeXml,
  Zap,
  Terminal,
  Sliders,
  Layers,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CapabilityBadgeProps {
  slug: string;
  name: string;
  className?: string;
  compact?: boolean;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  vision: Eye,
  reasoning: Brain,
  "tool-calling": Wrench,
  "json-mode": CodeXml,
  streaming: Zap,
  "code-interpreter": Terminal,
  "system-prompt": Sliders,
  caching: Layers,
};

export function CapabilityBadge({
  slug,
  name,
  className,
  compact = false,
}: CapabilityBadgeProps) {
  const Icon = ICON_MAP[slug.toLowerCase()] || Sparkles;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border border-border/80 bg-muted/40 text-muted-foreground transition-colors hover:text-foreground",
        compact ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs font-medium",
        className
      )}
      title={name}
    >
      <Icon className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {!compact && <span>{name}</span>}
    </span>
  );
}
