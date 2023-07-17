-- CreateEnum
CREATE TYPE "ChannelRole" AS ENUM ('CREATOR', 'ADMIN', 'USER');

-- AlterTable
ALTER TABLE "UserPost" ADD COLUMN     "channel_id" INTEGER;

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelProfile" (
    "id" SERIAL NOT NULL,
    "rolle" "ChannelRole" NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "ChannelProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- AddForeignKey
ALTER TABLE "ChannelProfile" ADD CONSTRAINT "ChannelProfile_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelProfile" ADD CONSTRAINT "ChannelProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPost" ADD CONSTRAINT "UserPost_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
