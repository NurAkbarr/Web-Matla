-- AlterTable
ALTER TABLE `PmbSetting` ADD COLUMN `isOpen` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('STUDENT', 'DOSEN', 'ADMIN', 'SUPER_ADMIN') NOT NULL DEFAULT 'STUDENT';

-- CreateTable
CREATE TABLE `StudentProfile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `programStudiId` INTEGER NOT NULL,
    `semester` INTEGER NOT NULL DEFAULT 1,
    `ipk` DOUBLE NOT NULL DEFAULT 0,
    `sksDitempuh` INTEGER NOT NULL DEFAULT 0,
    `totalSks` INTEGER NOT NULL DEFAULT 144,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StudentProfile_userId_key`(`userId`),
    UNIQUE INDEX `StudentProfile_nim_key`(`nim`),
    INDEX `StudentProfile_programStudiId_fkey`(`programStudiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Announcement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'info',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseSchedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `courseName` VARCHAR(191) NOT NULL,
    `lecturer` VARCHAR(191) NULL,
    `lecturerId` INTEGER NULL,
    `room` VARCHAR(191) NOT NULL,
    `dayOfWeek` INTEGER NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `programStudiId` INTEGER NOT NULL,
    `semester` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CourseSchedule_programStudiId_fkey`(`programStudiId`),
    INDEX `CourseSchedule_lecturerId_fkey`(`lecturerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enrollment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentProfileId` INTEGER NOT NULL,
    `courseScheduleId` INTEGER NOT NULL,
    `gradeScore` DOUBLE NULL,
    `gradeLetter` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ENROLLED',
    `semester` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Enrollment_courseScheduleId_fkey`(`courseScheduleId`),
    UNIQUE INDEX `Enrollment_studentProfileId_courseScheduleId_key`(`studentProfileId`, `courseScheduleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudentProfile` ADD CONSTRAINT `StudentProfile_programStudiId_fkey` FOREIGN KEY (`programStudiId`) REFERENCES `ProgramStudi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentProfile` ADD CONSTRAINT `StudentProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseSchedule` ADD CONSTRAINT `CourseSchedule_programStudiId_fkey` FOREIGN KEY (`programStudiId`) REFERENCES `ProgramStudi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseSchedule` ADD CONSTRAINT `CourseSchedule_lecturerId_fkey` FOREIGN KEY (`lecturerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_studentProfileId_fkey` FOREIGN KEY (`studentProfileId`) REFERENCES `StudentProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_courseScheduleId_fkey` FOREIGN KEY (`courseScheduleId`) REFERENCES `CourseSchedule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
