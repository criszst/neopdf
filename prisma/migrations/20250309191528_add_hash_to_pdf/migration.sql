/*
  Warnings:

  - A unique constraint covering the columns `[fileHash]` on the table `PDF` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PDF" ADD COLUMN     "fileHash" TEXT,
ADD COLUMN     "fileSize" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "PDF_fileHash_key" ON "PDF"("fileHash");
