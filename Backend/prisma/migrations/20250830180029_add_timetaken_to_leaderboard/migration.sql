/*
  Warnings:

  - Added the required column `timeTaken` to the `LeaderboardEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeaderboardEntry" ADD COLUMN     "timeTaken" INTEGER NOT NULL;
