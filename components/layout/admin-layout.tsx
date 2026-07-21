import { ShieldCheck, UsersRound } from "lucide-react";

import { AppHeader } from "@/components/layout/app-header";
import Link from "next/link";
import { cn } from "@/lib/utils";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8 lg:px-10">
        <AppHeader />
        <div className="mt-8 rounded-3xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p className="min-w-0 flex-1">
              Área disponible solo en desarrollo y Preview. Aún no sustituye la
              autenticación y autorización definitivas.
            </p>
          </div>
        </div>
        <nav aria-label="Navegación administrativa" className="mt-6 flex gap-2 overflow-x-auto pb-1">
          <AdminNavLink href="/admin">Inicio</AdminNavLink>
          <AdminNavLink href="/admin/professionals">
            <UsersRound className="size-4" aria-hidden="true" />
            Profesionales
          </AdminNavLink>
        </nav>
        {children}
      </div>
    </main>
  );
}

function AdminNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      )}
    >
      {children}
    </Link>
  );
}
