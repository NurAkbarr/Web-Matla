import { useState, useEffect } from "react";
import axios from "axios";
import {
  Upload,
  Save,
  CheckCircle2,
  Clock,
  Trash2,
  ImagePlus,
  X,
} from "lucide-react";
import Toast from "../../components/Toast";
import API_BASE_URL from "../../utils/api";

const PmbSettings = () => {
  const [formData, setFormData] = useState({
    tahunAjaran: "2024/2025",
    gelombangAktif: "Gelombang 1",
    deadlinePendaftaran: "",
    tagline: "",
    deskripsi: "",
    isOpen: true,
  });
  const [brosurFile, setBrosurFile] = useState(null);
  const [newSlideFiles, setNewSlideFiles] = useState([]);
  const [currentBrosur, setCurrentBrosur] = useState(null);
  const [brosurImages, setBrosurImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/pmb-settings`);
      const data = res.data;
      if (data) {
        setFormData({
          tahunAjaran: data.tahunAjaran,
          gelombangAktif: data.gelombangAktif,
          deadlinePendaftaran: data.deadlinePendaftaran
            ? new Date(data.deadlinePendaftaran).toISOString().slice(0, 16)
            : "",
          tagline: data.tagline,
          deskripsi: data.deskripsi,
          isOpen: data.isOpen ?? true,
        });
        setCurrentBrosur(data.brosurUrl);
        setBrosurImages(
          Array.isArray(data.brosurImages) ? data.brosurImages : [],
        );
      }
    } catch (error) {
      console.error("Gagal memuat pengaturan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBrosurFile(e.target.files[0]);
    }
  };

  const handleSlideFilesChange = (e) => {
    if (e.target.files) {
      setNewSlideFiles(Array.from(e.target.files));
    }
  };

  const handleDeleteImage = async (imageUrl) => {
    if (!window.confirm("Hapus gambar ini dari carousel?")) return;
    setDeleting(imageUrl);
    try {
      const token = localStorage.getItem("matla_token");
      await axios.delete(`${API_BASE_URL}/pmb-settings/image`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { imageUrl },
      });
      setBrosurImages((prev) => prev.filter((u) => u !== imageUrl));
      setToast({ type: "success", message: "Gambar berhasil dihapus." });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Gagal menghapus gambar." });
    } finally {
      setDeleting(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = new FormData();
    payload.append("tahunAjaran", formData.tahunAjaran);
    payload.append("gelombangAktif", formData.gelombangAktif);
    payload.append(
      "deadlinePendaftaran",
      new Date(formData.deadlinePendaftaran).toISOString(),
    );
    payload.append("tagline", formData.tagline);
    payload.append("deskripsi", formData.deskripsi);
    payload.append("isOpen", formData.isOpen);

    if (brosurFile) {
      payload.append("brosur", brosurFile);
    }

    if (newSlideFiles.length > 0) {
      newSlideFiles.forEach((file) => {
        payload.append("brosurImages", file);
      });
    }

    try {
      const token = localStorage.getItem("matla_token");
      const res = await axios.put(
        `${API_BASE_URL}/pmb-settings`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setToast({ type: "success", message: "Pengaturan berhasil disimpan!" });
      setBrosurImages(
        Array.isArray(res.data.brosurImages) ? res.data.brosurImages : [],
      );
      setNewSlideFiles([]);
      setBrosurFile(null);
      // reset file inputs
      document
        .querySelectorAll('input[type="file"]')
        .forEach((el) => (el.value = ""));
      fetchSettings();
    } catch (error) {
      console.error(error);
      setToast({ type: "error", message: "Gagal menyimpan pengaturan." });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Memuat pengaturan...</div>
    );

  return (
    <div className="admin-page max-w-4xl mx-auto">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan PMB</h1>
        <p className="text-gray-500">
          Kelola informasi gelombang, brosur, dan carousel gambar publik.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ---- Informasi Gelombang ---- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tahun Ajaran
              </label>
              <input
                type="text"
                name="tahunAjaran"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={formData.tahunAjaran}
                onChange={handleInputChange}
                placeholder="2024/2025"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gelombang Aktif
              </label>
              <input
                type="text"
                name="gelombangAktif"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={formData.gelombangAktif}
                onChange={handleInputChange}
                placeholder="Gelombang 1"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Clock size={16} className="text-orange-500" /> Deadline
                Pendaftaran
              </label>
              <input
                type="datetime-local"
                name="deadlinePendaftaran"
                className="w-full px-4 py-2 border border-orange-200 bg-orange-50/30 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                value={formData.deadlinePendaftaran}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Waktu ini untuk Countdown Timer di halaman PMB publik.
              </p>
            </div>
          </div>

          <hr className="border-gray-100 my-8" />
          <div className="flex items-center justify-between bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <div>
              <h3 className="text-lg font-bold text-emerald-900">Status Pendaftaran</h3>
              <p className="text-sm text-emerald-700">
                Aktifkan jika sistem PMB sudah siap menerima pendaftar baru.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="isOpen"
                className="sr-only peer"
                checked={formData.isOpen}
                onChange={handleInputChange}
              />
              <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-sm"></div>
              <span className="ml-3 text-sm font-bold text-emerald-900">
                {formData.isOpen ? "DIBUKA" : "DITUTUP"}
              </span>
            </label>
          </div>

          <hr className="border-gray-100 my-8" />
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Materi Promosi
          </h3>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tagline Promo
            </label>
            <input
              type="text"
              name="tagline"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              value={formData.tagline}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deskripsi Promosi PMB
            </label>
            <textarea
              name="deskripsi"
              rows="3"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
              value={formData.deskripsi}
              onChange={handleInputChange}
            />
          </div>

          <hr className="border-gray-100 my-8" />
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
            <ImagePlus size={20} className="text-primary" /> Manajemen Foto
            Carousel Brosur
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Upload beberapa gambar untuk ditampilkan sebagai slideshow carousel
            di halaman PMB. Maks 10 gambar, tiap gambar maks 10 MB.
          </p>

          {/* Current Carousel Images */}
          {brosurImages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600 mb-3">
                Gambar saat ini ({brosurImages.length} foto):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {brosurImages.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-video bg-gray-100"
                  >
                    <img
                      src={`${API_BASE_URL.replace("/api", "")}${url}`}
                      alt={`Slide ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(url)}
                        disabled={deleting === url}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                        title="Hapus gambar ini"
                      >
                        {deleting === url ? "..." : <Trash2 size={16} />}
                      </button>
                    </div>
                    <span className="absolute top-1.5 left-1.5 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-md">
                      Slide {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Slide Images */}
          <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-200 border-dashed">
            <label className="block text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2">
              <Upload size={16} /> Tambah Gambar Carousel (Bisa Multiple)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              onChange={handleSlideFilesChange}
            />
            {newSlideFiles.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {newSlideFiles.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600"
                  >
                    <CheckCircle2 size={12} className="text-green-500" />
                    {f.name}
                    <button
                      type="button"
                      onClick={() =>
                        setNewSlideFiles((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        )
                      }
                      className="text-red-400 hover:text-red-600 ml-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Legacy single brosur upload */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 border-dashed relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Upload size={16} className="text-primary" /> Update Brosur Utama
              (Gambar/PDF)
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              className="w-full mb-3 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              onChange={handleFileChange}
            />
            {currentBrosur && !brosurFile && (
              <div className="text-sm font-medium text-emerald-600 flex items-center gap-2">
                <CheckCircle2 size={16} /> Brosur utama sudah ter-upload dan
                aktif.
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
            >
              <Save size={18} /> {saving ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PmbSettings;
