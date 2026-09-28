-- Admin-managed custom pages and a bounded hierarchical public navigation tree.
CREATE TABLE "CustomPage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "blocks" JSONB NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CustomPage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CustomPage_slug_key" ON "CustomPage"("slug");
CREATE INDEX "CustomPage_status_sortOrder_idx" ON "CustomPage"("status", "sortOrder");

CREATE TABLE "NavigationItem" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "parentId" TEXT,
    "customPageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "NavigationItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NavigationItem_customPageId_key" ON "NavigationItem"("customPageId");
CREATE INDEX "NavigationItem_parentId_sortOrder_idx" ON "NavigationItem"("parentId", "sortOrder");
ALTER TABLE "NavigationItem" ADD CONSTRAINT "NavigationItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "NavigationItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NavigationItem" ADD CONSTRAINT "NavigationItem_customPageId_fkey" FOREIGN KEY ("customPageId") REFERENCES "CustomPage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
