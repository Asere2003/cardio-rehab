import { Card, CardContent } from "@/components/ui/card";

export default function ProfessionalsLoading() {
  return (
    <div className="space-y-4 py-10" aria-live="polite" aria-busy="true">
      <p className="text-sm text-muted-foreground">Cargando profesionales…</p>
      {[1, 2, 3].map((item) => (
        <Card key={item} className="rounded-3xl">
          <CardContent className="h-36 animate-pulse p-6" />
        </Card>
      ))}
    </div>
  );
}
