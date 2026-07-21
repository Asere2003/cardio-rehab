-- AlterTable
ALTER TABLE "Professional" ADD COLUMN     "professionalCategory" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;
