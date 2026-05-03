import { BookOpen, Layers, CheckCircle2 } from "lucide-react";
import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";

export default function PublicSubjects() {
  const levels = [
    {
      level: "Niveli i Parë",
      description: "Bazat thelbësore për çdo besimtar. Njohja me parimet fillestare të fesë.",
      subjects: [
        "Bazat e Besimit (Teuhidi)",
        "Kushtet e Fikhut - Pjesa I (Namazi & Abdesi)",
        "Mësimi i Shkronjave të Kur'anit (Elifi)",
        "Edukimi dhe Morali Islam"
      ]
    },
    {
      level: "Niveli i Dytë",
      description: "Thellimi në zbatimin praktik dhe njohja me historikun Islam.",
      subjects: [
        "Fikhu i Agjërimit dhe Zekatit",
        "Texhvidi Bazë",
        "Sira (Jeta e Pejgamberit a.s)",
        "Hifz (Mësimi përmendësh i sureve të shkurtra)"
      ]
    },
    {
      level: "Niveli i Tretë",
      description: "Studime më të avancuara në shkencat e thelluara Islame.",
      subjects: [
        "Tefsiri i Kur'anit Famëlartë",
        "Shkenca e Hadithit",
        "Texhvidi i Avancuar",
        "Gjuha Arabe"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-sans selection:bg-[#b0f0d6] selection:text-[#002117] flex flex-col overflow-x-hidden">
      <PublicNav />

      <main className="flex-1 w-full px-6 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-[64px] font-serif font-bold text-[#003527] mb-6 leading-tight tracking-tight text-balance">
            Programi i <span className="text-[#735c00] italic font-normal">Lëndëve</span>
          </h1>
          <p className="text-lg text-[#404944] leading-relaxed">
            Kurrikula jonë është e ndarë në nivele për të mundësuar një zhvillim gradual dhe të qëndrueshëm në përvetësimin e dijes islame.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {levels.map((level, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 md:p-12 border border-[#735c00]/20 shadow-[0_8px_30px_rgba(115,92,0,0.04)] hover:shadow-[0_8px_30px_rgba(115,92,0,0.08)] relative overflow-hidden group hover:border-[#735c00]/40 transition-all duration-300">
              <div className="absolute -right-10 -top-10 h-40 w-40 bg-[#f0eded] rounded-full blur-3xl group-hover:bg-[#003527]/10 transition-colors pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-1/3">
                  <div className="inline-flex items-center justify-center p-3 bg-[#f0eded] text-[#003527] rounded-xl mb-6">
                    <Layers className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-[#003527] mb-3">{level.level}</h2>
                  <p className="text-[#404944] leading-relaxed">
                    {level.description}
                  </p>
                </div>
                
                <div className="md:w-2/3 w-full bg-[#f6f3f2] rounded-2xl p-6 md:p-8 border border-[#bfc9c3]/30">
                  <h3 className="text-sm font-bold text-[#003527] mb-6 uppercase tracking-wider">Lëndët e këtij niveli</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {level.subjects.map((subject, subIndex) => (
                      <div key={subIndex} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-[#bfc9c3]/30">
                        <CheckCircle2 className="h-5 w-5 text-[#735c00] mt-0.5 shrink-0" />
                        <span className="text-[#1c1b1b] font-medium">{subject}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
