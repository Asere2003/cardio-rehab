import { describe, expect, it } from "vitest";

import { createProfessionalSchema } from "@/lib/admin/professional-validation";

const validProfessional = {
  firstName: "Lucía",
  lastName: "Martín",
  email: "  LUCIA.MARTIN@EXAMPLE.TEST ",
  professionalCategory: "NURSING",
  organizationId: "cm12345678901234567890123",
  careUnitId: "cm12345678901234567890124",
  permissions: ["PATIENT_VIEW", "SESSION_VIEW"],
};

describe("createProfessionalSchema", () => {
  it("normalizes the professional email", () => {
    const result = createProfessionalSchema.parse(validProfessional);

    expect(result.email).toBe("lucia.martin@example.test");
  });

  it("rejects unknown permissions", () => {
    const result = createProfessionalSchema.safeParse({
      ...validProfessional,
      permissions: ["UNKNOWN_PERMISSION"],
    });

    expect(result.success).toBe(false);
  });

  it("rejects missing names and HTML-like content", () => {
    const result = createProfessionalSchema.safeParse({
      ...validProfessional,
      firstName: "<b>Lucía</b>",
      lastName: " ",
    });

    expect(result.success).toBe(false);
  });
});
