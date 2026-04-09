import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "082124306742";
  const message = "Assalamu'alaikum Warahmatullahi Wabarakatuh, Admin Matla University. Saya ingin bertanya mengenai informasi terkait Universitas. Syukran.";
  
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/^0/, '62')}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[999] group flex items-center gap-3 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300"
      aria-label="Contact us on WhatsApp"
    >
      {/* Tooltip Label */}
      <span className="hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 bg-white text-slate-800 font-bold px-4 py-2 rounded-xl shadow-xl border border-slate-100 text-sm whitespace-nowrap">
        Hubungi Kami (WhatsApp)
      </span>

      {/* Button with Pulse Effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-25 group-hover:opacity-40 transition-opacity"></div>
        <div className="relative w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 transition-all duration-300 transform hover:scale-110 active:scale-95 group-hover:rotate-[12deg]">
          <MessageCircle size={30} fill="currentColor" className="text-emerald-50" />
        </div>
      </div>

      <style>{`
        @keyframes custom-ping {
          0% { transform: scale(1); opacity: 0.5; }
          70%, 100% { transform: scale(1.6); opacity: 0; }
        }
        .animate-ping {
          animation: custom-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </a>
  );
};

export default WhatsAppButton;
