import { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AppClass {
  id: string;
  title: string;
  subjectId: string;
  teacherId: string;
  semester: string;
  subjectName?: string;
  studentCount?: number;
}

export default function TeacherClasses() {
  const { appUser } = useAuth();
  const [classes, setClasses] = useState<AppClass[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (appUser?.uid) {
      fetchData();
    }
  }, [appUser]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'classes'), where('teacherId', '==', appUser!.uid));
      const clsSnap = await getDocs(q);

      const subjectCache: Record<string, string> = {};
      const clsData: AppClass[] = [];

      for (const clsDoc of clsSnap.docs) {
        const data = clsDoc.data() as AppClass;
        data.id = clsDoc.id;

        if (!subjectCache[data.subjectId]) {
          const sSnap = await getDoc(doc(db, 'subjects', data.subjectId));
          subjectCache[data.subjectId] = sSnap.data()?.title || 'N/A';
        }
        
        data.subjectName = subjectCache[data.subjectId];
        
        // Count enrollments (inefficient for large DB, but ok for now)
        const enrollmentsSnap = await getDocs(collection(db, 'classes', data.id, 'enrollments'));
        data.studentCount = enrollmentsSnap.size;

        clsData.push(data);
      }

      setClasses(clsData);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'teacher_classes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>;
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-serif text-slate-800 italic">Klasat që Mësoj</h1>
          <p className="text-sm text-slate-500 mt-1">Pasqyra e klasave tuaja aktive.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 md:auto-rows-[160px] gap-4">
        {classes.length === 0 ? (
          <div className="col-span-1 border border-slate-200 shadow-sm md:col-span-12 rounded-2xl bg-white flex items-center justify-center p-12">
            <p className="text-slate-500">Nuk keni klasa të caktuara akoma.</p>
          </div>
        ) : classes.map(cls => (
          <div key={cls.id} className="col-span-1 md:col-span-4 row-span-1 md:row-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:border-emerald-300 transition-colors cursor-pointer group" onClick={() => navigate(`/classes/${cls.id}`)}>
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full shadow-sm border border-emerald-200 text-xs font-semibold">{cls.subjectName}</div>
                <span className="text-xs text-slate-400 font-medium">{cls.semester}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-700 mb-1 group-hover:text-emerald-700 transition-colors">{cls.title}</h2>
              <div className="text-sm text-slate-500 mt-2">
                 Studentë: <strong className="text-slate-700">{cls.studentCount}</strong>
              </div>
            </div>
            <div className="mt-4">
              <span className="w-full text-[10px] uppercase font-bold text-slate-600 tracking-widest border border-dashed border-slate-300 py-3 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2">
                Menaxho Klasën
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
