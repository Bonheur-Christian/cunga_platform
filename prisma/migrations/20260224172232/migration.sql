/*
  Warnings:

  - A unique constraint covering the columns `[productId,location]` on the table `inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "inventory_productId_location_key" ON "inventory"("productId", "location");
