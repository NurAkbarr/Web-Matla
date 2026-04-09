import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";

// You will need to install axios in frontend if not already installed, assume fetch for now.
import API_BASE_URL from "../../utils/api";

const API_URL = API_BASE_URL;

const AdminMahasiswa = () => {
  const [students, setStudents] = useState([]);
  const [prodis, setProdis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    nim: "",
    programStudiId: "",
    semester: 1,
    angkatan: "",
    ipk: 0.0,
    sksDitempuh: 0,
    totalSks: 144,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("matla_token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch students
      const resStudents = await fetch(`${API_URL}/student-profile`, { headers });
      const dataStudents = await resStudents.json();
      setStudents(Array.isArray(dataStudents) ? dataStudents : []);

      // Fetch prodi for dropdown
      const resProdi = await fetch(`${API_URL}/prodi`);
      const dataProdi = await resProdi.json();
      setProdis(Array.isArray(dataProdi) ? dataProdi : []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (student = null) => {
    if (student) {
      setFormData({
        id: student.id,
        name: student.name,
        email: student.email,
        password: "", // Don't populate password on edit
        nim: student.studentProfile?.nim || "",
        programStudiId: student.studentProfile?.programStudiId || "",
        semester: student.studentProfile?.semester || 1,
        angkatan: student.studentProfile?.angkatan || "",
        ipk: student.studentProfile?.ipk || 0.0,
        sksDitempuh: student.studentProfile?.sksDitempuh || 0,
        totalSks: student.studentProfile?.totalSks || 144,
      });
    } else {
      setFormData({
        id: null,
        name: "",
        email: "",
        password: "",
        nim: "",
        programStudiId: "",
        semester: 1,
        angkatan: "",
        ipk: 0.0,
        sksDitempuh: 0,
        totalSks: 144,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("matla_token");
      const method = formData.id ? "PUT" : "POST";
      const url = formData.id
        ? `${API_URL}/student-profile/${formData.id}`
        : `${API_URL}/student-profile`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchData();
        closeModal();
      } else {
        const err = await response.json();
        alert(err.message || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Save error", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus mahasiswa ini?")) {
      try {
        const token = localStorage.getItem("matla_token");
        const response = await fetch(`${API_URL}/student-profile/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          fetchData();
        } else {
           alert("Gagal menghapus data");
        }
      } catch (error) {
        console.error("Delete error", error);
      }
    }
  };

  const filteredStudents = students.filter((s) =>
    (s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.studentProfile?.nim || "").includes(searchTerm)
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Mahasiswa Aktif</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola data profil, IPK, dan SKS mahasiswa</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} /> Tambah Mahasiswa
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama atau NIM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Nama Mahasiswa</th>
                <th className="p-4 font-semibold">NIM & Prodi</th>
                <th className="p-4 font-semibold">Semester</th>
                <th className="p-4 font-semibold">Angkatan</th>
                <th className="p-4 font-semibold">IPK</th>
                <th className="p-4 font-semibold">SKS</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    Tidak ada data mahasiswa ditemukan.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{student.name}</div>
                      <div className="text-gray-500 text-xs">{student.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{student.studentProfile?.nim || "-"}</div>
                      <div className="text-gray-500 text-xs text-primary bg-primary/10 inline-block px-2 py-0.5 rounded mt-1">
                        {student.studentProfile?.programStudi?.nama || "Belum diset"}
                      </div>
                    </td>
                    <td className="p-4">{student.studentProfile?.semester || "-"}</td>
                    <td className="p-4 font-semibold text-gray-700">{student.studentProfile?.angkatan || "-"}</td>
                    <td className="p-4 font-medium text-gray-800">{student.studentProfile?.ipk || "-"}</td>
                    <td className="p-4">
                      {student.studentProfile ? `${student.studentProfile.sksDitempuh}/${student.studentProfile.totalSks}` : "-"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openModal(student)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
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
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {formData.id ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="studentForm" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Akun Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-800 border-b pb-2">Data Akun</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password {formData.id ? "(Isi jika ingin ubah)" : "*"}
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required={!formData.id}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Profil Akademik Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-800 border-b pb-2">Profil Akademik</h3>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">NIM *</label>
                        <input
                          type="text"
                          name="nim"
                          value={formData.nim}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Angkatan</label>
                        <input
                          type="text"
                          name="angkatan"
                          value={formData.angkatan}
                          onChange={handleInputChange}
                          required
                          placeholder="cth: 1, 2, atau 2024"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Program Studi *</label>
                          <select
                            name="programStudiId"
                            value={formData.programStudiId}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="">-- Pilih Prodi --</option>
                            {prodis.map(p => (
                              <option key={p.id} value={p.id}>{p.nama}</option>
                            ))}
                          </select>
                        </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                        <input
                          type="number"
                          name="semester"
                          value={formData.semester}
                          onChange={handleInputChange}
                          min="1"
                          max="14"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">IPK</label>
                        <input
                          type="number"
                          name="ipk"
                          value={formData.ipk}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          max="4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SKS Diambil</label>
                        <input
                          type="number"
                          name="sksDitempuh"
                          value={formData.sksDitempuh}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total SKS</label>
                        <input
                          type="number"
                          name="totalSks"
                          value={formData.totalSks}
                          onChange={handleInputChange}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 sticky bottom-0">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="studentForm"
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                disabled={loading}
              >
                {formData.id ? "Simpan Perubahan" : "Simpan Baru"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMahasiswa;
