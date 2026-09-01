import { Component, type ErrorInfo, type ReactNode } from "react";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";
import { useStudio } from "@/lib/studio-store";

export function AppErrorComponent({ error, reset }: ErrorComponentProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg">
      <span className="text-rec" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="text-lg font-semibold">Something went wrong</h1>
      <p className="max-w-md text-sm break-words text-muted">
        {error instanceof Error ? error.message : "That take hit a snag. Start a new one."}
      </p>
      <button
        type="button"
        className="mt-2 h-11 rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg"
        onClick={() => {
          try {
            useStudio.getState().resetTake();
          } catch {
            /* ignore */
          }
          if (typeof reset === "function") reset();
          else window.location.reload();
        }}
      >
        New take
      </button>
    </main>
  );
}

type GuardProps = { children: ReactNode };

type GuardState = { error: Error | null };

export class StudioGuard extends Component<GuardProps, GuardState> {
  state: GuardState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <AppErrorComponent
          error={this.state.error}
          reset={() => {
            try {
              useStudio.getState().resetTake();
            } catch {
              /* ignore */
            }
            this.setState({ error: null });
          }}
        />
      );
    }
    return this.props.children;
  }
}
