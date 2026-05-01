import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Layout } from '@/components/Layout';
import { Loader2 } from 'lucide-react';

// Pages
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import SubjectsAdmin from '@/pages/admin/Subjects';
import ClassesAdmin from '@/pages/admin/Classes';
import ClassDetails from '@/pages/shared/ClassDetails';
import MyClasses from '@/pages/student/MyClasses';
import AvailableClasses from '@/pages/student/AvailableClasses';
import TeacherClasses from '@/pages/teacher/Classes';
import UsersAdmin from '@/pages/admin/Users';

function AuthGuard({ children, roles }: { children: React.ReactNode, roles?: string[] }) {
  const { user, appUser, loading } = useAuth();

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>;
  }

  if (!user || !appUser) {
    return <Navigate to="/login" />;
  }

  if (roles && (!appUser.roles || !appUser.roles.some(r => roles.includes(r)))) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}>
            <Route index element={<Dashboard />} />
            
            {/* Admin Routes */}
            <Route path="admin/subjects" element={<AuthGuard roles={['admin', 'superadmin']}><SubjectsAdmin /></AuthGuard>} />
            <Route path="admin/classes" element={<AuthGuard roles={['admin', 'superadmin']}><ClassesAdmin /></AuthGuard>} />
            <Route path="admin/users" element={<AuthGuard roles={['admin', 'superadmin']}><UsersAdmin /></AuthGuard>} />
            
            {/* Teacher Routes */}
            <Route path="teacher/classes" element={<AuthGuard roles={['teacher']}><TeacherClasses /></AuthGuard>} />
            
            {/* Student Routes */}
            <Route path="classes/my" element={<AuthGuard roles={['student']}><MyClasses /></AuthGuard>} />
            <Route path="classes/available" element={<AuthGuard roles={['student']}><AvailableClasses /></AuthGuard>} />
            
            {/* Shared Route */}
            <Route path="classes/:classId" element={<AuthGuard roles={['student', 'teacher', 'admin', 'superadmin']}><ClassDetails /></AuthGuard>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
