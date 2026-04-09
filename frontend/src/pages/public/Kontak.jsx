import { useState } from "react";
import Toast from "../../components/Toast";
import {
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Send,
  Clock,
  User,
  AtSign,
  FileText,
} from "lucide-react";

const Kontak = () => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    subjek: "",
    pesan: "",
  });
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setToast({
      message:
        "Pesan Anda telah terkirim! Terima kasih telah menghubungi kami.",
      type: "success",
    });
    setFormData({ nama: "", email: "", subjek: "", pesan: "" });
  };

  const contactInfo = [
    {
      icon: <MapPin size={24} />,
      label: "Alamat",
      value: "Jl. Conspet No. 123, Kota Tangerang, Banten, Indonesia",
      color: "#3b7668",
    },
    {
      icon: <Mail size={24} />,
      label: "Email",
      value: "info@matla-university.ac.id",
      href: "mailto:info@matla-university.ac.id",
      color: "#e58f3b",
    },
    {
      icon: <Phone size={24} />,
      label: "Telepon",
      value: "+62 123 4567 890",
      href: "tel:+62123456789",
      color: "#5b8dd9",
    },
    {
      icon: <MessageCircle size={24} />,
      label: "WhatsApp",
      value: "+62 812 3456 7890",
      href: "https://wa.me/628123456789",
      color: "#25d366",
    },
  ];

  return (
    <div className="kontak-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* Hero */}
      <section className="kontak-hero">
        <div className="kontak-hero-overlay" />
        <div className="container kontak-hero-content">
          <h1 className="kontak-hero-title">Hubungi Kami</h1>
          <p className="kontak-hero-desc">
            Punya pertanyaan atau butuh informasi lebih lanjut? Jangan ragu
            untuk menghubungi kami melalui formulir di bawah atau kontak
            langsung.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="kontak-info-section">
        <div className="container">
          <div className="kontak-info-grid">
            {contactInfo.map((item, idx) => (
              <div className="kontak-info-card" key={idx}>
                <div
                  className="kontak-info-icon"
                  style={{
                    backgroundColor: `${item.color}15`,
                    color: item.color,
                  }}
                >
                  {item.icon}
                </div>
                <h3 className="kontak-info-label">{item.label}</h3>
                {item.href ? (
                  <a
                    href={item.href}
                    className="kontak-info-value kontak-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="kontak-info-value">{item.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="kontak-main-section">
        <div className="container kontak-main-grid">
          {/* Form */}
          <div className="kontak-form-wrapper">
            <div className="kontak-form-header">
              <h2 className="kontak-form-title">Kirim Pesan</h2>
              <p className="kontak-form-subtitle">
                Isi formulir di bawah ini dan kami akan segera merespon pesan
                Anda.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="kontak-form">
              <div className="kontak-form-row">
                <div className="kontak-form-group">
                  <label className="kontak-label">
                    <User size={14} /> Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    placeholder="Masukkan nama Anda"
                    className="kontak-input"
                    required
                  />
                </div>
                <div className="kontak-form-group">
                  <label className="kontak-label">
                    <AtSign size={14} /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Masukkan email Anda"
                    className="kontak-input"
                    required
                  />
                </div>
              </div>

              <div className="kontak-form-group">
                <label className="kontak-label">
                  <FileText size={14} /> Subjek
                </label>
                <input
                  type="text"
                  name="subjek"
                  value={formData.subjek}
                  onChange={handleChange}
                  placeholder="Tentang apa pesan Anda?"
                  className="kontak-input"
                  required
                />
              </div>

              <div className="kontak-form-group">
                <label className="kontak-label">
                  <MessageCircle size={14} /> Pesan
                </label>
                <textarea
                  name="pesan"
                  value={formData.pesan}
                  onChange={handleChange}
                  placeholder="Tulis pesan Anda di sini..."
                  className="kontak-input kontak-textarea"
                  rows="5"
                  required
                />
              </div>

              <button type="submit" className="kontak-submit-btn">
                <Send size={18} /> Kirim Pesan
              </button>
            </form>
          </div>

          {/* Map / Sidebar */}
          <div className="kontak-sidebar">
            <div className="kontak-map-wrapper">
              <div className="kontak-map-placeholder">
                <MapPin size={48} className="map-pin-icon" />
                <p>Peta Lokasi Kampus</p>
                <span>Tangerang, Banten</span>
              </div>
            </div>

            <div className="kontak-hours-card">
              <div className="kontak-hours-header">
                <Clock size={20} />
                <h3>Jam Operasional</h3>
              </div>
              <ul className="kontak-hours-list">
                <li>
                  <span>Senin – Jumat</span>
                  <strong>08.00 – 16.00 WIB</strong>
                </li>
                <li>
                  <span>Sabtu</span>
                  <strong>09.00 – 12.00 WIB</strong>
                </li>
                <li>
                  <span>Minggu & Hari Libur</span>
                  <strong>Tutup</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .kontak-page { width: 100%; }

        /* ---- HERO ---- */
        .kontak-hero {
          position: relative;
          min-height: 45vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: url('/assets/bg-web.png');
          background-size: cover;
          background-position: center;
          text-align: center;
        }

        .kontak-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(27,65,55,0.9) 0%, rgba(27,65,55,0.7) 100%);
        }

        .kontak-hero-content {
          position: relative;
          z-index: 2;
          color: white;
          padding: 4rem 1rem;
        }

        .kontak-hero-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          margin-bottom: 1rem;
          color: white;
        }

        .kontak-hero-desc {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.85);
          max-width: 550px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* ---- INFO CARDS ---- */
        .kontak-info-section {
          padding: 4rem 0 2rem;
          background: var(--color-bg-app);
          margin-top: -3rem;
          position: relative;
          z-index: 3;
        }

        .kontak-info-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .kontak-info-card {
          background: white;
          border-radius: var(--radius-xl);
          padding: 2rem 1.5rem;
          text-align: center;
          border: 1px solid var(--color-secondary);
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .kontak-info-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }

        .kontak-info-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .kontak-info-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .kontak-info-value {
          font-size: 0.95rem;
          color: var(--color-text-main);
          line-height: 1.5;
        }

        .kontak-link {
          color: var(--color-primary);
          font-weight: 500;
          transition: opacity 0.2s;
        }

        .kontak-link:hover { opacity: 0.75; }

        /* ---- FORM + MAP ---- */
        .kontak-main-section {
          padding: 4rem 0 6rem;
          background: var(--color-bg-app);
        }

        .kontak-main-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 2.5rem;
          align-items: start;
        }

        .kontak-form-wrapper {
          background: white;
          border-radius: var(--radius-xl);
          padding: 2.5rem;
          border: 1px solid var(--color-secondary);
          box-shadow: var(--shadow-sm);
        }

        .kontak-form-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--color-text-main);
          margin-bottom: 0.5rem;
        }

        .kontak-form-subtitle {
          font-size: 0.95rem;
          color: var(--color-text-muted);
          margin-bottom: 2rem;
        }

        .kontak-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .kontak-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .kontak-form-group {
          display: flex;
          flex-direction: column;
        }

        .kontak-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-main);
          margin-bottom: 0.5rem;
        }

        .kontak-input {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1.5px solid var(--color-secondary);
          border-radius: var(--radius-md);
          background: var(--color-bg-app);
          font-size: 0.95rem;
          font-family: inherit;
          color: var(--color-text-main);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .kontak-input:focus {
          border-color: var(--color-primary);
          background: white;
          box-shadow: 0 0 0 3px rgba(59,118,104,0.1);
        }

        .kontak-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .kontak-submit-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          width: 100%;
          padding: 0.9rem;
          background: var(--color-primary);
          color: white;
          font-size: 1rem;
          font-weight: 700;
          font-family: inherit;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }

        .kontak-submit-btn:hover {
          background: var(--color-primary-hover);
        }

        .kontak-submit-btn:active {
          transform: translateY(1px);
        }

        /* ---- SIDEBAR (MAP + HOURS) ---- */
        .kontak-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .kontak-map-wrapper {
          border-radius: var(--radius-xl);
          overflow: hidden;
          border: 1px solid var(--color-secondary);
          box-shadow: var(--shadow-sm);
        }

        .kontak-map-placeholder {
          width: 100%;
          height: 280px;
          background: linear-gradient(135deg, #e8f5ed 0%, #d4ecde 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .map-pin-icon {
          color: var(--color-primary);
          opacity: 0.6;
        }

        .kontak-map-placeholder p {
          font-weight: 600;
          color: var(--color-text-main);
          font-size: 1rem;
        }

        .kontak-map-placeholder span {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .kontak-hours-card {
          background: white;
          border-radius: var(--radius-xl);
          padding: 1.75rem;
          border: 1px solid var(--color-secondary);
          box-shadow: var(--shadow-sm);
        }

        .kontak-hours-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-text-main);
          margin-bottom: 1.25rem;
        }

        .kontak-hours-header svg { color: var(--color-primary); }

        .kontak-hours-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .kontak-hours-list li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--color-secondary);
        }

        .kontak-hours-list li:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .kontak-hours-list li span { color: var(--color-text-muted); }
        .kontak-hours-list li strong { color: var(--color-text-main); font-weight: 600; }

        /* ---- RESPONSIVE ---- */
        @media (max-width: 992px) {
          .kontak-info-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .kontak-main-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .kontak-info-grid {
            grid-template-columns: 1fr;
          }
          .kontak-form-row {
            grid-template-columns: 1fr;
          }
          .kontak-info-section {
            margin-top: -2rem;
          }
          .kontak-hero-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Kontak;
