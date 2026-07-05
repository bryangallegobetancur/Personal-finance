import { Component } from "react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="grid min-h-screen place-items-center bg-background p-8">
            <div className="text-center">
              <h1 className="text-h2 font-bold text-error">Error inesperado</h1>
              <p className="mt-2 text-small text-muted-foreground">
                {this.state.error?.message ?? "Algo salió mal al cargar la aplicación."}
              </p>
              <button
                type="button"
                className="mt-4 rounded-button bg-primary px-4 py-2 text-small font-medium text-primary-foreground hover:bg-primary-hover"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Reintentar
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
