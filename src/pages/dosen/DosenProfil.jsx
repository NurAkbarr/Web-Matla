import { useState, useEffect, useRef } from "react";
import axios from "axios";
import API_BASE_URL from "../../utils/api";
import Toast from "../../components/Toast";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Lock, 
  ShieldCheck, 
  Award, 
  Save, 
  Camera,
  Loader2,
  BookOpen,
  Users
} from "lucide-react";

const DosenProfil = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("biodata");
    const [toast, setToast] = useState(null);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    // Form States
    const [formData, setFormData] = useState({
        academicTitle: "",
        phoneNumber: "",
        address: "",
        gender: "",
        birthPlace: "",
        birthDate: "",
        expertise: "",
        profilePictureUrl: ""
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("matla_token");
            const res = await axios.get(`${API_BASE_URL}/dosen/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfileData(res.data);
            
            // Fill form data
            const p = res.data.profile || {};
            setFormData({
                academicTitle: p.academicTitle || "",
                phoneNumber: p.phoneNumber || "",
                address: p.address || "",
                gender: p.gender || "",
                birthPlace: p.birthPlace || "",
                birthDate: p.birthDate ? p.birthDate.split('T')[0] : "",
                expertise: p.expertise || "",
                profilePictureUrl: p.profilePictureUrl || ""
            });
        } catch (error) {
            console.error("Fetch Profile Error:", error);
            setToast({ message: "Gagal memuat profil", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem("matla_token");
            await axios.put(`${API_BASE_URL}/dosen/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setToast({ message: "Profil berhasil diperbarui!", type: "success" });
            fetchProfile(); // Refresh statistics and data
        } catch (error) {
            console.error("Update Profile Error:", error);
            const msg = error.response?.data?.message || "Gagal memperbarui profil";
            setToast({ message: msg, type: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setToast({ message: "Konfirmasi password baru tidak cocok!", type: "error" });
            return;
        }
        setSaving(true);
        try {
            const token = localStorage.getItem("matla_token");
            await axios.put(`${API_BASE_URL}/dosen/profile/password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setToast({ message: "Password berhasil diubah", type: "success" });
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            console.error("Update Password Error:", error);
            const msg = error.response?.data?.message || "Gagal mengubah password";
            setToast({ message: msg, type: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Size validation (2MB)
        if (file.size > 2 * 1024 * 1024) {
            setToast({ message: "Ukuran file terlalu besar! Maksimal 2MB.", type: "error" });
            return;
        }

        const formDataPayload = new FormData();
        formDataPayload.append("profilePicture", file);

        setSaving(true);
        try {
            const token = localStorage.getItem("matla_token");
            const res = await axios.post(`${API_BASE_URL}/dosen/profile/upload`, formDataPayload, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            
            // Perbarui state lokal dengan URL baru dari server
            const newUrl = res.data.profilePictureUrl;
            setProfileData(prev => ({
                ...prev,
                profile: { ...prev.profile, profilePictureUrl: newUrl }
            }));
            setFormData(prev => ({ ...prev, profilePictureUrl: newUrl }));
            
            setToast({ message: "Foto profil berhasil diunggah!", type: "success" });
        } catch (error) {
            console.error("Upload Error:", error);
            const msg = error.response?.data?.message || "Gagal mengunggah foto";
            setToast({ message: msg, type: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
                <Loader2 className="animate-spin mb-2" size={32} />
                <p>Memuat profil...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* HEADER */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <User className="text-primary"/> Profil Saya
                </h1>
                <p className="text-slate-500 text-sm mt-1">Kelola informasi diri dan keamanan akun Anda.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT: ID CARD STYLE */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden relative">
                        {/* Decorative Background */}
                        <div className="h-24 bg-gradient-to-br from-primary to-[#2c6b5a]" />
                        
                        <div className="px-6 pb-8 pt-0 flex flex-col items-center -mt-12">
                            {/* Avatar */}
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100">
                                    {profileData.profile?.profilePictureUrl ? (
                                        <img 
                                            src={profileData.profile.profilePictureUrl.startsWith('http') ? profileData.profile.profilePictureUrl : `${API_BASE_URL.replace('/api', '')}${profileData.profile.profilePictureUrl}`} 
                                            alt={profileData.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <User size={56} />
                                        </div>
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handleFileUpload}
                                />
                                <button 
                                    onClick={() => fileInputRef.current.click()}
                                    className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
                                    title="Unggah Foto Baru"
                                    disabled={saving}
                                >
                                    {saving ? <Loader2 className="animate-spin" size={14}/> : <Camera size={14} />}
                                </button>
                            </div>

                            <div className="mt-4 text-center">
                                <h2 className="text-xl font-bold text-slate-800">
                                    {profileData.name}{formData.academicTitle ? `, ${formData.academicTitle}` : ''}
                                </h2>
                                <p className="text-slate-500 font-medium text-sm flex items-center justify-center gap-1 mt-1">
                                    <ShieldCheck size={14} className="text-blue-500"/> DOSEN AKTIF
                                </p>
                                <div className="mt-3 inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600 border border-slate-200 uppercase tracking-wider">
                                    NIDN: {profileData.profile?.nidn || "Belum Diatur"}
                                </div>
                            </div>

                            <div className="w-full mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Email</div>
                                    <div className="text-sm font-semibold text-slate-700 truncate">{profileData.email}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Keahlian</div>
                                    <div className="text-sm font-semibold text-slate-700">{formData.expertise || "-"}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Statistik Akademik</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><BookOpen size={18}/></div>
                                    <span className="text-sm font-medium text-slate-600">Mata Kuliah</span>
                                </div>
                                <span className="font-bold text-slate-800 text-lg">{profileData.stats.totalCourses}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Users size={18}/></div>
                                    <span className="text-sm font-medium text-slate-600">Mahasiswa Bimbingan</span>
                                </div>
                                <span className="font-bold text-slate-800 text-lg">{profileData.stats.totalStudents}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: TABS AND FORMS */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        {/* Tab Headers */}
                        <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar">
                           <button 
                             onClick={() => setActiveTab("biodata")}
                             className={`px-6 py-4 text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === "biodata" ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-400 hover:text-slate-600'}`}
                           >
                              <Award size={18}/> Informasi Biodata
                           </button>
                           <button 
                             onClick={() => setActiveTab("keamanan")}
                             className={`px-6 py-4 text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === "keamanan" ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-400 hover:text-slate-600'}`}
                           >
                              <Lock size={18}/> Keamanan & Sandi
                           </button>
                        </div>

                        <div className="p-8">
                            {activeTab === "biodata" && (
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                Gelar Akademik
                                            </label>
                                            <input 
                                                type="text" name="academicTitle" value={formData.academicTitle} onChange={handleInputChange}
                                                placeholder="cth: S.Kom., M.T."
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <Phone size={14}/> Nomor WhatsApp
                                            </label>
                                            <input 
                                                type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange}
                                                placeholder="08..."
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <Briefcase size={14}/> Bidang Keahlian
                                            </label>
                                            <input 
                                                type="text" name="expertise" value={formData.expertise} onChange={handleInputChange}
                                                placeholder="cth: Data Science, Networking"
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <Calendar size={14}/> Jenis Kelamin
                                            </label>
                                            <select 
                                                name="gender" value={formData.gender} onChange={handleInputChange}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            >
                                                <option value="">Pilih</option>
                                                <option value="LAKI-LAKI">Laki-Laki</option>
                                                <option value="PEREMPUAN">Perempuan</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                Tempat Lahir
                                            </label>
                                            <input 
                                                type="text" name="birthPlace" value={formData.birthPlace} onChange={handleInputChange}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                Tanggal Lahir
                                            </label>
                                            <input 
                                                type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <MapPin size={14}/> Alamat Lengkap
                                        </label>
                                        <textarea 
                                            name="address" value={formData.address} onChange={handleInputChange} rows="3"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <Camera size={14}/> Foto Profil (URL Link)
                                        </label>
                                        <input 
                                            type="text" name="profilePictureUrl" value={formData.profilePictureUrl} onChange={handleInputChange}
                                            placeholder="https://images.unsplash.com/photo-..."
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                        <p className="text-[10px] text-slate-400 italic">Gunakan link gambar eksternal yang valid untuk mengganti foto.</p>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button 
                                            type="submit" 
                                            disabled={saving}
                                            className="bg-primary hover:bg-[#2c6b5a] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-primary/20 disabled:opacity-50"
                                        >
                                            {saving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
                                            Simpan Perubahan
                                        </button>
                                    </div>
                                </form>
                            )}

                            {activeTab === "keamanan" && (
                                <form onSubmit={handleUpdatePassword} className="max-w-md space-y-6">
                                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-3">
                                        <Lock className="text-orange-500 mt-1 flex-shrink-0" size={18}/>
                                        <p className="text-xs text-orange-700 leading-relaxed">
                                            Pastikan password Anda terdiri dari minimal 6 karakter kombinasi huruf dan angka agar tetap aman.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Password Saat Ini</label>
                                        <input 
                                            type="password" 
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                            required
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Password Baru</label>
                                        <input 
                                            type="password" 
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                            required
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Konfirmasi Password Baru</label>
                                        <input 
                                            type="password" 
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                            required
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <button 
                                            type="submit" 
                                            disabled={saving}
                                            className="w-full bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-slate-200 disabled:opacity-50"
                                        >
                                            {saving ? <Loader2 className="animate-spin" size={20}/> : <ShieldCheck size={20}/>}
                                            Ganti Password Sekarang
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DosenProfil;
