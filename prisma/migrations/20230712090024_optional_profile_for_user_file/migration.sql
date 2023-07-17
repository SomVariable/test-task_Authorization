/*
  Warnings:

  - Added the required column `text` to the `UserPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserFile" ADD COLUMN     "userPostId" INTEGER;

-- AlterTable
ALTER TABLE "UserPost" ADD COLUMN     "text" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserFile" ADD CONSTRAINT "UserFile_userPostId_fkey" FOREIGN KEY ("userPostId") REFERENCES "UserPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
