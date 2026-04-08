import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ChevronRight,
  ChevronLeft,
  Upload,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Toast from "../../components/Toast";
import API_BASE_URL from "../../utils/api";

const PmbRegister = () => {
  const [step, setStep] = useState(1);
  const [prodis, setProdis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [pmbStatus, setPmbStatus] = useState({ isOpen: true, loading: true });

  // Form State
  const [formData, setFormData] = useState({
    // Aspek 1
    fullName: "",
    infoSource: "",
    nik: "",
    birthPlace: "",
    birthDate: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    employmentStatus: "",
    // Aspek 2
    lastEducation: "",
    schoolName: "",
    graduationYear: "",
    program: "",
    // Aspek 3
    techSkillLevel: "50",
    importanceOpinion: "",
    focusOpinion: "",
    comparisonOpinion: "",
    newSkillInterest: "",
    preferredField: "",
    motivation: "",
    termsAgreed: false,
  });

  const [paymentFile, setPaymentFile] = useState(null);

  // Fetch Program Studi for Dropdown
  useEffect(() => {
    const fetchProdi = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/prodi`);
        const activeProdis = res.data.filter((p) => p.status === "AKTIF");
        setProdis(activeProdis);
      } catch (err) {
        console.error("Gagal memuat prodi", err);
      }
    };

    const checkPmbStatus = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/pmb-settings`);
        setPmbStatus({ isOpen: res.data.isOpen ?? true, loading: false });
      } catch (err) {
        console.error("Gagal memvalidasi status PMB", err);
        setPmbStatus({ isOpen: true, loading: false });
      }
    };

    fetchProdi();
    checkPmbStatus();
  }, []);

  const handleInputChange = (e) => {
    let { name, value, type, checked } = e.target;

    // Strict Input Masking & Filtering
    if (name === "fullName") {
      // Hanya izinkan huruf dan spasi (mencegah XSS basic dan simbol aneh)
      value = value.replace(/[^a-zA-Z\s]/g, "");
    } else if (name === "nik" || name === "phone") {
      // Hanya izinkan angka, mencegah spasi, abjad, & simbol
      value = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setToast({ type: "error", message: "Ukuran file maksimal 5MB." });
        return;
      }
      setPaymentFile(file);
    }
  };

  const nextStep = () => {
    // Basic validation before next
    if (step === 1) {
      if (
        !formData.fullName.trim() ||
        !formData.nik.trim() ||
        !formData.phone.trim() ||
        !formData.gender ||
        !formData.employmentStatus
      ) {
        setToast({
          type: "error",
          message: "Mohon lengkapi Data Pribadi yang wajib (*) diisi.",
        });
        return;
      }
      if (!/^[a-zA-Z\s]+$/.test(formData.fullName.trim())) {
        setToast({
          type: "error",
          message: "Nama lengkap hanya boleh berisi huruf.",
        });
        return;
      }
      if (!/^\d{16}$/.test(formData.nik.trim())) {
        setToast({
          type: "error",
          message: "NIK harus berisi 16 digit angka tanpa spasi.",
        });
        return;
      }
      if (!/^\d+$/.test(formData.phone.trim())) {
        setToast({
          type: "error",
          message: "Nomor WhatsApp hanya boleh berisi angka.",
        });
        return;
      }
    }
    if (step === 2) {
      if (
        !formData.lastEducation ||
        !formData.schoolName ||
        !formData.program
      ) {
        setToast({
          type: "error",
          message: "Mohon lengkapi Data Pendidikan sebelum lanjut.",
        });
        return;
      }
    }
    setStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAgreed) {
      setToast({
        type: "error",
        message: "Anda harus menyetujui Syarat dan Ketentuan.",
      });
      return;
    }
    if (!paymentFile) {
      setToast({
        type: "error",
        message: "Bukti transfer (paymentProofUrl) wajib diunggah.",
      });
      return;
    }

    setLoading(true);
    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      payload.append(key, formData[key]);
    });
    payload.append("paymentProofUrl", paymentFile);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/pmb/register`,
        payload,
      );
      setRegistrationData(res.data);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error(error);
      setToast({
        type: "error",
        message: error.response?.data?.message || "Gagal mengirim pendaftaran.",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateWhatsAppLink = () => {
    if (!registrationData) return "#";
    // Nomor bendahara statis sesuai instruksi
    const phoneWa = "6289512345678"; // Ganti dengan nomor bendahara yang asli
    const text = `Assalamu'alaikum,\nSaya ingin mengkonfirmasi pembayaran pendaftaran PMB.\n\nNomor Pendaftaran: *${registrationData.registrationNo}*\nNama: *${formData.fullName}*\nPilihan Prodi: *${formData.program}*\n\nBukti transfer sudah saya upload di sistem PMB. Mohon arahannya untuk bergabung ke grup Mahasiswa Baru. Terima kasih.`;
    return `https://wa.me/${phoneWa}?text=${encodeURIComponent(text)}`;
  };

  if (pmbStatus.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium tracking-wide">
          Memvalidasi Status Pendaftaran...
        </p>
      </div>
    );
  }

  if (!pmbStatus.isOpen) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 pt-24">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 md:p-12 text-center border-t-8 border-red-500">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Pendaftaran Ditutup
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Mohon maaf, pendaftaran mahasiswa baru saat ini sedang tidak dibuka secara online. 
            Silakan kembali lagi nanti atau hubungi admin PMB untuk informasi lebih lanjut.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pmb"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-8 py-3 rounded-xl transition-all"
            >
              Kembali ke Beranda PMB
            </Link>
            <a
              href="https://wa.me/6282124306742"
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              Hubungi Admin via WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 pt-24">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 md:p-12 text-center border-t-8 border-primary">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Pendaftaran Berhasil!
          </h1>
          <p className="text-gray-600 mb-6">
            Alhamdulillah, data pendaftaran Anda telah kami terima.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 text-left">
            <p className="text-sm text-amber-800 font-medium mb-1">
              Nomor Pendaftaran Anda:
            </p>
            <p className="text-3xl font-mono font-bold text-amber-900 tracking-wider mb-4">
              {registrationData?.registrationNo}
            </p>
            <p className="text-sm text-amber-700">
              * Harap simpan nomor pendaftaran ini dengan baik untuk mengecek
              status kelulusan Anda.
            </p>
          </div>

          <p className="text-sm text-gray-600 mb-6 px-4">
            Langkah terakhir, silakan konfirmasi pembayaran Anda ke Bendahara
            PMB via WhatsApp untuk segera diundang masuk ke{" "}
            <b>
              Grup Calon Mahasiswa Baru (
              {registrationData?.gender === "L" ? "Ikhwan" : "Akhwat"})
            </b>
            .
          </p>

          <a
            href={generateWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg w-full md:w-auto"
          >
            Konfirmasi via WhatsApp Sekarang <ChevronRight size={18} />
          </a>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <Link to="/" className="text-primary hover:underline font-medium">
              Batal & Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fcfb] pt-24 pb-16">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Formulir Pendaftaran PMB
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Lengkapi data pendaftaran Anda dengan benar. Proses ini terdiri dari
            3 langkah singkat.
          </p>
        </div>

        {/* Wizard Progress */}
        <div className="mb-10 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>

          <div className="flex justify-between max-w-md mx-auto relative z-10 text-sm font-semibold pmb-reg-stepper">
            <div className="flex flex-col items-center gap-2 pmb-step-item">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors ${step >= 1 ? "bg-primary border-[#d6ebe3] text-white" : "bg-white border-gray-200 text-gray-400"}`}
              >
                1
              </div>
              <span className={step >= 1 ? "text-primary" : "text-gray-400"}>
                Data Pribadi
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors ${step >= 2 ? "bg-primary border-[#d6ebe3] text-white" : "bg-white border-gray-200 text-gray-400"}`}
              >
                2
              </div>
              <span className={step >= 2 ? "text-primary" : "text-gray-400"}>
                Pendidikan
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 pmb-step-item">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors ${step >= 3 ? "bg-primary border-[#d6ebe3] text-white" : "bg-white border-gray-200 text-gray-400"}`}
              >
                3
              </div>
              <span className={step >= 3 ? "text-primary" : "text-gray-400"}>
                Kuesioner & TF
              </span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          <form onSubmit={handleSubmit}>
            {/* STEP 1: Data Pribadi */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">
                  1. Data Pribadi
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      NIK (KTP) *
                    </label>
                    <input
                      type="text"
                      name="nik"
                      value={formData.nik}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="16 Digit NIK"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Tempat Lahir *
                    </label>
                    <input
                      type="text"
                      name="birthPlace"
                      value={formData.birthPlace}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Tanggal Lahir *
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Jenis Kelamin *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="">-- Pilih --</option>
                      <option value="L">Laki-laki (Ikhwan)</option>
                      <option value="P">Perempuan (Akhwat)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Status Pekerjaan Saat Ini *
                    </label>
                    <select
                      name="employmentStatus"
                      value={formData.employmentStatus}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="">-- Pilih --</option>
                      <option value="Pelajar/Mahasiswa">
                        Pelajar/Mahasiswa
                      </option>
                      <option value="Bekerja">Bekerja</option>
                      <option value="Wirausaha">Wirausaha</option>
                      <option value="Belum/Tidak Bekerja">
                        Belum/Tidak Bekerja
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      No. WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="08..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Alamat Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="Email aktif"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Alamat Domisili *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows="2"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    ></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Mendapatkan informasi PMB dari mana?
                    </label>
                    <input
                      type="text"
                      name="infoSource"
                      value={formData.infoSource}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="Contoh: Teman, Instagram, Facebook, Brosur, dll"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Data Pendidikan */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">
                  2. Data Pendidikan
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Pendidikan Terakhir *
                    </label>
                    <select
                      name="lastEducation"
                      value={formData.lastEducation}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="">-- Pilih --</option>
                      <option value="SMA/SMK/MA">SMA / SMK / MA</option>
                      <option value="D1/D2/D3">Diploma (D1/D2/D3)</option>
                      <option value="S1">S1 (Pindahan/Melanjutkan)</option>
                      <option value="Pesantren">Lulusan Pesantren</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Tahun Lulus *
                    </label>
                    <input
                      type="number"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleInputChange}
                      required
                      min="1980"
                      max="2030"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="Misal: 2023"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Nama Asal Sekolah / Kampus *
                    </label>
                    <input
                      type="text"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 mt-4">
                    <div className="bg-primary/5 p-5 rounded-xl border border-primary/20">
                      <label className="block text-lg font-bold text-primary mb-2">
                        Pilihan Program Studi *
                      </label>
                      <select
                        name="program"
                        value={formData.program}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-base"
                      >
                        <option value="">
                          -- Pilih Program Studi Tujuan --
                        </option>
                        {prodis.map((p) => (
                          <option key={p.id} value={p.nama}>
                            {p.jenjang} - {p.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Kuesioner & TF */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">
                  3. Kuesioner & Pembayaran
                </h2>

                <div className="space-y-5">
                  <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100">
                    <label className="block font-semibold text-gray-800 mb-2">
                      1. Skala Skill Teknologi (1-100)
                    </label>
                    <div className="flex gap-4 items-center">
                      <input
                        type="range"
                        name="techSkillLevel"
                        value={formData.techSkillLevel}
                        onChange={handleInputChange}
                        min="1"
                        max="100"
                        className="w-full"
                      />
                      <span className="font-bold text-primary bg-white px-3 py-1 rounded border border-gray-200">
                        {formData.techSkillLevel}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-800 mb-1">
                      2. Seberapa penting Ilmu Syari dan Teknologi bagi kamu,
                      dan apakah keduanya bisa berjalan beriringan?
                    </label>
                    <textarea
                      name="importanceOpinion"
                      value={formData.importanceOpinion}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-800 mb-1">
                      3. Apakah Kamu kuliah hanya ingin fokus belajar ilmu
                      syar'i tanpa ingin tahu perkembangan teknologi?
                    </label>
                    <textarea
                      name="focusOpinion"
                      value={formData.focusOpinion}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-800 mb-1">
                      4. Apa pendapatmu tentang orang yang memiliki dasar ilmu
                      syar'i dan profesional di bidang teknologi dibandingkan
                      dengan yang hanya ilmu syar'i saja di jaman sekarang?
                    </label>
                    <textarea
                      name="comparisonOpinion"
                      value={formData.comparisonOpinion}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-800 mb-1">
                      5. Jika ada satu keahlian baru yang ingin kamu kuasai saat
                      kuliah, apa itu?
                    </label>
                    <input
                      type="text"
                      name="newSkillInterest"
                      value={formData.newSkillInterest}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-800 mb-1">
                      6. Bidang apa yang paling kamu minati? *
                    </label>
                    <select
                      name="preferredField"
                      value={formData.preferredField}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    >
                      <option value="">-- Pilih --</option>
                      <option value="Bahasa">Bahasa</option>
                      <option value="Teknologi">Teknologi</option>
                      <option value="Dakwah">Dakwah</option>
                      <option value="Manajemen">Manajemen & Bisnis</option>
                      <option value="Hukum">Hukum / Syariah</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-800 mb-1">
                      7. Kenapa kamu ingin kuliah di sini?
                    </label>
                    <textarea
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                      required
                    ></textarea>
                  </div>
                </div>

                <hr className="my-6 border-gray-100" />

                <div className="bg-gray-100 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <AlertCircle size={20} className="text-primary" /> Informasi
                    Pembayaran
                  </h3>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 shadow-sm">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                      Transfer Pendaftaran ke Rekening Berikut:
                    </p>
                    <ul className="space-y-3 font-medium text-gray-800">
                      <li className="flex justify-between items-center border-b pb-2">
                        <span>BSI (Bank Syariah Indonesia)</span>
                        <span className="font-mono text-lg font-bold text-primary">
                          4195187780
                        </span>
                      </li>
                      <li className="flex justify-between items-center border-b pb-2">
                        <span>BCA Syari'ah</span>
                        <span className="font-mono text-lg font-bold text-primary">
                          0280041278
                        </span>
                      </li>
                    </ul>
                    <p className="text-sm text-gray-500 mt-3 flex items-center gap-1.5 align-middle">
                      <span>👤 Atas Nama:</span>{" "}
                      <b className="text-gray-700">Heru Fantono</b>
                    </p>
                    <p className="text-xs text-rose-500 mt-2 font-medium bg-rose-50 p-2 rounded">
                      * Biaya pendaftaran sudah termasuk uang pangkal.
                    </p>
                  </div>

                  <label className="block text-sm font-bold text-gray-800 mb-1">
                    Uggah Bukti Transfer *
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={handleFileChange}
                    required
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 outline-none bg-white p-2 rounded-lg border border-gray-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maks 5MB (JPG/PNG/PDF).
                  </p>
                </div>

                <div className="flex items-start gap-3 mt-6 p-4 border border-emerald-100 bg-emerald-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="terms"
                    name="termsAgreed"
                    checked={formData.termsAgreed}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-700 cursor-pointer select-none"
                  >
                    Saya menyatakan bahwa data yang saya isi adalah benar. Saya
                    setuju dengan syarat dan ketentuan pendaftaran di Matla
                    Islamic University.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                  <ChevronLeft size={18} /> Kembali
                </button>
              ) : (
                <div></div>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-2.5 bg-primary text-white hover:bg-primary-hover rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  Lanjut <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-md disabled:opacity-70"
                >
                  {loading ? "Memproses..." : "Kirim & Daftar PMB"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <style>{`
        /* ---- RESPONSIVE MOBILE FIXES ---- */
        @media (max-width: 768px) {
          .pmb-reg-stepper {
            flex-direction: row;
            justify-content: space-between;
            padding: 0 10px;
          }
          .pmb-step-item span {
            font-size: 0.75rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default PmbRegister;
