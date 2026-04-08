const Jadwal = () => {
  return (
    <div className="std-page">
      <div className="std-header-simple">
        <h1 className="std-page-title">Jadwal Kuliah</h1>
        <p className="std-page-subtitle">Semester Ganjil 2023/2024</p>
      </div>

      <div className="std-schedule-day">
        <h3 className="std-day-title">Senin</h3>
        <div className="std-next-class glass-card">
          <div className="std-class-time">
            <strong>08:00</strong>
            <span>09:40</span>
          </div>
          <div className="std-class-details">
            <h3>Struktur Data</h3>
            <p>Ruang 204 • Ibu Rina, M.T</p>
          </div>
        </div>
        <div className="std-next-class glass-card">
          <div className="std-class-time">
            <strong>10:00</strong>
            <span>11:40</span>
          </div>
          <div className="std-class-details">
            <h3>Sistem Operasi</h3>
            <p>Ruang Lab Komputer 1 • Bpk. Ahmad, S.Kom</p>
          </div>
        </div>
      </div>

      <div className="std-schedule-day">
        <h3 className="std-day-title">Selasa</h3>
        <div className="std-next-class glass-card">
          <div className="std-class-time">
            <strong>09:00</strong>
            <span>11:30</span>
          </div>
          <div className="std-class-details">
            <h3>Pemrograman Web Lanjut</h3>
            <p>Ruang Lab Komputer 2 • Bpk. Budi Santoso, M.Kom</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jadwal;
