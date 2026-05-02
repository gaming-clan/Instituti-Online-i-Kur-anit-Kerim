import React, { useState } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, BookOpen, Users, User, Check, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const ROLE_CONFIG: Record<UserRole, { label: string; icon: any; color: string; desc: string }> = {
  superadmin: {
    label: 'Super Admin',
    icon: Shield,
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    desc: 'Qasje të plotë në të gjitha funksionet e sistemit.'
  },
  admin: {
    label: 'Administrator',
    icon: Shield,
    color: 'bg-rose-100 text-rose-700 border-rose-200',
    desc: 'Menaxhimi i përdoruesve, lëndëve dhe klasave.'
  },
  teacher: {
    label: 'Mësues',
    icon: Users,
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    desc: 'Menaxhimi i orëve, materialeve dhe gradimi i studentëve.'
  },
  student: {
    label: 'Student',
    icon: User,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    desc: 'Ndiqni mësimet, dorëzoni detyrat dhe shihni rezultatet.'
  }
};

export default function RoleSelection() {
  const { appUser, activeRoles, setActiveRoles } = useAuth();
  const navigate = useNavigate();
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(activeRoles);

  if (!appUser) return null;

  const toggleRole = (role: UserRole) => {
    if (selectedRoles.includes(role)) {
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter(r => r !== role));
      }
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleConfirm = () => {
    setActiveRoles(selectedRoles);
    navigate('/dashboard');
  };

  const handleSelectAll = () => {
    setSelectedRoles(appUser.roles);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05)_0%,transparent_50%)]">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className="bg-emerald-800 p-2 rounded-xl shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-serif italic text-slate-800">Instituti i Kur'anit</span>
          </motion.div>
          
          <h1 className="text-3xl font-serif italic text-slate-900 mb-2">Zgjidhni Rolin Tuaj</h1>
          <p className="text-slate-500">Ju keni disa role në platformë. Zgjidhni si dëshironi të veproni sot.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {appUser.roles.map((role, idx) => {
            const config = ROLE_CONFIG[role];
            const isSelected = selectedRoles.includes(role);
            const Icon = config.icon;

            return (
              <motion.div
                key={role}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => toggleRole(role)}
                className="cursor-pointer"
              >
                <Card className={`h-full p-6 transition-all border-2 rounded-3xl group ${isSelected ? 'border-emerald-600 ring-4 ring-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-2xl ${config.color} transition-transform group-hover:scale-110`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-slate-900">{config.label}</h3>
                        {isSelected && (
                          <div className="h-6 w-6 bg-emerald-600 rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">{config.desc}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={handleSelectAll}
            className="w-full sm:w-auto h-14 px-8 rounded-2xl border-slate-200 text-slate-600 hover:bg-white"
          >
            Përdor të Gjitha Rolet
          </Button>
          <Button 
            onClick={handleConfirm}
            className="w-full sm:w-auto h-14 px-10 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl shadow-xl group"
          >
            Vazhdo në Dashboard <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
