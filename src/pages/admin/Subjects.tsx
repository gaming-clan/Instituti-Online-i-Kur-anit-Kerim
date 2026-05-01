import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface Subject {
  id: string;
  title: string;
  description: string;
  createdAt: number;
}

export default function SubjectsAdmin() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'subjects'));
      const data: Subject[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Subject);
      });
      setSubjects(data);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'subjects', editingId), {
          title,
          description
        });
      } else {
        await addDoc(collection(db, 'subjects'), {
          title,
          description,
          createdAt: Date.now()
        });
      }
      setIsOpen(false);
      resetForm();
      fetchSubjects();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, editingId ? `subjects/${editingId}` : 'subjects');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (subject: Subject) => {
    setTitle(subject.title);
    setDescription(subject.description);
    setEditingId(subject.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('A jeni të sigurt? Kjo fshin lëndën.')) return;
    try {
      await deleteDoc(doc(db, 'subjects', id));
      fetchSubjects();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `subjects/${id}`);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEditingId(null);
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>;
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-serif text-slate-800 italic">Menaxhimi i Lëndëve</h1>
          <p className="text-sm text-slate-500 mt-1">Katalogu i lëndëve islame.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(!open) resetForm(); }}>
          <DialogTrigger render={<Button className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow-sm" />}>
              <Plus className="mr-2 h-4 w-4" />
              Shto Lëndë
          </DialogTrigger>
          <DialogContent className="rounded-2xl border-slate-200">
            <DialogHeader>
              <DialogTitle className="font-serif italic text-slate-800">{editingId ? 'Ndrysho Lëndën' : 'Shto Lëndë të Re'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-600">Titulli</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="p.sh. Fiqh I Mësimi" className="border-slate-200 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-600">Përshkrimi</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Detajet e lëndës..." className="border-slate-200 rounded-xl" />
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
              <TableHead className="text-slate-600 font-semibold h-12">Titulli</TableHead>
              <TableHead className="text-slate-600 font-semibold h-12">Përshkrimi</TableHead>
              <TableHead className="w-[100px] text-slate-600 font-semibold h-12">Veprime</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.length === 0 ? (
              <TableRow className="border-slate-200">
                <TableCell colSpan={3} className="text-center py-12 text-slate-500 bg-white">Nuk ka lëndë të regjistruara.</TableCell>
              </TableRow>
            ) : subjects.map(subject => (
              <TableRow key={subject.id} className="border-slate-100 hover:bg-slate-50/50">
                <TableCell className="font-medium text-slate-700">{subject.title}</TableCell>
                <TableCell className="text-slate-500 truncate max-w-sm">{subject.description}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(subject)} className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(subject.id)} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg">
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
