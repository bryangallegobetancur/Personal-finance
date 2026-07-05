import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  action?: ReactNode;
}

export function Card({ className, title, action, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-surface shadow-sm transition-shadow",
        className
      )}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          {title && (
            <h3 className="text-small font-semibold text-foreground">{title}</h3>
          )}
          {action}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
