import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../utils/api";
import { Book, Users } from "lucide-react";

const DosenJadwal = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const DINO = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("matla_token");
        const res = await axios.get(`${API_BASE_URL}/dosen/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(res.data);
      } catch (error) {
        console.error(error);
      } finally {
         setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Book className="text-[#1b4137]" /> Jadwal Mengajar
        </h1>
        <p className="text-gray-500 text-sm mt-1">Daftar mata kuliah yang Anda ampu semester ini</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Mata Kuliah</th>
                <th className="p-4 font-semibold">Prodi & Semester</th>
                <th className="p-4 font-semibold">Hari & Waktu</th>
                <th className="p-4 font-semibold">Ruang</th>
                <th className="p-4 font-semibold text-center">Jml Mahasiswa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">Memuat data...</td>
                </tr>
              ) : courses.length === 0 ? (
                 <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">Anda belum memiliki jadwal mengajar.</td>
                </tr>
              ) : (
                courses.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-semibold text-[#1b4137]">{item.courseName}</td>
                    <td className="p-4">
                      {item.programStudi?.nama} <br />
                      <span className="text-gray-500 font-medium">Smt {item.semester}</span>
                    </td>
                    <td className="p-4 font-medium text-gray-800">
                      {DINO[item.dayOfWeek === 7 ? 0 : item.dayOfWeek]}, {item.startTime} - {item.endTime}
                    </td>
                    <td className="p-4 text-gray-600">{item.room}</td>
                    <td className="p-4 text-center font-bold text-blue-600 bg-blue-50">
                       <span className="flex items-center justify-center gap-1"><Users size={14}/> {item._count?.enrollments || 0}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DosenJadwal;
