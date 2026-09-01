import { Toaster as Sonner } from "sonner";

function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "bg-elevated text-fg border border-border shadow-reel font-sans",
          title: "text-fg",
          description: "text-muted",
          actionButton: "bg-accent text-accent-fg",
          cancelButton: "bg-surface text-muted",
        },
      }}
    />
  );
}

export { Toaster };
