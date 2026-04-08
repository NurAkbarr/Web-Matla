import React from "react";
import { useLocation } from "react-router-dom";

const PlaceholderPage = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const rawTitle = pathParts[pathParts.length - 1]; // e.g. "program-studi"

  // Convert "program-studi" to "Program Studi"
  const title = rawTitle
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div
      className="container"
      style={{ padding: "8rem 1rem", minHeight: "60vh", textAlign: "center" }}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-600 text-lg">
        Halaman ini sedang dalam tahap pengembangan (Coming Soon).
      </p>

      <style>{`
        .text-3xl { font-size: 2.25rem; line-height: 2.5rem; }
        .font-bold { font-weight: 700; }
        .text-gray-800 { color: #1f2937; }
        .mb-4 { margin-bottom: 1rem; }
        .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
        .text-gray-600 { color: #4b5563; }
      `}</style>
    </div>
  );
};

export default PlaceholderPage;
