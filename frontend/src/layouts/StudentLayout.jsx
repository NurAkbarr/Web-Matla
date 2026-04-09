import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  Calendar,
  CreditCard,
  User,
  LogOut,
  Bell,
} from "lucide-react";
import "../index.css"; // Ensure styles are loaded

const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("matla_token");
    localStorage.removeItem("matla_user");
    navigate("/login", { replace: true });
  };

  const navItems = [
    { path: "/student", icon: Home, label: "Beranda" },
    { path: "/student/akademik", icon: BookOpen, label: "Akademik" },
    { path: "/student/jadwal", icon: Calendar, label: "Jadwal" },
    { path: "/student/keuangan", icon: CreditCard, label: "Keuangan" },
    { path: "/student/transkrip", icon: BookOpen, label: "Transkrip" },
    { path: "/student/profil", icon: User, label: "Profil" },
  ];

  return (
    <div className="student-dashboard">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="student-sidebar">
        <div className="student-sidebar-header">
          <img
            src="/assets/logo.png"
            alt="Matla Logo"
            className="student-logo"
          />
          <div>
            <h2 className="student-brand">MATLA</h2>
            <p className="student-brand-sub">Student Portal</p>
          </div>
        </div>

        <nav className="student-desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`student-nav-item ${isActive ? "active" : ""}`}
                end={item.path === "/student"}
              >
                <Icon size={20} className="student-nav-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="student-sidebar-footer">
          <button onClick={handleLogout} className="student-logout-btn">
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* --- MOBILE TOP BAR --- */}
      <header className="student-mobile-topbar">
        <div className="student-topbar-left">
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="student-mobile-logo"
          />
          <div>
            <h1 className="student-mobile-title">MATLA</h1>
            <p className="student-mobile-subtitle">Student Portal</p>
          </div>
        </div>
        <button className="student-bell-btn">
          <Bell size={20} />
          <span className="student-bell-badge"></span>
        </button>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="student-main-content">
        <div className="student-content-inner">
          <Outlet />
        </div>
      </main>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <nav className="student-bottom-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`student-bottom-item ${isActive ? "active" : ""}`}
              end={item.path === "/student"}
            >
              <div className="student-bottom-icon-wrapper">
                <Icon size={22} className="student-bottom-icon" />
                {isActive && <div className="student-bottom-indicator" />}
              </div>
              <span className="student-bottom-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default StudentLayout;
