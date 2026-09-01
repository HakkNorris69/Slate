import { createFileRoute } from "@tanstack/react-router";
import { StudioApp } from "@/components/studio/studio-app";
import { AppErrorComponent, StudioGuard } from "@/lib/error-component";

export const Route = createFileRoute("/")({
  component: Home,
  errorComponent: AppErrorComponent,
});

function Home() {
  return (
    <StudioGuard>
      <StudioApp />
    </StudioGuard>
  );
}