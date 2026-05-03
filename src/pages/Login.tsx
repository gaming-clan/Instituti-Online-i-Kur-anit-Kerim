import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, Apple, Mail } from 'lucide-react';

export default function Login() {
  const { user, signIn, signInWithApple, loading } = useAuth();
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMsg('');
    try {
      await signIn();
      navigate('/');
    } catch (error: any) {
      console.error(error);
      setIsSigningIn(false);
      setErrorMsg(error?.message || 'Ndodhi një gabim gjatë kyçjes me Google.');
    }
  };

  const handleAppleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMsg('');
    try {
      await signInWithApple();
      navigate('/');
    } catch (error: any) {
      console.error(error);
      setIsSigningIn(false);
      setErrorMsg('Hyrja me Apple dështoi. Sigurohuni që keni konfiguruar llogarinë saktë.');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      if (!firstName || !lastName || !phone || !password) {
        setErrorMsg('Të lutem plotëso të paktën Emrin, Mbiemrin, Numrin e Telefonit dhe Fjalëkalimin.');
        return;
      }
    } else {
      if (!email || !password) {
        setErrorMsg('Të lutem plotëso Email-in dhe Fjalëkalimin.');
        return;
      }
    }
    
    setIsSigningIn(true);
    setErrorMsg('');
    try {
      if (isRegistering) {
        const authEmail = email.trim() ? email.trim() : `${phone.replace(/\D/g, '')}@instituti.local`;
        const userCred = await createUserWithEmailAndPassword(auth, authEmail, password);
        const fullName = `${firstName.trim()} ${lastName.trim()}`;
        
        await updateProfile(userCred.user, { displayName: fullName });
        await setDoc(doc(db, 'users', userCred.user.uid), {
          email: authEmail,
          fullName: fullName,
          phone: phone,
          role: 'student',
          roles: ['student'],
          createdAt: Date.now()
        }, { merge: true });
        
      } else {
        const loginEmail = email.includes('@') ? email.trim() : `${email.replace(/\D/g, '')}@instituti.local`;
        await signInWithEmailAndPassword(auth, loginEmail, password);
      }
      navigate('/');
    } catch (error: any) {
      console.error(error);
      setIsSigningIn(false);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMsg('Kjo llogari ekziston tashmë.');
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        setErrorMsg('Të dhëna të gabuara.');
      } else if (error.code === 'auth/weak-password') {
         setErrorMsg('Fjalëkalimi duhet të ketë të paktën 6 karaktere.');
      } else {
        setErrorMsg(error?.message || 'Ndodhi një gabim gjatë autentifikimit.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcf9f8] p-4 font-sans relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#b0f0d6] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-[#ffe088] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_8px_30px_rgba(115,92,0,0.08)] overflow-hidden border border-[#003527]/10 z-10 my-8">
        <div className="bg-[#003527] p-8 text-center text-white relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-90 relative z-10 text-white" />
          <h1 className="text-3xl font-serif tracking-tight mb-2 relative z-10 text-white font-bold">Instituti i Kur'anit</h1>
          <p className="text-[#95d3ba] text-sm relative z-10">Portali Online i Studimeve Islame</p>
        </div>
        <div className="p-8">
          
          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-xl text-sm border border-rose-200">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isRegistering && (
                <>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Emri *</label>
                      <input 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="Emri"
                        disabled={isSigningIn}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Mbiemri *</label>
                      <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="Mbiemri"
                        disabled={isSigningIn}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Numri i Telefonit *</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                      placeholder="+355 6x xxx xxxx"
                      disabled={isSigningIn}
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {isRegistering ? 'Email (Opsionale)' : 'Email / Numër Telefoni'}
                </label>
                <input 
                  type={isRegistering ? "email" : "text"} 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  placeholder={isRegistering ? "name@example.com" : "name@example.com / numri"}
                  disabled={isSigningIn}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fjalëkalimi *</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="••••••••"
                  disabled={isSigningIn}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full py-6 text-base rounded-2xl bg-[#003527] hover:bg-[#064e3b] text-white shadow-md transition-all flex items-center justify-center mt-2"
                disabled={isSigningIn}
              >
                {isSigningIn ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Mail className="w-5 h-5 mr-3" />
                )}
                {isRegistering ? 'Regjistrohu' : 'Kyçu'}
              </Button>
            </form>

            <div className="relative pt-4 pb-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">ose vazhdo me</span>
              </div>
            </div>

            <Button
              className="w-full py-6 text-base rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all flex items-center justify-center"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
            >
              {isSigningIn ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Google
            </Button>

            <Button
              className={`w-full py-6 text-base rounded-2xl bg-black hover:bg-zinc-900 text-white shadow-md transition-all flex items-center justify-center ${isIOS ? 'border border-emerald-400' : ''}`}
              onClick={handleAppleSignIn}
              disabled={isSigningIn}
            >
              {isSigningIn ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Apple className="w-5 h-5 mr-3" />
              )}
              Apple
            </Button>
            
            <div className="mt-6 text-center text-sm text-[#404944]">
              {isRegistering ? (
                <p>Keni tashmë një llogari? <button onClick={() => setIsRegistering(false)} className="text-[#003527] font-bold hover:underline">Kyçu këtu</button></p>
              ) : (
                <p>Nuk keni llogari? <button onClick={() => setIsRegistering(true)} className="text-[#003527] font-bold hover:underline">Regjistrohu tani</button></p>
              )}
            </div>
            
          </div>
          
          <div className="mt-8 text-center pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium">
              Instituti i Kur'anit © 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
