import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import Toast from "../../components/Toast";
import API_BASE_URL from "../../utils/api";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
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
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Bypass-Tunnel-Reminder": "true"
          }
        }
      );

      const { token, user } = response.data;

      // Save to localStorage
      localStorage.setItem("matla_token", token);
      localStorage.setItem("matla_user", JSON.stringify(user));

      showToast("Login berhasil! Mengalihkan...", "success");

      // Role-based redirection
      setTimeout(() => {
        if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
          navigate("/admin");
        } else if (user.role === "DOSEN") {
          navigate("/dosen");
        } else {
          navigate("/student"); // Default for STUDENT
        }
      }, 1000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Koneksi ke server gagal. Silakan coba lagi.";
      showToast(errorMessage, "error");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="login-bg-overlay" />

      {/* Centered Card */}
      <div className="login-card">
        {/* Logo */}
        <div className="login-card-logo">
          <Link to="/">
            <img
              src="/assets/logo.png"
              alt="Logo Matla"
              className="login-logo-img"
            />
          </Link>
          <h2 className="login-brand">MATLA</h2>
          <p className="login-brand-sub">Islamic University</p>
        </div>

        {/* Header */}
        <div className="login-card-header">
          <h1 className="login-card-title">Selamat Datang! 👋</h1>
          <p className="login-card-subtitle">
            Masuk ke akun Anda untuk mengakses dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label">Email</label>
            <div className="login-input-wrapper">
              <Mail size={18} className="login-input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                className="login-input"
                required
              />
            </div>
          </div>

          <div className="login-field">
            <div className="login-label-row">
              <label className="login-label">Password</label>
              <a href="#" className="login-forgot">
                Lupa password?
              </a>
            </div>
            <div className="login-input-wrapper">
              <Lock size={18} className="login-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                className="login-input"
                required
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`login-submit-btn ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="login-spinner" />
            ) : (
              <>
                <LogIn size={18} /> Masuk
              </>
            )}
          </button>
        </form>

        <div className="login-divider">
          <span>atau</span>
        </div>

        <p className="login-register-text">
          Belum punya akun?{" "}
          <Link to="/register" className="login-register-link">
            Daftar Sekarang
          </Link>
        </p>

        <p className="login-footer">
          © {new Date().getFullYear()} Matla Islamic University
        </p>
      </div>

      <style>{`
        .login-page {
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

        .login-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, rgba(27,65,55,0.85) 0%, rgba(27,65,55,0.7) 50%, rgba(0,0,0,0.4) 100%);
          z-index: 0;
        }

        /* ---- CARD ---- */
        .login-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(16px);
          border-radius: 1.25rem;
          padding: 2rem 2.25rem 1.5rem;
          box-shadow: 0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
        }

        /* ---- LOGO ---- */
        .login-card-logo {
          text-align: center;
          margin-bottom: 1.25rem;
        }

        .login-logo-img {
          height: 44px;
          width: auto;
          margin-bottom: 0.5rem;
        }

        .login-brand {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--color-primary);
          letter-spacing: 2px;
          line-height: 1;
        }

        .login-brand-sub {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        /* ---- HEADER ---- */
        .login-card-header {
          text-align: center;
          margin-bottom: 1.25rem;
        }

        .login-card-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--color-text-main);
          margin-bottom: 0.4rem;
        }

        .login-card-subtitle {
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }

        /* ---- FORM ---- */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .login-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text-main);
        }

        .login-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .login-forgot {
          font-size: 0.78rem;
          color: var(--color-primary);
          font-weight: 500;
          transition: opacity 0.2s;
        }
        .login-forgot:hover { opacity: 0.7; }

        .login-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .login-input-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--color-text-light);
          pointer-events: none;
        }

        .login-input {
          width: 100%;
          padding: 0.7rem 1rem 0.7rem 2.6rem;
          border: 1.5px solid var(--color-secondary);
          border-radius: var(--radius-md);
          background: var(--color-bg-app);
          font-size: 0.93rem;
          font-family: inherit;
          color: var(--color-text-main);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .login-input:focus {
          border-color: var(--color-primary);
          background: white;
          box-shadow: 0 0 0 3px rgba(59,118,104,0.1);
        }

        .login-eye-btn {
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
        .login-eye-btn:hover { color: var(--color-primary); }

        /* ---- SUBMIT ---- */
        .login-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
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
        .login-submit-btn:hover { background: var(--color-primary-hover); }
        .login-submit-btn:active { transform: translateY(1px); }
        .login-submit-btn.loading { pointer-events: none; opacity: 0.8; }

        .login-spinner {
          width: 20px; height: 20px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ---- DIVIDER ---- */
        .login-divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 1rem 0;
          color: var(--color-text-light);
          font-size: 0.82rem;
        }
        .login-divider::before,
        .login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--color-secondary);
        }

        .login-register-text {
          text-align: center;
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }

        .login-register-link {
          color: var(--color-primary);
          font-weight: 600;
          transition: opacity 0.2s;
        }
        .login-register-link:hover { opacity: 0.75; }

        .login-footer {
          text-align: center;
          font-size: 0.72rem;
          color: var(--color-text-light);
          margin-top: 1.25rem;
        }

        /* ---- RESPONSIVE ---- */
        @media (max-width: 480px) {
          .login-card {
            padding: 1.5rem 1.25rem 1.25rem;
          }
          .login-card-title {
            font-size: 1.25rem;
          }
          .login-card-logo { margin-bottom: 1rem; }
          .login-card-header { margin-bottom: 1rem; }
          .login-logo-img { height: 36px; }
          .login-brand { font-size: 1.2rem; }
        }
      `}</style>
    </div>
  );
};

export default Login;
