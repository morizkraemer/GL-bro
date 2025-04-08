/*
  Warnings:

  - Added the required column `createdByUserId` to the `GuestList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GuestList" ADD COLUMN     "createdByUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "GuestList" ADD CONSTRAINT "GuestList_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
