-- DropForeignKey
ALTER TABLE "UserFile" DROP CONSTRAINT "UserFile_profileId_fkey";

-- AlterTable
ALTER TABLE "UserFile" ALTER COLUMN "profileId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserFile" ADD CONSTRAINT "UserFile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
