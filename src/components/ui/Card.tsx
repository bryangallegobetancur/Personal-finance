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
        "app-card min-w-0 rounded-card border border-border bg-surface backdrop-blur-2xl",
        className
      )}
      {...props}
    >
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6 sm:py-5">
          {title && (
            <h3 className="text-[15px] font-semibold leading-6 text-foreground">{title}</h3>
          )}
          {action}
        </div>
      )}
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}
