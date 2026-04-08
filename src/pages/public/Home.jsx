import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Target,
  GraduationCap,
  BookOpen,
  Briefcase,
  Globe,
  HeartHandshake,
  IdCard,
  Receipt,
  ExternalLink
} from "lucide-react";

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container hero-container grid items-center">
          <div className="hero-content">
            <h1 className="hero-title">
              Selamat Datang di{" "}
              <span className="text-primary">Matla Islamic University</span>
            </h1>
            <h2 className="hero-subtitle">
              Kuliah Bahasa Arab & S1 PAI Berbasis Al-Qur’an dan As-Sunnah
            </h2>
            <p className="hero-description">
              Dapatkan gelar S.Pd resmi dengan kurikulum terstruktur, target
              fasih Bahasa Arab dalam 2 tahun melalui penguasaan 500 kosa kata
              per semester, serta pembekalan softskill dan hardskill seperti
              public speaking, programming, desain grafis, dan lainnya.
            </p>

            <div className="hero-actions">
              <Link to="/pmb/register" className="btn-primary">
                Daftar Sekarang
              </Link>
            </div>
          </div>

          <div className="hero-visual hidden md:block">
            {/* The mosque illustration is part of the background, so this side is kept empty or can hold a floating element */}
          </div>
        </div>
      </section>

      {/* Portal Layanan Removed by Request */}

      {/* About Section */}
      <section className="about-section" id="tentang">
        <div className="container about-container">
          <div className="about-content">
            <h2 className="section-title">Tentang Matla Islamic University</h2>
            <p className="about-description">
              Matla Islamic University adalah Kampus Islam Online terdepan yang
              menyediakan program kuliah Bahasa Arab dan S1 Pendidikan Agama
              Islam yang fleksibel dan mudah diakses
            </p>

            <ul className="feature-list">
              <li className="feature-item">
                <CheckCircle2 className="feature-icon" size={24} />
                <span>
                  Pembelajaran sistematis{" "}
                  <strong>sesuai dengan Kurikulum Islami</strong> yang
                  terintegrasi
                </span>
              </li>
              <li className="feature-item">
                <CheckCircle2 className="feature-icon" size={24} />
                <span>
                  Dosen-dosen <strong>berpengalaman</strong> lulusan Timur
                  Tengah
                </span>
              </li>
              <li className="feature-item">
                <CheckCircle2 className="feature-icon" size={24} />
                <span>
                  Membangun <strong>karakter Islami</strong> dengan pendekatan
                  menyeluruh
                </span>
              </li>
            </ul>
          </div>
          <div className="about-visual hidden md:block">
            {/* Keeping right side empty as the background image handles the visual */}
          </div>
        </div>
      </section>

      {/* Keunggulan Section */}
      <section className="features-section" id="keunggulan">
        <div className="container">
          <div className="features-header text-center mb-12">
            <h2 className="section-title">Apa yang Membuat Matla Berbeda?</h2>
            <p className="section-subtitle">
              Keunggulan program pendidikan kami yang dirancang untuk melahirkan
              generasi tangguh.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-card-icon">
                <Target size={28} />
              </div>
              <h3 className="feature-card-title">
                Target Terukur & Sistematis
              </h3>
              <p className="feature-card-desc">
                Kurikulum disusun bertahap dengan target penguasaan 500 kosa
                kata per semester dan kemampuan membaca kitab dalam 2 tahun.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-card-icon">
                <GraduationCap size={28} />
              </div>
              <h3 className="feature-card-title">Gelar Resmi S1 PAI (S.Pd)</h3>
              <p className="feature-card-desc">
                Lulus dengan gelar akademik resmi S.Pd melalui program S1
                Pendidikan Agama Islam yang terstruktur dan terarah.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-card-icon">
                <BookOpen size={28} />
              </div>
              <h3 className="feature-card-title">
                Berbasis Al-Qur’an dan As-Sunnah
              </h3>
              <p className="feature-card-desc">
                Materi pembelajaran disusun berdasarkan dalil yang shahih dan
                pemahaman yang lurus sesuai tuntunan para ulama.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-card-icon">
                <Briefcase size={28} />
              </div>
              <h3 className="feature-card-title">
                Pembekalan Softskill & Hardskill
              </h3>
              <p className="feature-card-desc">
                Mahasiswa dibekali keahlian era digital: Public Speaking, Data
                Analis, Meta Ads, Programming, Desain, hingga Manajemen &
                Pelatihan Mekanik agar siap kerja dan usaha.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card">
              <div className="feature-card-icon">
                <Globe size={28} />
              </div>
              <h3 className="feature-card-title">Sistem Online Fleksibel</h3>
              <p className="feature-card-desc">
                Bisa diikuti dari mana saja melalui genggaman dengan sistem
                pembelajaran e-learning yang terstruktur.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card">
              <div className="feature-card-icon">
                <HeartHandshake size={28} />
              </div>
              <h3 className="feature-card-title">
                Pembinaan Karakter & Mentoring
              </h3>
              <p className="feature-card-desc">
                Bukan sekadar kuliah, tetapi mahasiswa dibina secara personal
                dalam hal adab, kedisiplinaran, dan kesiapan berkontribusi
                nyata.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
                .home-page {
                    width: 100%;
                }
                
                .hero-section {
                    height: calc(100vh - 80px); /* Strictly one screen minus navbar */
                    background-image: url('/assets/bg-web.png');
                    background-size: cover;
                    background-position: center bottom;
                    background-repeat: no-repeat;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                }

                .hero-container {
                    display: grid;
                    grid-template-columns: 1.2fr 0.8fr;
                    gap: 2rem;
                }

                .hero-title {
                    font-size: 3rem;
                    line-height: 1.2;
                    font-weight: 700;
                    color: var(--color-text-main);
                    margin-bottom: 1rem;
                }

                .hero-subtitle {
                    font-size: 1.5rem;
                    line-height: 1.4;
                    font-weight: 600;
                    color: var(--color-text-main);
                    margin-bottom: 1rem;
                    max-width: 800px;
                }

                .hero-description {
                    font-size: 1.05rem;
                    line-height: 1.6;
                    color: var(--color-text-muted);
                    max-width: 800px;
                }
                
                .hero-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-top: 2rem;
                }
                
                .text-primary { color: var(--color-primary); }
                .text-status-success { color: #5db08d; /* Matches the custom green checkmark */ }

                .btn-accent {
                    background-color: #e58f3b;
                    color: white;
                    border: none;
                    padding: 0.8rem 2rem;
                    border-radius: var(--radius-md);
                    font-weight: 600;
                    font-size: 1rem;
                    transition: transform 0.2s, background-color 0.2s;
                    box-shadow: 0 4px 6px rgba(229, 143, 59, 0.3);
                }
                
                .btn-accent:hover {
                    background-color: #d17c30;
                    transform: translateY(-2px);
                }
                
                .btn-outline {
                    background-color: transparent;
                    color: var(--color-primary);
                    border: 2px solid var(--color-primary);
                    padding: 0.8rem 2rem;
                    border-radius: var(--radius-md);
                    font-weight: 600;
                    font-size: 1rem;
                    transition: all 0.2s ease;
                }
                
                .btn-outline:hover {
                    background-color: var(--color-primary-light);
                }

                /* Responsive adjustments */
                @media (max-width: 992px) {
                    .hero-title { font-size: 2.2rem; }
                    .hero-container { grid-template-columns: 1fr; }
                    .hero-description { max-width: 100%; }
                }

                @media (max-width: 768px) {
                    .hero-section {
                        min-height: auto;
                        padding: 3rem 0;
                        background-position: center;
                    }
                    .hero-title { font-size: 1.8rem; }
                    .cta-title { font-size: 1.6rem; }
                    .hidden { display: none; }
                }

                /* Portal Layanan Section Styles */
                .portal-section {
                    background-color: #f8faf9;
                    border-bottom: 1px solid #edf2f0;
                }

                .portal-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 2rem;
                    max-width: 900px;
                    margin: 0 auto;
                }

                .portal-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
                    border: 1px solid #f3f4f6;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    position: relative;
                    overflow: hidden;
                }

                .portal-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
                    border-color: #e5e7eb;
                }

                .portal-card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    padding: 1.5rem 1.5rem 0;
                }

                .portal-card-content, .portal-card-footer {
                    margin-top: 3.5rem;
                }

                .portal-icon-wrapper {
                    width: 52px;
                    height: 52px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .portal-status {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.8rem;
                    padding: 0.3rem 0.8rem;
                    background: #f0fdf4;
                    color: #166534;
                    border-radius: 20px;
                    border: 1px solid #bbf7d0;
                    margin-top: 5px;
                }

                .status-dot {
                    width: 6px; height: 6px;
                    background-color: #22c55e;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
                    70% { box-shadow: 0 0 0 4px rgba(34, 197, 94, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
                }

                .portal-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 0.5rem;
                }

                .portal-desc {
                    color: #6b7280;
                    line-height: 1.5;
                    font-size: 0.95rem;
                }

                /* Responsive */
                @media (max-width: 992px) {
                    .portal-grid {
                        grid-template-columns: 1fr;
                        max-width: 500px;
                    }
                }

                /* About Section Styles */
                .about-section {
                    padding: 8rem 0;
                    background-color: var(--color-bg-white);
                    background-image: linear-gradient(to right, rgba(255,255,255,1) 40%, rgba(255,255,255,0.2)), url('/assets/bg-web.png');
                    background-size: cover;
                    background-position: right center;
                    position: relative;
                }
                
                .about-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 3rem;
                    align-items: center;
                }
                
                .section-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #2e3e50; /* Darker blue-grey to match the text on mockup */
                    margin-bottom: 1.5rem;
                }
                
                .about-description {
                    font-size: 1.15rem;
                    line-height: 1.7;
                    color: #4a5568; /* Greyish text */
                    margin-bottom: 2rem;
                    max-width: 95%;
                }
                
                .feature-list {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                    margin-bottom: 2.5rem;
                }
                
                
                .feature-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    font-size: 1.1rem;
                    color: var(--color-text-main);
                    line-height: 1.5;
                }
                
                .feature-icon {
                    color: #88c7a1; /* Light green from the new mockup */
                    flex-shrink: 0;
                    margin-top: 0.1rem;
                    background-color: #e8f5ed;
                    border-radius: 50%;
                }
                
                /* Features / Keunggulan Section Styles */
                .features-section {
                    padding: 6rem 0;
                    background-color: var(--color-bg-app); /* Slightly off-white background to separate sections */
                }
                
                .section-subtitle {
                    font-size: 1.1rem;
                    color: var(--color-text-muted);
                    max-width: 600px;
                    margin: 0 auto;
                }
                
                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2rem;
                }
                
                .feature-card {
                    background: var(--color-bg-white);
                    padding: 2.5rem 2rem;
                    border-radius: var(--radius-xl);
                    box-shadow: var(--shadow-sm);
                    border: 1px solid var(--color-secondary);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .feature-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-lg);
                    border-color: var(--color-primary-light);
                }
                
                .feature-card-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 16px;
                    background-color: #e8f5ed;
                    color: var(--color-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                }
                
                .feature-card-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: var(--color-text-main);
                    margin-bottom: 1rem;
                }
                
                .feature-card-desc {
                    font-size: 1rem;
                    color: var(--color-text-muted);
                    line-height: 1.6;
                }
                
                /* Helper classes for text alignment that might be missing in index.css */
                .text-center { text-align: center; }
                .mb-12 { margin-bottom: 3rem; }
                
                @media (max-width: 992px) {
                    .about-container {
                        grid-template-columns: 1fr;
                    }
                    .about-section {
                        background-image: linear-gradient(to right, rgba(255,255,255,1) 60%, rgba(255,255,255,0.7)), url('/assets/bg-web.png');
                    }
                    .about-description {
                        max-width: 100%;
                    }
                    .features-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .section-title {
                        font-size: 2rem;
                    }
                }
                
                @media (max-width: 768px) {
                    .features-grid {
                        display: flex;
                        overflow-x: auto;
                        scroll-snap-type: x mandatory;
                        padding-bottom: 1rem; /* Space for scrollbar */
                        -webkit-overflow-scrolling: touch;
                        /* Hide scrollbar for a cleaner look while maintaining functionality */
                        scrollbar-width: none; 
                    }
                    .features-grid::-webkit-scrollbar {
                        display: none;
                    }
                    .feature-card {
                        min-width: 85vw; /* Almost full width but shows a peek of the next card */
                        scroll-snap-align: center;
                    }
                    .section-title {
                        font-size: 1.6rem;
                    }
                }
            `}</style>
    </div>
  );
};

export default Home;
