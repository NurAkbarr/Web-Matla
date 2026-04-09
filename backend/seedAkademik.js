const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log("Memulai seeding data akademik dummy...");

  // 1. Pastikan ada Program Studi
  let prodi = await prisma.programStudi.findFirst();
  if (!prodi) {
    prodi = await prisma.programStudi.create({
      data: {
        kode: "PAI-01",
        nama: "Pendidikan Agama Islam",
        jenjang: "S1",
        fakultas: "Tarbiyah",
        deskripsi: "Program Studi PAI",
      }
    });
    console.log("Berhasil membuat Program Studi:", prodi.nama);
  }

  // 2. Cari Dosen yang sudah ada (atau buat jika tidak ada)
  let dosen = await prisma.user.findFirst({ where: { role: 'DOSEN' } });
  if (!dosen) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);
    dosen = await prisma.user.create({
      data: {
        name: "Dr. Dosen Dummy, M.Pd.",
        email: "dosen@matla.id",
        password: hashedPassword,
        role: "DOSEN"
      }
    });
    console.log("Berhasil membuat Dosen Dummy:", dosen.name);
  } else {
    console.log("Menggunakan Dosen yang sudah ada:", dosen.name);
  }

  // 3. Buat Mahasiswa Dummy (Akun + Profil)
  let studentEmail = "mahasiswa1@matla.id";
  let studentUser = await prisma.user.findUnique({ where: { email: studentEmail }});
  
  if (!studentUser) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);
    studentUser = await prisma.user.create({
      data: {
        name: "Ahmad Mahasiswa",
        email: studentEmail,
        password: hashedPassword,
        role: "STUDENT"
      }
    });
  }

  let studentProfile = await prisma.studentProfile.findUnique({ where: { userId: studentUser.id }});
  if (!studentProfile) {
    studentProfile = await prisma.studentProfile.create({
      data: {
        userId: studentUser.id,
        nim: "1234567890",
        programStudiId: prodi.id,
        semester: 1,
        ipk: 0,
        sksDitempuh: 0
      }
    });
    console.log("Berhasil membuat Mahasiswa Dummy:", studentUser.name);
  } else {
     console.log("Mahasiswa Dummy sudah ada:", studentUser.name);
  }


  // 4. Buat 3 Mata Kuliah Semester 1 dengan Dosen pengampu
  const coursesData = [
    { name: "Ulumul Qur'an", room: "Ruang A1", day: 1, start: "08:00", end: "10:30" },
    { name: "Bahasa Arab Dasar", room: "Ruang B2", day: 2, start: "13:00", end: "15:30" },
    { name: "Pengantar Filsafat", room: "Ruang C3", day: 3, start: "10:00", end: "12:30" },
  ];

  const courseIds = [];
  for (const c of coursesData) {
    let course = await prisma.courseSchedule.findFirst({
        where: { courseName: c.name, semester: 1 }
    });
    
    if (!course) {
        course = await prisma.courseSchedule.create({
        data: {
            courseName: c.name,
            lecturerId: dosen.id,
            room: c.room,
            dayOfWeek: c.day,
            startTime: c.start,
            endTime: c.end,
            programStudiId: prodi.id,
            semester: 1
        }
        });
        console.log(`Berhasil membuat Jadwal Kuliah: ${c.name}`);
    }
    courseIds.push(course.id);
  }

  // 5. Daftarkan mahasiswa ke mata kuliah tersebut (Enrollment) tanpa nilai awal (agar diinput dosen)
  for (const cid of courseIds) {
      // check if enrolled
      const existing = await prisma.enrollment.findFirst({
          where: { studentProfileId: studentProfile.id, courseScheduleId: cid }
      });

      if (!existing) {
          await prisma.enrollment.create({
              data: {
                  studentProfileId: studentProfile.id,
                  courseScheduleId: cid,
                  semester: 1,
                  status: "ENROLLED"
              }
          });
          console.log(`Berhasil mendaftarkan Mahasiswa ke course ID: ${cid}`);
      }
  }

  console.log("Seeding data dummy selesai!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
