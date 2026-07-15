import {
  Activity,
  ArrowRight,
  ClipboardCheck,
  HeartPulse,
  Home,
  ShieldCheck,
  Smartphone,
  Stethoscope,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { InfoCard } from "@/components/cards/info-card";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/public-layout";

const features = [
  {
    icon: ClipboardCheck,
    title: "Tu Plan",
    text: "Hecho para ti por el equipo de rehabilitación.",
  },
  {
    icon: Smartphone,
    title: "Registra tus sesiones",
    text: "Anota cómo te encuentras después de cada entrenamiento.",
  },
  {
    icon: Stethoscope,
    title: "Siempre acompañado",
    text: "Tu equipo puede revisar tu evolución cuando sea necesario.",
  },
];

export default function HomePage() {
  return (
    <PublicLayout showLoginButton>
      <div className="grid gap-10 pt-10 pb-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-24 lg:pb-16">
        <section>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm">
            <ShieldCheck className="size-4 text-primary" />
            Acompañamiento después del hospital
          </div>

          <h1 className="text-5xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Volver a Latir también es volver a caminar.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Continúa tu programa de rehabilitación cardíaca desde casa y permite
            que tu equipo sanitario siga acompañándote en cada paso.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:hidden">
            <Link href="/access">
              <Button
                size="lg"
                className="h-14 w-full rounded-2xl text-base sm:w-auto"
              >
                Entrar
                <ArrowRight className="size-5" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="relative">
          <Card className="rounded-[2rem] border-primary/10 shadow-xl">
            <CardHeader >
              <CardTitle className="flex items-center gap-3 text-2xl">
                <HeartPulse className="size-7 text-primary" />
                Hoy toca cuidarte
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-3xl bg-accent p-5">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-card">
                    <Activity className="size-6 text-primary" />
                  </div>

                  <div>
                    <p className="font-bold">Caminar</p>
                    <p className="text-sm text-muted-foreground">
                      30 minutos · Borg 5-6
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border bg-card p-5">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary">
                    <Home className="size-6 text-secondary-foreground" />
                  </div>

                  <div>
                    <p className="font-bold">Ejercicios en casa</p>
                    <p className="text-sm text-muted-foreground">
                      Fuerza suave + estiramientos
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-primary p-6 text-primary-foreground">
                <p className="text-sm opacity-90">Mensaje del equipo</p>
                <p className="mt-2 text-xl font-bold">
                  Poco a poco. Lo importante es seguir.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <section className="grid gap-4 pb-8 md:grid-cols-3">
        {features.map((feature) => (
          <InfoCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.text}
          />
        ))}
      </section>
    </PublicLayout>
  );
}