/*
  Warnings:

  - You are about to drop the column `profileId` on the `UserFile` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserFile` table. All the data in the column will be lost.
  - You are about to drop the column `userPostId` on the `UserFile` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `UserPost` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `UserFile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profile_id]` on the table `UserFile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `UserFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `UserPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserFile" DROP CONSTRAINT "UserFile_profileId_fkey";

-- DropForeignKey
ALTER TABLE "UserFile" DROP CONSTRAINT "UserFile_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserFile" DROP CONSTRAINT "UserFile_userPostId_fkey";

-- DropForeignKey
ALTER TABLE "UserPost" DROP CONSTRAINT "UserPost_authorId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_userId_fkey";

-- DropIndex
DROP INDEX "UserFile_profileId_key";

-- DropIndex
DROP INDEX "UserFile_userId_key";

-- DropIndex
DROP INDEX "UserProfile_userId_key";

-- AlterTable
ALTER TABLE "UserFile" DROP COLUMN "profileId",
DROP COLUMN "userId",
DROP COLUMN "userPostId",
ADD COLUMN     "profile_id" INTEGER,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD COLUMN     "user_postId" INTEGER;

-- AlterTable
ALTER TABLE "UserPost" DROP COLUMN "authorId",
ADD COLUMN     "author_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserFile_user_id_key" ON "UserFile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserFile_profile_id_key" ON "UserFile"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_user_id_key" ON "UserProfile"("user_id");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFile" ADD CONSTRAINT "UserFile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFile" ADD CONSTRAINT "UserFile_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFile" ADD CONSTRAINT "UserFile_user_postId_fkey" FOREIGN KEY ("user_postId") REFERENCES "UserPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPost" ADD CONSTRAINT "UserPost_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
