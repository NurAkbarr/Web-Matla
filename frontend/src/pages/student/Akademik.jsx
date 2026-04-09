const Akademik = () => {
  return (
    <div className="std-page">
      <div className="std-header-simple">
        <h1 className="std-page-title">Akademik</h1>
        <p className="std-page-subtitle">Informasi nilai dan mata kuliah</p>
      </div>

      <div className="std-empty-state glass-card">
        <img
          src="https://illustrations.popsy.co/amber/student-going-to-school.svg"
          alt="Academic"
          className="std-empty-img"
        />
        <h3>Data Akademik</h3>
        <p>
          Fitur Kartu Hasil Studi (KHS) dan Transkrip Nilai sedang dalam tahap
          pengembangan. Silakan cek kembali nanti.
        </p>
        <button className="std-btn-primary">Download KRS Ganjil 2023</button>
      </div>
    </div>
  );
};

export default Akademik;
