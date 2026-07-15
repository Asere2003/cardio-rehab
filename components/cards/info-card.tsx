import { Card, CardContent } from "@/components/ui/card";

import type { LucideIcon } from "lucide-react";

type InfoCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function InfoCard({
  icon: Icon,
  title,
  description,
}: InfoCardProps) {
  return (
    <Card className="rounded-3xl">
      <CardContent className="p-6">
        <Icon className="mb-4 size-7 text-primary" />

        <h3 className="text-lg font-bold">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}