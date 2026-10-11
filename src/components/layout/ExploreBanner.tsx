import { Link } from "react-router-dom";
import { LogIn, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ExploreBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 px-4 py-2",
        "bg-accent text-foreground",
        "border-b border-border",
        "text-caption"
      )}
    >
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline">
          Modo exploración &mdash; los datos no se guardan.
        </span>
        <span className="sm:hidden">
          Exploración &mdash; datos no guardados.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-button px-2 py-1.5 text-caption font-medium transition-colors hover:bg-primary/10"
        >
          <LogIn className="h-4 w-4" />
          Iniciar sesión
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="grid h-7 w-7 place-items-center rounded-full hover:bg-primary/10"
          aria-label="Cerrar aviso"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
