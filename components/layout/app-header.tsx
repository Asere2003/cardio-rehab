import { ArrowLeft, ArrowRight, HeartPulse } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

type AppHeaderProps = {
  showLoginButton?: boolean;
  showBackButton?: boolean;
};

export function AppHeader({
  showLoginButton = false,
  showBackButton = false,
}: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <HeartPulse className="size-6" />
        </div>

        <div>
          <p className="text-lg font-bold leading-none">Volver a Latir</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Rehabilitación Cardíaca
          </p>
        </div>
      </Link>

      {showLoginButton && (
        <Link href="/access" className="hidden lg:block">
          <Button size="lg" className="h-14 rounded-2xl whitespace-nowrap">
            Entrar
            <ArrowRight className="size-5" />
          </Button>
        </Link>
      )}

      {showBackButton && (
        <Link href="/" className="hidden lg:block">
          <Button
            size="lg"
            variant="outline"
            className="h-14 rounded-2xl border-primary bg-background px-6 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <ArrowLeft className="size-5" />
            Inicio
          </Button>
        </Link>
      )}
    </header>
  );
}