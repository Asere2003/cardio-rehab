import { AdminLayout } from "@/components/layout/admin-layout";
import { assertAdminSurfaceAvailable } from "@/lib/admin/surface";

export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  assertAdminSurfaceAvailable();

  return <AdminLayout>{children}</AdminLayout>;
}
