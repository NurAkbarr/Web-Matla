import { useState, useEffect } from "react";
import axios from "axios";
import { BookOpen, Search, Plus, Edit2, Trash2 } from "lucide-react";
import Toast from "../../components/Toast";
import API_BASE_URL from "../../utils/api";

const ProdiData = () => {
  const [prodiList, setProdiList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmInfo, setDeleteConfirmInfo] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    jenjang: "S1",
    fakultas: "",
    deskripsi: "",
    akreditasi: "",
    status: "AKTIF",
  });

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchProdi = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/prodi`);
      setProdiList(res.data);
    } catch (err) {
      console.error(err);
      showToast("Gagal memuat data Program Studi", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProdi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      kode: "",
      nama: "",
      jenjang: "S1",
      fakultas: "",
      deskripsi: "",
      akreditasi: "",
      status: "AKTIF",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prodi) => {
    setEditingId(prodi.id);
    setFormData({
      kode: prodi.kode,
      nama: prodi.nama,
      jenjang: prodi.jenjang,
      fakultas: prodi.fakultas,
      deskripsi: prodi.deskripsi || "",
      akreditasi: prodi.akreditasi || "",
      status: prodi.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("matla_token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (editingId) {
        await axios.put(
          `${API_BASE_URL}/prodi/${editingId}`,
          formData,
          { headers },
        );
        showToast("Data Prodi berhasil diperbarui");
      } else {
        await axios.post(`${API_BASE_URL}/prodi`, formData, {
          headers,
        });
        showToast("Program Studi baru berhasil ditambahkan");
      }
      setIsModalOpen(false);
      fetchProdi();
    } catch (err) {
      console.error(err);
      showToast(
        err.response?.data?.message || "Terjadi kesalahan saat menyimpan data",
        "error",
      );
    }
  };

  const initiateDelete = (id, nama) => {
    setDeleteConfirmInfo({ id, nama });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmInfo) return;

    try {
      const token = localStorage.getItem("matla_token");
      await axios.delete(
        `${API_BASE_URL}/prodi/${deleteConfirmInfo.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      showToast("Data berhasil dihapus");
      setDeleteConfirmInfo(null);
      fetchProdi();
    } catch (err) {
      console.error(err);
      showToast("Gagal menghapus data", "error");
    }
  };

  const statusConfig = {
    AKTIF: {
      badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
      label: "Aktif",
    },
    COMING_SOON: {
      badge: "bg-amber-100 text-amber-700 border-amber-200",
      label: "Segera Hadir",
    },
    NONAKTIF: {
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      label: "Nonaktif",
    },
  };

  const filteredProdi = prodiList.filter(
    (p) =>
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.kode.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="prodi-page space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="text-primary" /> Data Program Studi
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola informasi jurusan dan program studi Universitas.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-colors shrink-0 shadow-sm"
        >
          <Plus size={18} /> Tambah Prodi
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center bg-slate-50">
          <div className="relative w-full max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari Prodi (Nama / Kode)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-500 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-slate-100">Kode</th>
                <th className="px-6 py-4 border-b border-slate-100">
                  Program Studi
                </th>
                <th className="px-6 py-4 border-b border-slate-100">
                  Fakultas
                </th>
                <th className="px-6 py-4 border-b border-slate-100">Status</th>
                <th className="px-6 py-4 border-b border-slate-100 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : filteredProdi.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    Belum ada data Program Studi.
                  </td>
                </tr>
              ) : (
                filteredProdi.map((prodi) => (
                  <tr
                    key={prodi.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {prodi.kode}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">
                        {prodi.jenjang} - {prodi.nama}
                      </p>
                      <p className="text-xs text-slate-500">
                        Akreditasi: {prodi.akreditasi || "-"}
                      </p>
                    </td>
                    <td className="px-6 py-4">{prodi.fakultas}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig[prodi.status].badge}`}
                      >
                        {statusConfig[prodi.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(prodi)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => initiateDelete(prodi.id, prodi.nama)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? "Edit Program Studi" : "Tambah Program Studi Baru"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Kode Prodi <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="kode"
                    value={formData.kode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Cth: IF"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Nama Prodi <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Cth: Teknik Informatika"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Jenjang <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="jenjang"
                    value={formData.jenjang}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Fakultas <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="fakultas"
                    value={formData.fakultas}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Cth: Fakultas Ilmu Komputer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Akreditasi
                  </label>
                  <input
                    name="akreditasi"
                    value={formData.akreditasi}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Cth: Baik Sekali"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Status Publikasi
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold"
                  >
                    <option value="AKTIF" className="text-emerald-600">
                      Aktif (Tampil Publik)
                    </option>
                    <option value="COMING_SOON" className="text-amber-600">
                      Coming Soon (Segera Hadir)
                    </option>
                    <option value="NONAKTIF" className="text-slate-500">
                      Nonaktif (Sembunyikan)
                    </option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    placeholder="Gambaran singkat tentang prodi ini..."
                  ></textarea>
                </div>
              </div>
            </form>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl transition-colors shadow-sm"
              >
                Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmInfo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Hapus Program Studi?
            </h3>
            <p className="text-slate-500 mb-6">
              Anda yakin ingin menghapus{" "}
              <strong>{deleteConfirmInfo.nama}</strong>? Aksi ini tidak dapat
              dibatalkan.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirmInfo(null)}
                className="px-6 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-sm shadow-red-600/20 transition-all"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProdiData;
