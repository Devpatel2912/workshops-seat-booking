/*
  Warnings:

  - You are about to drop the column `eventDate` on the `workshops` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "workshops_eventDate_idx";

-- AlterTable
ALTER TABLE "workshops" DROP COLUMN "eventDate";
