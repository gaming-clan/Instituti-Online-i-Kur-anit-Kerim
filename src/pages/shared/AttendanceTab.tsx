import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, doc, getDocs, getDoc, setDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Calendar, Save } from 'lucide-react';

interface Student {
  id: string;
  fullName: string;
  email: string;
}

interface AttendanceSession {
  id: string;
  date: string;
  topic: string;
  records: Record<string, string>; // studentId -> status (present, absent, late)
}

interface Props {
  classId: string;
  isTeacherOrAdmin: boolean;
  studentId?: string;
}

export default function AttendanceTab({ classId, isTeacherOrAdmin, studentId }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newTopic, setNewTopic] = useState('');
  const [attendanceState, setAttendanceState] = useState<Record<string, string>>({}); // studentId -> status
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
          stData.push({ id: uSnap.id, ...(uSnap.data() as Omit<Student, 'id'>) });
        }
      }
      setStudents(stData);

      // Fetch sessions
      const q = query(collection(db, `classes/${classId}/sessions`), orderBy('date', 'desc'));
      const sessSnap = await getDocs(q);
      const sessData: AttendanceSession[] = [];
      sessSnap.forEach(d => {
        sessData.push({ id: d.id, ...d.data() } as AttendanceSession);
      });
      setSessions(sessData);
      
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'attendance_data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = () => {
    const initialState: Record<string, string> = {};
    students.forEach(s => { initialState[s.id] = 'present'; });
    setAttendanceState(initialState);
    setNewTopic('');
    setNewDate(new Date().toISOString().split('T')[0]);
    setIsDialogOpen(true);
  };

  const saveSession = async () => {
    if (!newDate) return;
    setSaving(true);
    try {
      await addDoc(collection(db, `classes/${classId}/sessions`), {
        date: newDate,
        topic: newTopic,
        records: attendanceState
      });
      setIsDialogOpen(false);
      fetchData();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'attendance_session');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-emerald-600" /></div>;
  }

  // Calculate stats for current student (if not teacher)
  let presentDays = 0;
  let totalDays = sessions.length;
  if (!isTeacherOrAdmin && studentId) {
    sessions.forEach(s => {
      if (s.records[studentId] === 'present') presentDays++;
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div className="col-span-1 md:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-700">Regjistri i Prezencës</h2>
            <p className="text-sm text-slate-500">
              {isTeacherOrAdmin ? 'Menaxhoni takimet dhe mungesat.' : 'Pasqyra e prezencës suaj.'}
            </p>
          </div>
          {isTeacherOrAdmin && (
            <Button onClick={handleCreateSession} className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow-sm">
              <Plus className="mr-2 h-4 w-4" /> Sesion i Ri
            </Button>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <Calendar className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <p className="text-slate-500">Nuk ka asnjë sesion të regjistruar akoma.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-slate-600">Data</TableHead>
                  <TableHead className="font-semibold text-slate-600">Tema</TableHead>
                  <TableHead className="font-semibold text-slate-600">Statusi / Detaje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map(s => {
                  const myStatus = !isTeacherOrAdmin && studentId ? s.records[studentId] : null;
                  const presents = Object.values(s.records).filter(st => st === 'present').length;
                  const total = Object.values(s.records).length;

                  return (
                    <TableRow key={s.id} className="hover:bg-slate-50/50 cursor-default">
                      <TableCell className="font-medium text-slate-700">{s.date}</TableCell>
                      <TableCell className="text-slate-600">{s.topic || '-'}</TableCell>
                      <TableCell>
                        {isTeacherOrAdmin ? (
                          <span className="text-sm text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-md">
                            Prezent: {presents} / {total}
                          </span>
                        ) : (
                          <span className={`text-sm font-semibold px-2 py-1 rounded-md ${
                            myStatus === 'present' ? 'bg-emerald-50 text-emerald-700' : 
                            myStatus === 'late' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {myStatus === 'present' ? 'Prezent' : myStatus === 'late' ? 'Me Vonesë' : 'Mungesë'}
                          </span>
                        )}
                      </TableCell>
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
            <h2 className="text-lg font-bold text-emerald-100 mb-2">Përmbledhja Juaj</h2>
            <div className="mt-6 flex flex-col gap-4">
              <div className="bg-emerald-900/50 p-4 rounded-xl border border-emerald-700/50">
                <div className="text-xs text-emerald-200/80 uppercase font-semibold mb-1">Pjesëmarrja</div>
                <div className="text-3xl font-serif">{totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0}%</div>
              </div>
              <div className="flex justify-between bg-emerald-900/50 p-4 rounded-xl border border-emerald-700/50 text-sm">
                 <span>Prezent:</span>
                 <span className="font-bold">{presentDays}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog for New Session */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-serif italic text-slate-800">Regjistro Prezencën</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2 py-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label className="text-slate-600">Data</Label>
                <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="rounded-xl border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600">Tema (Opcionale)</Label>
                <Input value={newTopic} onChange={e => setNewTopic(e.target.value)} placeholder="Tema e leksionit..." className="rounded-xl border-slate-200" />
              </div>
            </div>

            <h3 className="font-bold text-slate-700 mb-2">Lista e Studentëve</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-600">Studenti</TableHead>
                    <TableHead className="font-semibold text-slate-600 w-[180px]">Statusi</TableHead>
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
                        <Select value={attendanceState[s.id]} onValueChange={(val) => setAttendanceState(prev => ({...prev, [s.id]: val}))}>
                          <SelectTrigger className="h-8 rounded-lg border-slate-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="present">Prezent</SelectItem>
                            <SelectItem value="late">Me Vonesë</SelectItem>
                            <SelectItem value="absent">Mungesë</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 shrink-0">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">Anulo</Button>
            <Button onClick={saveSession} disabled={saving || students.length === 0} className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Ruaj
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
