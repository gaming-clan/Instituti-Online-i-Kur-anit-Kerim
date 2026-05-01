import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AppClass {
  id: string;
  title: string;
  subjectId: string;
  teacherId: string;
  semester: string;
  createdAt: number;
}

interface UserSummary {
  id: string;
  fullName: string;
}

interface SubjectSummary {
  id: string;
  title: string;
}

export default function ClassesAdmin() {
  const [classes, setClasses] = useState<AppClass[]>([]);
  const [teachers, setTeachers] = useState<UserSummary[]>([]);
  const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form base
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [semester, setSemester] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [clsSnap, tchSnap, subSnap] = await Promise.all([
        getDocs(collection(db, 'classes')),
        getDocs(query(collection(db, 'users'), where('role', '==', 'teacher'))),
        getDocs(collection(db, 'subjects'))
      ]);

      setClasses(clsSnap.docs.map(d => ({ id: d.id, ...d.data() } as AppClass)));
      setTeachers(tchSnap.docs.map(d => ({ id: d.id, fullName: d.data().fullName })));
      setSubjects(subSnap.docs.map(d => ({ id: d.id, title: d.data().title })));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'classes/data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { title, subjectId, teacherId, semester };
      if (editingId) {
        await updateDoc(doc(db, 'classes', editingId), payload);
      } else {
        await addDoc(collection(db, 'classes'), { ...payload, createdAt: Date.now() });
      }
      setIsOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, editingId ? `classes/${editingId}` : 'classes');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (cls: AppClass) => {
    setTitle(cls.title);
    setSubjectId(cls.subjectId);
    setTeacherId(cls.teacherId);
    setSemester(cls.semester);
    setEditingId(cls.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('A jeni të sigurt? Kjo fshin klasën.')) return;
    try {
      await deleteDoc(doc(db, 'classes', id));
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `classes/${id}`);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSubjectId('');
    setTeacherId('');
    setSemester('');
    setEditingId(null);
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>;
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-serif text-slate-800 italic">Menaxhimi i Klasave</h1>
          <p className="text-sm text-slate-500 mt-1">Mundo të krijosh instanca të lëndëve.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Shto Klasë
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl border-slate-200">
            <DialogHeader>
              <DialogTitle className="font-serif italic text-slate-800">{editingId ? 'Ndrysho Klasën' : 'Shto Klasë të Re'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-600">Titulli i Klasës</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="p.sh. Fiqh Vjeshtë 2026" className="border-slate-200 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600">Lënda</Label>
                <Select value={subjectId} onValueChange={setSubjectId} required>
                  <SelectTrigger className="border-slate-200 rounded-xl"><SelectValue placeholder="Zgjidh Lëndën" /></SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200">
                    {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600">Mësuesi (Mësues)</Label>
                <Select value={teacherId} onValueChange={setTeacherId} required>
                  <SelectTrigger className="border-slate-200 rounded-xl"><SelectValue placeholder="Zgjidh Mësuesin" /></SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200">
                    {teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.fullName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester" className="text-slate-600">Semestri/Periudha</Label>
                <Input id="semester" value={semester} onChange={(e) => setSemester(e.target.value)} required placeholder="p.sh. Vjeshtë 2026" className="border-slate-200 rounded-xl" />
              </div>
              <div className="flex justify-end pt-4 gap-2">
                <Button type="button" variant="outline" className="rounded-xl border-slate-200" onClick={() => setIsOpen(false)}>Anulo</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ruaj
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="border-slate-200 hover:bg-transparent">
              <TableHead className="text-slate-600 font-semibold h-12">Klasa</TableHead>
              <TableHead className="text-slate-600 font-semibold h-12">Lënda</TableHead>
              <TableHead className="text-slate-600 font-semibold h-12">Mësuesi</TableHead>
              <TableHead className="text-slate-600 font-semibold h-12">Semestri</TableHead>
              <TableHead className="w-[100px] text-slate-600 font-semibold h-12">Veprime</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.length === 0 ? (
              <TableRow className="border-slate-200">
                <TableCell colSpan={5} className="text-center py-12 text-slate-500 bg-white">Nuk ka klasa të regjistruara.</TableCell>
              </TableRow>
            ) : classes.map(cls => (
              <TableRow key={cls.id} className="border-slate-100 hover:bg-slate-50/50">
                <TableCell className="font-medium text-slate-700">{cls.title}</TableCell>
                <TableCell className="text-slate-500">{subjects.find(s => s.id === cls.subjectId)?.title || 'N/A'}</TableCell>
                <TableCell className="text-slate-500">{teachers.find(t => t.id === cls.teacherId)?.fullName || 'N/A'}</TableCell>
                <TableCell className="text-slate-500">{cls.semester}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(cls)} className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(cls.id)} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
