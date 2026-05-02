import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, Award, BookMarked, ArrowRight, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function PublicHome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-800 p-2 rounded-xl shadow-sm">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-serif italic text-slate-800 leading-tight">Instituti i Kur'anit</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Button onClick={() => navigate("/dashboard")} className="bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl shadow-md">Paneli i Përgjithshëm</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")} className="text-slate-600 hover:text-emerald-700">Kyçu</Button>
              <Button onClick={() => navigate("/login")} className="bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl shadow-md">Regjistrohu</Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-6 py-12 md:py-24 max-w-7xl mx-auto text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none"></div>
        
        <h1 className="text-5xl md:text-7xl font-serif italic text-slate-900 mb-6 leading-tight tracking-tight">
          Përsosmëria në <br />
          <span className="text-emerald-800">Studimet Islame</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed capitalize">
          Esselamu Alejkum we Rrahmetullahi we Berekatuhu. <br/> Bashkohuni me ne në rrugën e dijes dhe në shërbim të thirrjes islame.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Button onClick={() => navigate("/dashboard")} className="h-14 px-8 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl text-lg shadow-xl group transition-all">
              Shko te Paneli <LayoutDashboard className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button onClick={() => navigate("/login")} className="h-14 px-8 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl text-lg shadow-xl group transition-all">
              Fillo Tani <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
          <Button variant="outline" className="h-14 px-8 rounded-2xl text-lg border-slate-200 text-slate-700 hover:bg-white shadow-sm">
            Mëso Më Shumë
          </Button>
        </div>
      </header>

      {/* Features */}
      <section className="px-6 py-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
            <BookMarked className="h-6 w-6 text-emerald-700" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Lëndë të Diversifikuara</h3>
          <p className="text-slate-500 leading-relaxed">Nga bazat e Teuhidit deri te studimet e thelluara të Fikhut dhe Tefsirin e Kur'anit Famëlartë.</p>
        </div>
        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
            <Users className="h-6 w-6 text-emerald-700" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Mësues të Kualifikuar</h3>
          <p className="text-slate-500 leading-relaxed">Mësoni nga hoxhallarë me përvojë dhe përkushtim maksimal ndaj studentëve.</p>
        </div>
        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
            <Award className="h-6 w-6 text-emerald-700" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Certifikim Online</h3>
          <p className="text-slate-500 leading-relaxed">Përfundoni kurset dhe pajisuni me certifikata të njohura nga instituti ynë.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 py-10 bg-slate-900 text-white text-center">
        <div className="flex items-center justify-center gap-2 opacity-80 mb-4">
          <BookOpen className="h-5 w-5 text-emerald-400" />
          <span className="font-serif italic font-medium leading-tight tracking-tight">Instituti i Kur'anit</span>
        </div>
        <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">© 2026 Vepër e Dashamirësisë ndaj Islamit</p>
      </footer>
    </div>
  );
}
