"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createProfessionalWithMembership, ProfessionalCreationError } from "@/lib/admin/professionals";
import {
  parseProfessionalFormData,
  type ProfessionalFormState,
} from "@/lib/admin/professional-validation";
import { assertAdminSurfaceAvailable } from "@/lib/admin/surface";

export async function createProfessionalAction(
  _previousState: ProfessionalFormState,
  formData: FormData,
): Promise<ProfessionalFormState> {
  assertAdminSurfaceAvailable();

  const parsed = parseProfessionalFormData(formData);

  if (!parsed.success) {
    return {
      message: "Revisa los datos indicados antes de continuar.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await createProfessionalWithMembership(parsed.data);
    revalidatePath("/admin/professionals");
    redirect(`/admin/professionals/${result.professionalId}?created=1`);
  } catch (error) {
    if (error instanceof ProfessionalCreationError) {
      if (error.code === "DUPLICATE_EMAIL") {
        return { message: "Ya existe una cuenta con este correo profesional." };
      }

      if (error.code === "INVALID_CARE_UNIT") {
        return {
          message:
            "La unidad seleccionada ya no está disponible para esta organización. Revísala e inténtalo de nuevo.",
        };
      }
    }

    return {
      message:
        "No hemos podido crear el profesional. No se ha guardado ningún dato parcial.",
    };
  }
}
