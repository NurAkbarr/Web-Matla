import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../utils/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalApplicants: 0,
    activeStudents: 0,
    totalPrograms: 0,
    webVisitors: 0,
  });
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("matla_token");
        const res = await axios.get(
          `${API_BASE_URL}/dashboard/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setStats(res.data.stats);
        setRecentApplicants(res.data.recentApplicants);
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helpers
  const formatNumber = (num) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const getInitial = (name) => {
    return name.substring(0, 2).toUpperCase();
  };

  const getColor = (status) => {
    switch (status) {
      case "DITERIMA":
        return "emerald";
      case "DITOLAK":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "DITERIMA":
        return "Diterima";
      case "DITOLAK":
        return "Ditolak";
      default:
        return "Diproses";
    }
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Hari ini";
    if (diffInDays === 1) return "Kemarin";
    return `${diffInDays} hari lalu`;
  };

  return (
    <div className="admin-page">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1.5 md:mb-2">
          Selamat Datang, Admin Utama 👋
        </h1>
        <p className="text-sm md:text-base text-gray-500">
          Berikut adalah ringkasan performa sistem Matla Islamic University hari
          ini.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-gray-500 mb-0.5">
              Total Pendaftar
            </p>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">
              {isLoading ? "..." : formatNumber(stats.totalApplicants)}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-gray-500 mb-0.5">
              Mahasiswa Aktif
            </p>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">
              {isLoading ? "..." : formatNumber(stats.activeStudents)}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-gray-500 mb-0.5">
              Program Studi
            </p>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">
              {isLoading ? "..." : formatNumber(stats.totalPrograms)}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-gray-500 mb-0.5">
              Pengunjung Web
            </p>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">
              {isLoading ? "..." : formatNumber(stats.webVisitors)}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Content Area Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Registrations */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
          <div className="flex justify-between items-center mb-5 md:mb-6">
            <h3 className="text-base md:text-lg font-bold text-gray-800">
              Pendaftar PMB Terbaru
            </h3>
            <a
              href="/admin/pmb"
              className="text-xs md:text-sm font-semibold text-primary hover:text-primary-hover bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-md transition-colors"
            >
              Lihat Data Lengkap &rarr;
            </a>
          </div>

          <div className="space-y-3 md:space-y-4">
            {isLoading ? (
              <div className="text-center py-6 text-gray-400 text-sm">
                Memuat data terbaru...
              </div>
            ) : recentApplicants.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-sm">
                Belum ada data pendaftar.
              </div>
            ) : (
              recentApplicants.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 md:p-4 border border-gray-100 rounded-xl hover:bg-gray-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div
                      className={`w-10 h-10 rounded-full bg-${getColor(item.status)}-100 flex items-center justify-center text-${getColor(item.status)}-600 font-bold border border-${getColor(item.status)}-200`}
                    >
                      {getInitial(item.fullName)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {item.fullName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.program}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-[10px] md:text-xs font-semibold rounded-full mb-1 border ${
                        item.status === "DITERIMA"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : item.status === "DITOLAK"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {getStatusLabel(item.status)}
                    </span>
                    <div className="flex items-center justify-end text-[10px] md:text-xs text-gray-400 gap-1 mt-0.5">
                      <Calendar size={12} /> {timeAgo(item.appliedDate)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-[#1b4137] rounded-2xl shadow-sm text-white p-6 relative overflow-hidden flex flex-col justify-between border border-[#1b4137]">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 opacity-10 pointer-events-none">
            <img
              src="/assets/logo-bulat.png"
              alt="Decoration"
              className="w-56 h-56 object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-0"></div>

          <div className="relative z-10 flex-1 flex flex-col justify-between">
            <div>
              <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md rounded border border-white/10 text-[10px] font-bold uppercase tracking-wider mb-4">
                Informasi Sistem
              </span>
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                Tahun Ajaran 2024/2025
              </h3>
              <p className="text-white/80 text-sm mb-6 max-w-[240px] leading-relaxed">
                Penerimaan Mahasiswa Baru Gelombang 1 akan ditutup dalam waktu
                dekat.
              </p>
            </div>

            <div className="bg-black/20 rounded-xl p-4 backdrop-blur-md border border-white/10 mt-auto">
              <div className="flex justify-between items-end mb-2">
                <p className="text-xs font-medium uppercase tracking-wider opacity-80">
                  Sisa Kuota PAI
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">45</span>
                  <span className="text-xs opacity-70">/ 180</span>
                </div>
              </div>
              <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
