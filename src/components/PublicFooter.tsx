import { useNavigate } from "react-router-dom";

export function PublicFooter() {
  const navigate = useNavigate();
  return (
    <footer className="w-full bg-[#fcf9f8] border-t border-[#003527]/5 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-xl font-serif font-semibold text-[#003527]">
          Instituti i Kur'anit
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <button onClick={() => navigate('/')} className="text-[#404944] hover:text-[#003527] underline underline-offset-4 font-sans text-[14px]">Kryefaqja</button>
          <button onClick={() => navigate('/lendet')} className="text-[#404944] hover:text-[#003527] underline underline-offset-4 font-sans text-[14px]">Lëndët</button>
          <button onClick={() => navigate('/mesuesit')} className="text-[#404944] hover:text-[#003527] underline underline-offset-4 font-sans text-[14px]">Stafi</button>
          <button onClick={() => navigate('/login')} className="text-[#404944] hover:text-[#003527] underline underline-offset-4 font-sans text-[14px]">Regjistrimi</button>
        </div>
        <div className="text-[#404944] text-center md:text-right text-[12px] font-sans">
          © 2026 Instituti i Kur'anit Kerim. Vepër e Dashamirësisë ndaj Islamit.
        </div>
      </div>
    </footer>
  );
}
