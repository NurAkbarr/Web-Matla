import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="container footer-content grid">
        <div className="footer-brand">
          <div className="flex items-center gap-2 mb-4">
            <img src="/assets/logo.png" alt="Matla Logo" className="logo-img" />
            <span className="logo-text">MATLA</span>
          </div>
          <p className="font-semibold mb-2">
            Matla Islamic University - Kampus Islam Online
          </p>
          <p className="text-muted text-sm mb-1">
            Jl. Conspet No. 123, Kota Santri, Indonesia.
          </p>
          <p className="text-muted text-sm mb-1">info@matla-university.ac.id</p>
          <p className="text-muted text-sm">+62 123 4567 890</p>
        </div>

        <div className="footer-links">
          <h4 className="font-semibold mb-4">Menu</h4>
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                to="/tentang"
                className="text-muted hover:text-primary transition-colors"
              >
                Tentang
              </Link>
            </li>
            <li>
              <Link
                to="/program"
                className="text-muted hover:text-primary transition-colors"
              >
                Program
              </Link>
            </li>
            <li>
              <Link
                to="/informasi"
                className="text-muted hover:text-primary transition-colors"
              >
                Informasi
              </Link>
            </li>
            <li>
              <Link
                to="/kontak"
                className="text-muted hover:text-primary transition-colors"
              >
                Kontak
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-socials">
          <h4 className="font-semibold mb-4">Ikuti Kami</h4>
          <ul className="flex flex-col gap-3">
            <li>
              <a
                href="#"
                className="flex items-center gap-2 text-muted hover:text-primary transition-colors"
              >
                <Facebook size={18} /> Faceedook
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2 text-muted hover:text-primary transition-colors"
              >
                <Twitter size={18} /> Twitter
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2 text-muted hover:text-primary transition-colors"
              >
                <Instagram size={18} /> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="text-center text-sm text-muted">
          © {new Date().getFullYear()} Matla. All rights reserved.
        </p>
      </div>

      <style>{`
                .footer-container {
                    background-color: var(--color-bg-white);
                    border-top: 1px solid var(--color-secondary); /* Added separator line */
                    box-shadow: 0 -1px 2px 0 rgba(0, 0, 0, 0.05);
                    padding-top: 4rem;
                }
                .grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr;
                    gap: 2rem;
                    margin-bottom: 3rem;
                }
                .logo-img { height: 32px; width: auto; }
                .logo-text { font-size: 1.25rem; font-weight: 600; color: var(--color-primary); letter-spacing: 1px;}
                .text-muted { color: var(--color-text-muted); }
                .hover\\:text-primary:hover { color: var(--color-primary); }
                
                .footer-bottom {
                    border-top: 1px solid var(--color-secondary);
                    padding: 1.5rem 0;
                    background-color: var(--color-bg-app);
                }

                @media (max-width: 768px) {
                    .grid { grid-template-columns: 1fr; }
                }
            `}</style>
    </footer>
  );
};

export default Footer;
