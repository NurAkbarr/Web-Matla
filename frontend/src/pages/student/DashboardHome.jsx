import React, { useState, useEffect } from "react";
import { Bell, BookOpen, Clock, AlertCircle, ChevronRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

import API_BASE_URL from "../../utils/api";

const API_URL = API_BASE_URL;

const DashboardHome = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("matla_token");
      const response = await fetch(`${API_URL}/student/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      } else {
        console.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Hari ini";
    if (diffInDays === 1) return "Kemarin";
    return `${diffInDays} Hari yang lalu`;
  };

  if (loading) {
    return (
      <div className="std-page flex justify-center items-center h-full">
        <p className="text-gray-500">Memuat data dashboard...</p>
      </div>
    );
  }

  if (!data || !data.profile) {
     return (
        <div className="std-page p-6">
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3">
                <AlertCircle />
                <p>Profil mahasiswa belum diatur. Silakan hubungi admin.</p>
            </div>
        </div>
     );
  }

  const { profile, announcements, nextClass } = data;

  return (
    <div className="std-page">
      {/* Header Greeting */}
      <div className="std-header">
        <div>
          <h1 className="std-greeting">Selamat Pagi, {(profile.name || "Sobat Matla").split(' ')[0]}! 👋</h1>
          <p className="std-subtitle">{(profile.programStudi || "Program Studi")} • Semester {profile.semester || "-"}</p>
        </div>
        <div className="std-avatar">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || "User")}&background=3b7668&color=fff&size=100`}
            alt="Profile"
          />
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="std-stats-grid">
        <div className="std-stat-card glass-card">
          <div
            className="std-stat-icon"
            style={{ background: "rgba(59, 118, 104, 0.15)", color: "#3b7668" }}
          >
            <BookOpen size={20} />
          </div>
          <div>
            <p className="std-stat-label">IPK Kumulatif</p>
            <h3 className="std-stat-value">{profile.ipk.toFixed(2)}</h3>
          </div>
        </div>
        <div className="std-stat-card glass-card">
          <div
            className="std-stat-icon"
            style={{ background: "rgba(229, 143, 59, 0.15)", color: "#e58f3b" }}
          >
            <Clock size={20} />
          </div>
          <div>
            <p className="std-stat-label">SKS Ditempuh</p>
            <h3 className="std-stat-value">
              {profile.sksDitempuh}<span className="std-stat-suffix">/{profile.totalSks}</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Upcoming Class Widget */}
      <section className="std-section">
        <div className="std-section-header">
          <h2 className="std-section-title">Kelas Selanjutnya</h2>
          <Link to="/student/jadwal" className="std-see-all">
            Lihat Semua
          </Link>
        </div>

        {nextClass ? (
          <div className="std-next-class glass-card primary-gradient">
            <div className="std-class-time">
              <strong>{nextClass.startTime}</strong>
              <span>{nextClass.endTime}</span>
            </div>
            <div className="std-class-details">
              <h3>{nextClass.courseName}</h3>
              <p>{nextClass.room} • {nextClass.lecturer}</p>
            </div>
            <div className="std-class-status">
              <span className="badge badge-ongoing">{nextClass.statusText}</span>
            </div>
          </div>
        ) : (
          <div className="glass-card p-6 text-center text-gray-500 rounded-2xl border border-gray-100 bg-white">
            <p>Tidak ada kelas selanjutnya untuk hari ini.</p>
          </div>
        )}
      </section>

      {/* Announcements */}
      <section className="std-section">
        <div className="std-section-header">
          <h2 className="std-section-title">Pengumuman Terbaru</h2>
        </div>

        <div className="std-announcement-list">
          {announcements && announcements.length > 0 ? (
            announcements.map((ann) => (
              <div key={ann.id} className="std-announcement-card glass-card">
                <div className={`std-ann-icon ${ann.type}`}>
                  {ann.type === 'warning' ? <AlertCircle size={20} /> : 
                   ann.type === 'success' ? <CheckCircle2 size={20} /> :
                   <Bell size={20} />}
                </div>
                <div className="std-ann-content">
                  <h4>{ann.title}</h4>
                  <p>{ann.content}</p>
                  <span className="std-ann-date">{getTimeAgo(ann.createdAt)}</span>
                </div>
                <ChevronRight size={18} className="std-ann-arrow" />
              </div>
            ))
          ) : (
            <div className="glass-card p-6 text-center text-gray-500 rounded-2xl border border-gray-100 bg-white">
              <p>Belum ada pengumuman terbaru.</p>
            </div>
          )}
        </div>
      </section>

      {/* Spacing for mobile bottom nav */}
      <div className="std-bottom-spacer"></div>
    </div>
  );
};

export default DashboardHome;
