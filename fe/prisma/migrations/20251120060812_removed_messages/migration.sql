/*
  Warnings:

  - You are about to drop the column `messageId` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `message` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_messageId_fkey";

-- DropIndex
DROP INDEX "Report_messageId_idx";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "messageId",
ADD COLUMN     "message" TEXT NOT NULL;

-- DropTable
DROP TABLE "Message";

-- DropEnum
DROP TYPE "MessageType";
