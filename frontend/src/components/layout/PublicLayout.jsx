import { Outlet } from "react-router-dom";
import Navbar from "../public/Navbar";
import Footer from "../public/Footer";
import WhatsAppButton from "../WhatsAppButton";

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default PublicLayout;
