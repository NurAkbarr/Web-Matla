import {
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  Clock,
  XCircle,
  FileEdit,
  Trash2,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Toast from "../../components/Toast";
import API_BASE_URL from "../../utils/api";

const PMBData = () => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Selection state
  const [selectedIds, setSelectedIds] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  // Modals state
  const [deleteModalInfo, setDeleteModalInfo] = useState(null);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [detailModalData, setDetailModalData] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchApplicants = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("matla_token");
      const res = await axios.get(`${API_BASE_URL}/pmb`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTableData(res.data);
      setSelectedIds([]); // Reset selection on fetch
      setIsAllSelected(false);
    } catch (err) {
      console.error(err);
      showToast("Gagal mengambil data pendaftar", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Checkbox Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = tableData.map((item) => item.id);
      setSelectedIds(allIds);
      setIsAllSelected(true);
    } else {
      setSelectedIds([]);
      setIsAllSelected(false);
    }
  };

  const handleSelectOne = (e, id) => {
    if (e.target.checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
      setIsAllSelected(false); // Can't be 'all selected' if we uncheck one
    }
  };

  // Sync isAllSelected when individual checkboxes change
  useEffect(() => {
    if (tableData.length > 0 && selectedIds.length === tableData.length) {
      setIsAllSelected(true);
    } else {
      setIsAllSelected(false);
    }
  }, [selectedIds, tableData]);

  // Bulk Delete Action
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      const token = localStorage.getItem("matla_token");
      const res = await axios.post(
        `${API_BASE_URL}/pmb/bulk-delete`,
        { ids: selectedIds },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      showToast(res.data.message);
      setBulkDeleteModalOpen(false);
      fetchApplicants();
    } catch (err) {
      console.error("Bulk Delete Error:", err);
      showToast(err.response?.data?.message || "Gagal menghapus data", "error");
    }
  };

  // Single Delete Action
  const handleSingleDelete = async () => {
    if (!deleteModalInfo) return;
    try {
      const token = localStorage.getItem("matla_token");
      const res = await axios.delete(
        `${API_BASE_URL}/pmb/${deleteModalInfo.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      showToast(res.data.message);
      setDeleteModalInfo(null);
      fetchApplicants();
    } catch (err) {
      console.error("Single Delete Error:", err);
      showToast(err.response?.data?.message || "Gagal menghapus data", "error");
    }
  };

  // Status Update Action
  const handleUpdateStatus = async (id, newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const token = localStorage.getItem("matla_token");
      const res = await axios.put(
        `${API_BASE_URL}/pmb/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      showToast(res.data.message);
      
      // Update local state to reflect change without refetching everything
      setTableData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item,
        ),
      );
      
      // Update modal data if open
      if (detailModalData && detailModalData.id === id) {
        setDetailModalData((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Update Status Error:", err);
      showToast(err.response?.data?.message || "Gagal mengubah status", "error");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Derive Filtered Data
  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      // 1. Filter by Search Query
      const lowerQuery = searchQuery.toLowerCase();
      const matchesSearch =
        item.fullName.toLowerCase().includes(lowerQuery) ||
        item.email.toLowerCase().includes(lowerQuery) ||
        item.phone.toLowerCase().includes(lowerQuery) ||
        item.registrationNo.toLowerCase().includes(lowerQuery);

      // 2. Filter by Status
      const matchesStatus =
        statusFilter === "Semua" || item.status.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [tableData, searchQuery, statusFilter]);

  // Handle Export Excel
  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      showToast("Tidak ada data untuk diekspor", "error");
      return;
    }

    // Prepare data for Excel
    const excelData = filteredData.map((item, index) => ({
      "No": index + 1,
      "No. Pendaftaran": item.registrationNo,
      "Nama Lengkap": item.fullName,
      "NIK": item.nik,
      "Jenis Kelamin": item.gender === "L" ? "Laki-laki" : "Perempuan",
      "No. WhatsApp": item.phone,
      "Email": item.email,
      "Status Pekerjaan": item.employmentStatus || "-",
      "Sumber Info": item.infoSource || "-",
      "Program Studi": item.program,
      "Asal Sekolah": item.schoolName,
      "Skor Skill IT": item.techSkillLevel,
      "Tanggal Daftar": formatDate(item.appliedDate),
      "Status": item.status,
    }));

    // Generate Excel file
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pendaftar PMB");
    
    // Auto-size columns slightly
    const columnWidths = [
      { wch: 5 },  // No
      { wch: 15 }, // No. Pend
      { wch: 25 }, // Nama
      { wch: 20 }, // NIK
      { wch: 15 }, // JK
      { wch: 15 }, // Phone
      { wch: 25 }, // Email
      { wch: 20 }, // Pekerjaan
      { wch: 15 }, // Sumber
      { wch: 25 }, // Prodi
      { wch: 20 }, // Sekolah
      { wch: 10 }, // Skor IT
      { wch: 15 }, // Tgl
      { wch: 12 }, // Status
    ];
    worksheet["!cols"] = columnWidths;

    XLSX.writeFile(workbook, `Data_PMB_Matla_${formatDate(new Date())}.xlsx`);
    showToast("Berhasil mengekspor data ke Excel");
  };

  // Status Badge formatting
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "DITERIMA":
        return <span className="status-badge status-diterima">Diterima</span>;
      case "DITOLAK":
        return <span className="status-badge status-ditolak">Ditolak</span>;
      case "DIPROSES":
      default:
        return <span className="status-badge status-diproses">Diproses</span>;
    }
  };

  return (
    <div className="admin-page space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Data Pendaftaran Mahasiswa Baru
        </h1>
        {selectedIds.length > 0 && (
          <button
            onClick={() => setBulkDeleteModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-colors shadow-sm animate-in slide-in-from-right-4"
          >
            <Trash2 size={16} />
            Hapus Data Terpilih ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {/* Search Input matching mockup */}
        <div className="search-box relative w-full md:w-[480px]">
          <Search
            className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari nama, email, atau nomor HP"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-sm"
          />
        </div>

        <div className="filters flex flex-col sm:flex-row flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Status Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-gray-600 font-medium">Status</span>
            <div className="relative w-full sm:w-auto">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-3 pr-10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              >
                <option value="Semua">Semua</option>
                <option value="DIPROSES">Diproses</option>
                <option value="DITERIMA">Diterima</option>
                <option value="DITOLAK">Ditolak</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>

          {/* Right Action Buttons matching mockup */}
          <div className="flex items-center gap-2 w-full sm:w-auto ml-auto">
            <button 
                onClick={() => setStatusFilter("Semua")}
                className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm flex-1 sm:flex-none transition-colors ${statusFilter === 'Semua' ? 'bg-gray-800 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50 bg-white'}`}
            >
              Semua
            </button>
            <button 
                onClick={() => setStatusFilter("DIPROSES")}
                className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm flex-1 sm:flex-none transition-colors ${statusFilter === 'DIPROSES' ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
            >
              Diproses
            </button>
            <button 
                onClick={() => setStatusFilter("DITERIMA")}
                className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm flex-1 sm:flex-none transition-colors ${statusFilter === 'DITERIMA' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100'}`}
            >
              Diterima
            </button>
            <button 
                onClick={() => setStatusFilter("DITOLAK")}
                className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm flex-1 sm:flex-none transition-colors ${statusFilter === 'DITOLAK' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'}`}
            >
              Ditolak
            </button>
            <button 
              onClick={handleExportExcel}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center gap-2 shadow-sm flex-1 sm:flex-none transition-colors"
            >
              <Filter size={16} /> Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="py-4 px-6 w-12 text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer accent-primary"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    disabled={isLoading || filteredData.length === 0}
                  />
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-700">
                  Reg. No
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-700">
                  Nama Lengkap
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-700">
                  Program Studi
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-700">
                  No. HP
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-700">
                  Tanggal Daftar
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-700 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    <div className="flex justify-center mb-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    Memuat data pendaftar...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    Tidak ada data pendaftar.
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition-colors ${selectedIds.includes(row.id) ? "bg-primary/5" : "hover:bg-gray-50"}`}
                  >
                    <td className="py-3.5 px-6 text-sm text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer accent-primary"
                        checked={selectedIds.includes(row.id)}
                        onChange={(e) => handleSelectOne(e, row.id)}
                      />
                    </td>
                    <td className="py-3.5 px-6 text-xs font-mono text-gray-500 font-semibold">
                      {row.registrationNo}
                    </td>
                    <td className="py-3.5 px-6 text-sm">
                      <p className="font-semibold text-slate-800">
                        {row.fullName}
                      </p>
                      <p className="text-xs text-slate-500">{row.email}</p>
                    </td>
                    <td className="py-3.5 px-6 text-sm text-gray-600 font-medium">
                      {row.program}
                    </td>
                    <td className="py-3.5 px-6 text-sm text-gray-600">
                      {row.phone}
                    </td>
                    <td className="py-3.5 px-6 text-sm text-gray-600">
                      {formatDate(row.appliedDate)}
                    </td>
                    <td className="py-3.5 px-6 text-sm">
                      {getStatusBadge(row.status)}
                    </td>
                    <td className="py-3.5 px-6 text-sm text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setDetailModalData(row)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors text-xs font-medium shadow-sm"
                          title="Lihat & Verifikasi"
                        >
                          <Eye size={13} /> Detail
                        </button>
                        <button
                          onClick={() =>
                            setDeleteModalInfo({
                              id: row.id,
                              name: row.fullName,
                            })
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-colors text-xs font-medium shadow-sm"
                        >
                          <Trash2 size={13} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination matching mockup */}
        <div className="border-t border-gray-200 p-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Menampilkan {filteredData.length > 0 ? 1 : 0} sampai {filteredData.length > 10 ? 10 : filteredData.length} dari {filteredData.length} entri (Total {tableData.length})
          </p>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 flex items-center justify-center text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
              <ChevronDown size={16} className="transform rotate-90" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-white bg-primary rounded-md shadow-sm">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
              3
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
              4
            </button>
            <button className="flex items-center gap-1.5 px-3 h-8 text-sm font-medium text-gray-600 hover:text-primary transition-colors ml-2">
              Berikutnya{" "}
              <ChevronDown size={14} className="transform -rotate-90" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Delete Modal */}
      {bulkDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200 text-center border-t-4 border-red-500">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100">
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Hapus {selectedIds.length} Pendaftar?
            </h3>
            <p className="text-slate-500 mb-6 text-sm">
              Anda yakin ingin menghapus <strong>{selectedIds.length}</strong>{" "}
              data pendaftar sekaligus? Aksi massal ini bersifat permanen dan
              tidak dapat dikembalikan.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setBulkDeleteModalOpen(false)}
                className="px-6 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-sm shadow-red-600/20 transition-all flex items-center gap-2"
              >
                <Trash2 size={18} /> Ya, Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Delete Modal */}
      {deleteModalInfo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Hapus Data Pendaftar?
            </h3>
            <p className="text-slate-500 mb-6">
              Anda yakin ingin menghapus data{" "}
              <strong>{deleteModalInfo.name}</strong>?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteModalInfo(null)}
                className="px-6 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSingleDelete}
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-sm shadow-red-600/20 transition-all"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail & Verification Modal */}
      {detailModalData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col my-auto animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Detail Pendaftar: {detailModalData.registrationNo}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Mendaftar pada {formatDate(detailModalData.appliedDate)}
                </p>
              </div>
              <button
                onClick={() => setDetailModalData(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column - Data */}
                <div className="md:col-span-2 space-y-8">
                  
                  {/* Aspek 1 */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
                      1. Data Pribadi
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Nama Lengkap</p>
                        <p className="font-semibold text-gray-900">{detailModalData.fullName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1">NIK</p>
                        <p className="font-mono text-gray-900">{detailModalData.nik}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Tempat, Tanggal Lahir</p>
                        <p className="text-gray-900">
                          {detailModalData.birthPlace}, {formatDate(detailModalData.birthDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Jenis Kelamin</p>
                        <p className="text-gray-900">
                          {detailModalData.gender === "L" ? "Laki-laki (Ikhwan)" : "Perempuan (Akhwat)"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1">No. WhatsApp</p>
                        <p className="text-gray-900">
                           <a href={`https://wa.me/${detailModalData.phone}`} target="_blank" className="text-primary hover:underline">{detailModalData.phone}</a>
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Email</p>
                        <p className="text-gray-900">{detailModalData.email}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500 font-medium mb-1">Alamat Domisili</p>
                        <p className="text-gray-900">{detailModalData.address}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Status Pekerjaan</p>
                        <p className="text-gray-900">{detailModalData.employmentStatus || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Sumber Info PMB</p>
                        <p className="text-gray-900">{detailModalData.infoSource || "-"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Aspek 2 */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
                      2. Data Pendidikan
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                        <div className="col-span-2 p-3 bg-primary/5 rounded-lg border border-primary/20 mb-2">
                            <p className="text-primary font-bold text-xs uppercase mb-1">Pilihan Program Studi</p>
                            <p className="text-lg font-bold text-gray-900">{detailModalData.program}</p>
                        </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Pendidikan Terakhir</p>
                        <p className="text-gray-900">{detailModalData.lastEducation}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Tahun Lulus</p>
                        <p className="text-gray-900">{detailModalData.graduationYear}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500 font-medium mb-1">Asal Sekolah/Kampus</p>
                        <p className="text-gray-900">{detailModalData.schoolName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Aspek 3 */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
                      3. Kuesioner Mahasiswa
                    </h4>
                    <div className="space-y-4 text-sm">
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-100 flex justify-between items-center">
                          <p className="font-semibold text-gray-800">Skor Skill Teknologi</p>
                          <span className="text-xl font-bold text-primary">{detailModalData.techSkillLevel}/100</span>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Pentingnya Ilmu Syari & Teknologi menurut pendaftar:</p>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">{detailModalData.importanceOpinion}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Apakah kuliah hanya fokus ilmu syar'i?</p>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">{detailModalData.focusOpinion}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Pendapat tentang ilmuwan syar'i vs teknologi:</p>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">{detailModalData.comparisonOpinion}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Keahlian baru yang ingin dikuasai: <span className="font-semibold text-gray-900">{detailModalData.newSkillInterest}</span></p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Bidang yang diminati: <span className="font-semibold text-gray-900">{detailModalData.preferredField}</span></p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Motivasi kuliah di Matla:</p>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">{detailModalData.motivation}</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column - Status & Photo */}
                <div className="space-y-6">
                  {/* Status Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <CheckCircle size={16} /> Verifikasi Pendaftar
                    </h4>
                    <div className="mb-5">
                       <p className="text-xs text-slate-500 mb-2">Status Saat Ini:</p>
                       <div className="text-lg">{getStatusBadge(detailModalData.status)}</div>
                    </div>
                    
                    <div className="space-y-2">
                        <p className="text-xs text-slate-500 font-medium">Ubah Status Menjadi:</p>
                        <button 
                            disabled={isUpdatingStatus || detailModalData.status === "DITERIMA"}
                            onClick={() => handleUpdateStatus(detailModalData.id, "DITERIMA")}
                            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                        >
                            Terima Pendaftar
                        </button>
                        <button 
                            disabled={isUpdatingStatus || detailModalData.status === "DITOLAK"}
                            onClick={() => handleUpdateStatus(detailModalData.id, "DITOLAK")}
                            className="w-full py-2.5 bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 border border-red-200 text-sm font-bold rounded-lg transition-colors"
                        >
                            Tolak Pendaftar
                        </button>
                        <button 
                            disabled={isUpdatingStatus || detailModalData.status === "DIPROSES"}
                            onClick={() => handleUpdateStatus(detailModalData.id, "DIPROSES")}
                            className="w-full py-2 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 border border-slate-200 text-xs font-semibold rounded-lg transition-colors mt-2"
                        >
                            Kembalikan ke 'Diproses'
                        </button>
                    </div>
                  </div>

                  {/* Payment Proof Card */}
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            Bukti Pembayaran / TF
                        </h4>
                    </div>
                    <div className="p-4 bg-gray-100 flex items-center justify-center min-h-[200px]">
                        {detailModalData.paymentProofUrl ? (
                           detailModalData.paymentProofUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ? (
                              <a href={`${API_BASE_URL.replace("/api", "")}${detailModalData.paymentProofUrl}`} target="_blank" rel="noreferrer">
                                <img 
                                    src={`${API_BASE_URL.replace("/api", "")}${detailModalData.paymentProofUrl}`} 
                                    alt="Bukti Transfer" 
                                    className="max-w-full rounded-lg shadow-sm border border-gray-200 hover:opacity-90 transition-opacity cursor-pointer transform hover:scale-[1.02] duration-200"
                                    style={{ maxHeight: "300px", objectFit: "contain" }}
                                />
                              </a>
                           ) : (
                              <a 
                                href={`${API_BASE_URL.replace("/api", "")}${detailModalData.paymentProofUrl}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-primary/30 rounded-xl hover:bg-primary/5 transition-colors"
                              >
                                  <FileEdit size={32} className="text-primary mb-2" />
                                  <span className="text-sm font-semibold text-primary">Lihat Dokumen PDF</span>
                              </a>
                           )
                        ) : (
                            <p className="text-sm text-gray-400">Belum ada bukti yang diunggah.</p>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Existing Status Badge Styles */
        .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        .status-diproses {
            background-color: #f3f4f6;
            color: #4b5563;
        }
        .status-diterima {
            background-color: #d1fae5;
            color: #059669;
        }
        .status-ditolak {
            background-color: #fee2e2;
            color: #dc2626;
        }

        /* Modal Scrollbar Styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default PMBData;
