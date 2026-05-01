import { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export default function UsersAdmin() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { appUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const data: UserData[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as UserData);
      });
      setUsers(data);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (userId === appUser?.uid) {
      alert("Nuk mund të ndryshoni rolin tuaj!");
      return;
    }
    
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>;
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-serif text-slate-800 italic">Menaxhimi i Përdoruesve</h1>
          <p className="text-sm text-slate-500 mt-1">Mund të ndryshoni rolet e përdoruesve.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="border-slate-200 hover:bg-transparent">
              <TableHead className="text-slate-600 font-semibold h-12">Emri Plotë</TableHead>
              <TableHead className="text-slate-600 font-semibold h-12">Email</TableHead>
              <TableHead className="text-slate-600 font-semibold h-12">Roli</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow className="border-slate-200">
                <TableCell colSpan={3} className="text-center py-12 text-slate-500 bg-white">Nuk ka përdorues të regjistruar.</TableCell>
              </TableRow>
            ) : users.map(user => (
              <TableRow key={user.id} className="border-slate-100 hover:bg-slate-50/50">
                <TableCell className="font-medium text-slate-700">{user.fullName}</TableCell>
                <TableCell className="text-slate-500">{user.email}</TableCell>
                <TableCell>
                  <Select 
                    value={user.role} 
                    onValueChange={(val) => handleRoleChange(user.id, val)}
                    disabled={user.id === appUser?.uid}
                  >
                    <SelectTrigger className="w-[140px] h-8 text-xs border-slate-200 rounded-lg">
                      <SelectValue placeholder="Zgjidh Rolin" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200">
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Mësues</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
