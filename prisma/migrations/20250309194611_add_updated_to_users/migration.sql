/*
  Warnings:

  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PDFType" AS ENUM ('DOCUMENT', 'FORM', 'PRESENTATION', 'BOOK', 'REPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('UPLOAD', 'VIEW', 'DOWNLOAD', 'DELETE', 'STAR', 'UNSTAR', 'SHARE');

-- AlterTable
ALTER TABLE "PDF" ADD COLUMN     "fileType" "PDFType" NOT NULL DEFAULT 'DOCUMENT',
ADD COLUMN     "isStarred" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastViewed" TIMESTAMP(3),
ADD COLUMN     "pageCount" INTEGER,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "storageLimit" INTEGER NOT NULL DEFAULT 52428800,
ADD COLUMN     "storageUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "updatedAt" TIMESTAMP NOT NULL DEFAULT now();


-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "details" TEXT,
    "userId" TEXT NOT NULL,
    "pdfId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_pdfId_fkey" FOREIGN KEY ("pdfId") REFERENCES "PDF"("id") ON DELETE SET NULL ON UPDATE CASCADE;
