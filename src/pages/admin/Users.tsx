import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  role?: string;
  roles?: string[];
  phone?: string;
  createdAt?: number;
}

const ALL_ROLES = [
  { id: 'student', label: 'Student' },
  { id: 'teacher', label: 'Mësues' },
  { id: 'admin', label: 'Administrator' },
  { id: 'superadmin', label: 'Admin i Përgjithshëm' },
];

export default function UsersAdmin() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { appUser } = useAuth();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({ fullName: '', email: '', roles: ['student'], phone: '' });

  const [editingRolesUser, setEditingRolesUser] = useState<UserData | null>(null);
  const [tempRoles, setTempRoles] = useState<string[]>([]);


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

  const getUserRoles = (u: UserData): string[] => {
    if (u.roles && u.roles.length > 0) return u.roles;
    if (u.role) return [u.role];
    return ['student'];
  };

  const handleSaveRoles = async () => {
    if (!editingRolesUser) return;
    if (editingRolesUser.id === appUser?.uid) {
      alert("Nuk mund të ndryshoni rolet tuaja!");
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (tempRoles.length === 0) setTempRoles(['student']);
      const finalRoles = tempRoles.length === 0 ? ['student'] : tempRoles;
      
      await updateDoc(doc(db, 'users', editingRolesUser.id), { roles: finalRoles });
      setUsers(users.map(u => u.id === editingRolesUser.id ? { ...u, roles: finalRoles } : u));
      setEditingRolesUser(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${editingRolesUser.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email) return;

    setIsSubmitting(true);
    try {
      const userData = {
        fullName: newUser.fullName,
        email: newUser.email,
        roles: newUser.roles,
        role: newUser.roles[0] || 'student',
        phone: newUser.phone,
        createdAt: Date.now()
      };
      
      // Use email as temporary ID until they sign in for the first time
      const tempId = newUser.email.replace(/\./g, '_'); // sanitize for doc ID
      
      await setDoc(doc(db, 'users', tempId), userData);
      setUsers([...users, { id: tempId, ...userData }]);
      setIsAddOpen(false);
      setNewUser({ fullName: '', email: '', roles: ['student'], phone: '' });
    } catch (error: any) {
      alert(error?.message || "Ndodhi një gabim gjatë regjistrimit të përdoruesit.");
      handleFirestoreError(error, OperationType.CREATE, 'users');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRole = (currentRoles: string[], roleId: string, setFunc: (val: string[]) => void) => {
    if (currentRoles.includes(roleId)) {
      setFunc(currentRoles.filter(r => r !== roleId));
    } else {
      setFunc([...currentRoles, roleId]);
    }
  };

  const canAssignRole = (roleId: string) => {
    if (roleId === 'superadmin' && !appUser?.roles.includes('superadmin')) return false;
    return true;
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>;
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-serif text-slate-800 italic">Menaxhimi i Përdoruesve</h1>
          <p className="text-sm text-slate-500 mt-1">Shtoni përdorues të rinj që do të kenë qasje në platformë.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Shto Përdorues
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl border-slate-200">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif italic text-slate-800">Pararegjistro Përdoruesin</DialogTitle>
              <p className="text-xs text-slate-500 mt-1">Përdoruesi do të mund të logohet duke përdorur Google ose Apple me këtë email.</p>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Emri i Plotë</Label>
                <Input id="fullName" value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})} required className="rounded-xl border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email i Logimit</Label>
                <Input id="email" type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required className="rounded-xl border-slate-200" placeholder="duhet të jetë email i Google/Apple" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Numri i Telefonit</Label>
                <Input id="phone" type="tel" value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} className="rounded-xl border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label>Rolet</Label>
                <div className="flex flex-wrap gap-2">
                  {ALL_ROLES.map(r => {
                    const active = newUser.roles.includes(r.id);
                    if (!canAssignRole(r.id)) return null;
                    return (
                      <Badge 
                        key={r.id} 
                        variant={active ? "default" : "outline"}
                        className={`cursor-pointer ${active ? 'bg-emerald-600 hover:bg-emerald-700' : 'text-slate-600'}`}
                        onClick={() => toggleRole(newUser.roles, r.id, (v) => setNewUser({...newUser, roles: v}))}
                      >
                        {r.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl">Anulo</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl">
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Përfundo'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Roles Edit Dialog */}
        <Dialog open={!!editingRolesUser} onOpenChange={(open) => !open && setEditingRolesUser(null)}>
          <DialogContent className="rounded-2xl border-slate-200">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif italic text-slate-800">Menaxho Rolet për {editingRolesUser?.fullName}</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <Label>Rolet e Caketuara</Label>
              <div className="flex flex-wrap gap-2">
                {ALL_ROLES.map(r => {
                  const active = tempRoles.includes(r.id);
                  const isSelfSuperadmin = appUser?.roles.includes('superadmin');
                  
                  // Cannot modify superadmin if you're not superadmin
                  const disabled = r.id === 'superadmin' && !isSelfSuperadmin;

                  return (
                    <Badge 
                      key={r.id} 
                      variant={active ? "default" : "outline"}
                      className={`
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        ${active ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent' : 'text-slate-600 border-slate-200'}
                      `}
                      onClick={() => {
                        if (!disabled) toggleRole(tempRoles, r.id, setTempRoles)
                      }}
                    >
                      {r.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={() => setEditingRolesUser(null)} className="rounded-xl">Anulo</Button>
              <Button type="button" disabled={isSubmitting} onClick={handleSaveRoles} className="bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Ruaj Rolet'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="border-slate-200 hover:bg-transparent">
              <TableHead className="text-slate-600 font-semibold h-12">Emri Plotë</TableHead>
              <TableHead className="text-slate-600 font-semibold h-12">Email</TableHead>
              <TableHead className="text-slate-600 font-semibold h-12">Të Dhëna</TableHead>
              <TableHead className="text-slate-600 font-semibold h-12">Rolet</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow className="border-slate-200">
                <TableCell colSpan={4} className="text-center py-12 text-slate-500 bg-white">Nuk ka përdorues të regjistruar.</TableCell>
              </TableRow>
            ) : users.map(user => {
              const uRoles = getUserRoles(user);
              return (
                <TableRow key={user.id} className="border-slate-100 hover:bg-slate-50/50">
                  <TableCell className="font-medium text-slate-700">{user.fullName}</TableCell>
                  <TableCell className="text-slate-500">{user.email}</TableCell>
                  <TableCell className="text-slate-500 text-xs">
                    {user.phone && <div>Tel: {user.phone}</div>}
                    {user.createdAt && <div>Shtuar: {new Date(user.createdAt).toLocaleDateString()}</div>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 flex-wrap">
                      {uRoles.map(r => (
                        <Badge key={r} variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none">
                          {ALL_ROLES.find(ar => ar.id === r)?.label || r}
                        </Badge>
                      ))}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-full"
                        onClick={() => {
                           setTempRoles(uRoles);
                           setEditingRolesUser(user);
                        }}
                        disabled={user.id === appUser?.uid}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
