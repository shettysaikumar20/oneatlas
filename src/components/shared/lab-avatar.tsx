import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabAvatarProps {
  name: string;
  color?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LabAvatar({
  name,
  color,
  className,
  size = "md",
}: LabAvatarProps) {
  const initial = name ? name.charAt(0).toUpperCase() : "A";
  const bgStyle = color ? { backgroundColor: color } : undefined;

  const sizeClasses = {
    sm: "h-5 w-5 text-[10px]",
    md: "h-6 w-6 text-xs",
    lg: "h-8 w-8 text-sm",
  }[size];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md font-semibold text-white shadow-sm transition-transform",
        sizeClasses,
        !color && "bg-primary",
        className
      )}
      style={bgStyle}
      title={name}
    >
      {initial}
    </div>
  );
}
