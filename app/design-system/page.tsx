import { HeartPulse, Stethoscope } from "lucide-react";

import { ProfessionalStatusBadge } from "@/components/admin/professional-status-badge";
import { ActionCard } from "@/components/cards/action-card";
import { PageIntro } from "@/components/common/page-intro";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DesignSystemPage() {
  return (
    <div className="py-10 sm:py-14">
      <PageIntro badge="Sistema de diseño" title="Volver a Latir" description="Ejemplos de componentes reutilizables. Disponible solo en desarrollo y Preview." />
      <section className="mt-12" aria-labelledby="buttons-title">
        <h2 id="buttons-title" className="text-2xl font-bold">Botones</h2>
        <div className="mt-5 flex flex-wrap gap-4">
          <Button size="lg" className="min-h-12 rounded-2xl">Acción principal</Button>
          <Button variant="outline" size="lg" className="min-h-12 rounded-2xl">Acción secundaria</Button>
          <Button disabled size="lg" className="min-h-12 rounded-2xl">Cargando</Button>
        </div>
      </section>
      <section className="mt-12" aria-labelledby="fields-title">
        <h2 id="fields-title" className="text-2xl font-bold">Campos de formulario</h2>
        <Card className="mt-5 max-w-xl rounded-3xl"><CardContent className="space-y-5 p-6">
          <div><Label htmlFor="design-system-email">Correo profesional</Label><Input id="design-system-email" type="email" placeholder="nombre@organizacion.es" className="mt-2 min-h-12" /></div>
          <label htmlFor="design-system-permission" className="flex min-h-12 items-center gap-3"><Checkbox id="design-system-permission" defaultChecked className="size-5" /><span className="font-medium">Consultar pacientes</span></label>
          <p className="rounded-2xl bg-destructive/10 p-3 text-sm text-destructive">Ejemplo de mensaje de error comprensible.</p>
        </CardContent></Card>
      </section>
      <section className="mt-12" aria-labelledby="status-title">
        <h2 id="status-title" className="text-2xl font-bold">Estado de profesional</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <Card className="rounded-3xl"><CardContent className="p-6"><ProfessionalStatusBadge hasActiveMembership /></CardContent></Card>
          <Card className="rounded-3xl"><CardContent className="p-6"><ProfessionalStatusBadge hasActiveMembership={false} /></CardContent></Card>
        </div>
      </section>
      <section className="mt-12" aria-labelledby="cards-title">
        <h2 id="cards-title" className="text-2xl font-bold">Tarjetas de acción</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <ActionCard href="#cards-title" icon={HeartPulse} title="Soy paciente" description="Continúa con tu programa de rehabilitación." />
          <ActionCard href="#cards-title" icon={Stethoscope} title="Soy profesional" description="Consulta la evolución de tus pacientes." />
        </div>
      </section>
    </div>
  );
}
