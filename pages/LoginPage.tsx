
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  googleProvider, 
  signInWithPopup, 
  auth, 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  signOut
} from '../firebase';
import { LogIn, ShieldCheck, AlertCircle, Mail, Lock, User as UserIcon, LogOut, Clock, ArrowRight } from 'lucide-react';
import { AppUser } from '../types';

interface LoginPageProps {
  user: AppUser | null;
}

const LoginPage: React.FC<LoginPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  if (user && user.role === 'admin' && user.isApproved) {
    return <Navigate to="/admin" />;
  }

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        if (!displayName) throw new Error('Full Name is required');
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName });
        await setDoc(doc(db, "users", result.user.uid), { email, displayName, role: 'user', isApproved: false, createdAt: new Date() });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  if (user && (!user.isApproved || user.role !== 'admin')) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center no-print">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border p-10 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6"><Clock className="w-8 h-8" /></div>
          <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
          <p className="text-slate-500 mb-8 text-sm">Account pending approval from Super Admin.</p>
          <button onClick={handleLogout} className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold">Sign Out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center no-print">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border overflow-hidden">
        <div className="bg-blue-600 p-8 text-center text-white"><h2 className="text-2xl font-black uppercase tracking-tight">Admin Gateway</h2></div>
        <div className="flex border-b">
          <button onClick={() => setMode('login')} className={`flex-1 py-4 text-xs font-bold uppercase ${mode === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>Log In</button>
          <button onClick={() => setMode('signup')} className={`flex-1 py-4 text-xs font-bold uppercase ${mode === 'signup' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>Sign Up</button>
        </div>
        <div className="p-8">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input type="text" placeholder="Full Name" required className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" value={displayName} onChange={e => setDisplayName(e.target.value)} />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <input type="email" placeholder="Email" required className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <input type="password" placeholder="Password" required className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {error && <div className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all">{loading ? '...' : mode === 'login' ? 'Sign In' : 'Create Account'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
