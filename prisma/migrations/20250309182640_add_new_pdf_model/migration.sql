/*
  Warnings:

  - You are about to drop the column `url` on the `PDF` table. All the data in the column will be lost.
  - Added the required column `s3Key` to the `PDF` table without a default value. This is not possible if the table is not empty.
  - Added the required column `s3Url` to the `PDF` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PDF` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PDF` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PDF" DROP COLUMN "url",
ADD COLUMN     "s3Key" TEXT NOT NULL,
ADD COLUMN     "s3Url" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PDF" ADD CONSTRAINT "PDF_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
