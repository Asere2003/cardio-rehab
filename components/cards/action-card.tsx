// components/cards/action-card.tsx

import { Card, CardContent } from "@/components/ui/card";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type ActionCardProps = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export function ActionCard({
  href,
  icon: Icon,
  title,
  description,
}: ActionCardProps) {
  return (
    <Link href={href}>
      <Card className="group rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl">
        <CardContent className="flex min-h-36 items-center gap-5 p-8">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
            <Icon className="size-8" />
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              {title}
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary/10">
            <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}