/*
  Warnings:

  - You are about to drop the column `genre` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `category` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "genre",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "discount" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL;
