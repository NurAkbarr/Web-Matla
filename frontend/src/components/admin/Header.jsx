import { ChevronDown, Search, Bell, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const location = useLocation();

  // Simple breadcrumb logic
  const getPageTitle = () => {
    if (location.pathname === "/admin") return "Dashboard Utama";
    if (location.pathname.startsWith("/admin/pmb"))
      return "PMB / Data Pendaftar";
    return "Dashboard";
  };

  const pageTitleParts = getPageTitle().split(" / ");

  return (
    <header className="admin-header w-full bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 py-3 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Menu size={22} />
        </button>

        <div className="header-title flex flex-col">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 leading-tight">
            {pageTitleParts[pageTitleParts.length - 1]}
          </h2>
          {pageTitleParts.length > 1 && (
            <div className="breadcrumbs text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
              <span>{pageTitleParts.slice(0, -1).join(" / ")}</span>
            </div>
          )}
        </div>
      </div>

      <div className="header-actions flex items-center gap-3 md:gap-5">
        <div className="search-bar hidden md:flex items-center bg-gray-50/80 hover:bg-gray-100 rounded-full px-4 py-2 border border-gray-100 transition-colors w-56 lg:w-72">
          <Search size={16} className="text-gray-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Cari data..."
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
          />
        </div>

        <button className="relative p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-full transition-all">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

        <div className="user-dropdown flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-gray-100">
          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 overflow-hidden flex items-center justify-center">
            <span className="text-emerald-700 font-bold text-xs">AD</span>
          </div>
          <div className="hidden md:flex flex-col items-start leading-tight">
            <span className="text-sm font-semibold text-gray-700">
              Admin Utama
            </span>
            <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5">
              Super Admin
            </span>
          </div>
          <ChevronDown size={14} className="text-gray-400 ml-1" />
        </div>
      </div>
    </header>
  );
};

export default Header;
