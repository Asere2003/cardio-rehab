-- CreateEnum
CREATE TYPE "PatientProgramStatus" AS ENUM ('PENDING', 'ACTIVE', 'PAUSED', 'DISCHARGED', 'FOLLOW_UP', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('PATIENT_CREATE', 'PATIENT_VIEW', 'PATIENT_EDIT', 'PLAN_ASSIGN', 'PLAN_EDIT', 'SESSION_VIEW', 'REPORT_GENERATE', 'PROFESSIONAL_MANAGE', 'AUDIT_VIEW');

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_userId_fkey";

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Professional" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "disabledAt" TIMESTAMP(3),

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareUnit" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "disabledAt" TIMESTAMP(3),

    CONSTRAINT "CareUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalMembership" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "careUnitId" TEXT NOT NULL,
    "permissions" "Permission"[] DEFAULT ARRAY[]::"Permission"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "ProfessionalMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientEnrollment" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "careUnitId" TEXT NOT NULL,
    "responsibleMembershipId" TEXT,
    "status" "PatientProgramStatus" NOT NULL DEFAULT 'PENDING',
    "internalReference" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CareUnit_organizationId_slug_key" ON "CareUnit"("organizationId", "slug");

-- CreateIndex
CREATE INDEX "ProfessionalMembership_careUnitId_idx" ON "ProfessionalMembership"("careUnitId");

-- CreateIndex
CREATE INDEX "ProfessionalMembership_endedAt_idx" ON "ProfessionalMembership"("endedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalMembership_professionalId_careUnitId_key" ON "ProfessionalMembership"("professionalId", "careUnitId");

-- CreateIndex
CREATE INDEX "PatientEnrollment_careUnitId_status_idx" ON "PatientEnrollment"("careUnitId", "status");

-- CreateIndex
CREATE INDEX "PatientEnrollment_patientId_status_idx" ON "PatientEnrollment"("patientId", "status");

-- CreateIndex
CREATE INDEX "PatientEnrollment_responsibleMembershipId_idx" ON "PatientEnrollment"("responsibleMembershipId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientEnrollment_careUnitId_internalReference_key" ON "PatientEnrollment"("careUnitId", "internalReference");

-- AddForeignKey
ALTER TABLE "CareUnit" ADD CONSTRAINT "CareUnit_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalMembership" ADD CONSTRAINT "ProfessionalMembership_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalMembership" ADD CONSTRAINT "ProfessionalMembership_careUnitId_fkey" FOREIGN KEY ("careUnitId") REFERENCES "CareUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientEnrollment" ADD CONSTRAINT "PatientEnrollment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientEnrollment" ADD CONSTRAINT "PatientEnrollment_careUnitId_fkey" FOREIGN KEY ("careUnitId") REFERENCES "CareUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientEnrollment" ADD CONSTRAINT "PatientEnrollment_responsibleMembershipId_fkey" FOREIGN KEY ("responsibleMembershipId") REFERENCES "ProfessionalMembership"("id") ON DELETE SET NULL ON UPDATE CASCADE;
