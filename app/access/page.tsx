// app/access/page.tsx

import { ArrowLeft, ArrowRight, HeartPulse, Stethoscope } from "lucide-react";

import { ActionCard } from "@/components/cards/action-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PageIntro } from "@/components/common/page-intro";
import { PublicLayout } from "@/components/layout/public-layout";

export default function AccessPage() {
  return (
    <PublicLayout showBackButton>
      <div className="mx-auto w-full max-w-3xl pt-12 pb-10 sm:pt-16 lg:pt-20">
        <PageIntro
          badge="Bienvenido"
          title="¿Cómo quieres entrar?"
          description="Elige tu perfil para continuar de forma sencilla."
        />

        <div className="mt-2 mb-8 flex flex-col gap-3 sm:flex-row lg:hidden">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="h-14 w-full rounded-2xl border-primary bg-background text-base text-primary hover:bg-primary hover:text-primary-foreground sm:w-auto"
            >
              <ArrowLeft className="size-5" />
              Inicio
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          <ActionCard
            href="/patient"
            icon={HeartPulse}
            title="Soy paciente"
            description="Continúa con tu programa de rehabilitación."
          />

          <ActionCard
            href="/professional"
            icon={Stethoscope}
            title="Soy profesional"
            description="Revisa la evolución de tus pacientes."
          />
        </div>

        <p className="mt-8 text-center text-sm leading-6 text-muted-foreground">
          Si tienes dudas, consulta con tu equipo de rehabilitación cardíaca.
        </p>
      </div>
    </PublicLayout>
  );
}