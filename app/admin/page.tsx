import { Card, CardContent } from "@/components/ui/card";

import Link from "next/link";
import { PageIntro } from "@/components/common/page-intro";
import { UsersRound } from "lucide-react";

export default function AdminPage() {
  return (
    <div>
      <PageIntro
        badge="Área de administración"
        title="Cuidamos también de quienes cuidan"
        description="Gestiona de forma clara los profesionales que forman parte de cada unidad asistencial."
      />
      <Link
        href="/admin/professionals"
        className="block rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <Card className="max-w-2xl rounded-3xl transition-transform hover:-translate-y-0.5 hover:shadow-lg">
          <CardContent className="flex min-h-40 items-center gap-5 p-6 sm:p-8">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
              <UsersRound className="size-7" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Gestionar profesionales</h2>
              <p className="mt-2 leading-7 text-muted-foreground">
                Consulta sus unidades, permisos iniciales y el estado de acceso
                digital pendiente.
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
