/*
  Warnings:

  - You are about to drop the column `role` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `UserProfile` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "role",
DROP COLUMN "status",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
