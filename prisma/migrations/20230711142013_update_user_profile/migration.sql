/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `UserFile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profileId` to the `UserFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserFile" ADD COLUMN     "profileId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserFile_profileId_key" ON "UserFile"("profileId");

-- AddForeignKey
ALTER TABLE "UserFile" ADD CONSTRAINT "UserFile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
