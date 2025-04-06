/*
  Warnings:

  - Added the required column `updatedAt` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Venue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "venueId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "address" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "GuestList" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "maxCapacity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuestList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "guestListId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GuestList_eventId_idx" ON "GuestList"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Guest_email_key" ON "Guest"("email");

-- CreateIndex
CREATE INDEX "Guest_guestListId_idx" ON "Guest"("guestListId");

-- CreateIndex
CREATE INDEX "Event_venueId_idx" ON "Event"("venueId");

-- AddForeignKey
ALTER TABLE "GuestList" ADD CONSTRAINT "GuestList_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_guestListId_fkey" FOREIGN KEY ("guestListId") REFERENCES "GuestList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
