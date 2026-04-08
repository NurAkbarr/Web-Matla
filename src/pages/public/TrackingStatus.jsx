import { useState } from "react";
import axios from "axios";
import { Search, Loader2, CheckCircle2, XCircle, Clock, ArrowRight, User, BookOpen, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import Toast from "../../components/Toast";

const TrackingStatus = () => {
  const [registrationNo, setRegistrationNo] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!registrationNo || !identifier) {
      showToast("Harap isi semua kolom.", "warning");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await axios.get("http://localhost:5000/api/pmb/track", {
        params: { registrationNo, identifier },
      });
      setResult(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal mengecek status. Pastikan data benar.";
      showToast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const statusConfig = {
    DITERIMA: {
      icon: <CheckCircle2 size={48} className="text-emerald-500" />,
      title: "Selamat! Anda Diterima",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      description: "Selamat bergabung menjadi bagian dari keluarga besar Matla Islamic University. Silakan periksa email Anda atau hubungi admin untuk langkah herregistrasi selanjutnya.",
    },
    DITOLAK: {
      icon: <XCircle size={48} className="text-red-500" />,
      title: "Mohon Maaf...",
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
      description: "Terima kasih telah mendaftar. Sayangnya, untuk saat ini pendaftaran Anda belum dapat kami setujui. Tetap semangat dan jangan menyerah!",
    },
    DIPROSES: {
      icon: <Clock size={48} className="text-amber-500" />,
      title: "Sedang Diproses",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      description: "Data pendaftaran Anda sudah kami terima dan saat ini sedang dalam tahap verifikasi oleh tim PMB. Silakan cek kembali secara berkala.",
    },
  };

  const currentStatus = result ? statusConfig[result.status] : null;

  return (
    <div className="tracking-page min-h-[80vh] flex flex-col items-center justify-center py-20 px-4 bg-slate-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
            Portal Tracking PMB
          </h1>
          <p className="text-slate-600 text-lg">
            Masukkan detail pendaftaran Anda untuk mengecek status seleksi.
          </p>
        </div>

        {/* Tracking Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-6 md:p-10 border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
          
          <form onSubmit={handleTrack} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Nomor Pendaftaran</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Cth: PMB240001"
                    value={registrationNo}
                    onChange={(e) => setRegistrationNo(e.target.value.toUpperCase())}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-mono font-bold text-slate-700"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email / NIK</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Masukkan Email atau NIK"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-slate-700"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Mengecek...
                </>
              ) : (
                <>
                  Cek Status Sekarang <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Result Section */}
          {result && currentStatus && (
            <div className={`mt-10 p-6 md:p-8 rounded-3xl border-2 ${currentStatus.bg} ${currentStatus.border} animate-in fade-in zoom-in-95 duration-500`}>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {currentStatus.icon}
                </div>
                <h2 className={`text-2xl font-black ${currentStatus.color} mb-2`}>
                  {currentStatus.title}
                </h2>
                <p className="text-slate-600 mb-8 max-w-md">
                  {currentStatus.description}
                </p>

                {/* Info Box */}
                <div className="w-full bg-white/60 backdrop-blur-sm rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left border border-white">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Nama Pendaftar</p>
                      <p className="font-bold text-slate-800">{result.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Program Studi</p>
                      <p className="font-bold text-slate-800">{result.program}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Tanggal Daftar</p>
                      <p className="font-bold text-slate-800">{formatDate(result.appliedDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">ID Pendaftaran</p>
                      <p className="font-mono font-bold text-slate-800">{result.registrationNo}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            Kendala saat mengecek? <Link to="/kontak" className="text-primary font-bold hover:underline">Hubungi Admin PMB</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackingStatus;
