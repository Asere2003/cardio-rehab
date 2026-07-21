import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole } from "../generated/prisma/client";
import { z } from "zod";

const bootstrapEnvironment = z.object({
  ALLOW_ADMIN_BOOTSTRAP: z.literal("true"),
  BOOTSTRAP_ORGANIZATION_NAME: z.string().trim().min(1).max(100),
  BOOTSTRAP_ORGANIZATION_SLUG: z.string().trim().regex(/^[a-z0-9-]+$/),
  BOOTSTRAP_CARE_UNIT_NAME: z.string().trim().min(1).max(100),
  BOOTSTRAP_CARE_UNIT_SLUG: z.string().trim().regex(/^[a-z0-9-]+$/),
  BOOTSTRAP_ADMIN_EMAIL: z.string().trim().toLowerCase().email(),
  BOOTSTRAP_ADMIN_FIRST_NAME: z.string().trim().min(1).max(100),
  BOOTSTRAP_ADMIN_LAST_NAME: z.string().trim().min(1).max(100),
});

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("El bootstrap no se puede ejecutar en producción.");
  }

  const configuration = bootstrapEnvironment.parse(process.env);
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("Falta DATABASE_URL.");
  }

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  try {
    const result = await prisma.$transaction(async (transaction) => {
      const organization = await transaction.organization.upsert({
        where: { slug: configuration.BOOTSTRAP_ORGANIZATION_SLUG },
        create: { name: configuration.BOOTSTRAP_ORGANIZATION_NAME, slug: configuration.BOOTSTRAP_ORGANIZATION_SLUG },
        update: {},
        select: { id: true },
      });
      const careUnit = await transaction.careUnit.upsert({
        where: { organizationId_slug: { organizationId: organization.id, slug: configuration.BOOTSTRAP_CARE_UNIT_SLUG } },
        create: { organizationId: organization.id, name: configuration.BOOTSTRAP_CARE_UNIT_NAME, slug: configuration.BOOTSTRAP_CARE_UNIT_SLUG },
        update: {},
        select: { id: true },
      });
      const existingUser = await transaction.user.findUnique({
        where: { email: configuration.BOOTSTRAP_ADMIN_EMAIL },
        select: { id: true, role: true, professional: { select: { id: true } } },
      });

      if (existingUser && existingUser.role !== UserRole.ADMIN) {
        throw new Error("El correo ya pertenece a una identidad que no es ADMIN.");
      }

      const user = existingUser ?? await transaction.user.create({
        data: {
          email: configuration.BOOTSTRAP_ADMIN_EMAIL,
          password: null,
          role: UserRole.ADMIN,
          professional: {
            create: {
              firstName: configuration.BOOTSTRAP_ADMIN_FIRST_NAME,
              lastName: configuration.BOOTSTRAP_ADMIN_LAST_NAME,
              professionalCategory: "ADMINISTRATION",
            },
          },
        },
        select: { id: true, role: true, professional: { select: { id: true } } },
      });

      if (!user.professional) {
        throw new Error("La identidad ADMIN existente no tiene perfil profesional.");
      }

      await transaction.professionalMembership.upsert({
        where: { professionalId_careUnitId: { professionalId: user.professional.id, careUnitId: careUnit.id } },
        create: {
          professionalId: user.professional.id,
          careUnitId: careUnit.id,
          permissions: ["PROFESSIONAL_MANAGE", "AUDIT_VIEW"],
        },
        update: {},
      });

      return { createdUser: !existingUser };
    });

    console.log(result.createdUser
      ? "Bootstrap completado: identidad ADMIN creada sin credencial."
      : "Bootstrap completado: estructura y membresía ADMIN verificadas.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Error de bootstrap desconocido.";
  console.error(`Bootstrap detenido: ${message}`);
  process.exitCode = 1;
});
