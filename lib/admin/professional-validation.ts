import { z } from "zod";

import {
  permissionValues,
  professionalCategories,
  type ProfessionalCategory,
} from "@/lib/admin/professional-constants";

const readableText = z
  .string()
  .trim()
  .min(1, "Este campo es obligatorio.")
  .max(100, "El texto es demasiado largo.")
  .refine((value) => !/[<>]/.test(value), "No incluyas etiquetas HTML.");

const identifier = z.string().trim().min(1, "Selecciona una opción.").max(64);

export const createProfessionalSchema = z.object({
  firstName: readableText,
  lastName: readableText,
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Introduce un correo profesional válido.")
    .max(254, "El correo es demasiado largo."),
  professionalCategory: z.enum(professionalCategories),
  organizationId: identifier,
  careUnitId: identifier,
  permissions: z
    .array(z.enum(permissionValues))
    .min(1, "Selecciona al menos un permiso."),
});

export type CreateProfessionalInput = z.infer<typeof createProfessionalSchema>;

export type ProfessionalFormState = {
  message?: string;
  fieldErrors?: Partial<Record<keyof CreateProfessionalInput, string[]>>;
};

export function parseProfessionalFormData(formData: FormData) {
  return createProfessionalSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    professionalCategory: formData.get("professionalCategory"),
    organizationId: formData.get("organizationId"),
    careUnitId: formData.get("careUnitId"),
    permissions: formData.getAll("permissions"),
  });
}

export function getProfessionalCategoryLabel(category: string | null) {
  const labels: Record<ProfessionalCategory, string> = {
    NURSING: "Enfermería",
    MEDICINE: "Medicina",
    PHYSIOTHERAPY: "Fisioterapia",
    ADMINISTRATION: "Administración",
    COORDINATION: "Coordinación",
    OTHER: "Otra función",
  };

  return category && category in labels
    ? labels[category as ProfessionalCategory]
    : "No indicada";
}
