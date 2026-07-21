import Link from "next/link";
import { ArrowRight, UsersRound } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { ProfessionalStatusBadge } from "@/components/admin/professional-status-badge";
import { getProfessionalCategoryLabel } from "@/lib/admin/professional-validation";
import { permissionDetails } from "@/lib/admin/professional-constants";
import type { ProfessionalListItem } from "@/lib/admin/professionals";

type ProfessionalListProps = {
  professionals: ProfessionalListItem[];
};

export function ProfessionalList({ professionals }: ProfessionalListProps) {
  if (professionals.length === 0) {
    return (
      <Card className="rounded-3xl">
        <CardContent className="p-8 text-center sm:p-12">
          <UsersRound className="mx-auto size-10 text-primary" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-bold">Aún no hay profesionales</h2>
          <p className="mx-auto mt-2 max-w-lg leading-7 text-muted-foreground">
            Cuando la organización y la unidad estén preparadas, podrás añadir al
            primer profesional desde esta área.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {professionals.map((professional) => {
        const activeMemberships = professional.memberships.filter(
          (membership) => membership.endedAt === null,
        );
        const firstMembership = activeMemberships[0] ?? professional.memberships[0];

        return (
          <Link
            key={professional.id}
            href={`/admin/professionals/${professional.id}`}
            className="group rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <Card className="rounded-3xl transition-transform group-hover:-translate-y-0.5 group-hover:shadow-lg">
              <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xl font-bold">{professional.fullName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {getProfessionalCategoryLabel(professional.category)} · {professional.email}
                  </p>
                  {firstMembership && (
                    <p className="mt-3 text-sm font-medium">
                      {firstMembership.unitName} · {firstMembership.organizationName}
                    </p>
                  )}
                  {firstMembership && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {firstMembership.permissions
                        .slice(0, 2)
                        .map((permission) => permissionDetails[permission].label)
                        .join(" · ")}
                      {firstMembership.permissions.length > 2
                        ? ` · +${firstMembership.permissions.length - 2}`
                        : ""}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <ProfessionalStatusBadge hasActiveMembership={activeMemberships.length > 0} />
                  <span className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary">
                    Ver detalle
                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
