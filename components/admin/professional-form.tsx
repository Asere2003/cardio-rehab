"use client";

import { useActionState, useMemo, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProfessionalAction } from "@/app/admin/professionals/new/actions";
import {
  permissionDetails,
  permissionValues,
  professionalCategories,
  professionalCategoryLabels,
  type PermissionValue,
} from "@/lib/admin/professional-constants";
import type { ProfessionalFormState } from "@/lib/admin/professional-validation";

type OrganizationOption = {
  id: string;
  name: string;
  careUnits: Array<{ id: string; name: string }>;
};

type ProfessionalFormProps = {
  organizations: OrganizationOption[];
};

const initialState: ProfessionalFormState = {};

export function ProfessionalForm({ organizations }: ProfessionalFormProps) {
  const [state, formAction, isPending] = useActionState(
    createProfessionalAction,
    initialState,
  );
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id ?? "");
  const selectedOrganization = useMemo(
    () => organizations.find((organization) => organization.id === organizationId),
    [organizationId, organizations],
  );
  const permissionsByGroup = useMemo(() => {
    return permissionValues.reduce<Record<string, PermissionValue[]>>(
      (groups, permission) => {
        const group = permissionDetails[permission].group;
        groups[group] = [...(groups[group] ?? []), permission];
        return groups;
      },
      {},
    );
  }, []);

  if (organizations.length === 0) {
    return (
      <Card className="rounded-3xl">
        <CardContent className="p-8">
          <h2 className="text-xl font-bold">Falta preparar la estructura asistencial</h2>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            Antes de añadir profesionales, ejecuta el bootstrap controlado para
            crear una organización y una unidad asistencial de desarrollo.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-xl">1. Datos profesionales</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Solo necesitamos lo imprescindible para identificar a esta persona.
          </p>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <FormField error={state.fieldErrors?.firstName}>
            <Label htmlFor="firstName">Nombre</Label>
            <Input id="firstName" name="firstName" autoComplete="given-name" required className="mt-2 min-h-12" />
          </FormField>
          <FormField error={state.fieldErrors?.lastName}>
            <Label htmlFor="lastName">Apellidos</Label>
            <Input id="lastName" name="lastName" autoComplete="family-name" required className="mt-2 min-h-12" />
          </FormField>
          <FormField error={state.fieldErrors?.email} className="sm:col-span-2">
            <Label htmlFor="email">Correo profesional</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required className="mt-2 min-h-12" />
          </FormField>
          <FormField error={state.fieldErrors?.professionalCategory} className="sm:col-span-2">
            <Label htmlFor="professionalCategory">Función profesional</Label>
            <select
              id="professionalCategory"
              name="professionalCategory"
              required
              defaultValue=""
              className="mt-2 min-h-12 w-full rounded-3xl border border-input bg-input/50 px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              <option value="" disabled>Selecciona una función</option>
              {professionalCategories.map((category) => (
                <option key={category} value={category}>
                  {professionalCategoryLabels[category]}
                </option>
              ))}
            </select>
          </FormField>
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-xl">2. Organización y unidad</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Los permisos se aplicarán únicamente dentro de esta unidad.
          </p>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <FormField error={state.fieldErrors?.organizationId}>
            <Label htmlFor="organizationId">Organización</Label>
            <select
              id="organizationId"
              name="organizationId"
              value={organizationId}
              onChange={(event) => setOrganizationId(event.target.value)}
              required
              className="mt-2 min-h-12 w-full rounded-3xl border border-input bg-input/50 px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              {organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField error={state.fieldErrors?.careUnitId}>
            <Label htmlFor="careUnitId">Unidad asistencial</Label>
            <select
              id="careUnitId"
              name="careUnitId"
              key={selectedOrganization?.id}
              disabled={!selectedOrganization || selectedOrganization.careUnits.length === 0}
              required
              className="mt-2 min-h-12 w-full rounded-3xl border border-input bg-input/50 px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {selectedOrganization?.careUnits.length ? (
                selectedOrganization.careUnits.map((careUnit) => (
                  <option key={careUnit.id} value={careUnit.id}>
                    {careUnit.name}
                  </option>
                ))
              ) : (
                <option value="">No hay unidades disponibles</option>
              )}
            </select>
          </FormField>
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-xl">3. Permisos iniciales</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Selecciona solo las tareas que esta persona necesita realizar en su unidad.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(permissionsByGroup).map(([group, permissions]) => (
            <fieldset key={group}>
              <legend className="text-sm font-bold">{group}</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {permissions.map((permission) => {
                  const detail = permissionDetails[permission];
                  const id = `permission-${permission}`;
                  return (
                    <label
                      key={permission}
                      htmlFor={id}
                      className="flex min-h-16 cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors hover:bg-muted"
                    >
                      <Checkbox id={id} name="permissions" value={permission} className="mt-0.5 size-5" />
                      <span>
                        <span className="block font-semibold">{detail.label}</span>
                        <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                          {detail.description}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
          <FieldError messages={state.fieldErrors?.permissions} />
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-xl font-bold">4. Revisar y crear</h2>
          <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">
            Se creará el perfil, su membresía y los permisos en una única operación.
            El acceso digital seguirá pendiente hasta la fase de autenticación.
          </p>
          {state.message && (
            <p className="mt-4 rounded-2xl bg-destructive/10 p-4 text-sm font-medium text-destructive" role="alert">
              {state.message}
            </p>
          )}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="submit" size="lg" disabled={isPending} className="min-h-14 rounded-2xl text-base">
              {isPending ? "Creando profesional…" : "Crear profesional"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

function FormField({
  children,
  error,
  className,
}: {
  children: React.ReactNode;
  error?: string[];
  className?: string;
}) {
  return (
    <div className={className}>
      {children}
      <FieldError messages={error} />
    </div>
  );
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.[0]) {
    return null;
  }

  return <p className="mt-2 text-sm font-medium text-destructive">{messages[0]}</p>;
}
