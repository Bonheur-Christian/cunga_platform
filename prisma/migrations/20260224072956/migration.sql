/*
  Warnings:

  - You are about to drop the column `reviewedBy` on the `product_requests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product_requests" DROP COLUMN "reviewedBy",
ADD COLUMN     "fulFilledBy" TEXT;
