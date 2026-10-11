import type { ReactNode } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface Props {
  children: ReactNode;
}

export function ThemeBackground({ children }: Props) {
  const { theme } = useTheme();

  if (theme === "v7") {
    return (
      <div className="relative min-h-screen overflow-clip">
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
          <div
            className="absolute -left-20 -top-20 h-72 w-72 rounded-full opacity-30 motion-safe:animate-aurora-fuchsia"
            style={{ background: "#d946ef", filter: "blur(64px)" }}
          />
          <div
            className="absolute -right-20 top-20 h-72 w-72 rounded-full opacity-30 motion-safe:animate-aurora-indigo"
            style={{ background: "#6366f1", filter: "blur(64px)" }}
          />
          <div
            className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full opacity-30 motion-safe:animate-aurora-cyan"
            style={{ background: "#22d3ee", filter: "blur(64px)" }}
          />
        </div>
        <div className="relative z-0">{children}</div>
      </div>
    );
  }

  if (theme === "v3") {
    return (
      <div className="relative min-h-screen overflow-clip">
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
          <div
            className="absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-40"
            style={{ background: "rgba(111,180,160,0.4)", filter: "blur(64px)" }}
          />
          <div
            className="absolute -right-24 bottom-10 h-72 w-72 rounded-full opacity-60"
            style={{ background: "rgba(197,225,218,0.6)", filter: "blur(64px)" }}
          />
        </div>
        <div className="relative z-0">{children}</div>
      </div>
    );
  }

  return <>{children}</>;
}
