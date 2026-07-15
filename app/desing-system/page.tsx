import { HeartPulse, Stethoscope } from "lucide-react";

import { ActionCard } from "@/components/cards/action-card";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/common/page-intro";
import { PublicLayout } from "@/components/layout/public-layout";

export default function DesignSystemPage() {
  return (
    <PublicLayout>
      <div className="mx-auto w-full max-w-6xl py-12">

        <PageIntro
          badge="Design System"
          title="Volver a Latir"
          description="Catálogo de componentes reutilizables de la aplicación."
        />

        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">
            Buttons
          </h2>

          <div className="flex flex-wrap gap-4">
            <Button>Primary</Button>

            <Button variant="outline">
              Outline
            </Button>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">
            ActionCard
          </h2>

          <div className="grid gap-4 lg:grid-cols-2">
            <ActionCard
              href="#"
              icon={HeartPulse}
              title="Soy paciente"
              description="Continúa con tu programa de rehabilitación."
            />

            <ActionCard
              href="#"
              icon={Stethoscope}
              title="Soy profesional"
              description="Consulta la evolución de tus pacientes."
            />
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}