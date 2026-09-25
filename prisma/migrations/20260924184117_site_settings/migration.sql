-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "singleton" BOOLEAN NOT NULL DEFAULT true,
    "organizationName" TEXT,
    "legalName" TEXT,
    "alternateName" TEXT,
    "slogan" TEXT,
    "description" TEXT,
    "foundingDate" TEXT,
    "locality" TEXT,
    "countryCode" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "linkedin" TEXT,
    "x" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SiteSettings_singleton_key" ON "SiteSettings"("singleton");
