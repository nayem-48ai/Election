
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { auth, db, doc, getDoc, signOut } from './firebase';
import { onAuthStateChanged, User } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import { Navbar } from './components/Navbar';
import { AppUser } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || userData.displayName || 'User',
            role: userData.role || 'user',
            isApproved: userData.isApproved || false,
          });
        } else {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'User',
            role: 'user',
            isApproved: false,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <header className="no-print">
          <Navbar user={user} />
        </header>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage user={user} />} />
            <Route 
              path="/admin/*" 
              element={
                user && user.role === 'admin' && user.isApproved 
                ? <AdminDashboard user={user} /> 
                : <Navigate to="/login" />
              } 
            />
          </Routes>
        </main>
        <footer className="bg-slate-800 text-slate-300 py-8 px-4 text-center mt-auto no-print">
          <div className="container mx-auto">
            <p className="font-semibold text-white mb-2">Hat Madhnogor High School</p>
            <p className="text-sm">&copy; {new Date().getFullYear()} Student Result Management System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
