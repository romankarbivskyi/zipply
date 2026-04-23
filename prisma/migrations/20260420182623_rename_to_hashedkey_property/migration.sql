/*
  Warnings:

  - You are about to drop the column `hashedSecret` on the `ApiKey` table. All the data in the column will be lost.
  - Added the required column `key` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "hashedSecret",
ADD COLUMN     "key" TEXT NOT NULL;
