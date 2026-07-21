"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ProfessionalsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The error is deliberately not exposed to the user interface.
  }, []);

  return (
    <div className="py-16 text-center">
      <AlertCircle className="mx-auto size-10 text-primary" aria-hidden="true" />
      <h1 className="mt-4 text-2xl font-bold">No hemos podido cargar el equipo</h1>
      <p className="mx-auto mt-2 max-w-lg leading-7 text-muted-foreground">
        Inténtalo de nuevo. Si el problema continúa, revisa la conexión de desarrollo.
      </p>
      <Button onClick={reset} className="mt-6 min-h-12 rounded-2xl">
        <RefreshCw className="size-5" aria-hidden="true" />
        Reintentar
      </Button>
    </div>
  );
}
