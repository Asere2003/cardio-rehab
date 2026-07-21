import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";

import { ProfessionalStatusBadge } from "@/components/admin/professional-status-badge";
import { PageIntro } from "@/components/common/page-intro";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { permissionDetails } from "@/lib/admin/professional-constants";
import { getProfessionalDetail } from "@/lib/admin/professionals";
import { getProfessionalCategoryLabel } from "@/lib/admin/professional-validation";

export const dynamic = "force-dynamic";

export default async function ProfessionalDetailPage({
  params,
  searchParams,
}: PageProps<"/admin/professionals/[professionalId]">) {
  const { professionalId } = await params;
  const { created } = await searchParams;
  const professional = await getProfessionalDetail(professionalId);

  if (!professional) {
    notFound();
  }

  const activeMemberships = professional.memberships.filter(
    (membership) => membership.endedAt === null,
  );

  return (
    <div className="py-10 sm:py-14">
      <Link href="/admin/professionals" className="inline-flex">
        <Button variant="outline" className="min-h-12 rounded-2xl border-primary text-primary">
          <ArrowLeft className="size-5" aria-hidden="true" />
          Volver a profesionales
        </Button>
      </Link>
      {created === "1" && (
        <div className="mt-6 flex gap-3 rounded-3xl bg-green-50 p-5 text-green-950" role="status">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <p>
            Profesional creado correctamente. El acceso digital se habilitará en
            una fase posterior.
          </p>
        </div>
      )}
      <PageIntro
        className="mt-8"
        badge="Detalle del profesional"
        title={`${professional.firstName} ${professional.lastName}`}
        description={`${getProfessionalCategoryLabel(professional.professionalCategory)} · ${professional.user.email}`}
      />
      <div className="space-y-6">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl">Estado actual</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfessionalStatusBadge hasActiveMembership={activeMemberships.length > 0} />
            <p className="mt-4 leading-7 text-muted-foreground">
              El perfil y sus membresías existen. No se ha creado ninguna
              contraseña, sesión ni invitación.
            </p>
          </CardContent>
        </Card>

        <section aria-labelledby="memberships-heading">
          <h2 id="memberships-heading" className="text-2xl font-bold">
            Unidades y permisos
          </h2>
          <div className="mt-4 grid gap-4">
            {professional.memberships.map((membership) => (
              <Card key={membership.id} className="rounded-3xl">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{membership.careUnit.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {membership.careUnit.organization.name}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {membership.endedAt ? "Membresía finalizada" : "Membresía activa"}
                    </span>
                  </div>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {membership.permissions.map((permission) => (
                      <li key={permission} className="rounded-2xl bg-muted px-4 py-3 text-sm">
                        <span className="font-semibold">{permissionDetails[permission].label}</span>
                        <span className="mt-1 block text-muted-foreground">
                          {permissionDetails[permission].description}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm text-muted-foreground">
                    Asignada el {membership.createdAt.toLocaleDateString("es-ES")}.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
