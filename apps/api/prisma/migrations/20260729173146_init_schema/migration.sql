-- CreateEnum
CREATE TYPE "ThemeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "UploadBatch" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "totalRecords" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UploadBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "feedbackText" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "productArea" TEXT NOT NULL,
    "feedbackDate" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER,
    "batchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "problemStatement" TEXT NOT NULL,
    "status" "ThemeStatus" NOT NULL DEFAULT 'PENDING',
    "aiConfidence" DOUBLE PRECISION,
    "batchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThemeFeedback" (
    "id" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,

    CONSTRAINT "ThemeFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "report" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeBase" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnowledgeBase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Feedback_batchId_idx" ON "Feedback"("batchId");

-- CreateIndex
CREATE INDEX "Feedback_productArea_idx" ON "Feedback"("productArea");

-- CreateIndex
CREATE INDEX "Feedback_feedbackDate_idx" ON "Feedback"("feedbackDate");

-- CreateIndex
CREATE INDEX "Theme_batchId_idx" ON "Theme"("batchId");

-- CreateIndex
CREATE INDEX "ThemeFeedback_themeId_idx" ON "ThemeFeedback"("themeId");

-- CreateIndex
CREATE INDEX "ThemeFeedback_feedbackId_idx" ON "ThemeFeedback"("feedbackId");

-- CreateIndex
CREATE UNIQUE INDEX "ThemeFeedback_themeId_feedbackId_key" ON "ThemeFeedback"("themeId", "feedbackId");

-- CreateIndex
CREATE INDEX "Report_batchId_idx" ON "Report"("batchId");

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "UploadBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Theme" ADD CONSTRAINT "Theme_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "UploadBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThemeFeedback" ADD CONSTRAINT "ThemeFeedback_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThemeFeedback" ADD CONSTRAINT "ThemeFeedback_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "UploadBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
