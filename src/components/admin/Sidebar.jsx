import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  BookOpen,
  X,
  CreditCard,
} from "lucide-react";
import { useState } from "react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("matla_token");
    localStorage.removeItem("matla_user");
    navigate("/login", { replace: true });
  };
  const [pmbOpen, setPmbOpen] = useState(true);
  const [akademikOpen, setAkademikOpen] = useState(false);
  const [kontenOpen, setKontenOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path
      ? "sidebar-menu-item active"
      : "sidebar-menu-item";
  };

  const isSubActive = (path) => location.pathname === path;

  return (
    <>
      <aside
        className={`sidebar-container ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} flex flex-col h-screen overflow-y-auto fixed lg:sticky top-0 left-0 z-30 transition-transform duration-300 ease-in-out`}
      >
        <div className="sidebar-brand flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Matla" className="h-8 w-auto" />
            <span
              className="text-xl font-bold tracking-wide"
              style={{ color: "#2b3a41" }}
            >
              MATLA
            </span>
          </Link>

          <button
            className="lg:hidden p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav flex-1 py-4 px-3 overflow-y-auto custom-scrollbar">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Sistem Utama
          </p>
          <ul className="flex flex-col gap-1 mb-8">
            <li>
              <Link to="/admin" className={isActive("/admin")}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            </li>

            <li>
              <Link to="/admin/users" className={isActive("/admin/users")}>
                <Users size={18} /> Manajemen User
              </Link>
            </li>

            {/* PMB Section */}
            <li>
              <button
                className={`sidebar-menu-btn ${pmbOpen ? "open" : ""}`}
                onClick={() => setPmbOpen(!pmbOpen)}
              >
                <div className="flex items-center gap-3">
                  <Users size={18} /> PMB
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${pmbOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`sidebar-submenu-wrapper grid transition-[grid-template-rows] duration-200 ease-in-out ${pmbOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <ul className="overflow-hidden border-l border-gray-200 ml-6 pl-1 mt-1 mb-2 flex flex-col gap-1">
                  <li>
                    <Link
                      to="/admin/pmb"
                      className={`sidebar-submenu-item ${isSubActive("/admin/pmb") ? "text-primary font-bold bg-primary/5 rounded-r-md border-l-2 border-primary -ml-[5px]" : ""}`}
                    >
                      Data Pendaftar
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/pmb-settings"
                      className={`sidebar-submenu-item ${isSubActive("/admin/pmb-settings") ? "text-primary font-bold bg-primary/5 rounded-r-md border-l-2 border-primary -ml-[5px]" : ""}`}
                    >
                      Pengaturan Gelombang
                    </Link>
                  </li>
                </ul>
              </div>
            </li>



            {/* Akademik Section */}
            <li>
              <button
                className={`sidebar-menu-btn ${akademikOpen ? "open" : ""}`}
                onClick={() => setAkademikOpen(!akademikOpen)}
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={18} /> Akademik
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${akademikOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`sidebar-submenu-wrapper grid transition-[grid-template-rows] duration-200 ease-in-out ${akademikOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <ul className="overflow-hidden border-l border-gray-200 ml-6 pl-1 mt-1 mb-2 flex flex-col gap-1">
                  <li>
                    <Link
                      to="/admin/mahasiswa"
                      className={`sidebar-submenu-item ${isSubActive("/admin/mahasiswa") ? "text-primary font-bold bg-primary/5 rounded-r-md border-l-2 border-primary -ml-[5px]" : ""}`}
                    >
                      Mahasiswa Aktif
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/dosen"
                      className={`sidebar-submenu-item ${isSubActive("/admin/dosen") ? "text-primary font-bold bg-primary/5 rounded-r-md border-l-2 border-primary -ml-[5px]" : ""}`}
                    >
                      Data Dosen
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/jadwal"
                      className={`sidebar-submenu-item ${isSubActive("/admin/jadwal") ? "text-primary font-bold bg-primary/5 rounded-r-md border-l-2 border-primary -ml-[5px]" : ""}`}
                    >
                      Jadwal Perkuliahan
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/prodi"
                      className={`sidebar-submenu-item ${isSubActive("/admin/prodi") ? "text-primary font-bold bg-primary/5 rounded-r-md border-l-2 border-primary -ml-[5px]" : ""}`}
                    >
                      Program Studi
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>

          <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Manajemen Konten
          </p>
          <ul className="flex flex-col gap-1">
            {/* Konten Section */}
            <li>
              <button
                className={`sidebar-menu-btn ${kontenOpen ? "open" : ""}`}
                onClick={() => setKontenOpen(!kontenOpen)}
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} /> Halaman Web
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${kontenOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`sidebar-submenu-wrapper grid transition-[grid-template-rows] duration-200 ease-in-out ${kontenOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <ul className="overflow-hidden border-l border-gray-200 ml-6 pl-1 mt-1 mb-2 flex flex-col gap-1">
                  <li>
                    <Link
                      to="/admin/pengumuman"
                      className={`sidebar-submenu-item ${isSubActive("/admin/pengumuman") ? "text-primary font-bold bg-primary/5 rounded-r-md border-l-2 border-primary -ml-[5px]" : ""}`}
                    >
                      Pengumuman Akademik
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="sidebar-submenu-item">
                      Galeri Kegiatan
                    </a>
                  </li>
                  <li>
                    <a href="#" className="sidebar-submenu-item">
                      Banner & Hero
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer p-4 border-t border-gray-100 bg-white">
          <div className="admin-profile flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
              <span className="text-primary font-bold">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">
                Administrator
              </p>
              <p className="text-xs text-gray-500 truncate">admin@matla.id</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        <style>{`
          .sidebar-container {
            width: 260px;
            background-color: #f8faf9;
            border-right: 1px solid #e5e7eb;
          }
          
          .sidebar-menu-item, .sidebar-menu-btn {
            display: flex;
            align-items: center;
            padding: 0.6rem 1rem;
            color: #4b5563;
            font-weight: 500;
            font-size: 0.9rem;
            text-decoration: none;
            gap: 0.75rem;
            transition: all 0.2s ease;
            width: 100%;
            border: none;
            background: transparent;
            cursor: pointer;
            justify-content: space-between;
            border-radius: 0.375rem;
          }
          
          .sidebar-menu-item:hover, .sidebar-menu-btn:hover {
            color: var(--color-primary);
          }
          
          .sidebar-menu-item.active, .sidebar-menu-btn.open {
            background-color: var(--color-primary);
            color: white;
            box-shadow: 0 4px 6px -1px rgba(59, 118, 104, 0.2);
          }
          
          .sidebar-menu-item.active:hover, .sidebar-menu-btn.open:hover {
            color: white; /* keep white when hovered & active */
          }
          
          .sidebar-submenu-item {
            display: block;
            padding: 0.5rem 1rem 0.5rem 1.25rem;
            color: #6b7280;
            font-size: 0.85rem;
            transition: all 0.2s;
            position: relative;
          }
          
          .sidebar-submenu-item:hover, .sidebar-submenu-item.text-primary.font-semibold {
            color: #1f2937;
            font-weight: 500;
          }

          /* No line before submenu items in mockup */
          /* Custom Scrollbar */
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #e5e7eb;
            border-radius: 20px;
          }
          .sidebar-container:hover .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #d1d5db;
          }
        `}</style>
      </aside>
    </>
  );
};

export default Sidebar;
