-- DropForeignKey
ALTER TABLE "UserPost" DROP CONSTRAINT "UserPost_author_id_fkey";

-- DropForeignKey
ALTER TABLE "UserPost" DROP CONSTRAINT "UserPost_channel_id_fkey";

-- AddForeignKey
ALTER TABLE "UserPost" ADD CONSTRAINT "UserPost_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPost" ADD CONSTRAINT "UserPost_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
