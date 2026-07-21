import "server-only";

import { notFound } from "next/navigation";

export function isAdminSurfaceAvailable() {
  return process.env.VERCEL_ENV !== "production" && process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview";
}

export function assertAdminSurfaceAvailable() {
  if (!isAdminSurfaceAvailable()) {
    notFound();
  }
}
