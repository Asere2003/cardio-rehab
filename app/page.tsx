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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    icon: ClipboardCheck,
    title: "Plan personalizado",
    text: "Ejercicios adaptados por el equipo de rehabilitación.",
  },
  {
    icon: Smartphone,
    title: "Seguimiento desde casa",
    text: "El paciente registra sus sesiones desde el móvil.",
  },
  {
    icon: Stethoscope,
    title: "Revisión profesional",
    text: "El equipo puede consultar la evolución cuando lo necesite.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-svh bg-background">
      <section className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <HeartPulse className="size-6" />
            </div>

            <div>
              <p className="text-lg font-bold leading-none">Volver a Latir</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Rehabilitación Cardíaca
              </p>
            </div>
          </Link>

          <Button variant="ghost" className="hidden sm:inline-flex">
            Acceder
          </Button>
        </header>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <section>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm">
              <ShieldCheck className="size-4 text-primary" />
              Acompañamiento después del hospital
            </div>

            <h1 className="text-5xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Tu corazón sigue entrenando en casa.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Una herramienta sencilla para que los pacientes continúen su
              programa de rehabilitación cardíaca y el equipo sanitario pueda
              revisar su evolución.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 w-full rounded-2xl text-base sm:w-auto">
                  Comenzar
                  <ArrowRight className="size-5" />
                </Button>
              </Link>

              <Link href="/test">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 w-full rounded-2xl text-base sm:w-auto"
                >
                  Probar conexión
                </Button>
              </Link>
            </div>
          </section>

          <section className="relative">
            <Card className="rounded-[2rem] border-primary/10 shadow-xl">
              <CardHeader>
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
            <Card key={feature.title} className="rounded-3xl">
              <CardContent className="p-6">
                <feature.icon className="mb-4 size-7 text-primary" />
                <h2 className="text-lg font-bold">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      </section>
    </main>
  );
}