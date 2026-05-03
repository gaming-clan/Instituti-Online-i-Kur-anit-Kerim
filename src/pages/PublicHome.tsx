import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, School, Verified, ArrowRight as ArrowForward, Quote, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PublicNav } from "@/components/PublicNav";

export default function PublicHome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-sans selection:bg-[#b0f0d6] selection:text-[#002117] overflow-x-hidden flex flex-col">
      {/* Navigation */}
      <PublicNav />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full min-h-[700px] md:min-h-[870px] flex items-center justify-center px-6 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[#f0eded]">
            <img 
              alt="Hero Background" 
              className="w-full h-full object-cover opacity-20 mix-blend-multiply" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3Gzdux9KoHH0MOKma9Dxixaojox9V8oh4vtxGnxN53ky08p0ssaPUC8RVwg-1YDEU1XJ07sXAKoiAkb67j3Y6q-Mxm_6QJLiNgaBHPUm_6HWcqYD-L_C1c-O4JRC4YWbJpdeeH3TSEekkAlTtgMvQ7NQfJXII75dz2KhGb1yVuSH4RZ04TOF-lcPEtiBYSUeVxTOy9iLHz552lEFZ-DZ6iRIv_5zqiN393IEb2pS85SZIA2lD9JX4C7Ou-MlEbMNmflHD5a5OaTs"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#fcf9f8] via-transparent to-transparent z-10"></div>
            <div className="absolute inset-0 opacity-30 z-10 bg-girih-pattern"></div>
          </div>

          <div className="relative z-20 max-w-[800px] mx-auto text-center flex flex-col items-center gap-8 -mt-20 md:mt-0">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#003527]/10 text-[#003527] text-xs font-bold tracking-widest border border-[#003527]/20 backdrop-blur-sm uppercase">
              <Star className="w-4 h-4 mr-2" />
              Tradita Takohet Me Inovacionin
            </div>
            <h1 className="text-5xl md:text-[64px] font-serif font-bold text-[#003527] leading-tight tracking-tight text-balance">
              Përsosmëria në <br/>
              <span className="text-[#735c00] italic font-normal">Studimet Islame</span>
            </h1>
            <p className="text-lg md:text-xl text-[#404944] max-w-[600px] text-balance leading-relaxed">
              Bashkohuni me ne në rrugën e dijes dhe në shërbim të thirrjes islame. Instituti ynë ofron një përvojë premium akademike e cila ndërthur metodologjinë klasike me qasjen bashkëkohore.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
              {user ? (
                <Button onClick={() => navigate("/dashboard")} className="bg-[#003527] hover:bg-[#064e3b] text-white px-8 h-14 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_4px_14px_0_rgba(0,53,39,0.39)] hover:shadow-[0_6px_20px_rgba(0,53,39,0.23)] w-full sm:w-auto">
                  Fillo Tani
                </Button>
              ) : (
                <Button onClick={() => navigate("/login")} className="bg-[#003527] hover:bg-[#064e3b] text-white px-8 h-14 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_4px_14px_0_rgba(0,53,39,0.39)] hover:shadow-[0_6px_20px_rgba(0,53,39,0.23)] w-full sm:w-auto">
                  Fillo Tani
                </Button>
              )}
              <Button variant="outline" className="border-[#735c00] text-[#735c00] hover:bg-[#735c00]/5 hover:text-[#735c00] px-8 h-14 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 bg-transparent w-full sm:w-auto">
                Mëso Më Shumë
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 bg-[#fcf9f8] relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-[32px] font-serif font-bold text-[#003527] mb-4">Shtyllat e Programit Tonë</h2>
              <p className="text-[18px] text-[#404944] max-w-2xl mx-auto leading-relaxed">Një qasje e rafinuar ndaj edukimit që i jep përparësi thellësisë, qartësisë dhe rritjes shpirtërore.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-10 rounded-xl border border-[#735c00]/20 shadow-[0_8px_30px_rgba(115,92,0,0.04)] hover:shadow-[0_8px_30px_rgba(115,92,0,0.08)] transition-all duration-300 group">
                <div className="w-14 h-14 rounded-full bg-[#f0eded] flex items-center justify-center mb-6 group-hover:bg-[#003527]/10 transition-colors">
                  <BookOpen className="text-[#003527] w-7 h-7" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-[#003527] mb-3">Lëndë të Diversifikuara</h3>
                <p className="text-[16px] text-[#404944] leading-relaxed">
                  Kurrikula jonë gjithëpërfshirëse mbulon shkencat klasike dhe sfidat bashkëkohore, duke siguruar një edukim të rrumbullakosur mirë.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white p-10 rounded-xl border border-[#735c00]/20 shadow-[0_8px_30px_rgba(115,92,0,0.04)] hover:shadow-[0_8px_30px_rgba(115,92,0,0.08)] transition-all duration-300 group relative transform md:-translate-y-4">
                <div className="absolute inset-0 border-2 border-[#735c00]/10 rounded-xl pointer-events-none"></div>
                <div className="w-14 h-14 rounded-full bg-[#f0eded] flex items-center justify-center mb-6 group-hover:bg-[#003527]/10 transition-colors">
                  <School className="text-[#735c00] w-7 h-7" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-[#003527] mb-3">Mësues të Kualifikuar</h3>
                <p className="text-[16px] text-[#404944] leading-relaxed">
                  Mësoni nga hoxhallarë të kualifikuar të cilët mbartin një përkushtim të thellë ndaj studentëve dhe dijes elitare.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white p-10 rounded-xl border border-[#735c00]/20 shadow-[0_8px_30px_rgba(115,92,0,0.04)] hover:shadow-[0_8px_30px_rgba(115,92,0,0.08)] transition-all duration-300 group">
                <div className="w-14 h-14 rounded-full bg-[#f0eded] flex items-center justify-center mb-6 group-hover:bg-[#003527]/10 transition-colors">
                  <Verified className="text-[#003527] w-7 h-7" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-[#003527] mb-3">Kushtet e Akademisë</h3>
                <p className="text-[16px] text-[#404944] leading-relaxed">
                  Prezencë e rregullt në Zoom. Mësimet në format PDF. Kalimi në nivelin tjetër kërkon rezultat minimal prej 60% në fund.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scholar Quote */}
        <section className="py-24 px-6 bg-[#fcf9f8] relative overflow-hidden">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            <Quote className="text-[#735c00] w-[40px] h-[40px] mb-8 opacity-50 rotate-180" />
            <blockquote className="border-l-4 border-[#735c00] pl-8 text-left">
              <p className="text-[32px] font-serif text-[#003527] italic mb-6 leading-tight">
                "Edukimi i vërtetë nuk është vetëm grumbullimi i fakteve, por pastrimi i zemrës dhe ndriçimi i mendjes në kërkim të së Vërtetës Hyjnore."
              </p>
              <footer className="text-[12px] font-bold text-[#735c00] tracking-widest uppercase">
                — TRADITA E DIJES
              </footer>
            </blockquote>
          </div>
        </section>

        {/* Upcoming Programs (Bento Layout) */}
        <section className="py-24 px-6 bg-[#f6f3f2]">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="flex w-full flex-col md:flex-row justify-between items-start md:items-end mb-[60px] gap-6">
              <div>
                <h2 className="text-[32px] font-serif font-bold text-[#003527] mb-2 leading-tight">Programet e Ardhshme</h2>
                <p className="text-[16px] text-[#404944]">Eksploroni kurset tona të kuruara me kujdes për semestrin e ri.</p>
              </div>
              <button 
                onClick={() => navigate('/lendet')}
                className="flex items-center text-[#735c00] text-[12px] font-bold tracking-widest uppercase hover:text-[#003527] transition-colors"
              >
                Shiko të Gjitha <ArrowForward className="ml-2 w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
              {/* Large Feature Card */}
              <div className="lg:col-span-8 rounded-xl overflow-hidden relative group h-[400px]">
                <img 
                  alt="Manuscript Study" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOSXYa7riS5VK2VKMTYsRHaBb7dozTq174iWvEklMHSTQqikaImpgKz-QAQ04mmIFcPAbVHuXgM3RqaTdWb-0qRG4HqxTdOyV2miYS-51_T3kv9N1nqQINw15gsfOFgsHodF21W2TOxeisfQGJ8poQjetYCeky4i5xND3Ij7YVUCLhUaG7ltS9hZRfaTr9iIyKBGPef8vTO5-QM_iw1eHxy4bFBW5OUPVwOGqte5TE1TkQ2pd_4bfBK0flICB7ppoDWnaufw6F2Tw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003527] via-[#003527]/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-10 w-full">
                  <span className="inline-block px-3 py-1 bg-[#735c00]/20 backdrop-blur-md text-[#fed65b] text-[12px] font-bold tracking-widest uppercase rounded-full mb-4 border border-[#735c00]/30 shadow-sm">
                    Kurs Themelor
                  </span>
                  <h3 className="text-[32px] font-serif font-bold text-white mb-2 leading-tight">Hyrje në Shkencat Kuranore</h3>
                  <p className="text-[#e5e2e1] max-w-lg mb-4 text-[16px]">
                    Një udhëtim i thellë në metodologjinë e tefsirit dhe kontekstin historik të shpalljes.
                  </p>
                </div>
              </div>
              
              {/* Small Stacked Cards */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                <div className="flex-1 bg-white p-8 rounded-xl border border-[#bfc9c3]/30 flex flex-col justify-center shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-[#003527]/5 flex items-center justify-center mb-4">
                    <BookOpen className="text-[#003527] w-5 h-5" />
                  </div>
                  <h4 className="text-[20px] font-serif font-semibold text-[#003527] mb-2 leading-tight">Studimi i Besimit</h4>
                  <p className="text-[14px] text-[#404944] mb-4">Eksplorimi i thellë i Teuhidit sipas dijetarëve kryesorë.</p>
                  <button onClick={() => navigate('/lendet')} className="text-[#735c00] text-[12px] font-bold tracking-widest uppercase hover:underline underline-offset-4 text-left">
                    Detajet e Kursit
                  </button>
                </div>
                
                <div className="flex-1 bg-[#003527] text-white p-8 rounded-xl shadow-sm flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Star className="w-24 h-24" fill="currentColor" />
                  </div>
                  <h4 className="text-[20px] font-serif font-semibold mb-2 relative z-10 leading-tight">Masterclass i Fikhut</h4>
                  <p className="text-[14px] text-[#80bea6] relative z-10 mb-4">Shtjellimi i rregullave dhe logjikës juridike islame.</p>
                  <button onClick={() => navigate('/login')} className="text-[#ffe088] text-[12px] font-bold tracking-widest uppercase hover:underline underline-offset-4 relative z-10 text-left">
                    Regjistrohu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#fcf9f8] border-t border-[#003527]/5">
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
    </div>
  );
}
