-- AlterTable
ALTER TABLE "Post" ADD COLUMN "authorSlug" TEXT;

-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN "knowsAbout" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN "sameAs" JSONB NOT NULL DEFAULT '[]';
