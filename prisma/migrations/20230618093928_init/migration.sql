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
    "verification_timestamp" TEXT DEFAULT '',
    "role" "Roles" NOT NULL DEFAULT 'user',
    "status" "Status" NOT NULL DEFAULT 'pending',
    "isConfirmedChangePassword" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
