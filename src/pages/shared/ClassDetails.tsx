import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ClassData {
  id: string;
  title: string;
  semester: string;
  teacherId: string;
  subjectId: string;
}

export default function ClassDetails() {
  const { classId } = useParams<{ classId: string }>();
  const { appUser } = useAuth();
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (classId) {
      fetchClassDetails();
    }
  }, [classId]);

  const fetchClassDetails = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'classes', classId!));
      if (docSnap.exists()) {
        setClassData({ id: docSnap.id, ...docSnap.data() } as ClassData);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `classes/${classId}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>;
  }

  if (!classData) {
    return <div className="text-center p-8 text-neutral-500">Klasa nuk u gjet.</div>;
  }

  const isTeacherOrAdmin = appUser?.role === 'admin' || appUser?.uid === classData.teacherId;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header Bento Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start mb-2">
        <div>
          <h1 className="text-2xl font-serif text-slate-800 italic">{classData.title}</h1>
          <p className="text-sm text-slate-500 mt-1">Semestri: {classData.semester}</p>
        </div>
        <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full shadow-sm border border-emerald-200 text-xs font-semibold">Aktiv</div>
      </div>

      <Tabs defaultValue="overview" className="w-full h-full flex flex-col">
        <div className="flex justify-start mb-4">
          <TabsList className="bg-slate-200/50 p-1 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Përgjithshme</TabsTrigger>
            <TabsTrigger value="attendance" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Prezenca</TabsTrigger>
            <TabsTrigger value="exams" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Provimet</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-12 md:auto-rows-[160px] gap-4">
            <div className="col-span-1 md:col-span-8 row-span-1 md:row-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-700 mb-2">Informacione</h2>
                <p className="text-sm text-slate-500">Mirësevini në klasën {classData.title}. Këtu do të gjeni materialet dhe njoftimet (në zhvillim).</p>
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-4 row-span-1 md:row-span-2 bg-emerald-800 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between">
              <div>
                 <h2 className="text-lg font-bold text-emerald-100 mb-2">Përmbledhje</h2>
                 <p className="text-sm text-emerald-100.50">Statistikat e klasës do të shfaqen këtu së shpejti.</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="attendance" className="mt-0">
           <div className="grid grid-cols-1 md:grid-cols-12 md:auto-rows-[160px] gap-4">
             <div className="col-span-1 md:col-span-8 row-span-1 md:row-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-700 mb-2">Regjistri i Prezencës</h2>
                {isTeacherOrAdmin ? (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">Shikoni ose regjistroni prezencën për takimet e kësaj klase.</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Këtu do të pasqyrohet mungesat dhe prezenca juaj pasi mësuesi të fillojë marrjen e prezencës.</p>
                )}
              </div>
              {isTeacherOrAdmin && (
                <Button className="w-full sm:w-auto mt-4 bg-emerald-700 hover:bg-emerald-600 text-white" disabled>
                  <Plus className="mr-2 h-4 w-4" /> Krijo Sesion të Ri (Së Shpejti)
                </Button>
              )}
             </div>
           </div>
        </TabsContent>
        
        <TabsContent value="exams" className="mt-0">
           <div className="grid grid-cols-1 md:grid-cols-12 md:auto-rows-[160px] gap-4">
            <div className="col-span-1 md:col-span-8 row-span-1 md:row-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-700 mb-4">Provimet</h2>
                {isTeacherOrAdmin ? (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">Krijo dhe menaxho provimet për studentët.</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Këtu do të shfaqen provimet që duhet të kryeni dhe rezultatet tuaja.</p>
                )}
              </div>
              {isTeacherOrAdmin && (
                <Button className="w-full sm:w-auto mt-4 bg-emerald-700 hover:bg-emerald-600 text-white" disabled>
                  <Plus className="mr-2 h-4 w-4" /> Krijo Provim (Së Shpejti)
                </Button>
              )}
            </div>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
