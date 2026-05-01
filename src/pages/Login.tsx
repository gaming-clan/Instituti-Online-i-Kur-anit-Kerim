import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, Apple } from 'lucide-react';

export default function Login() {
  const { user, signIn, signInWithApple, loading } = useAuth();
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 z-10">
        <div className="bg-emerald-800 p-8 text-center text-white relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-90 relative z-10" />
          <h1 className="text-3xl font-serif italic tracking-tight mb-2 relative z-10">Instituti i Kur'anit</h1>
          <p className="text-emerald-100/90 text-sm relative z-10">Portali Online i Studimeve Islame</p>
        </div>
        <div className="p-8">
          
          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-xl text-sm border border-rose-200">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <p className="text-sm text-slate-500 text-center mb-6">Zgjidhni një mënyrë për t'u kyçur në llogarinë tuaj.</p>
            
            <Button
              className="w-full py-7 text-base rounded-2xl bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all flex items-center justify-center"
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
              {isSigningIn ? 'Po kyçesh...' : 'Vazhdo me Google'}
            </Button>

            <Button
              className={`w-full py-7 text-base rounded-2xl bg-black hover:bg-zinc-900 text-white shadow-md transition-all flex items-center justify-center ${isIOS ? 'border-2 border-emerald-400' : ''}`}
              onClick={handleAppleSignIn}
              disabled={isSigningIn}
            >
              {isSigningIn ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Apple className="w-5 h-5 mr-3" />
              )}
              {isSigningIn ? 'Po kyçesh...' : 'Vazhdo me Apple'}
            </Button>
          </div>
          
          <div className="mt-8 text-center pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium">
              Instituti i Kur'anit © 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
