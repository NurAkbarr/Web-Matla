import { useState, useEffect } from "react";
import axios from "axios";
import { BookOpen, Users, LogOut } from "lucide-react";
import API_BASE_URL from "../../utils/api";

const DosenDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("matla_token");
        const storedUser = JSON.parse(localStorage.getItem("matla_user"));
        if (storedUser) setUser(storedUser);

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
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Memuat dashboard...</div>;

  const totalStudents = courses.reduce((acc, c) => acc + (c._count?.enrollments || 0), 0);

  return (
    <div className="dosen-dashboard space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-2xl text-white shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Selamat Datang, {user.name || "Dosen"}</h1>
          <p className="text-slate-300">Semoga harimu menyenangkan. Berikut ringkasan aktivitas akademikmu.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 flex items-center justify-center rounded-xl">
            <BookOpen size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">Total Kelas</p>
            <p className="text-3xl font-black text-slate-800">{courses.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-xl">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">Total Mahasiswa Ajar</p>
            <p className="text-3xl font-black text-slate-800">{totalStudents}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DosenDashboard;
