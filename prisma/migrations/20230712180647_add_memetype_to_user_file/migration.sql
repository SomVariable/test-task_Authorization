/*
  Warnings:

  - Added the required column `mimetype` to the `UserFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserFile" ADD COLUMN     "mimetype" TEXT NOT NULL;
