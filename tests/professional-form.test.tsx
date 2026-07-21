import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProfessionalForm } from "@/components/admin/professional-form";

describe("ProfessionalForm", () => {
  it("explains the empty state when no organization is available", () => {
    render(<ProfessionalForm organizations={[]} />);

    expect(
      screen.getByRole("heading", { name: "Falta preparar la estructura asistencial" }),
    ).toBeDefined();
    expect(screen.queryByRole("button", { name: "Crear profesional" })).toBeNull();
  });
});
