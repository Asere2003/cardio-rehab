import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type PageIntroProps = {
  title: string;
  description?: string;
  badge?: string;
  className?: string;
};

export function PageIntro({
  title,
  description,
  badge,
  className,
}: PageIntroProps) {
  return (
    <div className={cn("mb-8", className)}>
      {badge && (
        <p className="mb-2 text-sm font-semibold text-primary">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm ">
            <ShieldCheck className="size-4 text-primary" />
            {badge}
          </div>
        </p>
      )}

      <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
        {title}
      </h1>

      {description && (
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}