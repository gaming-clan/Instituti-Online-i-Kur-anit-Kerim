import { BookOpen, User, GraduationCap, MapPin } from "lucide-react";
import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";

export default function PublicTeachers() {
  const teachers = [
    {
      name: "Hoxhë Shembulli 1",
      title: "Mësues i Fikhut dhe Teuhidit",
      description: "Ka përfunduar studimet në Universitetin Islamik të Medinës. Ka një përvojë 10-vjeçare në mësimdhënie.",
      location: "Tiranë, Shqipëri"
    },
    {
      name: "Hoxhë Shembulli 2",
      title: "Mësues i Kura'nit dhe Texhvidit",
      description: "Hafiz i Kura'nit me Ixhaze në 10 Kiratetet. Përkushtim maksimal në përmirësimin e leximit të Kura'nit.",
      location: "Gjilan, Kosovë"
    },
    {
      name: "Hoxhë Shembulli 3",
      title: "Mësues i Sires dhe Hadithit",
      description: "Studiues i thelluar në shkencat e Hadithit dhe Historisë Islame. Autor i disa librave dhe përkthyes.",
      location: "Shkup, Maqedoni e Veriut"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-sans selection:bg-[#b0f0d6] selection:text-[#002117] flex flex-col overflow-x-hidden">
      <PublicNav />

      <main className="flex-1 w-full px-6 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-[64px] font-serif font-bold text-[#003527] mb-6 leading-tight tracking-tight text-balance">
            Mësuesit e <span className="text-[#735c00] italic font-normal">Institutit</span>
          </h1>
          <p className="text-lg text-[#404944] leading-relaxed">
            Njihuni me stafin tonë të hoxhallarëve të kualifikuar, të cilët janë të përkushtuar në përcjelljen e dijes islame me saktësi dhe sinqeritet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers.map((teacher, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 border border-[#735c00]/20 shadow-[0_8px_30px_rgba(115,92,0,0.04)] hover:shadow-[0_8px_30px_rgba(115,92,0,0.08)] transition-all duration-300 group">
              <div className="h-16 w-16 bg-[#f0eded] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#003527]/10 transition-colors">
                <User className="h-8 w-8 text-[#003527]" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#003527] mb-2">{teacher.name}</h3>
              <p className="text-[#735c00] font-medium mb-4 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" /> {teacher.title}
              </p>
              <p className="text-[#404944] leading-relaxed mb-6">
                {teacher.description}
              </p>
              <div className="pt-6 border-t border-[#003527]/10 flex items-center gap-2 text-sm text-[#404944] font-medium">
                <MapPin className="h-4 w-4" /> {teacher.location}
              </div>
            </div>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
