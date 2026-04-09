import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInfoDropdownOpen, setIsInfoDropdownOpen] = useState(false);
  const [isLayananDropdownOpen, setIsLayananDropdownOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  return (
    <header className="navbar-container">
      <div className="container flex justify-between items-center navbar-inner">
        <Link to="/" className="navbar-logo flex items-center gap-2">
          <img src="/assets/logo.png" alt="Matla Logo" className="logo-img" />
          <span className="logo-text">MATLA</span>
        </Link>

        <nav className="navbar-menu">
          <Link to="/" className={isActive("/")}>
            Beranda
          </Link>
          <a href="/#tentang" className="nav-link">
            Tentang
          </a>
          <a href="/#keunggulan" className="nav-link">
            Keunggulan
          </a>
          <div
            className="nav-dropdown-container"
            onMouseEnter={() => setIsInfoDropdownOpen(true)}
            onMouseLeave={() => setIsInfoDropdownOpen(false)}
          >
            <button
              className={`nav-link flex items-center gap-1 ${location.pathname.startsWith("/informasi") ? "active" : ""}`}
            >
              Informasi{" "}
              <ChevronDown
                size={16}
                className={`transition-transform ${isInfoDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Desktop Dropdown Menu */}
            <div
              className={`nav-dropdown-menu ${isInfoDropdownOpen ? "show" : ""}`}
            >
              <Link to="/informasi/program-studi" className="dropdown-item">
                Program Studi
              </Link>
              <Link to="/informasi/karya-mahasiswa" className="dropdown-item">
                Karya Mahasiswa
              </Link>
              <Link to="/informasi/karya-dosen" className="dropdown-item">
                Karya Dosen
              </Link>
              <Link to="/informasi/staf-pengajar" className="dropdown-item">
                Staf Pengajar
              </Link>
              <Link to="/informasi/galeri" className="dropdown-item">
                Galeri
              </Link>
            </div>
          </div>

          <div
            className="nav-dropdown-container"
            onMouseEnter={() => setIsLayananDropdownOpen(true)}
            onMouseLeave={() => setIsLayananDropdownOpen(false)}
          >
            <button
              className="nav-link flex items-center gap-1"
            >
              Layanan{" "}
              <ChevronDown
                size={16}
                className={`transition-transform ${isLayananDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Layanan Desktop Dropdown Menu */}
            <div
              className={`nav-dropdown-menu lay-menu ${isLayananDropdownOpen ? "show" : ""}`}
            >
              <a href="https://ktm.matla.id/ktm/login" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                KTM Digital
              </a>
              <a href="https://bendahara.matla.id/login-form" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                Portal Bendahara
              </a>
            </div>
          </div>

          <Link to="/pmb" className={isActive("/pmb")}>
            PMB
          </Link>
          <Link to="/kontak" className={isActive("/kontak")}>
            Kontak
          </Link>
        </nav>

        <div className="navbar-actions">
          <Link to="/login" className="btn-primary">
            Login
          </Link>
        </div>

        <div className="navbar-hamburger">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="hamburger-btn"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <nav className="mobile-nav">
            <Link
              to="/"
              className={isActive("/")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Beranda
            </Link>
            <a
              href="/#tentang"
              className="nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tentang
            </a>
            <a
              href="/#keunggulan"
              className="nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Keunggulan
            </a>
            {/* Mobile Dropdown Accordion */}
            <div className="mobile-dropdown-container">
              <button
                className="nav-link w-full flex justify-between items-center"
                onClick={() => setIsInfoDropdownOpen(!isInfoDropdownOpen)}
              >
                Informasi
                <ChevronDown
                  size={20}
                  className={`transition-transform ${isInfoDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`mobile-dropdown-menu ${isInfoDropdownOpen ? "show" : ""}`}
              >
                <Link
                  to="/informasi/program-studi"
                  className="mobile-dropdown-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Program Studi
                </Link>
                <Link
                  to="/informasi/karya-mahasiswa"
                  className="mobile-dropdown-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Karya Mahasiswa
                </Link>
                <Link
                  to="/informasi/karya-dosen"
                  className="mobile-dropdown-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Karya Dosen
                </Link>
                <Link
                  to="/informasi/staf-pengajar"
                  className="mobile-dropdown-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Staf Pengajar
                </Link>
                <Link
                  to="/informasi/galeri"
                  className="mobile-dropdown-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Galeri
                </Link>
              </div>
            </div>

            {/* Mobile Layanan Dropdown */}
            <div className="mobile-dropdown-container">
              <button
                className="nav-link w-full flex justify-between items-center"
                onClick={() => setIsLayananDropdownOpen(!isLayananDropdownOpen)}
              >
                Layanan
                <ChevronDown
                  size={20}
                  className={`transition-transform ${isLayananDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`mobile-dropdown-menu ${isLayananDropdownOpen ? "show" : ""}`}
              >
                <a
                  href="https://ktm.matla.id/ktm/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-dropdown-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  KTM Digital
                </a>
                <a
                  href="https://bendahara.matla.id/login-form"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-dropdown-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Portal Bendahara
                </a>
              </div>
            </div>

            <Link
              to="/pmb"
              className={isActive("/pmb")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              PMB
            </Link>
            <Link
              to="/kontak"
              className={isActive("/kontak")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kontak
            </Link>
            <Link
              to="/login"
              className="btn-primary text-center mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
          </nav>
        </div>
      )}

      <style>{`
        .navbar-container {
            background-color: var(--color-bg-white);
            box-shadow: var(--shadow-sm);
            position: sticky;
            top: 0;
            z-index: 50;
        }
        .navbar-inner {
            height: 80px;
        }
        .logo-img {
            height: 40px;
            width: auto;
        }
        .logo-text {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--color-primary);
            letter-spacing: 1px;
        }
        .nav-link {
            color: var(--color-text-main);
            font-weight: 500;
            font-size: 1rem;
            font-family: inherit;
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            transition: color 0.2s ease;
            position: relative;
        }
        .nav-link:hover {
            color: var(--color-primary);
        }
        .nav-link.active {
            color: var(--color-text-main);
        }
        .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            right: 0;
            height: 2px;
            background-color: var(--color-text-main);
            border-radius: 2px;
        }

        /* Desktop Dropdown Styles */
        .nav-dropdown-container {
            position: relative;
            display: flex;
            align-items: center;
            height: 100%; /* ensures hover works properly over the whole navbar height area */
        }
        
        .nav-dropdown-menu {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            background-color: var(--color-bg-white);
            min-width: 220px;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--color-secondary);
            padding: 0.5rem 0;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: none;
            z-index: 100;
        }
        
        .nav-dropdown-menu.show {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
            pointer-events: auto;
        }
        
        .dropdown-item {
            display: block;
            padding: 0.75rem 1.5rem;
            color: var(--color-text-main);
            font-size: 0.95rem;
            transition: all 0.2s ease;
        }
        
        .dropdown-item:hover {
            background-color: var(--color-primary-light);
            color: var(--color-primary);
            padding-left: 1.75rem; /* Little internal shift effect */
        }
        .navbar-menu {
            display: flex;
            align-items: center;
            gap: 2.5rem;
        }
        .navbar-actions {
            display: block;
        }
        .navbar-hamburger {
            display: none;
        }
        .hamburger-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--color-text-main);
            padding: 0.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .mobile-menu-overlay {
            display: none;
            background-color: var(--color-bg-white);
            border-top: 1px solid var(--color-secondary);
            position: absolute;
            width: 100%;
            left: 0;
            box-shadow: var(--shadow-sm);
        }
        .mobile-nav {
            display: flex;
            flex-direction: column;
            padding: 1.5rem;
            gap: 1.5rem;
            max-height: calc(100vh - 80px);
            overflow-y: auto;
        }
        
        /* Mobile Dropdown Styles */
        .mobile-dropdown-container {
            display: flex;
            flex-direction: column;
            width: 100%;
        }
        
        .mobile-dropdown-menu {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-top: 0;
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: all 0.3s ease-in-out;
            padding-left: 1rem;
            border-left: 2px solid var(--color-secondary);
            margin-left: 0.5rem;
        }
        
        .mobile-dropdown-menu.show {
            max-height: 400px; /* Arbitrary large enough value for transition to work */
            opacity: 1;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
        }
        
        .mobile-dropdown-item {
            color: var(--color-text-muted);
            padding: 0.5rem 0;
            display: block;
            font-size: 0.95rem;
            transition: color 0.2s;
        }
        
        .mobile-dropdown-item:hover {
            color: var(--color-primary);
        }

        @media (max-width: 992px) {
            .navbar-menu { gap: 1.5rem; }
        }

        @media (max-width: 768px) {
            .navbar-menu { display: none; }
            .navbar-actions { display: none; }
            .navbar-hamburger { display: block; }
            .mobile-menu-overlay { display: block; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
