import { forwardRef, useState } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

function fieldClasses(hasError?: boolean) {
  return cn(
    "block w-full rounded-input border bg-surface-2 px-4 text-body text-foreground transition-colors duration-200 ease-out placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 backdrop-blur-xl disabled:opacity-60",
    hasError
      ? "border-error focus:ring-error/30"
      : "border-border focus:border-primary focus:ring-primary/20"
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, FieldProps {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, hasError, icon, className, id, type, ...props }, ref) => {
    const inputId = id || props.name;
    const isPassword = type === "password";
    const [visible, setVisible] = useState(false);
    const effectiveType = isPassword ? (visible ? "text" : "password") : type;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-small font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={effectiveType}
            className={cn(
              fieldClasses(hasError || !!error),
              "h-14",
              icon && "pl-12",
              isPassword && "pr-12",
              className
            )}
            aria-invalid={!!error}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-button p-1.5 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
              tabIndex={-1}
            >
              {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
        </div>
        {hint && !error && (
          <p className="text-caption text-muted-foreground">{hint}</p>
        )}
        {error && <p className="text-caption text-error">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, FieldProps {
  hasError?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, hasError, icon: _icon, className, id, children, ...props }, ref) => {
    const selectId = id || props.name;
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-small font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            fieldClasses(hasError || !!error),
            "h-14 cursor-pointer appearance-none bg-surface-2 pr-10",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {hint && !error && (
          <p className="text-caption text-muted-foreground">{hint}</p>
        )}
        {error && <p className="text-caption text-error">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
