-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'active', 'blocked');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "verification_key" TEXT DEFAULT '',
    "verification_timestemp" TEXT DEFAULT '',
    "role" "Roles" NOT NULL DEFAULT 'user',
    "status" "Status" NOT NULL DEFAULT 'pending',
    "isConfirmedChangePassword" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");
