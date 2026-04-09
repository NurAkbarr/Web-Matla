import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import Toast from "../../components/Toast";
import API_BASE_URL from "../../utils/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    konfirmasi: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.konfirmasi) {
      showToast("Password dan konfirmasi tidak cocok!", "error");
      return;
    }
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        {
          name: formData.nama,
          email: formData.email,
          password: formData.password,
        },
      );

      showToast(
        response.data.message || "Registrasi berhasil! Silakan login.",
        "success",
      );
      setTimeout(() => {
        navigate("/login");
      }, 1500); // Wait a bit so user can read the success toast
    } catch (error) {
      // Extract error message from backend if available
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat registrasi. Silakan coba lagi.";
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="register-bg-overlay" />

      <div className="register-card">
        {/* Logo */}
        <div className="register-card-logo">
          <Link to="/">
            <img
              src="/assets/logo.png"
              alt="Logo Matla"
              className="register-logo-img"
            />
          </Link>
          <h2 className="register-brand">MATLA</h2>
          <p className="register-brand-sub">Islamic University</p>
        </div>

        {/* Header */}
        <div className="register-card-header">
          <h1 className="register-card-title">Buat Akun Baru 🎓</h1>
          <p className="register-card-subtitle">
            Daftarkan diri Anda untuk memulai perjalanan belajar.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-field">
            <label className="register-label">Nama Lengkap</label>
            <div className="register-input-wrapper">
              <User size={18} className="register-input-icon" />
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                className="register-input"
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label className="register-label">Email</label>
            <div className="register-input-wrapper">
              <Mail size={18} className="register-input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                className="register-input"
                required
              />
            </div>
          </div>

          <div className="register-form-row">
            <div className="register-field">
              <label className="register-label">Password</label>
              <div className="register-input-wrapper">
                <Lock size={18} className="register-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 karakter"
                  className="register-input"
                  required
                />
              </div>
            </div>

            <div className="register-field">
              <label className="register-label">Konfirmasi Password</label>
              <div className="register-input-wrapper">
                <Lock size={18} className="register-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="konfirmasi"
                  value={formData.konfirmasi}
                  onChange={handleChange}
                  placeholder="Ulangi password"
                  className="register-input"
                  required
                />
                <button
                  type="button"
                  className="register-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`register-submit-btn ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="register-spinner" />
            ) : (
              <>
                <UserPlus size={18} /> Daftar
              </>
            )}
          </button>
        </form>

        <div className="register-divider">
          <span>atau</span>
        </div>

        <p className="register-login-text">
          Sudah punya akun?{" "}
          <Link to="/login" className="register-login-link">
            Masuk
          </Link>
        </p>

        <p className="register-footer">
          © {new Date().getFullYear()} Matla Islamic University
        </p>
      </div>

      <style>{`
        .register-page {
          height: 100vh;
          height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background-image: url('/assets/bg-web.png');
          background-size: cover;
          background-position: center;
          padding: 1rem;
          overflow: hidden;
        }

        .register-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, rgba(27,65,55,0.85) 0%, rgba(27,65,55,0.7) 50%, rgba(0,0,0,0.4) 100%);
          z-index: 0;
        }

        .register-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 480px;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(16px);
          border-radius: 1.25rem;
          padding: 1.75rem 2.25rem 1.5rem;
          box-shadow: 0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
        }

        .register-card-logo {
          text-align: center;
          margin-bottom: 1rem;
        }

        .register-logo-img {
          height: 40px;
          width: auto;
          margin-bottom: 0.35rem;
        }

        .register-brand {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--color-primary);
          letter-spacing: 2px;
          line-height: 1;
        }

        .register-brand-sub {
          font-size: 0.7rem;
          color: var(--color-text-muted);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .register-card-header {
          text-align: center;
          margin-bottom: 1rem;
        }

        .register-card-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--color-text-main);
          margin-bottom: 0.3rem;
        }

        .register-card-subtitle {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .register-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
        }

        .register-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .register-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-text-main);
        }

        .register-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .register-input-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--color-text-light);
          pointer-events: none;
        }

        .register-input {
          width: 100%;
          padding: 0.65rem 1rem 0.65rem 2.5rem;
          border: 1.5px solid var(--color-secondary);
          border-radius: var(--radius-md);
          background: var(--color-bg-app);
          font-size: 0.9rem;
          font-family: inherit;
          color: var(--color-text-main);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .register-input:focus {
          border-color: var(--color-primary);
          background: white;
          box-shadow: 0 0 0 3px rgba(59,118,104,0.1);
        }

        .register-eye-btn {
          position: absolute;
          right: 0.7rem;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text-light);
          padding: 0.2rem;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .register-eye-btn:hover { color: var(--color-primary); }

        .register-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.7rem;
          background: var(--color-primary);
          color: white;
          font-size: 0.95rem;
          font-weight: 700;
          font-family: inherit;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-top: 0.25rem;
        }
        .register-submit-btn:hover { background: var(--color-primary-hover); }
        .register-submit-btn:active { transform: translateY(1px); }
        .register-submit-btn.loading { pointer-events: none; opacity: 0.8; }

        .register-spinner {
          width: 20px; height: 20px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: regspin 0.7s linear infinite;
        }
        @keyframes regspin { to { transform: rotate(360deg); } }

        .register-divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0.85rem 0;
          color: var(--color-text-light);
          font-size: 0.8rem;
        }
        .register-divider::before,
        .register-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--color-secondary);
        }

        .register-login-text {
          text-align: center;
          font-size: 0.88rem;
          color: var(--color-text-muted);
        }

        .register-login-link {
          color: var(--color-primary);
          font-weight: 600;
          transition: opacity 0.2s;
        }
        .register-login-link:hover { opacity: 0.75; }

        .register-footer {
          text-align: center;
          font-size: 0.7rem;
          color: var(--color-text-light);
          margin-top: 1rem;
        }

        @media (max-width: 540px) {
          .register-card {
            padding: 1.5rem 1.25rem 1.25rem;
          }
          .register-form-row {
            grid-template-columns: 1fr;
          }
          .register-card-title { font-size: 1.2rem; }
          .register-logo-img { height: 32px; }
          .register-brand { font-size: 1.1rem; }
        }
      `}</style>
    </div>
  );
};

export default Register;
