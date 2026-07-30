/*
  Warnings:

  - You are about to drop the column `batchId` on the `Theme` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Theme` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Theme" DROP CONSTRAINT "Theme_batchId_fkey";

-- DropIndex
DROP INDEX "Theme_batchId_idx";

-- AlterTable
ALTER TABLE "Theme" DROP COLUMN "batchId";

-- CreateIndex
CREATE UNIQUE INDEX "Theme_title_key" ON "Theme"("title");
