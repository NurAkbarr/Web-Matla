import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Clock,
  Download,
  HelpCircle,
  X,
} from "lucide-react";
import axios from "axios";
import CoverflowCarousel from "../../components/CoverflowCarousel";
import API_BASE_URL from "../../utils/api";

// ============================================================
// DATA DINAMIS — Nanti akan diganti dengan data dari API Admin
// ============================================================
const pmbData = {
  tahun: "2025/2026",
  deadlinePendaftaran: new Date("2025-08-31T23:59:59"),
  tagline: "Mulai Perjalanan Ilmu Anda Bersama Kami",
  deskripsi:
    "Daftarkan diri Anda sekarang dan raih gelar S1 PAI resmi dengan kurikulum berbasis Al-Qur'an dan As-Sunnah. Pendaftaran terbatas!",
  brosurUrl: "/assets/bg-web.png", // Sementara pakai background, nanti dari upload admin
  alurPendaftaran: [
    {
      step: 1,
      judul: "Isi Formulir Online",
      deskripsi:
        "Lengkapi formulir pendaftaran secara online dengan data diri yang benar dan valid.",
    },
    {
      step: 2,
      judul: "Pembayaran Administrasi",
      deskripsi:
        "Lakukan pembayaran biaya administrasi pendaftaran ke rekening yang tertera.",
    },
    {
      step: 3,
      judul: "Seleksi & Verifikasi",
      deskripsi:
        "Tim kami akan memverifikasi data dan form Anda dalam waktu 3x24 jam kerja.",
    },
    {
      step: 4,
      judul: "Pengumuman & Diterima",
      deskripsi:
        "Hasil seleksi akan diumumkan melalui email dan WhatsApp yang Anda daftarkan. Selamat bergabung! 🎉",
    },
  ],
  faq: [
    {
      pertanyaan: "Berapa biaya pendaftaran di Matla Islamic University?",
      jawaban:
        "Biaya administrasi pendaftaran sangat terjangkau. Silakan hubungi admin kami melalui WhatsApp untuk informasi detail biaya terkini karena program kami berkembang secara dinamis.",
    },
    {
      pertanyaan: "Apakah kuliah bisa dilakukan sambil bekerja?",
      jawaban:
        "Tentu saja! Sistem pembelajaran kami sepenuhnya online dan fleksibel, sehingga bisa Anda ikuti dari mana saja, kapan saja, sambil tetap bekerja atau menjalani aktivitas sehari-hari.",
    },
    {
      pertanyaan: "Berapa lama durasi studi program S1 PAI?",
      jawaban:
        "Program S1 PAI dirancang untuk dapat diselesaikan dalam waktu 4 tahun (8 semester) dengan kurikulum terstruktur, meskipun terdapat kemungkinan percepatan.",
    },
    {
      pertanyaan: "Gelar apa yang akan saya dapatkan setelah lulus?",
      jawaban:
        "Lulusan program S1 Pendidikan Agama Islam (PAI) akan mendapatkan gelar S.Pd (Sarjana Pendidikan) yang diakui secara resmi.",
    },
    {
      pertanyaan: "Apakah ada program beasiswa?",
      jawaban:
        "Ya, tersedia program beasiswa bagi mahasiswa yang memenuhi kriteria tertentu. hubungi tim admin kami untuk informasi lebih lanjut mengenai syarat dan cara mendaftarkan diri.",
    },
  ],
};

// Komponen countdown timer
const CountdownTimer = ({ deadline }) => {
  const calculateTimeLeft = () => {
    // If deadline is invalid, return zeros
    if (!deadline) {
      return { hari: 0, jam: 0, menit: 0, detik: 0 };
    }

    // Parse the ISO string to a valid Date object
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return { hari: 0, jam: 0, menit: 0, detik: 0 };
    }

    const diff = deadlineDate.getTime() - new Date().getTime();
    if (diff <= 0) return { hari: 0, jam: 0, menit: 0, detik: 0 };
    return {
      hari: Math.floor(diff / (1000 * 60 * 60 * 24)),
      jam: Math.floor((diff / (1000 * 60 * 60)) % 24),
      menit: Math.floor((diff / 1000 / 60) % 60),
      detik: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // Recalculate immediately when deadline changes
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline]);

  const units = [
    { label: "Hari", value: timeLeft.hari },
    { label: "Jam", value: timeLeft.jam },
    { label: "Menit", value: timeLeft.menit },
    { label: "Detik", value: timeLeft.detik },
  ];

  return (
    <div className="countdown-wrapper">
      <p className="countdown-label">
        <Clock size={16} /> Batas Waktu Pendaftaran
      </p>
      <div className="countdown-grid">
        {units.map((u) => (
          <div key={u.label} className="countdown-unit">
            <span className="countdown-value">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="countdown-unit-label">{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Komponen FAQ item
const FaqItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{faq.pertanyaan}</span>
        <ChevronDown
          size={20}
          className={`faq-icon ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div className="faq-answer-container">
        <p className="faq-answer">{faq.jawaban}</p>
      </div>
    </div>
  );
};

const PMB = () => {
  const [dbPmbData, setDbPmbData] = useState({
    tahunAjaran: "2024/2025",
    gelombangAktif: "Gelombang 1",
    deadlinePendaftaran: new Date().toISOString(),
    tagline: pmbData.tagline,
    deskripsi: pmbData.deskripsi,
    brosurUrl: "",
    isOpen: true,
  });
  const [brosurImages, setBrosurImages] = useState([]);

  // Cek apakah file adalah gambar berdasarkan ekstensinya
  const isImage = dbPmbData.brosurUrl?.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/pmb-settings`);
        if (res.data) {
          // Normalize brosurUrl - sometimes multer saves without a leading slash
          let url = res.data.brosurUrl;
          if (url && !url.startsWith("/")) {
            url = "/" + url;
          }

          setDbPmbData({
            ...res.data,
            brosurUrl: url,
          });

          // Parse and set carousel images
          const imgs = Array.isArray(res.data.brosurImages)
            ? res.data.brosurImages
            : [];
          
          // Use API_BASE_URL but remove /api suffix to get base URL for images
          const baseUrl = API_BASE_URL.replace("/api", "");
          
          setBrosurImages(
            imgs.map((u) =>
              u.startsWith("/")
                ? `${baseUrl}${u}`
                : `${baseUrl}/${u}`,
            ),
          );
        }
      } catch (error) {
        console.error("Gagal memuat pengaturan pmb:", error);
      }
    };
    loadSettings();
  }, []);

  // Handle force download via Blob to prevent browser from just opening the image/PDF
  // Handle native download via backend Content-Disposition attachment endpoint
  const handleDownloadBrosur = (url, filename) => {
    try {
      // url example: https://giant-pillows-make.loca.lt/uploads/brosur-123.jpg
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      const actualFilename = pathParts[pathParts.length - 1];
      
      const downloadUrl = `${API_BASE_URL}/pmb-settings/download/${actualFilename}?customName=${filename}`;
      
      // Native browser download redirect
      window.location.href = downloadUrl;
    } catch (error) {
      console.error("Gagal mendownload brosur:", error);
      // Fallback
      window.open(url, "_blank");
    }
  };

  return (
    <div className="pmb-landing">
      {/* ===== HERO SECTION ===== */}
      <section className="pmb-hero">
        <div className="pmb-hero-overlay" />
        <div className="container pmb-hero-content">
          <div className="pmb-hero-badge">
            <FileText size={14} /> PMB {dbPmbData.tahunAjaran} -{" "}
            {dbPmbData.gelombangAktif}
          </div>
          <h1 className="pmb-hero-title">{dbPmbData.tagline}</h1>
          <p className="pmb-hero-desc">{dbPmbData.deskripsi}</p>
          <CountdownTimer deadline={dbPmbData.deadlinePendaftaran} />
          <div className="pmb-hero-actions">
            {dbPmbData.isOpen ? (
              <>
                <Link to="/pmb/register" className="btn-pmb-primary">
                  Daftar Sekarang <ArrowRight size={18} />
                </Link>
                <Link to="/pmb/track" className="btn-pmb-secondary">
                  Cek Status <Clock size={18} />
                </Link>
              </>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 px-6 py-3 rounded-xl text-white font-bold flex items-center gap-2">
                  <X size={20} /> Pendaftaran Sedang Ditutup
                </div>
                <Link to="/pmb/track" className="btn-pmb-secondary">
                  Cek Status Kelulusan <Clock size={18} />
                </Link>
              </div>
            )}
            {dbPmbData.brosurUrl && (
              <button
                onClick={() => handleDownloadBrosur(`${API_BASE_URL.replace("/api", "")}${dbPmbData.brosurUrl}`, `Brosur_PMB_${dbPmbData.tahunAjaran.replace(/\//g, "-")}`)}
                className="btn-pmb-outline"
              >
                <Download size={18} /> Unduh Brosur
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ===== BROSUR SECTION ===== */}
      <section className="brosur-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title-pmb">
              Brosur PMB {dbPmbData.tahunAjaran}
            </h2>
            <p className="section-subtitle-pmb">
              Temukan semua informasi lengkap seputar program pendidikan dan
              fasilitas kami.
            </p>
          </div>

          {/* Coverflow Carousel (multiple images) */}
          {brosurImages.length > 0 ? (
            <div style={{ marginBottom: "2rem" }}>
              <CoverflowCarousel images={brosurImages} autoPlay={4000} />
              {dbPmbData.brosurUrl && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => handleDownloadBrosur(`${API_BASE_URL.replace("/api", "")}${dbPmbData.brosurUrl}`, `Brosur_Utama_PMB_${dbPmbData.tahunAjaran.replace(/\//g, "-")}`)}
                    className="btn-pmb-outline-sm"
                    style={{
                      color: "#1b4137",
                      borderColor: "#1b4137",
                      display: "inline-flex",
                    }}
                  >
                    <Download size={16} /> Unduh Brosur Utama
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="brosur-wrapper">
              {dbPmbData.brosurUrl ? (
                isImage ? (
                  <img
                    src={`${API_BASE_URL.replace("/api", "")}${dbPmbData.brosurUrl}`}
                    alt={`Brosur PMB ${dbPmbData.tahunAjaran}`}
                    className="brosur-image"
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "80vh",
                      objectFit: "contain",
                      display: "block",
                      backgroundColor: "#f8f9fa",
                    }}
                  />
                ) : (
                  <iframe
                    src={`${API_BASE_URL.replace("/api", "")}${dbPmbData.brosurUrl}`}
                    title={`Brosur PMB ${dbPmbData.tahunAjaran}`}
                    className="brosur-image"
                    style={{
                      width: "100%",
                      minHeight: "600px",
                      backgroundColor: "#f1f1f1",
                      border: "none",
                    }}
                  />
                )
              ) : (
                <div
                  style={{
                    minHeight: "300px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#eaeaea",
                  }}
                >
                  <p className="text-gray-500">Brosur belum tersedia.</p>
                </div>
              )}

              {dbPmbData.brosurUrl && (
                <div className="brosur-overlay-info">
                  <span>📄 Brosur Resmi Matla Islamic University</span>
                  <a
                    href={`${API_BASE_URL.replace("/api", "")}${dbPmbData.brosurUrl}`}
                    download
                    className="btn-pmb-outline-sm"
                  >
                    <Download size={16} /> Unduh
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ===== ALUR PENDAFTARAN ===== */}
      <section className="alur-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title-pmb">Alur Pendaftaran</h2>
            <p className="section-subtitle-pmb">
              Proses pendaftaran mudah, cepat, dan bisa dilakukan dari mana
              saja.
            </p>
          </div>
          <div className="alur-timeline">
            {pmbData.alurPendaftaran.map((item, index) => (
              <div key={item.step} className="alur-item">
                <div className="alur-step-indicator">
                  <div className="alur-step-number">{item.step}</div>
                  {index < pmbData.alurPendaftaran.length - 1 && (
                    <div className="alur-connector" />
                  )}
                </div>
                <div className="alur-card">
                  <h3 className="alur-title">{item.judul}</h3>
                  <p className="alur-desc">{item.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="faq-section">
        <div className="container faq-container">
          <div className="section-header text-center mb-faq">
            <HelpCircle size={40} className="faq-header-icon" />
            <h2 className="section-title-pmb">Pertanyaan Umum (FAQ)</h2>
            <p className="section-subtitle-pmb">
              Jawaban atas pertanyaan yang sering ditanyakan calon mahasiswa
              baru.
            </p>
          </div>
          <div className="faq-list">
            {pmbData.faq.map((item, index) => (
              <FaqItem key={index} faq={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="pmb-cta-section" id="daftar">
        <div className="container pmb-cta-container">
          <CheckCircle2 size={52} className="cta-icon-big" />
          <h2 className="pmb-cta-title">Siap Memulai Perjalanan Anda?</h2>
          <p className="pmb-cta-desc">
            Bergabunglah dengan ribuan mahasiswa Matla Islamic University dan
            mulailah perjalanan ilmu Anda sekarang juga.
          </p>
          {dbPmbData.isOpen ? (
            <Link to="/pmb/register" className="btn-pmb-primary btn-lg">
              Isi Formulir Pendaftaran <ArrowRight size={20} />
            </Link>
          ) : (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl text-white font-bold text-lg inline-flex items-center gap-2">
              <Clock size={24} className="text-orange-300" /> Pendaftaran Secara Online Belum Dibuka
            </div>
          )}
          <p className="pmb-cta-note">
            Butuh bantuan?{" "}
            <a
              href="https://wa.me/6212345678"
              target="_blank"
              rel="noreferrer"
              className="cta-wa-link"
            >
              Hubungi kami via WhatsApp
            </a>
          </p>
        </div>
      </section>

      {/* ===== STYLES ===== */}
      <style>{`
        .pmb-landing {
          width: 100%;
        }

        /* ---- HERO ---- */
        .pmb-hero {
          position: relative;
          min-height: 85vh;
          display: flex;
          align-items: center;
          background-image: url('/assets/bg-web.png');
          background-size: cover;
          background-position: center;
          overflow: hidden;
        }

        .pmb-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(27,65,55,0.88) 0%, rgba(27,65,55,0.65) 60%, rgba(0,0,0,0.2) 100%);
        }

        .pmb-hero-content {
          position: relative;
          z-index: 2;
          max-width: 720px;
          color: white;
          padding: 4rem 1rem;
        }

        .pmb-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(8px);
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.35rem 1rem;
          border-radius: 999px;
          margin-bottom: 1.5rem;
          letter-spacing: 0.5px;
        }

        .pmb-hero-title {
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 1.25rem;
          color: white;
        }

        .pmb-hero-desc {
          font-size: 1.1rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.85);
          margin-bottom: 2.5rem;
          max-width: 600px;
        }

        /* ---- COUNTDOWN ---- */
        .countdown-wrapper {
          margin-bottom: 2.5rem;
        }

        .countdown-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: rgba(255,255,255,0.75);
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
        }

        .countdown-grid {
          display: flex;
          gap: 1rem;
        }

        .countdown-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 0.75rem 1.25rem;
          min-width: 72px;
        }

        .countdown-value {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          line-height: 1;
        }

        .countdown-unit-label {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.7);
          font-weight: 500;
          margin-top: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* ---- HERO BUTTONS ---- */
        .pmb-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .btn-pmb-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #e58f3b;
          color: white;
          font-weight: 700;
          font-size: 1rem;
          padding: 0.85rem 2rem;
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(229,143,59,0.4);
        }

        .btn-pmb-primary:hover {
          background: #d17c30;
          transform: translateY(-2px);
        }

        .btn-pmb-primary.btn-lg {
          font-size: 1.1rem;
          padding: 1rem 2.5rem;
        }

        .btn-pmb-outline {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          padding: 0.85rem 1.75rem;
          border-radius: var(--radius-md);
          border: 2px solid rgba(255,255,255,0.6);
          transition: all 0.2s ease;
        }

        .btn-pmb-outline:hover {
          background: rgba(255,255,255,0.15);
          border-color: white;
        }

        .btn-pmb-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          color: var(--color-primary);
          font-weight: 700;
          font-size: 1rem;
          padding: 0.85rem 1.75rem;
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .btn-pmb-secondary:hover {
          background: #f8f9fa;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          color: var(--color-primary-dark);
        }

        /* ---- BROSUR ---- */
        .brosur-section {
          padding: 6rem 0;
          background: var(--color-bg-app);
        }

        .section-header {
          margin-bottom: 3rem;
        }

        .section-title-pmb {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-text-main);
          margin-bottom: 0.75rem;
        }

        .section-subtitle-pmb {
          font-size: 1.05rem;
          color: var(--color-text-muted);
          max-width: 550px;
          margin: 0 auto;
        }

        .brosur-wrapper {
          position: relative;
          max-width: 800px;
          margin: 0 auto;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }

        .brosur-image {
          width: 100%;
          display: block;
          object-fit: contain;
          max-height: 80vh;
        }

        .brosur-overlay-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: white;
          font-size: 0.95rem;
        }

        .btn-pmb-outline-sm {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          border: 1.5px solid white;
          color: white;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: var(--radius-md);
          transition: background 0.2s;
        }

        .btn-pmb-outline-sm:hover {
          background: rgba(255,255,255,0.2);
        }

        /* ---- ALUR ---- */
        .alur-section {
          padding: 6rem 0;
          background: white;
        }

        .alur-timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
          max-width: 700px;
          margin: 0 auto;
        }

        .alur-item {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }

        .alur-step-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }

        .alur-step-number {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--color-primary);
          color: white;
          font-size: 1.1rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(59,118,104,0.35);
          z-index: 1;
        }

        .alur-connector {
          width: 2px;
          flex: 1;
          min-height: 40px;
          background: linear-gradient(to bottom, var(--color-primary), var(--color-primary-light));
          margin: 0.25rem 0;
        }

        .alur-card {
          background: var(--color-bg-app);
          border: 1px solid var(--color-secondary);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          flex: 1;
          margin-bottom: 1.25rem;
          transition: box-shadow 0.2s;
        }

        .alur-card:hover {
          box-shadow: var(--shadow-md);
        }

        .alur-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: 0.5rem;
        }

        .alur-desc {
          font-size: 0.95rem;
          color: var(--color-text-muted);
          line-height: 1.6;
        }

        /* ---- FAQ ---- */
        .faq-section {
          padding: 6rem 0;
          background: var(--color-bg-app);
        }

        .faq-container {
          max-width: 800px;
        }

        .faq-header-icon {
          color: var(--color-primary);
          margin-bottom: 1rem;
        }

        .mb-faq { margin-bottom: 3rem; }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .faq-item {
          background: white;
          border: 1px solid var(--color-secondary);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .faq-item.open {
          border-color: var(--color-primary-light);
          box-shadow: 0 0 0 3px rgba(59,118,104,0.08);
        }

        .faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text-main);
          font-family: inherit;
          transition: color 0.2s;
        }

        .faq-question:hover {
          color: var(--color-primary);
        }

        .faq-icon {
          flex-shrink: 0;
          color: var(--color-primary);
          transition: transform 0.3s ease;
        }

        .faq-icon.rotate-180 {
          transform: rotate(180deg);
        }

        .faq-answer-container {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease;
        }

        .faq-item.open .faq-answer-container {
          max-height: 300px;
        }

        .faq-answer {
          padding: 0 1.5rem 1.25rem;
          font-size: 0.975rem;
          color: var(--color-text-muted);
          line-height: 1.7;
        }

        /* ---- CTA ---- */
        .pmb-cta-section {
          padding: 6rem 0;
          background: linear-gradient(135deg, var(--color-primary) 0%, #2d5a4f 100%);
          text-align: center;
          color: white;
        }

        .pmb-cta-container {
          max-width: 650px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cta-icon-big {
          color: rgba(255,255,255,0.7);
          margin-bottom: 1.5rem;
        }

        .pmb-cta-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1.25rem;
          line-height: 1.2;
        }

        .pmb-cta-desc {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.85);
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }

        .pmb-cta-note {
          margin-top: 1.5rem;
          font-size: 0.95rem;
          color: rgba(255,255,255,0.75);
        }

        .cta-wa-link {
          color: #a6e3c3;
          font-weight: 600;
          text-decoration: underline;
        }

        .cta-wa-link:hover {
          color: white;
        }

        /* ---- RESPONSIVE ---- */
        @media (max-width: 768px) {
          .pmb-hero-content {
            padding: 3rem 1rem;
          }
          .pmb-hero-title {
            font-size: 1.8rem;
          }
          .countdown-grid {
            gap: 0.6rem;
          }
          .countdown-unit {
            padding: 0.6rem 0.85rem;
            min-width: 60px;
          }
          .countdown-value {
            font-size: 1.5rem;
          }
          .pmb-cta-title {
            font-size: 1.6rem;
          }
          .section-title-pmb {
            font-size: 1.6rem;
          }
          .alur-timeline {
            padding: 0 0.5rem;
          }
        }

        /* ---- SHARED UTILITIES ---- */
        .text-center { text-align: center; }
        .transition-transform { transition: transform 0.3s ease; }
      `}</style>
    </div>
  );
};

export default PMB;
