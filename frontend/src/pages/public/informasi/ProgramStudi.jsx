import { useState, useEffect } from "react";
import axios from "axios";
import {
  BookOpen,
  Monitor,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../../utils/api";

const ProgramStudi = () => {
  const [prodis, setProdis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProdi = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/prodi`);
        // Pisahkan yang nonaktif jika tidak ingin ditampilkan sama sekali di publik (opsional)
        const visibleProdi = res.data.filter((p) => p.status !== "NONAKTIF");
        setProdis(visibleProdi);
      } catch (err) {
        console.error("Gagal memuat prodi:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProdi();
  }, []);

  // Ikon jurusan acak untuk estetika jika belum ada gambar asli
  const getRandomIcon = (kode) => {
    switch (kode.toUpperCase()) {
      case "IF":
        return <Monitor className="w-8 h-8" />;
      case "MN":
        return <Briefcase className="w-8 h-8" />;
      default:
        return <GraduationCap className="w-8 h-8" />;
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Aesthetic Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-emerald-800 to-slate-900 pt-32 pb-24 lg:pt-40 lg:pb-32 text-center px-4">
        {/* Subtle patterned overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-6 animate-fade-in-up">
            <BookOpen size={16} /> Kampus Islam Modern
          </div>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            Program Akademik <br className="hidden md:block" />{" "}
            <span className="text-emerald-300">Pilihan Masa Depan</span>
          </h1>
          <p
            className="text-lg text-emerald-100/80 mb-8 max-w-2xl animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            Temukan jurusan yang sesuai dengan passion dan jadilah bagian dari
            generasi unggul berlandaskan nilai-nilai Islami.
          </p>
        </div>

        {/* Decorative Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-full h-[60px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,124.22,199.15,115.39,242.72,109.76,283.47,83.18,321.39,56.44Z"
              className="fill-slate-50"
            ></path>
          </svg>
        </div>
      </section>

      {/* Grid Program Studi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {isLoading ? (
          <div className="flex flex-col items-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium">
              Memuat Program Studi...
            </p>
          </div>
        ) : prodis.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700">Belum Ada Data</h3>
            <p className="text-slate-500 mt-2">
              Daftar Program Studi sedang diperbarui.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prodis.map((prodi) => {
              const isComingSoon = prodi.status === "COMING_SOON";

              return (
                <div
                  key={prodi.id}
                  className={`group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 transition-all duration-300
                    ${isComingSoon ? "grayscale-[20%] opacity-90" : "hover:shadow-xl hover:-translate-y-1"}
                  `}
                >
                  {/* Status Badges */}
                  <div className="absolute top-4 right-4 z-10">
                    {isComingSoon ? (
                      <span className="inline-flex flex-col md:flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/90 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg border border-white/10 animate-pulse">
                        <Lock size={14} /> Segera Hadir
                      </span>
                    ) : (
                      prodi.akreditasi && (
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold shadow-sm">
                          Akreditasi: {prodi.akreditasi}
                        </span>
                      )
                    )}
                  </div>

                  {/* Header/Banner Image Area */}
                  <div
                    className={`h-32 p-6 flex items-end ${isComingSoon ? "bg-slate-200" : "bg-primary/5"}`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm 
                        ${isComingSoon ? "bg-slate-300 text-slate-500" : "bg-white text-primary"}`}
                    >
                      {getRandomIcon(prodi.kode)}
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-6">
                    <p className="text-sm font-bold text-slate-400 mb-1">
                      {prodi.jenjang} • {prodi.fakultas}
                    </p>
                    <h3
                      className={`text-xl font-bold mb-3 ${isComingSoon ? "text-slate-600" : "text-slate-800"}`}
                    >
                      {prodi.nama}
                    </h3>

                    <p className="text-slate-500 text-sm line-clamp-3 mb-6 min-h-[60px]">
                      {prodi.deskripsi ||
                        "Program studi ini bertujuan menghasilkan lulusan berkualitas yang memiliki landasan Islami yang kuat dalam menghadapi tantangan dunia modern."}
                    </p>

                    {/* Action Area */}
                    <div className="pt-4 border-t border-slate-100 flex items-center">
                      {isComingSoon ? (
                        <button
                          disabled
                          className="w-full py-3 rounded-xl bg-slate-100 text-slate-400 font-semibold text-sm cursor-not-allowed border border-slate-200 text-center"
                        >
                          Pendaftaran Belum Dibuka
                        </button>
                      ) : (
                        <Link
                          to="/pmb"
                          className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-all shadow-sm shadow-primary/20 group-hover:shadow-md"
                        >
                          Daftar Sekarang
                          <ChevronRight
                            size={18}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProgramStudi;
