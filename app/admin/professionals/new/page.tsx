import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageIntro } from "@/components/common/page-intro";
import { ProfessionalForm } from "@/components/admin/professional-form";
import { getProfessionalCreationOptions } from "@/lib/admin/professionals";

export const dynamic = "force-dynamic";

export default async function NewProfessionalPage() {
  const organizations = await getProfessionalCreationOptions();

  return (
    <div>
      <Link href="/admin/professionals" className="inline-flex">
        <Button variant="outline" className="min-h-12 rounded-2xl border-primary text-primary">
          <ArrowLeft className="size-5" aria-hidden="true" />
          Volver a profesionales
        </Button>
      </Link>
      <PageIntro
        className="mt-8"
        badge="Nuevo profesional"
        title="Añadir una persona al equipo"
        description="Completa estos pasos con calma. El acceso digital no se activará todavía."
      />
      <ProfessionalForm organizations={organizations} />
    </div>
  );
}
