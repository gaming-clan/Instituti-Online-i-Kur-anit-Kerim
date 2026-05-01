import { useAuth } from '@/context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function Login() {
  const { user, signIn, loading } = useAuth();
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signIn();
      navigate('/');
    } catch (error) {
      console.error(error);
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50/50 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
        <div className="bg-emerald-700 p-8 text-center text-white">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl font-bold tracking-tight mb-2">Instituti i Kur'anit</h1>
          <p className="text-emerald-100/90 text-sm">Portali Online i Studimeve Islame</p>
        </div>
        <div className="p-8">
          <div className="space-y-6">
            <Button
              className="w-full py-6 text-lg bg-white border-2 border-neutral-200 text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 shadow-sm transition-all"
              onClick={handleSignIn}
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
              {isSigningIn ? 'Po kyçesh...' : 'Kyçu me Google'}
            </Button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-neutral-500">
              Duke vazhduar, ju pranoni kushtet dhe rregulloret e platformës.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
