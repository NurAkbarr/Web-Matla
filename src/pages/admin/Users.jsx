import { useState, useEffect } from "react";
import axios from "axios";
import {
  Users as UsersIcon,
  Search,
  MoreVertical,
  Edit2,
  ShieldAlert,
  Trash2,
  Plus,
} from "lucide-react";
import Toast from "../../components/Toast";
import API_BASE_URL from "../../utils/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  // Delete Modal State
  const [deleteConfirmInfo, setDeleteConfirmInfo] = useState(null);

  // Get current user id from token to prevent self-deletion logic in UI
  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem("matla_token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch {
      return null;
    }
  };
  const currentUserId = getCurrentUserId();

  // Role display configs
  const roleConfig = {
    STUDENT: {
      label: "Mahasiswa",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    DOSEN: {
      label: "Dosen",
      color: "bg-amber-100 text-amber-700 border-amber-200",
    },
    ADMIN: {
      label: "Admin",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    SUPER_ADMIN: {
      label: "Super Admin",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
  };

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("matla_token");
      const res = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      showToast("Gagal mengambil data user", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("matla_token");
      await axios.put(
        `${API_BASE_URL}/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      showToast("Role berhasil diubah!", "success");
      // Update local state without refetching for better UX
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Gagal mengubah role", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("matla_token");
      await axios.post(`${API_BASE_URL}/users`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("User baru berhasil ditambahkan!");
      setIsCreateModalOpen(false);
      setFormData({ name: "", email: "", password: "", role: "STUDENT" });
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast(
        err.response?.data?.message || "Gagal membuat user baru",
        "error",
      );
    }
  };

  const initiateDelete = (id, name, role) => {
    // Prevent self-deletion
    if (id === currentUserId) {
      return showToast(
        "Anda tidak dapat menghapus akun Anda sendiri.",
        "error",
      );
    }
    setDeleteConfirmInfo({ id, name, role });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmInfo) return;
    try {
      const token = localStorage.getItem("matla_token");
      await axios.delete(
        `${API_BASE_URL}/users/${deleteConfirmInfo.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      showToast("User berhasil dihapus");
      setDeleteConfirmInfo(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Gagal menghapus user", "error");
    }
  };

  // Filter logic
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Formatter
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="users-page space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <UsersIcon className="text-primary" /> Manajemen User
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola akses dan role pengguna sistem Matla.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-colors shrink-0 shadow-sm"
        >
          <Plus size={18} /> Tambah User
        </button>
      </div>

      {/* Card Wrapper */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="relative w-full max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
        </div>

        {/* Table Container (Scrollable on small screens) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-slate-500 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-slate-100">
                  Pengguna
                </th>
                <th className="px-6 py-4 border-b border-slate-100">
                  Role Saat Ini
                </th>
                <th className="px-6 py-4 border-b border-slate-100">
                  Bergabung Sejak
                </th>
                <th className="px-6 py-4 border-b border-slate-100 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <div className="flex justify-center mb-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    Memuat data...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {user.name}
                          </p>
                          <p className="text-slate-500 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${roleConfig[user.role].color}`}
                      >
                        {roleConfig[user.role].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 items-center">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          className="text-sm border border-slate-200 rounded-lg bg-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-700 font-medium cursor-pointer"
                        >
                          <option value="STUDENT">Jadikan Mahasiswa</option>
                          <option value="DOSEN">Jadikan Dosen</option>
                          <option value="ADMIN">Jadikan Admin</option>
                          <option value="SUPER_ADMIN">
                            Jadikan Super Admin
                          </option>
                        </select>
                        <button
                          onClick={() =>
                            initiateDelete(user.id, user.name, user.role)
                          }
                          disabled={user.id === currentUserId}
                          className={`p-1.5 rounded-md transition-colors ${
                            user.id === currentUserId
                              ? "text-slate-300 cursor-not-allowed"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                          title={
                            user.id === currentUserId
                              ? "Tidak bisa menghapus akun sendiri"
                              : "Hapus User"
                          }
                        >
                          <Trash2 size={18} />
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

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <UsersIcon className="text-primary" size={24} /> Tambah User
                Baru
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  minLength="6"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Minimal 6 karakter"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Role/Peran Dasar
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-semibold text-slate-700"
                >
                  <option value="STUDENT">Mahasiswa</option>
                  <option value="DOSEN">Dosen</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl transition-colors shadow-sm"
                >
                  Buat Akun
                </button>
              </div>
            </form>
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
              Hapus Pengguna?
            </h3>
            <p className="text-slate-500 mb-6 break-words">
              Anda yakin ingin menghapus akun{" "}
              <strong>{deleteConfirmInfo.name}</strong> secara permanen?
              {deleteConfirmInfo.role === "SUPER_ADMIN" && (
                <span className="block mt-2 text-red-500 text-sm font-semibold bg-red-50 p-2 rounded-md border border-red-100">
                  Peringatan: User ini adalah SUPER ADMIN.
                </span>
              )}
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
                Ya, Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
