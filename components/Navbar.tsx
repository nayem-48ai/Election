
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, LogIn, LogOut, Home } from 'lucide-react';
import { signOut, auth } from '../firebase';
import { AppUser } from '../types';

interface NavbarProps {
  user: AppUser | null;
}

export const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800 hidden sm:block">EduResult</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium flex items-center gap-1">
            <Home className="w-4 h-4" /> <span className="hidden sm:inline">Home</span>
          </Link>
          
          {user && user.role === 'admin' && user.isApproved ? (
            <>
              <Link to="/admin" className="text-slate-600 hover:text-blue-600 font-medium flex items-center gap-1">
                <LayoutDashboard className="w-4 h-4" /> <span className="hidden sm:inline">Admin Panel</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 font-medium flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-1 shadow-md shadow-blue-200 transition-all"
            >
              <LogIn className="w-4 h-4" /> <span>Admin Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
