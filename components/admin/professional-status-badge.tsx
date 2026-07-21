import { CheckCircle2, Clock3 } from "lucide-react";

type ProfessionalStatusBadgeProps = {
  hasActiveMembership: boolean;
};

export function ProfessionalStatusBadge({
  hasActiveMembership,
}: ProfessionalStatusBadgeProps) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Estado del profesional">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-950">
        <CheckCircle2 className="size-4" aria-hidden="true" />
        Perfil creado
      </span>
      {hasActiveMembership && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-950">
          <CheckCircle2 className="size-4" aria-hidden="true" />
          Membresía activa
        </span>
      )}
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground">
        <Clock3 className="size-4" aria-hidden="true" />
        Acceso digital pendiente
      </span>
    </div>
  );
}
