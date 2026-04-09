import React, { useState, useEffect } from "react";
import { Users, Search, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../utils/api";

const AdminDosen = () => {
  const [dosens, setDosens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("matla_token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch dosens from the newly created list API
      const res = await fetch(`${API_BASE_URL}/dosen/list`, { headers });
      const data = await res.json();
      setDosens(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDosens = dosens.filter((d) =>
    (d.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (d.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Direktori Dosen</h1>
          <p className="text-gray-500 text-sm mt-1">Daftar staf pengajar dan dosen aktif universitas</p>
        </div>
        <Link
          to="/admin/users"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
           Kelola via Manajemen User
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama atau email dosen..."
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
                <th className="p-4 font-semibold">Profil Dosen</th>
                <th className="p-4 font-semibold text-center">Status Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="2" className="p-8 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredDosens.length === 0 ? (
                <tr>
                  <td colSpan="2" className="p-8 text-center text-gray-500">
                    Tidak ada data dosen ditemukan. Tambahkan peran DOSEN di Manajemen User.
                  </td>
                </tr>
              ) : (
                filteredDosens.map((dosen) => (
                  <tr key={dosen.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
                           {dosen.name.charAt(0).toUpperCase()}
                         </div>
                         <div>
                            <div className="font-medium text-gray-800">{dosen.name}</div>
                            <div className="text-gray-500 text-xs flex items-center gap-1"><Mail size={12}/> {dosen.email}</div>
                         </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                       <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold border border-amber-200">DOSEN</span>
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

export default AdminDosen;
