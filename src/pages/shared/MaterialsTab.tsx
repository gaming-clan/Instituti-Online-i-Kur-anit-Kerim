import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, doc, getDocs, addDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash2, FileText, Download, ExternalLink } from 'lucide-react';

interface Material {
  id: string;
  title: string;
  description: string;
  url: string;
  createdAt: any;
}

interface Props {
  classId: string;
  isTeacherOrAdmin: boolean;
}

export default function MaterialsTab({ classId, isTeacherOrAdmin }: Props) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, [classId]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, `classes/${classId}/materials`), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data: Material[] = [];
      snap.forEach(d => {
        data.push({ id: d.id, ...d.data() } as Material);
      });
      setMaterials(data);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'materials');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormTitle('');
    setFormDesc('');
    setFormUrl('');
    setIsDialogOpen(true);
  };

  const saveMaterial = async () => {
    if (!formTitle || !formUrl) return;
    setSaving(true);
    try {
      await addDoc(collection(db, `classes/${classId}/materials`), {
        title: formTitle,
        description: formDesc,
        url: formUrl,
        createdAt: serverTimestamp()
      });
      setIsDialogOpen(false);
      fetchMaterials();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'materials');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Jeni të sigurt që doni ta fshini këtë material?')) return;
    try {
      await deleteDoc(doc(db, `classes/${classId}/materials/${id}`));
      fetchMaterials();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'materials');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-emerald-600" /></div>;
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-700">Materialet e Kursit</h2>
          <p className="text-sm text-slate-500">Leksione, detyra dhe libra për këtë lëndë.</p>
        </div>
        {isTeacherOrAdmin && (
          <Button onClick={handleCreate} className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Shto Material
          </Button>
        )}
      </div>

      {materials.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <FileText className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <p className="text-slate-500">Nuk ka asnjë material të publikuar akoma.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map(mat => (
            <div key={mat.id} className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-300 transition-colors">
              <div>
                <h3 className="font-bold text-slate-700 mb-1">{mat.title}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-3">{mat.description}</p>
              </div>
              <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100">
                <a href={mat.url} target="_blank" rel="noreferrer" className="text-emerald-700 hover:text-emerald-800 text-sm font-semibold flex items-center gap-1">
                  <ExternalLink className="h-4 w-4" /> Hap Lidhjen
                </a>
                {isTeacherOrAdmin && (
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(mat.id)} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8 w-8 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog for New Material */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif italic text-slate-800">Shto Material të Ri</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-600">Titulli</Label>
              <Input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Skripta e Leksionit 1" className="rounded-xl border-slate-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-600">Lidhja (URL)</Label>
              <Input value={formUrl} onChange={e => setFormUrl(e.target.value)} placeholder="https://drive.google.com/..." className="rounded-xl border-slate-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-600">Përshkrimi</Label>
              <Textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Përshkrim i shkurtër..." className="rounded-xl border-slate-200" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">Anulo</Button>
            <Button onClick={saveMaterial} disabled={saving || !formTitle || !formUrl} className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Ruaj Materialin'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
