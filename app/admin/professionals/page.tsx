import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageIntro } from "@/components/common/page-intro";
import { Plus } from "lucide-react";
import { ProfessionalList } from "@/components/admin/professional-list";
import { listProfessionals } from "@/lib/admin/professionals";

export const dynamic = "force-dynamic";

export default async function ProfessionalsPage() {
  const professionals = await listProfessionals();

  return (
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <PageIntro
          badge="Equipo asistencial"
          title="Profesionales"
          description="Una vista sencilla de las personas, unidades y permisos que forman el equipo."
          className="mb-0"
        />
        <Link href="/admin/professionals/new" className="shrink-0">
          <Button size="lg" className="min-h-14 w-full rounded-2xl text-base sm:w-auto">
            <Plus className="size-5" aria-hidden="true" />
            Añadir profesional
          </Button>
        </Link>
      </div>
      <div className="mt-8">
        <ProfessionalList professionals={professionals} />
      </div>
    </div>
  );
}
