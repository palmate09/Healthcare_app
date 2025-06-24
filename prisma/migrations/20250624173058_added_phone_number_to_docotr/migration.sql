/*
  Warnings:

  - A unique constraint covering the columns `[phone_number]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone_number` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Doctor` ADD COLUMN `phone_number` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Doctor_phone_number_key` ON `Doctor`(`phone_number`);
