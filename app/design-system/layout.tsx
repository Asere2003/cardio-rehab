import { AdminLayout } from "@/components/layout/admin-layout";
import { assertAdminSurfaceAvailable } from "@/lib/admin/surface";

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  assertAdminSurfaceAvailable();

  return <AdminLayout>{children}</AdminLayout>;
}
