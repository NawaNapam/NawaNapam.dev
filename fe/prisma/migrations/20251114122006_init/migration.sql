/*
  Warnings:

  - You are about to drop the `DeactivatedUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DeactivatedUser" DROP CONSTRAINT "DeactivatedUser_userId_fkey";

-- DropTable
DROP TABLE "DeactivatedUser";
