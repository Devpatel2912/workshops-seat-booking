-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED';

-- CreateIndex
CREATE INDEX "bookings_status_expiresAt_idx" ON "bookings"("status", "expiresAt");
