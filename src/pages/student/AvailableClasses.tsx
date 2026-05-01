import { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, getDocs, setDoc, doc, query, where, getDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AppClass {
  id: string;
  title: string;
  subjectId: string;
  teacherId: string;
  semester: string;
  teacherName?: string;
  subjectName?: string;
}

export default function AvailableClasses() {
  const { appUser } = useAuth();
  const [classes, setClasses] = useState<AppClass[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [enrollingMap, setEnrollingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (appUser?.uid) {
      fetchData();
    }
  }, [appUser]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const clsSnap = await getDocs(collection(db, 'classes'));
      
      const teacherCache: Record<string, string> = {};
      const subjectCache: Record<string, string> = {};
      const clsData: AppClass[] = [];
      const enrolled = new Set<string>();

      for (const clsDoc of clsSnap.docs) {
        const data = clsDoc.data() as AppClass;
        data.id = clsDoc.id;
        
        // Check enrollment
        const enrollSnap = await getDoc(doc(db, 'classes', data.id, 'enrollments', appUser!.uid));
        if (enrollSnap.exists()) {
          enrolled.add(data.id);
        }

        if (!teacherCache[data.teacherId]) {
          const tSnap = await getDoc(doc(db, 'users', data.teacherId));
          teacherCache[data.teacherId] = tSnap.data()?.fullName || 'N/A';
        }
        if (!subjectCache[data.subjectId]) {
          const sSnap = await getDoc(doc(db, 'subjects', data.subjectId));
          subjectCache[data.subjectId] = sSnap.data()?.title || 'N/A';
        }
        
        data.teacherName = teacherCache[data.teacherId];
        data.subjectName = subjectCache[data.subjectId];
        clsData.push(data);
      }

      setClasses(clsData);
      setEnrolledIds(enrolled);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'available_classes');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (classId: string) => {
    setEnrollingMap(prev => ({ ...prev, [classId]: true }));
    try {
      await setDoc(doc(db, 'classes', classId, 'enrollments', appUser!.uid), {
        studentId: appUser!.uid,
        enrolledAt: Date.now(),
        status: 'active'
      });
      setEnrolledIds(prev => new Set(prev).add(classId));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `classes/${classId}/enrollments`);
    } finally {
      setEnrollingMap(prev => ({ ...prev, [classId]: false }));
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>;
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-serif text-slate-800 italic">Klasat e Disponueshme</h1>
          <p className="text-sm text-slate-500 mt-1">Zgjidhni klasat për tu regjistruar.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 md:auto-rows-[160px] gap-4">
        {classes.length === 0 ? (
          <div className="col-span-1 border border-slate-200 shadow-sm md:col-span-12 rounded-2xl bg-white flex items-center justify-center p-12">
            <p className="text-slate-500">Për momentin nuk ka klasa të disponueshme.</p>
          </div>
        ) : classes.map(cls => {
          const isEnrolled = enrolledIds.has(cls.id);
          const isEnrolling = enrollingMap[cls.id];

          return (
            <div key={cls.id} className="col-span-1 md:col-span-4 row-span-1 md:row-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full shadow-sm border border-emerald-200 text-xs font-semibold">{cls.subjectName}</div>
                  <span className="text-xs text-slate-400 font-medium">{cls.semester}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-700 mb-1">{cls.title}</h2>
                <p className="text-sm text-slate-500">Prof. {cls.teacherName}</p>
              </div>
              <div className="mt-4">
                {isEnrolled ? (
                  <Button disabled variant="outline" className="w-full text-emerald-700 border-emerald-200 bg-emerald-50 rounded-xl">
                    <Check className="mr-2 h-4 w-4" /> I Regjistruar
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow-sm" 
                    onClick={() => handleEnroll(cls.id)}
                    disabled={isEnrolling}
                  >
                    {isEnrolling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Regjistrohu
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
