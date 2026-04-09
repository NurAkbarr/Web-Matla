-- CreateTable
CREATE TABLE `ProgramStudi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `jenjang` VARCHAR(191) NOT NULL,
    `fakultas` VARCHAR(191) NOT NULL,
    `deskripsi` TEXT NULL,
    `akreditasi` VARCHAR(191) NULL,
    `status` ENUM('AKTIF', 'COMING_SOON', 'NONAKTIF') NOT NULL DEFAULT 'AKTIF',
    `gambarUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ProgramStudi_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PmbSetting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tahunAjaran` VARCHAR(191) NOT NULL DEFAULT '2024/2025',
    `gelombangAktif` VARCHAR(191) NOT NULL DEFAULT 'Gelombang 1',
    `deadlinePendaftaran` DATETIME(3) NOT NULL,
    `tagline` VARCHAR(191) NOT NULL DEFAULT 'Mulai Perjalanan Ilmu Anda Bersama Kami',
    `deskripsi` TEXT NOT NULL,
    `brosurUrl` VARCHAR(191) NULL,
    `brosurImages` TEXT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
