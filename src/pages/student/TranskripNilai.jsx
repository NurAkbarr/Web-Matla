import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../utils/api";
import { Copy, Check, FileText } from "lucide-react";

const TranskripNilai = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const token = localStorage.getItem("matla_token");
        const res = await axios.get(`${API_BASE_URL}/student/grades`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEnrollments(res.data);
      } catch (error) {
        console.error("Gagal memuat nilai", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  // Group by semester
  const gradesBySemester = enrollments.reduce((acc, current) => {
    const sem = current.semester || 1;
    if (!acc[sem]) acc[sem] = [];
    acc[sem].push(current);
    return acc;
  }, {});

  const semesters = Object.keys(gradesBySemester).sort((a,b) => parseInt(b) - parseInt(a));

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
           <FileText className="text-primary"/> Transkrip Nilai & KHS
        </h1>
        <p className="text-slate-500 text-sm mt-1">Daftar nilai mata kuliah yang telah Anda ikuti.</p>
      </div>

      {loading ? (
           <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-100">Memuat data nilai...</div>
      ) : enrollments.length === 0 ? (
           <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 gap-2 flex flex-col items-center">
              <FileText size={48} className="text-slate-300"/>
              <p>Belum ada rekaman nilai mata kuliah.</p>
           </div>
      ) : (
          semesters.map(sem => (
              <div key={sem} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm mb-6">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                     <h2 className="font-bold text-slate-800">Semester {sem}</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-white text-slate-500 uppercase text-xs">
                          <th className="p-4 border-b">Mata Kuliah</th>
                          <th className="p-4 border-b">Dosen Pengampu</th>
                          <th className="p-4 border-b text-center border-l w-24">Nilai Angka</th>
                          <th className="p-4 border-b text-center w-24">Nilai Huruf</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gradesBySemester[sem].map((item, idx) => (
                           <tr key={item.id} className={idx % 2 === 0 ? "bg-slate-50/30" : "bg-white"}>
                              <td className="p-4 font-semibold text-primary">{item.course?.courseName}</td>
                              <td className="p-4 text-slate-600">{item.course?.dosen?.name || item.course?.lecturer || "-"}</td>
                              <td className="p-4 text-center font-bold text-slate-700 border-l">
                                  {item.status === 'DRAFT' ? <span className="text-xs font-normal text-slate-400 italic">Menunggu</span> : (item.gradeScore !== null ? parseFloat(item.gradeScore).toFixed(1) : '-')}
                              </td>
                              <td className="p-4 text-center font-bold">
                                  {item.status === 'DRAFT' ? (
                                      <span className="text-xs font-normal text-slate-400 italic">-</span>
                                  ) : item.gradeLetter ? (
                                     <span className={`inline-block px-2 py-1 rounded bg-slate-100 border text-slate-800 ${['A','A-'].includes(item.gradeLetter) ? 'bg-green-100 text-green-700 border-green-200' : ''}`}>
                                        {item.gradeLetter}
                                     </span>
                                  ) : (
                                     <span className="text-slate-400">-</span>
                                  )}
                              </td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              </div>
          ))
      )}
    </div>
  );
};

export default TranskripNilai;
