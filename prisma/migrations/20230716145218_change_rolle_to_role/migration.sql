/*
  Warnings:

  - You are about to drop the column `rolle` on the `ChannelProfile` table. All the data in the column will be lost.
  - Added the required column `role` to the `ChannelProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChannelProfile" DROP COLUMN "rolle",
ADD COLUMN     "role" "ChannelRole" NOT NULL;
