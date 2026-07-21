import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProfessionalStatusBadge } from "@/components/admin/professional-status-badge";

describe("ProfessionalStatusBadge", () => {
  it("communicates active membership and pending digital access", () => {
    render(<ProfessionalStatusBadge hasActiveMembership />);

    expect(screen.getByText("Perfil creado")).toBeDefined();
    expect(screen.getByText("Membresía activa")).toBeDefined();
    expect(screen.getByText("Acceso digital pendiente")).toBeDefined();
  });

  it("does not claim an inactive membership is active", () => {
    render(<ProfessionalStatusBadge hasActiveMembership={false} />);

    expect(screen.queryByText("Membresía activa")).toBeNull();
  });
});
