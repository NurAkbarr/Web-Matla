/*
  Warnings:

  - You are about to drop the column `maritalStatus` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the column `referenceBy` on the `Applicant` table. All the data in the column will be lost.
  - Added the required column `employmentStatus` to the `Applicant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Applicant` DROP COLUMN `maritalStatus`,
    DROP COLUMN `referenceBy`,
    ADD COLUMN `employmentStatus` VARCHAR(191) NOT NULL,
    ADD COLUMN `infoSource` VARCHAR(191) NULL;
