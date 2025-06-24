/*
  Warnings:

  - Made the column `phone_number` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `phone_number` BIGINT NOT NULL;
