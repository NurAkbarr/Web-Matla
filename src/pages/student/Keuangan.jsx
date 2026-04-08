const Keuangan = () => {
  return (
    <div className="std-page">
      <div className="std-header-simple">
        <h1 className="std-page-title">Keuangan</h1>
        <p className="std-page-subtitle">Status pembayaran UKT/SPP</p>
      </div>

      <div className="std-finance-card glass-card success-gradient">
        <p className="std-finance-label">Status Semester Genap 2023/2024</p>
        <h2 className="std-finance-status">LUNAS</h2>
        <p className="std-finance-desc">
          Terima kasih, pembayaran Anda telah diverifikasi.
        </p>
      </div>

      <h3 className="std-section-title" style={{ marginTop: "2rem" }}>
        Riwayat Pembayaran
      </h3>
      <div className="std-history-list">
        <div className="std-history-item glass-card">
          <div>
            <h4>UKT Semester Genap 2023/2024</h4>
            <p>12 Jan 2024 • Bank BSI</p>
          </div>
          <div className="std-history-amount">
            <span className="amount">Rp 4.500.000</span>
            <span className="status success">Berhasil</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Keuangan;
