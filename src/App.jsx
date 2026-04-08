import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/admin/AdminLayout";
import Home from "./pages/public/Home";
import PMB from "./pages/public/PMB";
import PmbRegister from "./pages/public/PmbRegister";
import Kontak from "./pages/public/Kontak";
import PlaceholderPage from "./pages/public/informasi/PlaceholderPage";
import ProgramStudi from "./pages/public/informasi/ProgramStudi";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PMBData from "./pages/admin/PMBData";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import ProdiData from "./pages/admin/ProdiData";
import PmbSettings from "./pages/admin/PmbSettings";
import TrackingStatus from "./pages/public/TrackingStatus";
import AdminMahasiswa from "./pages/admin/AdminMahasiswa";
import AdminPengumuman from "./pages/admin/AdminPengumuman";
import AdminJadwal from "./pages/admin/AdminJadwal";
import AdminDosen from "./pages/admin/AdminDosen";

// Auth Protections
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Student Pages
import StudentLayout from "./layouts/StudentLayout";
import DashboardHome from "./pages/student/DashboardHome";
import Akademik from "./pages/student/Akademik";
import Jadwal from "./pages/student/Jadwal";
import Keuangan from "./pages/student/Keuangan";
import Profil from "./pages/student/Profil";
import TranskripNilai from "./pages/student/TranskripNilai";

// Dosen Pages
import DosenLayout from "./layouts/DosenLayout";
import DosenDashboard from "./pages/dosen/DosenDashboard";
import DosenJadwal from "./pages/dosen/DosenJadwal";
import DosenInputNilai from "./pages/dosen/DosenInputNilai";
import DosenProfil from "./pages/dosen/DosenProfil";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pmb" element={<PMB />} />
          <Route path="/pmb/register" element={<PmbRegister />} />
          <Route path="/pmb/track" element={<TrackingStatus />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/informasi/program-studi" element={<ProgramStudi />} />
          <Route path="/informasi/:slug" element={<PlaceholderPage />} />
        </Route>

        {/* Auth Routes (no Navbar/Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Dashboard Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="akademik" element={<Akademik />} />
          <Route path="jadwal" element={<Jadwal />} />
          <Route path="keuangan" element={<Keuangan />} />
          <Route path="transkrip" element={<TranskripNilai />} />
          <Route path="profil" element={<Profil />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="pmb" element={<PMBData />} />
          <Route path="prodi" element={<ProdiData />} />
          <Route path="pmb-settings" element={<PmbSettings />} />
          <Route path="mahasiswa" element={<AdminMahasiswa />} />
          <Route path="dosen" element={<AdminDosen />} />
          <Route path="pengumuman" element={<AdminPengumuman />} />
          <Route path="jadwal" element={<AdminJadwal />} />
        </Route>

        {/* Dosen Routes */}
        <Route
          path="/dosen"
          element={
            <ProtectedRoute allowedRoles={["DOSEN"]}>
              <DosenLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DosenDashboard />} />
          <Route path="jadwal" element={<DosenJadwal />} />
          <Route path="nilai" element={<DosenInputNilai />} />
          <Route path="profil" element={<DosenProfil />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
