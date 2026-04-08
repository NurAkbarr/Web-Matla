import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Calendar, Users, UserPlus, Unlock, Lock } from "lucide-react";
import Toast from "../../components/Toast";

import API_BASE_URL from "../../utils/api";

const API_URL = API_BASE_URL;

const DINO = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const AdminJadwal = () => {
  const [schedules, setSchedules] = useState([]);
  const [prodis, setProdis] = useState([]);
  const [dosens, setDosens] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterProdi, setFilterProdi] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    courseName: "",
    lecturer: "",
    lecturerId: "",
    room: "",
    dayOfWeek: 1,
    startTime: "08:00",
    endTime: "10:00",
    programStudiId: "",
    semester: 1,
  });

  // Enrollments Modal State
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState(null);
  const [courseEnrollments, setCourseEnrollments] = useState([]);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("matla_token");
      const headers = { Authorization: `Bearer ${token}` };

      const res = await fetch(`${API_URL}/course-schedule`, { headers });
      const data = await res.json();
      setSchedules(Array.isArray(data) ? data : []);

      const resProdi = await fetch(`${API_URL}/prodi`);
      const dataProdi = await resProdi.json();
      setProdis(Array.isArray(dataProdi) ? dataProdi : []);

      const resDosen = await fetch(`${API_URL}/dosen/list`, { headers });
      const dataDosen = await resDosen.json();
      setDosens(Array.isArray(dataDosen) ? dataDosen : []);

      const resStudents = await fetch(`${API_URL}/student-profile`, { headers });
      const dataStudents = await resStudents.json();
      setAllStudents(Array.isArray(dataStudents) ? dataStudents : []);

    } catch (error) {
      console.error("Failed to fetch data", error);
      setToast({ message: "Gagal memuat data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === "lecturerId") {
      const selectedDosen = dosens.find(d => d.id === parseInt(e.target.value));
      setFormData({ 
        ...formData, 
        lecturerId: e.target.value,
        lecturer: selectedDosen ? selectedDosen.name : ""
      });
      return;
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (item = null) => {
    if (item) {
      setFormData({
        id: item.id,
        courseName: item.courseName,
        lecturer: item.lecturer || "",
        lecturerId: item.lecturerId || "",
        room: item.room,
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime,
        endTime: item.endTime,
        programStudiId: item.programStudiId,
        semester: item.semester,
      });
    } else {
      setFormData({
        id: null,
        courseName: "",
        lecturer: "",
        lecturerId: "",
        room: "",
        dayOfWeek: 1,
        startTime: "08:00",
        endTime: "10:00",
        programStudiId: "",
        semester: 1,
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
        ? `${API_URL}/course-schedule/${formData.id}`
        : `${API_URL}/course-schedule`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setToast({ message: "Jadwal berhasil disimpan", type: "success" });
        fetchData();
        closeModal();
      } else {
        const err = await response.json();
        setToast({ message: err.message || "Terjadi kesalahan", type: "error" });
      }
    } catch (error) {
      console.error("Save error", error);
      setToast({ message: "Gagal menyimpan jadwal", type: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
      try {
        const token = localStorage.getItem("matla_token");
        const response = await fetch(`${API_URL}/course-schedule/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          setToast({ message: "Jadwal berhasil dihapus", type: "success" });
          fetchData();
        } else {
           setToast({ message: "Gagal menghapus jadwal", type: "error" });
        }
      } catch (error) {
        console.error("Delete error", error);
      }
    }
  };

  // --- ENROLLMENTS LOGIC ---
  const openEnrollModal = async (course) => {
    setSelectedCourseForEnroll(course);
    setShowEnrollModal(true);
    fetchCourseEnrollments(course.id);
  };

  const closeEnrollModal = () => {
    setShowEnrollModal(false);
    setSelectedCourseForEnroll(null);
    setCourseEnrollments([]);
    setSelectedStudentToAdd("");
  };

  const fetchCourseEnrollments = async (courseId) => {
    setEnrollLoading(true);
    try {
      const token = localStorage.getItem("matla_token");
      const res = await fetch(`${API_URL}/dosen/enroll/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCourseEnrollments(data);
    } catch (error) {
      console.error("Fetch Enrollments Error", error);
      setToast({ message: "Gagal mengambil data peserta", type: "error" });
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleAddEnrollment = async () => {
    if (!selectedStudentToAdd) return;
    setEnrollLoading(true);
    try {
        const token = localStorage.getItem("matla_token");
        const response = await fetch(`${API_URL}/dosen/enroll`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                studentProfileId: selectedStudentToAdd,
                courseScheduleId: selectedCourseForEnroll.id,
                semester: selectedCourseForEnroll.semester
            })
        });

        if (response.ok) {
            setToast({ message: "Mahasiswa berhasil ditambahkan ke kelas", type: "success" });
            fetchCourseEnrollments(selectedCourseForEnroll.id);
            setSelectedStudentToAdd("");
        } else {
            const err = await response.json();
             setToast({ message: err.message || "Gagal menambahkan mahasiswa", type: "error" });
        }
    } catch (error) {
        console.error(error);
         setToast({ message: "Gagal menambahkan peserta", type: "error" });
    } finally {
        setEnrollLoading(false);
    }
  };

  const handleRemoveEnrollment = async (enrollmentId) => {
      if (!window.confirm("Keluarkan mahasiswa dari kelas ini?")) return;
      setEnrollLoading(true);
      try {
          const token = localStorage.getItem("matla_token");
          const response = await fetch(`${API_URL}/dosen/enroll/${enrollmentId}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.ok) {
              setToast({ message: "Peserta berhasil dikeluarkan", type: "success" });
              fetchCourseEnrollments(selectedCourseForEnroll.id);
          } else {
              setToast({ message: "Gagal mengeluarkan peserta", type: "error" });
          }
      } catch (error) {
          console.error(error);
          setToast({ message: "Gagal menghapus", type: "error" });
      } finally {
          setEnrollLoading(false);
      }
  };

  const handleUnlockGrades = async (course) => {
    if (!window.confirm(`Apakah Anda yakin ingin membuka kunci nilai "${course.courseName}"? Dosen akan dapat mengubah nilai kembali.`)) return;
    try {
        const token = localStorage.getItem("matla_token");
        const res = await fetch(`${API_URL}/dosen/courses/${course.id}/unlock`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            setToast({ message: "Kunci nilai berhasil dibuka", type: "success" });
            fetchData();
        } else {
            const err = await res.json();
            setToast({ message: err.message || "Gagal membuka kunci", type: "error" });
        }
    } catch (e) {
        console.error("Unlock Error", e);
        setToast({ message: "Terjadi kesalahan", type: "error" });
    }
  };

  let filteredItems = schedules.filter((s) =>
    (s.courseName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.lecturer || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterProdi) {
      filteredItems = filteredItems.filter(s => s.programStudiId === parseInt(filterProdi));
  }

  // Filter out students that are already enrolled to show in the dropdown
  const enrolledStudentIds = courseEnrollments.map(e => e.studentProfileId);
  const availableStudentsForEnroll = allStudents.filter(s => !enrolledStudentIds.includes(s.studentProfile?.id));

  return (
    <div className="p-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Jadwal & Peserta Kuliah</h1>
          <p className="text-gray-500 text-sm mt-1">Atur jadwal kelas dan daftarkan peserta secara manual</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} /> Tambah Jadwal
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center bg-gray-50/50">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari matkul atau dosen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>
          <select
             value={filterProdi}
             onChange={(e) => setFilterProdi(e.target.value)}
             className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
          >
              <option value="">Semua Program Studi</option>
              {prodis.map(p => (
                  <option key={p.id} value={p.id}>{p.nama}</option>
              ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold w-12">Hari</th>
                <th className="p-4 font-semibold">Waktu & Ruang</th>
                <th className="p-4 font-semibold">Mata Kuliah / Dosen</th>
                <th className="p-4 font-semibold">Prodi & Smt</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    Tidak ada jadwal ditemukan.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-medium text-gray-800">
                        {DINO[item.dayOfWeek === 7 ? 0 : item.dayOfWeek]}
                    </td>
                    <td className="p-4">
                        <div className="font-semibold text-gray-800">{item.startTime} - {item.endTime}</div>
                        <div className="text-gray-500 text-xs">{item.room}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-primary">{item.courseName}</div>
                      <div className="text-gray-500 text-xs">{item.lecturer}</div>
                    </td>
                    <td className="p-4">
                        <div className="font-medium text-gray-800">{item.programStudi?.nama}</div>
                        <div className="text-gray-500 text-xs">Semester {item.semester}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {item.isGradesPublished && (
                            <button
                              onClick={() => handleUnlockGrades(item)}
                              className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors border border-orange-200 bg-orange-50/50 hover:bg-orange-100 flex items-center gap-1 px-2"
                              title="Buka Paksa Kunci Nilai"
                            >
                               <Unlock size={16} /> <span className="text-xs font-semibold hidden lg:block">Buka Nilai</span>
                            </button>
                        )}
                        <button
                          onClick={() => openEnrollModal(item)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors flex items-center gap-1 px-3 border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100"
                          title="Kelola Peserta Kelas"
                        >
                          <Users size={16} /> <span className="text-xs font-semibold hidden lg:block">Peserta</span>
                        </button>
                        <button
                          onClick={() => openModal(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Jadwal"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Hapus Jadwal"
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

      {/* Modal Form Jadwal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {formData.id ? "Edit Jadwal" : "Tambah Jadwal"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="scheduleForm" onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Mata Kuliah *</label>
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosen Pengampu *</label>
                  <select
                    name="lecturerId"
                    value={formData.lecturerId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">-- Pilih Dosen --</option>
                    {dosens.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program Studi *</label>
                    <select
                        name="programStudiId"
                        value={formData.programStudiId}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">-- Pilih --</option>
                        {prodis.map(p => (
                            <option key={p.id} value={p.id}>{p.nama}</option>
                        ))}
                    </select>
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
                    <input
                        type="number"
                        name="semester"
                        value={formData.semester}
                        onChange={handleInputChange}
                        required
                        min="1"
                        max="14"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hari *</label>
                    <select
                        name="dayOfWeek"
                        value={formData.dayOfWeek}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="1">Senin</option>
                        <option value="2">Selasa</option>
                        <option value="3">Rabu</option>
                        <option value="4">Kamis</option>
                        <option value="5">Jumat</option>
                        <option value="6">Sabtu</option>
                        <option value="7">Minggu</option>
                    </select>
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ruangan *</label>
                    <input
                        type="text"
                        name="room"
                        value={formData.room}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jam Mulai *</label>
                        <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jam Selesai *</label>
                    <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
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
                form="scheduleForm"
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                disabled={loading}
              >
                {formData.id ? "Simpan Perubahan" : "Simpan Baru"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kelola Peserta */}
      {showEnrollModal && selectedCourseForEnroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                 <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Users className="text-emerald-600" /> Kelola Peserta Kelas
                 </h2>
                 <p className="text-sm text-gray-500 mt-1">{selectedCourseForEnroll.courseName} - {selectedCourseForEnroll.lecturer}</p>
              </div>
              <button onClick={closeEnrollModal} className="text-gray-400 hover:text-gray-600 font-bold p-2">
                ✕
              </button>
            </div>

            <div className="p-6 bg-slate-50 border-b border-gray-200">
               <h3 className="text-sm font-bold text-gray-700 mb-2">Tambah Mahasiswa Baru (Manual)</h3>
               <div className="flex gap-2">
                   <select 
                       className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                       value={selectedStudentToAdd}
                       onChange={(e) => setSelectedStudentToAdd(e.target.value)}
                   >
                       <option value="">-- Pilih Mahasiswa yang belum terdaftar di kelas ini --</option>
                       {availableStudentsForEnroll.map(student => {
                           if (!student.studentProfile) return null;
                           return (
                               <option key={student.id} value={student.studentProfile.id}>
                                   {student.studentProfile.nim} - {student.name} (Smt {student.studentProfile.semester})
                               </option>
                           )
                       })}
                   </select>
                   <button 
                       onClick={handleAddEnrollment}
                       disabled={!selectedStudentToAdd || enrollLoading}
                       className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors"
                   >
                       <UserPlus size={18} /> Tambah
                   </button>
               </div>
            </div>

            <div className="p-0 overflow-y-auto bg-white flex-1 min-h-[300px]">
               <table className="w-full text-left border-collapse">
                   <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                       <tr>
                           <th className="p-4 text-xs font-semibold text-gray-500 uppercase">NIM</th>
                           <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Nama Peserta</th>
                           <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Prodi / Smt</th>
                           <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-center">Aksi</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 text-sm">
                       {enrollLoading ? (
                           <tr><td colSpan="4" className="p-8 text-center text-gray-500">Memuat data peserta...</td></tr>
                       ) : courseEnrollments.length === 0 ? (
                           <tr><td colSpan="4" className="p-8 text-center text-gray-500">Belum ada mahasiswa terdaftar di kelas ini.</td></tr>
                       ) : (
                           courseEnrollments.map(enroll => (
                               <tr key={enroll.id} className="hover:bg-gray-50">
                                   <td className="p-4 font-medium text-gray-700">{enroll.student?.nim}</td>
                                   <td className="p-4 font-bold text-gray-800">{enroll.student?.user?.name}</td>
                                   <td className="p-4 text-gray-500">
                                       {enroll.student?.programStudi?.nama} <span className="mx-1">•</span> Smt {enroll.student?.semester}
                                   </td>
                                   <td className="p-4 text-center">
                                       <button 
                                           onClick={() => handleRemoveEnrollment(enroll.id)}
                                           className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                                           title="Keluarkan dari kelas"
                                       >
                                           <Trash2 size={16} />
                                       </button>
                                   </td>
                               </tr>
                           ))
                       )}
                   </tbody>
               </table>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50/50">
              <button
                onClick={closeEnrollModal}
                className="px-6 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminJadwal;
