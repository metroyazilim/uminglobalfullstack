-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "contactTo" TEXT,
ADD COLUMN     "smtpFrom" TEXT,
ADD COLUMN     "smtpHost" TEXT,
ADD COLUMN     "smtpPasswordEnc" TEXT,
ADD COLUMN     "smtpPort" INTEGER,
ADD COLUMN     "smtpSecure" BOOLEAN,
ADD COLUMN     "smtpUser" TEXT;
