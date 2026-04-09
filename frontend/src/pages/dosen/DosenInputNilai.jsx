import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../utils/api";
import Toast from "../../components/Toast";
import { Edit3, Save, ArrowLeft, Settings, Plus, Trash2, Download, Lock, History, X } from "lucide-react";

const DosenInputNilai = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [components, setComponents] = useState([]);
    
    // Component Setting State
    const [settingMode, setSettingMode] = useState(false);
    const [tempComponents, setTempComponents] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [saving, setSaving] = useState(false);
    
    // Publish & Audit State
    const [publishing, setPublishing] = useState(false);
    const [auditLogs, setAuditLogs] = useState([]);
    const [showAuditModal, setShowAuditModal] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem("matla_token");
            const res = await axios.get(`${API_BASE_URL}/dosen/courses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCourse = async (course) => {
        setLoading(true);
        setSelectedCourse(course);
        try {
            const token = localStorage.getItem("matla_token");
            
            // 1. Fetch Grade Components First
            const compRes = await axios.get(`${API_BASE_URL}/dosen/courses/${course.id}/grade-components`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const courseComponents = compRes.data;
            setComponents(courseComponents);
            
            const totalPercent = courseComponents.reduce((acc, c) => acc + parseFloat(c.percentage), 0);
            
            // 2. Fetch Students and their detailed grades
            const stdRes = await axios.get(`${API_BASE_URL}/dosen/courses/${course.id}/students`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const formatted = stdRes.data.map(enroll => {
                const stdRecord = {
                    enrollmentId: enroll.id,
                    name: enroll.student?.user?.name,
                    nim: enroll.student?.nim,
                    semester: enroll.semester || enroll.student?.semester,
                    angkatan: enroll.student?.angkatan,
                    gradeScore: enroll.gradeScore, // total
                    gradeLetter: enroll.gradeLetter, // final letter
                    details: {} 
                };
                
                // Prefill details mapped by component ID
                if (enroll.gradeDetails) {
                    enroll.gradeDetails.forEach(d => {
                        stdRecord.details[d.gradeComponentId] = d.score;
                    });
                }
                return stdRecord;
            });
            
            setStudents(formatted);
            
            // Auto open setting mode if components are empty or invalid
            if (courseComponents.length === 0 || Math.abs(totalPercent - 100) > 0.1) {
                setTempComponents(courseComponents.length > 0 ? courseComponents : [{ id: Date.now(), name: "Tugas", percentage: "" }]);
                setSettingMode(true);
            } else {
                setSettingMode(false);
            }
            
        } catch (error) {
             console.error(error);
             setToast({ message: "Gagal memuat detail kelas", type: "error" });
        } finally {
             setLoading(false);
        }
    };
    
    // COMPONENT SETTINGS LOGIC
    const handleAddTempComponent = () => {
        setTempComponents([...tempComponents, { id: Date.now(), name: "", percentage: "" }]);
    };
    
    const handleRemoveTempComponent = (id) => {
        setTempComponents(tempComponents.filter(c => c.id !== id));
    };

    const handleTempComponentChange = (id, field, value) => {
        setTempComponents(tempComponents.map(c => c.id === id ? { ...c, [field]: value } : c));
    };
    
    const totalTempPercent = tempComponents.reduce((sum, c) => sum + (parseFloat(c.percentage) || 0), 0);
    
    const saveSettings = async () => {
        if (Math.abs(totalTempPercent - 100) > 0.1) {
            setToast({ message: "Total bobot persentase harus pas 100%", type: "error" });
            return;
        }
        
        try {
            const token = localStorage.getItem("matla_token");
            await axios.post(`${API_BASE_URL}/dosen/courses/${selectedCourse.id}/grade-components`, 
            { components: tempComponents },
            { headers: { Authorization: `Bearer ${token}` }});
            
            setToast({ message: "Pengaturan kategori nilai berhasil disimpan", type: "success" });
            setSettingMode(false);
            handleSelectCourse(selectedCourse); // Refresh Data
        } catch (error) {
             console.error("Save Settings Error:", error);
             setToast({ message: "Gagal menyimpan pengaturan", type: "error" });
        }
    };

    // GRADE INPUT LOGIC
    const handleGradeDetailChange = (enrollmentId, componentId, value) => {
        setStudents(prev => prev.map(s => {
            if (s.enrollmentId === enrollmentId) {
                return {
                    ...s,
                    details: { ...s.details, [componentId]: value }
                };
            }
            return s;
        }));
    };

    const handleSaveGrades = async () => {
        if (!selectedCourse) return;
        setSaving(true);
        try {
            const token = localStorage.getItem("matla_token");
            
            // Format payload
            const payload = students.map(s => ({
                enrollmentId: s.enrollmentId,
                details: components.map(c => ({
                    componentId: c.id,
                    score: s.details[c.id] || 0
                }))
            }));
            
            await axios.put(`${API_BASE_URL}/dosen/courses/${selectedCourse.id}/grades`, 
            { grades: payload },
            { headers: { Authorization: `Bearer ${token}` }});
            
            setToast({ message: "Semua nilai berhasil disimpan dan dikalkulasi", type: "success" });
            handleSelectCourse(selectedCourse); // re-fetch to view final scores
        } catch (error) {
            console.error(error);
            setToast({ message: "Gagal menyimpan nilai", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handlePublishGrades = async () => {
        if (!selectedCourse) return;
        if (!window.confirm("Perhatian: Setelah dipublis, nilai akan segera ditampilkan ke dasbor mahasiswa dan otomatis terkunci (tidak bisa diubah lagi). Lanjutkan?")) return;
        
        setPublishing(true);
        try {
            const token = localStorage.getItem("matla_token");
            await axios.post(`${API_BASE_URL}/dosen/courses/${selectedCourse.id}/publish`, 
            {}, 
            { headers: { Authorization: `Bearer ${token}` }});
            
            setToast({ message: "Nilai berhasil dipublis dan dikunci!", type: "success" });
            // Update local state to reflect lock immediately
            setSelectedCourse(prev => ({...prev, isGradesPublished: true}));
            
            // Re-fetch courses in background so the list is updated
            fetchCourses();
        } catch (error) {
            console.error(error);
            setToast({ message: "Gagal mempublis nilai", type: "error" });
        } finally {
            setPublishing(false);
        }
    };

    const fetchAuditLogs = async () => {
        if (!selectedCourse) return;
        try {
            const token = localStorage.getItem("matla_token");
            const res = await axios.get(`${API_BASE_URL}/dosen/courses/${selectedCourse.id}/audit-logs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAuditLogs(res.data);
            setShowAuditModal(true);
        } catch (error) {
            console.error(error);
            setToast({ message: "Gagal memuat riwayat", type: "error" });
        }
    };

    const handleExportExcel = () => {
        if (!selectedCourse || students.length === 0) return;
        
        let csvContent = "NIM,Nama Mahasiswa,Semester,Angkatan,";
        
        // Component headers
        components.forEach(c => {
            csvContent += `"${c.name} (${c.percentage}%)",`;
        });
        csvContent += "Total Angka,Huruf Mutu\n";
        
        students.forEach(student => {
            let row = `"${student.nim}","${student.name}","${student.semester||'-'}","${student.angkatan||'-'}",`;
            components.forEach(c => {
                row += `"${student.details[c.id] || 0}",`;
            });
            row += `"${student.gradeScore !== null && student.gradeScore !== undefined ? parseFloat(student.gradeScore).toFixed(1) : '-'}","${student.gradeLetter || '-'}"\n`;
            csvContent += row;
        });
        
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Nilai_${selectedCourse.courseName.replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-6">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Edit3 className="text-[#1b4137]" /> Penilaian Mata Kuliah
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola kategori dan input nilai akhir mahasiswa secara detail.</p>
                </div>
            </div>

            {!selectedCourse && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div key={course.id} onClick={() => handleSelectCourse(course)} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md cursor-pointer transition-all border-l-4 border-l-[#1b4137]">
                             <h3 className="text-lg font-bold text-[#1b4137] mb-2">{course.courseName}</h3>
                             <p className="text-sm text-gray-500 mb-1">Semester {course.semester} • {course.programStudi?.nama}</p>
                             <p className="text-sm font-semibold text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded">{course._count?.enrollments || 0} Mahasiswa</p>
                        </div>
                    ))}
                    {courses.length === 0 && !loading && (
                        <div className="col-span-full p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500">
                             Belum ada jadwal mata kuliah yang Anda ampu.
                        </div>
                    )}
                </div>
            )}

            {selectedCourse && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50 gap-4">
                        <div>
                            <button onClick={() => setSelectedCourse(null)} className="text-gray-500 hover:text-gray-800 inline-flex items-center gap-2 mb-2 text-sm font-semibold transition-colors">
                                <ArrowLeft size={16}/> Kembali ke daftar Matkul
                            </button>
                            <h2 className="text-xl font-bold text-gray-800">{selectedCourse.courseName}</h2>
                        </div>
                        <div className="flex gap-2">
                            {selectedCourse.isGradesPublished ? (
                                <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-bold flex items-center gap-2 border border-orange-200">
                                    <Lock size={18} /> Nilai Terkunci & Publis
                                </div>
                            ) : (
                                <button onClick={() => {
                                    setTempComponents([...components]);
                                    setSettingMode(true);
                                }} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                                    <Settings size={18} /> Pengaturan Kategori
                                </button>
                            )}
                            
                            {!settingMode && (
                                <>
                                    <button onClick={fetchAuditLogs} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm">
                                        <History size={18} /> Riwayat
                                    </button>
                                    <button onClick={handleExportExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm">
                                        <Download size={18} /> Export Excel
                                    </button>
                                    {!selectedCourse.isGradesPublished && (
                                        <>
                                            <button onClick={handlePublishGrades} disabled={publishing} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm">
                                                {publishing ? 'Memproses...' : <><Lock size={18} /> Kunci & Publis</>}
                                            </button>
                                            <button onClick={handleSaveGrades} disabled={saving} className="bg-[#1b4137] hover:bg-[#2c6b5a] text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm">
                                                {saving ? 'Menyimpan...' : <><Save size={18} /> Simpan Input Nilai</>}
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* SETTING MODE */}
                    {settingMode && (
                         <div className="p-8 bg-slate-50 border-b border-gray-200">
                            <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="font-bold text-lg mb-4 text-gray-800">Pengaturan Kategori Nilai & Bobot</h3>
                                <p className="text-sm text-gray-500 mb-6">Tentukan kategori penilaian (misal: Absensi, UTS, UAS) dan presentasenya. Total keseluruhan bobot harus persis 100%.</p>
                                
                                <div className="space-y-3 mb-6">
                                    {tempComponents.map((c, i) => (
                                        <div key={c.id || i} className="flex gap-3 items-center">
                                            <input 
                                                type="text" placeholder="Nama Kategori (mis: Tugas 1)" 
                                                value={c.name} onChange={(e) => handleTempComponentChange(c.id, 'name', e.target.value)}
                                                className="flex-1 px-3 py-2 border rounded focus:ring-1 focus:ring-primary outline-none"
                                            />
                                            <input 
                                                type="number" placeholder="Persentase (%)" 
                                                value={c.percentage} onChange={(e) => handleTempComponentChange(c.id, 'percentage', e.target.value)}
                                                className="w-32 px-3 py-2 border rounded focus:ring-1 focus:ring-primary outline-none text-right"
                                            />
                                            <span className="text-gray-500">%</span>
                                            <button onClick={() => handleRemoveTempComponent(c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <button onClick={handleAddTempComponent} className="text-primary font-semibold flex flex-row items-center gap-1 hover:underline text-sm">
                                        <Plus size={16} /> Tambah Kategori
                                    </button>
                                    <div className="font-bold text-lg">
                                        Total: <span className={Math.abs(totalTempPercent - 100) < 0.1 ? "text-green-600" : "text-red-500"}>{totalTempPercent}%</span>
                                    </div>
                                </div>
                                
                                <div className="mt-6 flex justify-end gap-3">
                                    {components.length > 0 && Math.abs(components.reduce((a,c)=>a+c.percentage,0)-100) < 0.1 && (
                                        <button onClick={() => setSettingMode(false)} className="px-5 py-2 rounded-lg text-gray-600 bg-gray-100 font-semibold hover:bg-gray-200">
                                            Batal Mengubah
                                        </button>
                                    )}
                                    <button onClick={saveSettings} className="px-5 py-2 rounded-lg text-white bg-primary font-semibold shadow hover:bg-primary/90 flex gap-2 items-center">
                                         <Save size={18} /> Simpan Pengaturan
                                    </button>
                                </div>
                            </div>
                         </div>
                    )}

                    {/* INPUT MODE */}
                    {!settingMode && components.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b">
                                       <th className="p-4 font-semibold w-24">NIM</th>
                                       <th className="p-4 font-semibold min-w-[200px]">Nama Mahasiswa</th>
                                       <th className="p-4 font-semibold text-center border-l bg-gray-50">Smt / Angkt</th>
                                       {components.map(c => (
                                           <th key={c.id} className="p-4 font-semibold text-center border-l w-28 bg-emerald-50/50">
                                              {c.name}<br/>
                                              <span className="text-emerald-600 font-bold">{c.percentage}%</span>
                                           </th>
                                       ))}
                                       <th className="p-4 font-semibold w-24 text-center border-l bg-blue-50/50">Total Angka</th>
                                       <th className="p-4 font-semibold w-24 text-center border-l border-r bg-blue-50/50">Huruf Mutu</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {loading && <tr><td colSpan={4 + components.length} className="p-8 text-center text-gray-500">Memuat data...</td></tr>}
                                    {!loading && students.length === 0 && <tr><td colSpan={4 + components.length} className="p-8 text-center text-gray-500">Belum ada mahasiswa yang mengambil mata kuliah ini.</td></tr>}
                                    {!loading && students.map(student => (
                                        <tr key={student.enrollmentId} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 text-gray-500 font-medium">{student.nim}</td>
                                            <td className="p-4 font-bold text-gray-800">{student.name}</td>
                                            <td className="p-4 text-center border-l bg-gray-50/50">
                                                <div className="font-semibold text-gray-700">Smt {student.semester || '-'}</div>
                                                <div className="text-xs text-gray-500">Ang: {student.angkatan || '-'}</div>
                                            </td>
                                            {components.map(c => (
                                                <td key={c.id} className="p-3 border-l px-2">
                                                    {selectedCourse.isGradesPublished ? (
                                                        <div className="w-full p-2 text-center font-bold text-gray-800 bg-gray-100 rounded">
                                                            {student.details[c.id] !== undefined ? student.details[c.id] : '-'}
                                                        </div>
                                                    ) : (
                                                        <input 
                                                            type="number" 
                                                            min="0" max="100" 
                                                            placeholder="0-100"
                                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 text-center font-semibold"
                                                            value={student.details[c.id] || ''} 
                                                            onChange={(e) => handleGradeDetailChange(student.enrollmentId, c.id, e.target.value)} 
                                                        />
                                                    )}
                                                </td>
                                            ))}
                                            <td className="p-4 text-center border-l font-black text-lg text-blue-700 bg-blue-50/30">
                                                {student.gradeScore !== null && student.gradeScore !== undefined ? parseFloat(student.gradeScore).toFixed(1) : '-'}
                                            </td>
                                            <td className="p-4 text-center border-l border-r font-black text-lg bg-blue-50/30">
                                                {student.gradeLetter || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
            {/* MODAL AUDIT LOG */}
            {showAuditModal && (
                <div className="fixed inset-0 min-h-screen bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <History className="text-slate-500"/> Riwayat Perubahan Nilai
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Daftar rekaman jejak audit saat nilai ditimpa atau diperbarui.</p>
                            </div>
                            <button onClick={() => setShowAuditModal(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 bg-white">
                            {auditLogs.length === 0 ? (
                                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
                                    <History size={48} className="mx-auto text-gray-300 mb-3"/>
                                    <p className="font-medium text-lg">Belum ada riwayat perubahan</p>
                                    <p className="text-sm">Tidak ada deteksi pergantian nilai untuk mata kuliah ini.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-xl border border-gray-100">
                                    <table className="w-full text-left text-sm border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
                                                <th className="p-4 border-b">Waktu</th>
                                                <th className="p-4 border-b">Ubah Oleh</th>
                                                <th className="p-4 border-b">Mahasiswa</th>
                                                <th className="p-4 border-b text-center">Data Berubah</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {auditLogs.map(log => (
                                                <tr key={log.id} className="hover:bg-gray-50/50">
                                                    <td className="p-4 text-gray-500 whitespace-nowrap">
                                                        {new Date(log.timestamp).toLocaleString('id-ID', {day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}
                                                    </td>
                                                    <td className="p-4 font-medium text-gray-800">
                                                        {log.changedBy} <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full ml-1">{log.role}</span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-semibold text-gray-800">{log.studentName}</div>
                                                        <div className="text-xs text-gray-500">{log.nim}</div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <div className="text-sm text-gray-600 mb-1 font-medium">{log.componentName}</div>
                                                        <div className="flex items-center justify-center gap-2 font-bold text-lg">
                                                            <span className="text-red-500">{log.oldScore !== null ? log.oldScore : '-'}</span>
                                                            <ArrowLeft className="text-gray-300 rotate-180" size={16}/>
                                                            <span className="text-emerald-600">{log.newScore}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DosenInputNilai;
