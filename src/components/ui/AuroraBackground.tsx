import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function AuroraBackground({ children }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <div
          className="absolute -left-20 -top-20 h-72 w-72 rounded-full opacity-30 motion-safe:animate-aurora-fuchsia"
          style={{
            background: "var(--aurora-fuchsia)",
            filter: "blur(64px)",
          }}
        />
        <div
          className="absolute -right-20 top-20 h-72 w-72 rounded-full opacity-30 motion-safe:animate-aurora-indigo"
          style={{
            background: "var(--aurora-indigo)",
            filter: "blur(64px)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full opacity-30 motion-safe:animate-aurora-cyan"
          style={{
            background: "var(--aurora-cyan)",
            filter: "blur(64px)",
          }}
        />
      </div>
      <div className="relative z-0">{children}</div>
    </div>
  );
}
