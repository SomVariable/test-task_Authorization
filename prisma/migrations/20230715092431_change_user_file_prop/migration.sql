/*
  Warnings:

  - You are about to drop the column `user_postId` on the `UserFile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserFile" DROP CONSTRAINT "UserFile_user_postId_fkey";

-- AlterTable
ALTER TABLE "UserFile" DROP COLUMN "user_postId",
ADD COLUMN     "user_post_id" INTEGER;

-- AddForeignKey
ALTER TABLE "UserFile" ADD CONSTRAINT "UserFile_user_post_id_fkey" FOREIGN KEY ("user_post_id") REFERENCES "UserPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
