import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, GraduationCap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { appUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header Title */}
      <header className="flex justify-between items-center bg-transparent mb-4">
        <div>
          <h1 className="text-2xl font-serif text-slate-800 italic">Bismillahi r-Rahmani r-Rahim</h1>
          <p className="text-sm text-slate-500">Mirësevini, {appUser?.fullName}</p>
        </div>
        <div className="hidden sm:flex gap-2">
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 text-xs font-semibold">1445 Hijriah</div>
          <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full shadow-sm border border-emerald-200 text-xs font-semibold">Statusi: Aktiv</div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 md:auto-rows-[160px] gap-4">
        {appUser?.role === 'admin' && (
          <>
            <section className="col-span-1 md:col-span-4 row-span-1 md:row-span-2 bg-emerald-800 rounded-2xl shadow-sm border border-emerald-700 p-6 text-white flex flex-col justify-between">
              <div>
                <h2 className="font-bold flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-emerald-300" />
                  Menaxho Lëndët
                </h2>
                <p className="text-xs text-emerald-100">Shto ose modifiko lëndët e institutit.</p>
              </div>
              <Button className="w-full mt-4 bg-emerald-700 hover:bg-emerald-600 text-white" onClick={() => navigate('/admin/subjects')}>Shiko Lëndët</Button>
            </section>
            
            <section className="col-span-1 md:col-span-4 row-span-1 md:row-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <h2 className="font-bold text-slate-700 flex items-center gap-2 mb-2">
                  <GraduationCap className="h-5 w-5 text-emerald-600" />
                  Menaxho Klasat
                </h2>
                <p className="text-xs text-slate-500">Krijo dhe menaxho klasat.</p>
              </div>
              <Button className="w-full mt-4 text-[10px] uppercase font-bold text-slate-600 tracking-widest border border-dashed border-slate-300 py-3 rounded-lg hover:bg-slate-50" onClick={() => navigate('/admin/classes')}>Shiko Klasat</Button>
            </section>
            
            <section className="col-span-1 md:col-span-4 row-span-1 md:row-span-2 bg-amber-50 rounded-2xl border border-amber-100 p-6 flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-amber-900 flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-amber-600" />
                  Përdoruesit
                </h2>
                <p className="text-xs text-amber-700">Menaxho rolet e përdoruesve.</p>
              </div>
              <Button className="w-full mt-4 bg-white border border-amber-200 text-amber-800 hover:bg-amber-100" onClick={() => navigate('/admin/users')}>Shiko Përdoruesit</Button>
            </section>
          </>
        )}

        {appUser?.role === 'student' && (
          <>
            {/* Course Overview Card */}
            <section className="col-span-1 md:col-span-8 row-span-1 md:row-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-slate-700 flex items-center gap-2"><BookOpen className="h-5 w-5 text-emerald-600" /> Klasat e Mia</h2>
                <span className="text-xs text-emerald-600 font-semibold uppercase hidden sm:inline-block">Vazhdoni me mësimet tuaja</span>
              </div>
              <div className="flex flex-col h-full justify-between">
                 <p className="text-sm text-slate-500 mb-4">Përmbledhja e klasave tuaja aktive dhe progresit akademik.</p>
                 <Button className="w-full text-[10px] uppercase font-bold text-slate-600 tracking-widest border border-dashed border-slate-300 py-3 rounded-lg hover:bg-slate-50" onClick={() => navigate('/classes/my')}>Hap Klasat Aktive</Button>
              </div>
            </section>

            {/* Attendance Snapshot / Banner */}
            <section className="col-span-1 md:col-span-4 row-span-1 md:row-span-2 bg-emerald-800 rounded-2xl shadow-sm p-6 text-white flex flex-col justify-between">
              <div>
                <h2 className="font-bold mb-4 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-emerald-300" />
                  Klasa të Reja
                </h2>
                <p className="text-sm text-emerald-100">Zbuloni lëndë të reja dhe regjistrohuni në klasat e disponueshme këtë semestër.</p>
              </div>
              
              <Button className="w-full mt-4 border border-emerald-500 bg-emerald-700 hover:bg-emerald-600 text-white" onClick={() => navigate('/classes/available')}>Zbulo Klasat</Button>
            </section>
          </>
        )}
        
        {appUser?.role === 'teacher' && (
          <section className="col-span-1 md:col-span-12 row-span-1 md:row-span-2 bg-slate-800 rounded-2xl shadow-sm p-6 text-white flex flex-col justify-between">
            <div>
              <h2 className="font-bold text-slate-300 text-lg mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-emerald-400" /> Klasat që Mësoj</h2>
              <p className="text-sm text-slate-400">Menaxhoni klasat tuaja, shtoni provime dhe merrni prezencën.</p>
            </div>
            <div className="mt-6">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => navigate('/teacher/classes')}>Navigo te Klasat</Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
