const Profil = () => {
  return (
    <div className="std-page">
      <div className="std-header-simple">
        <h1 className="std-page-title">Profil Mahasiswa</h1>
      </div>

      <div className="std-profile-card glass-card">
        <div className="std-profile-avatar-large">
          <img
            src="https://ui-avatars.com/api/?name=Akbar+Matla&background=3b7668&color=fff&size=150"
            alt="Profile"
          />
        </div>
        <h2 className="std-profile-name">Akbar Matla</h2>
        <p className="std-profile-nim">NIM: 2021000101</p>

        <div className="std-profile-info-grid">
          <div className="std-profile-info-item">
            <span className="label">Program Studi</span>
            <span className="value">S1 Teknik Informatika</span>
          </div>
          <div className="std-profile-info-item">
            <span className="label">Fakultas</span>
            <span className="value">Fakultas Ilmu Komputer</span>
          </div>
          <div className="std-profile-info-item">
            <span className="label">Email</span>
            <span className="value">akbar@student.matla.ac.id</span>
          </div>
          <div className="std-profile-info-item">
            <span className="label">Status</span>
            <span className="value status-active">Aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
