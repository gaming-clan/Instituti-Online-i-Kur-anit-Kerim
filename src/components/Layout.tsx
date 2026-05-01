import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Calendar, GraduationCap, LayoutDashboard, LogOut, Users, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function Layout() {
  const { appUser, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Paneli i Përgjithshëm', href: '/', icon: LayoutDashboard, roles: ['student', 'teacher', 'admin', 'superadmin'] },
    { name: 'Klasat e Mia', href: '/classes/my', icon: BookOpen, roles: ['student'] },
    { name: 'Klasa të Disponueshme', href: '/classes/available', icon: Calendar, roles: ['student'] },
    { name: 'Mësimdhënia Ime', href: '/teacher/classes', icon: BookOpen, roles: ['teacher'] },
    { name: 'Menaxho Lëndët', href: '/admin/subjects', icon: BookOpen, roles: ['admin', 'superadmin'] },
    { name: 'Menaxho Klasat', href: '/admin/classes', icon: Calendar, roles: ['admin', 'superadmin'] },
    { name: 'Përdoruesit', href: '/admin/users', icon: Users, roles: ['admin', 'superadmin'] },
  ].filter(item => appUser?.roles && appUser.roles.some(r => item.roles.includes(r)));

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Navigation Sidebar */}
      <nav className="w-64 bg-emerald-950 flex flex-col p-6 text-white border-r border-emerald-800 z-10 hidden md:flex">
        <div className="mb-10">
          <div className="text-emerald-400 font-bold text-xl leading-tight uppercase tracking-widest">I.O.K.K</div>
          <div className="text-[10px] text-emerald-200/60 uppercase tracking-tighter">Instituti Online i Kur'anit Kerim</div>
        </div>
        
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || (location.pathname.startsWith(item.href) && item.href !== '/');
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-emerald-900/50 border border-emerald-700/50 text-white"
                    : "hover:bg-emerald-900/30 text-emerald-200/80"
                )}
              >
                {isActive && <div className="w-2 h-2 rounded-full bg-emerald-400"></div>}
                <item.icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-emerald-400" : "text-emerald-200/80 group-hover:text-emerald-300"
                )} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto pt-6 border-t border-emerald-800/50">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-col md:flex-row items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity outline-none">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0">
                  {appUser?.fullName?.substring(0, 2) || 'U'}
                </div>
                <div className="min-w-0 hidden md:block text-left">
                  <div className="text-xs font-bold text-white truncate">{appUser?.fullName}</div>
                  <div className="text-[10px] text-emerald-400 capitalize truncate">{appUser?.roles?.join(', ')} • {appUser?.uid.substring(0,6)}</div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuLabel>Llogaria Ime</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Dilni</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header hidden on desktop */}
        <header className="md:hidden h-16 bg-emerald-950 border-b border-emerald-800 flex items-center justify-between px-6 shadow-sm z-10 w-full text-white">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold text-xl leading-tight uppercase tracking-widest">I.O.K.K</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity outline-none">
                <Avatar className="h-9 w-9 bg-emerald-700 text-white rounded-full border border-emerald-600">
                  <AvatarFallback className="font-semibold text-xs uppercase">{appUser?.fullName?.substring(0, 2) || 'U'}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuLabel>{appUser?.fullName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Dilni</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
