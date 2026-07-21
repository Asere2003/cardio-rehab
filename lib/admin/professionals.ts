import "server-only";

import { Permission, Prisma, UserRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateProfessionalInput } from "@/lib/admin/professional-validation";

export class ProfessionalCreationError extends Error {
  constructor(
    public readonly code: "DUPLICATE_EMAIL" | "INVALID_CARE_UNIT" | "UNEXPECTED",
  ) {
    super(code);
  }
}

export type ProfessionalListItem = {
  id: string;
  fullName: string;
  email: string;
  category: string | null;
  memberships: Array<{
    id: string;
    unitName: string;
    organizationName: string;
    permissions: Permission[];
    endedAt: Date | null;
  }>;
};

export async function listProfessionals(): Promise<ProfessionalListItem[]> {
  const professionals = await prisma.professional.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      user: { select: { email: true } },
      professionalCategory: true,
      memberships: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          permissions: true,
          endedAt: true,
          careUnit: {
            select: {
              name: true,
              organization: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  return professionals.map((professional) => ({
    id: professional.id,
    fullName: `${professional.firstName} ${professional.lastName}`,
    email: professional.user.email,
    category: professional.professionalCategory,
    memberships: professional.memberships.map((membership) => ({
      id: membership.id,
      unitName: membership.careUnit.name,
      organizationName: membership.careUnit.organization.name,
      permissions: membership.permissions,
      endedAt: membership.endedAt,
    })),
  }));
}

export async function getProfessionalCreationOptions() {
  return prisma.organization.findMany({
    where: { disabledAt: null },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      careUnits: {
        where: { disabledAt: null },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      },
    },
  });
}

export async function getProfessionalDetail(professionalId: string) {
  return prisma.professional.findUnique({
    where: { id: professionalId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      professionalCategory: true,
      createdAt: true,
      user: { select: { email: true } },
      memberships: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          permissions: true,
          createdAt: true,
          endedAt: true,
          careUnit: {
            select: {
              name: true,
              organization: { select: { name: true } },
            },
          },
        },
      },
    },
  });
}

export async function createProfessionalWithMembership(input: CreateProfessionalInput) {
  try {
    return await prisma.$transaction(async (transaction) => {
      const careUnit = await transaction.careUnit.findFirst({
        where: {
          id: input.careUnitId,
          organizationId: input.organizationId,
          disabledAt: null,
          organization: { disabledAt: null },
        },
        select: { id: true },
      });

      if (!careUnit) {
        throw new ProfessionalCreationError("INVALID_CARE_UNIT");
      }

      const existingUser = await transaction.user.findUnique({
        where: { email: input.email },
        select: { id: true },
      });

      if (existingUser) {
        throw new ProfessionalCreationError("DUPLICATE_EMAIL");
      }

      const user = await transaction.user.create({
        data: {
          email: input.email,
          password: null,
          role: UserRole.PROFESSIONAL,
          professional: {
            create: {
              firstName: input.firstName,
              lastName: input.lastName,
              professionalCategory: input.professionalCategory,
              memberships: {
                create: {
                  careUnitId: careUnit.id,
                  permissions: input.permissions,
                },
              },
            },
          },
        },
        select: {
          professional: {
            select: { id: true },
          },
        },
      });

      if (!user.professional) {
        throw new ProfessionalCreationError("UNEXPECTED");
      }

      return { professionalId: user.professional.id };
    });
  } catch (error) {
    if (error instanceof ProfessionalCreationError) {
      throw error;
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ProfessionalCreationError("DUPLICATE_EMAIL");
    }

    throw new ProfessionalCreationError("UNEXPECTED");
  }
}
