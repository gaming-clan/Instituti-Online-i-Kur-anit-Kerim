import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, doc, getDocs, addDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash2, Megaphone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Post {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: any;
}

interface Props {
  classId: string;
  isTeacherOrAdmin: boolean;
}

export default function PostsTab({ classId, isTeacherOrAdmin }: Props) {
  const { appUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [classId]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, `classes/${classId}/posts`), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data: Post[] = [];
      snap.forEach(d => {
        data.push({ id: d.id, ...d.data() } as Post);
      });
      setPosts(data);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormTitle('');
    setFormContent('');
    setIsDialogOpen(true);
  };

  const savePost = async () => {
    if (!formTitle || !formContent) return;
    setSaving(true);
    try {
      await addDoc(collection(db, `classes/${classId}/posts`), {
        title: formTitle,
        content: formContent,
        authorName: appUser?.fullName || 'I/E Panjohur',
        createdAt: serverTimestamp()
      });
      setIsDialogOpen(false);
      fetchPosts();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'posts');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Jeni të sigurt që doni ta fshini këtë njoftim?')) return;
    try {
      await deleteDoc(doc(db, `classes/${classId}/posts/${id}`));
      fetchPosts();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'posts');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-emerald-600" /></div>;
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-700">Njoftimet & Postimet</h2>
          <p className="text-sm text-slate-500">Qëndroni të përditësuar me lajmet e fundit të klasës.</p>
        </div>
        {isTeacherOrAdmin && (
          <Button onClick={handleCreate} className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Shto Njoftim
          </Button>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <Megaphone className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <p className="text-slate-500">Nuk ka asnjë njoftim akoma.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="border border-slate-200 bg-slate-50/50 rounded-xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{post.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">Publikuar nga: <span className="font-semibold">{post.authorName}</span></p>
                </div>
                {isTeacherOrAdmin && (
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8 w-8 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-wrap mt-2">{post.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Dialog for New Post */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif italic text-slate-800">Krijo Njoftim</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-600">Titulli</Label>
              <Input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Njoftim për provimin..." className="rounded-xl border-slate-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-600">Përmbajtja</Label>
              <Textarea value={formContent} onChange={e => setFormContent(e.target.value)} placeholder="Shkruani mesazhin tuaj..." className="rounded-xl border-slate-200 min-h-[150px]" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">Anulo</Button>
            <Button onClick={savePost} disabled={saving || !formTitle || !formContent} className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Publiko'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
