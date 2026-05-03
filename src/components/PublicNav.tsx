import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

export function PublicNav() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();

  return (
    <nav className="sticky top-0 w-full z-50 bg-[#fcf9f8]/90 backdrop-blur-md border-b border-[#003527]/10 shadow-sm transition-opacity opacity-100 font-sans tracking-tight">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex justify-between items-center h-20">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <BookOpen className="h-8 w-8 text-[#003527]" />
          <span className="text-xl md:text-2xl font-serif font-bold text-[#003527] hidden sm:inline-block">Instituti i Kur'anit</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest uppercase mt-1">
          <Link to="/" className={`pb-1 border-b-2 hover:text-[#735c00] transition-colors duration-300 ${location.pathname === '/' ? 'border-[#735c00] text-[#003527]' : 'border-transparent text-[#404944]'}`}>Kryefaqja</Link>
          <Link to="/lendet" className={`pb-1 border-b-2 hover:text-[#735c00] transition-colors duration-300 ${location.pathname === '/lendet' ? 'border-[#735c00] text-[#003527]' : 'border-transparent text-[#404944]'}`}>Lëndët</Link>
          <Link to="/mesuesit" className={`pb-1 border-b-2 hover:text-[#735c00] transition-colors duration-300 ${location.pathname === '/mesuesit' ? 'border-[#735c00] text-[#003527]' : 'border-transparent text-[#404944]'}`}>Mësuesit</Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <Button onClick={() => navigate("/dashboard")} className="bg-[#003527] hover:bg-[#064e3b] text-white rounded-full px-6 py-2 h-auto text-xs font-bold uppercase tracking-widest transition-colors">Paneli</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")} className="text-[#404944] hover:text-[#003527] hover:bg-[#f0eded] px-3 sm:px-4 text-xs font-bold uppercase tracking-widest transition-colors">Kyçu</Button>
              <Button onClick={() => navigate("/login")} className="bg-[#003527] hover:bg-[#064e3b] text-white rounded-full px-6 py-2 h-auto text-xs font-bold uppercase tracking-widest hidden sm:flex transition-colors">Regjistrohu</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
