/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `Applicant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `comparisonOpinion` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `focusOpinion` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `graduationYear` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `importanceOpinion` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maritalStatus` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motivation` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `newSkillInterest` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nik` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentProofUrl` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferredField` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolName` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `techSkillLevel` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Made the column `birthPlace` on table `Applicant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `birthDate` on table `Applicant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `Applicant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastEducation` on table `Applicant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Applicant` ADD COLUMN `comparisonOpinion` TEXT NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `focusOpinion` TEXT NOT NULL,
    ADD COLUMN `gender` VARCHAR(191) NOT NULL,
    ADD COLUMN `graduationYear` VARCHAR(191) NOT NULL,
    ADD COLUMN `importanceOpinion` TEXT NOT NULL,
    ADD COLUMN `maritalStatus` VARCHAR(191) NOT NULL,
    ADD COLUMN `motivation` TEXT NOT NULL,
    ADD COLUMN `newSkillInterest` TEXT NOT NULL,
    ADD COLUMN `nik` VARCHAR(191) NOT NULL,
    ADD COLUMN `paymentProofUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `preferredField` VARCHAR(191) NOT NULL,
    ADD COLUMN `referenceBy` VARCHAR(191) NULL,
    ADD COLUMN `schoolName` VARCHAR(191) NOT NULL,
    ADD COLUMN `techSkillLevel` INTEGER NOT NULL,
    ADD COLUMN `termsAgreed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `birthPlace` VARCHAR(191) NOT NULL,
    MODIFY `birthDate` DATETIME(3) NOT NULL,
    MODIFY `address` TEXT NOT NULL,
    MODIFY `lastEducation` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Applicant_nik_key` ON `Applicant`(`nik`);
