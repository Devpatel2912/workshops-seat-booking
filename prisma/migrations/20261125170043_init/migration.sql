-- AlterTable
ALTER TABLE "user" ADD COLUMN     "signupRole" TEXT;

-- CreateTable
CREATE TABLE "workshops" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "eventDate" DATE NOT NULL,
    "startTime" TIME(0) NOT NULL,
    "endTime" TIME(0) NOT NULL,
    "seatLimit" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "fees" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workshops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "workshopId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "workshops_eventDate_idx" ON "workshops"("eventDate");

-- CreateIndex
CREATE INDEX "bookings_workshopId_idx" ON "bookings"("workshopId");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "workshops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
