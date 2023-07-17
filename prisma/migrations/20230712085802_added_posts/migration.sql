-- CreateTable
CREATE TABLE "UserPost" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "UserPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserPost" ADD CONSTRAINT "UserPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
