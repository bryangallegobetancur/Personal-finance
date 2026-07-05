import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  action?: ReactNode;
}

export function GlassCard({ className, title, action, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/20 bg-white/10 px-6 py-6 shadow-sm backdrop-blur-2xl",
        className
      )}
      {...props}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
          {title && (
            <h3 className="text-small font-semibold text-foreground">{title}</h3>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
