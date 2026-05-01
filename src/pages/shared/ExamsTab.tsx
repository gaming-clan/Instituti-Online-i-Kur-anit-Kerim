import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Edit, FileText, Save } from 'lucide-react';

interface Student {
  id: string;
  fullName: string;
}

interface Exam {
  id: string;
  title: string;
  date: string;
  maxPoints: number;
  results: Record<string, number>; // studentId -> achieved points
}

interface Props {
  classId: string;
  isTeacherOrAdmin: boolean;
  studentId?: string;
}

export default function ExamsTab({ classId, isTeacherOrAdmin, studentId }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formMaxPoints, setFormMaxPoints] = useState(100);
  const [formResults, setFormResults] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [classId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch enrolled students
      const enrollSnap = await getDocs(collection(db, `classes/${classId}/enrollments`));
      const studentIds = enrollSnap.docs.map(d => d.id);
      
      const stData: Student[] = [];
      for (const sid of studentIds) {
        const uSnap = await getDoc(doc(db, 'users', sid));
        if (uSnap.exists()) {
          stData.push({ id: uSnap.id, fullName: uSnap.data().fullName });
        }
      }
      setStudents(stData);

      // Fetch exams
      const q = query(collection(db, `classes/${classId}/exams`), orderBy('date', 'desc'));
      const examSnap = await getDocs(q);
      const exData: Exam[] = [];
      examSnap.forEach(d => {
        exData.push({ id: d.id, ...d.data() } as Exam);
      });
      setExams(exData);
      
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'exams_data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormTitle('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormMaxPoints(100);
    setFormResults({});
    setEditingExamId(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (exam: Exam) => {
    setFormTitle(exam.title);
    setFormDate(exam.date);
    setFormMaxPoints(exam.maxPoints || 100);
    setFormResults(exam.results || {});
    setEditingExamId(exam.id);
    setIsDialogOpen(true);
  };

  const saveExam = async () => {
    if (!formTitle || !formDate) return;
    setSaving(true);
    try {
      const examData = {
        title: formTitle,
        date: formDate,
        maxPoints: Number(formMaxPoints),
        results: formResults
      };

      if (editingExamId) {
        await updateDoc(doc(db, `classes/${classId}/exams/${editingExamId}`), examData);
      } else {
        await addDoc(collection(db, `classes/${classId}/exams`), examData);
      }
      
      setIsDialogOpen(false);
      fetchData();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'exams');
    } finally {
      setSaving(false);
    }
  };

  const handleResultChange = (stId: string, val: string) => {
    const num = parseFloat(val);
    setFormResults(prev => ({
      ...prev,
      [stId]: isNaN(num) ? 0 : num
    }));
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-emerald-600" /></div>;
  }

  // Calculate totals for student
  let totalAchieved = 0;
  let totalPossible = 0;
  if (!isTeacherOrAdmin && studentId) {
    exams.forEach(ex => {
      const res = ex.results?.[studentId];
      if (res !== undefined) {
        totalAchieved += res;
        totalPossible += ex.maxPoints;
      }
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div className="col-span-1 md:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-700">Provimet dhe Notat</h2>
            <p className="text-sm text-slate-500">
              {isTeacherOrAdmin ? 'Menaxho provimet dhe vendos notat.' : 'Rezultatet e provimeve tuaja.'}
            </p>
          </div>
          {isTeacherOrAdmin && (
            <Button onClick={handleCreate} className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow-sm">
              <Plus className="mr-2 h-4 w-4" /> Krijo Provim
            </Button>
          )}
        </div>

        {exams.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <FileText className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <p className="text-slate-500">Nuk ka asnjë provim të regjistruar akoma.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-slate-600">Provimi</TableHead>
                  <TableHead className="font-semibold text-slate-600">Data</TableHead>
                  {!isTeacherOrAdmin && <TableHead className="font-semibold text-slate-600">Pikët</TableHead>}
                  {isTeacherOrAdmin && <TableHead className="font-semibold text-slate-600 w-[100px]">Veprime</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map(ex => {
                  const myResult = !isTeacherOrAdmin && studentId ? ex.results?.[studentId] : undefined;
                  
                  return (
                    <TableRow key={ex.id} className="hover:bg-slate-50/50 cursor-default">
                      <TableCell className="font-medium text-slate-700">{ex.title}</TableCell>
                      <TableCell className="text-slate-600">{ex.date}</TableCell>
                      {!isTeacherOrAdmin && (
                        <TableCell>
                          {myResult !== undefined ? (
                            <span className="font-semibold text-emerald-700">{myResult} / {ex.maxPoints}</span>
                          ) : (
                            <span className="text-slate-400 text-sm">Pa notuar</span>
                          )}
                        </TableCell>
                      )}
                      {isTeacherOrAdmin && (
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(ex)} className="text-emerald-700 hover:bg-emerald-50 rounded-lg h-8">
                            <Edit className="h-4 w-4 mr-1" /> Notat
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {!isTeacherOrAdmin && (
        <div className="col-span-1 md:col-span-4 bg-emerald-800 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-emerald-100 mb-2">Performanca</h2>
            <div className="mt-6 flex flex-col gap-4">
              <div className="bg-emerald-900/50 p-4 rounded-xl border border-emerald-700/50">
                <div className="text-xs text-emerald-200/80 uppercase font-semibold mb-1">Pikët e grumbulluara</div>
                <div className="text-3xl font-serif">
                   {totalPossible > 0 ? Math.round((totalAchieved / totalPossible) * 100) : 0}%
                </div>
              </div>
              <div className="flex justify-between bg-emerald-900/50 p-4 rounded-xl border border-emerald-700/50 text-sm">
                 <span>Totali:</span>
                 <span className="font-bold">{totalAchieved} / {totalPossible}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog for Exam & Grades */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-serif italic text-slate-800">
              {editingExamId ? 'Menaxho Notat' : 'Krijo Provim të Ri'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Label className="text-slate-600">Titulli i Provimit</Label>
                <Input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Provimi Final" className="rounded-xl border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600">Data</Label>
                <Input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} className="rounded-xl border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600">Pikët Maksimale</Label>
                <Input type="number" min="0" value={formMaxPoints} onChange={e => setFormMaxPoints(Number(e.target.value))} className="rounded-xl border-slate-200" />
              </div>
            </div>

            <h3 className="font-bold text-slate-700 mb-2">Vendos Notat / Pikët</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-600">Studenti</TableHead>
                    <TableHead className="font-semibold text-slate-600 w-[180px]">Pikët</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-slate-500 py-6">Nuk ka asnjë student të regjistruar.</TableCell>
                    </TableRow>
                  ) : students.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium text-slate-700">{s.fullName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number" 
                            min="0"
                            max={formMaxPoints}
                            className="w-20 text-center rounded-lg border-slate-200 h-8"
                            value={formResults[s.id] !== undefined ? formResults[s.id] : ''} 
                            onChange={(e) => handleResultChange(s.id, e.target.value)} 
                            placeholder="-"
                          />
                          <span className="text-slate-400 text-sm">/ {formMaxPoints}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 shrink-0">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">Anulo</Button>
            <Button onClick={saveExam} disabled={saving || !formTitle} className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Ruaj Provimin
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
