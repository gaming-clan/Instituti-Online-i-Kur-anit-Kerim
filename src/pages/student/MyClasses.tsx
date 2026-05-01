import { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, collectionGroup, getDocs, doc, query, where, getDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface MyClass {
  id: string; // The classId
  title: string;
  semester: string;
  teacherName?: string;
  subjectName?: string;
  status: string;
}

export default function MyClasses() {
  const { appUser } = useAuth();
  const [classes, setClasses] = useState<MyClass[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (appUser?.uid) {
      fetchMyClasses();
    }
  }, [appUser]);

  const fetchMyClasses = async () => {
    setLoading(true);
    try {
      // Find all enrollments for this student
      const q = query(collectionGroup(db, 'enrollments'), where('studentId', '==', appUser!.uid));
      const enrollSnap = await getDocs(q);

      const clsData: MyClass[] = [];
      const teacherCache: Record<string, string> = {};
      const subjectCache: Record<string, string> = {};

      for (const enrollDoc of enrollSnap.docs) {
        // Doc path is classes/{classId}/enrollments/{uid}
        const classId = enrollDoc.ref.parent.parent?.id;
        if (!classId) continue;

        const clsSnap = await getDoc(doc(db, 'classes', classId));
        if (!clsSnap.exists()) continue;
        
        const clsInfo = clsSnap.data();

        if (!teacherCache[clsInfo.teacherId]) {
          const tSnap = await getDoc(doc(db, 'users', clsInfo.teacherId));
          teacherCache[clsInfo.teacherId] = tSnap.data()?.fullName || 'N/A';
        }
        if (!subjectCache[clsInfo.subjectId]) {
          const sSnap = await getDoc(doc(db, 'subjects', clsInfo.subjectId));
          subjectCache[clsInfo.subjectId] = sSnap.data()?.title || 'N/A';
        }

        clsData.push({
          id: classId,
          title: clsInfo.title,
          semester: clsInfo.semester,
          teacherName: teacherCache[clsInfo.teacherId],
          subjectName: subjectCache[clsInfo.subjectId],
          status: enrollDoc.data().status
        });
      }

      setClasses(clsData);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'my_classes');
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
          <h1 className="text-2xl font-serif text-slate-800 italic">Klasat e Mia</h1>
          <p className="text-sm text-slate-500 mt-1">Pasqyra e klasave ku jeni regjistruar.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 md:auto-rows-[160px] gap-4">
        {classes.length === 0 ? (
          <div className="col-span-1 border border-slate-200 shadow-sm md:col-span-12 rounded-2xl bg-white flex items-center justify-center p-12">
            <p className="text-slate-500">Nuk jeni regjistruar në asnjë klasë akoma.</p>
          </div>
        ) : classes.map(cls => (
          <div key={cls.id} className="col-span-1 md:col-span-4 row-span-1 md:row-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:border-emerald-300 transition-colors cursor-pointer group" onClick={() => navigate(`/classes/${cls.id}`)}>
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full shadow-sm border border-emerald-200 text-xs font-semibold">{cls.subjectName}</div>
                <span className="text-xs text-slate-400 font-medium">{cls.semester}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-700 mb-1 group-hover:text-emerald-700 transition-colors">{cls.title}</h2>
              <p className="text-sm text-slate-500">Prof. {cls.teacherName}</p>
            </div>
            <div className="mt-4">
              <span className="w-full text-[10px] uppercase font-bold text-slate-600 tracking-widest border border-dashed border-slate-300 py-3 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2">
                Hap Klasën
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
