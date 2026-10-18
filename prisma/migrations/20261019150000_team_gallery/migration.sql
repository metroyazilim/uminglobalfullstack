-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN "alternateName" TEXT,
ADD COLUMN "gallery" JSONB NOT NULL DEFAULT '[]';
