import { redirect } from "next/navigation";

import { assertAdminSurfaceAvailable } from "@/lib/admin/surface";

export default function LegacyDesignSystemPage() {
  assertAdminSurfaceAvailable();
  redirect("/design-system");
}
