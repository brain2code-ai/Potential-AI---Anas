
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User;
  logout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, logout }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Network', path: '/feed' },
    { label: 'Jobs', path: '/jobs' },
    { label: 'Interview', path: '/interview' },
    { label: 'Messages', path: '/messages' },
    { label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          PotentialAI
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative text-sm font-medium transition-colors ${
                location.pathname === item.path ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'
              }`}
            >
              {item.label}
              {item.label === 'Messages' && (
                <span className="absolute -top-1 -right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Link to="/profile" className="hidden md:flex flex-col items-end mr-2 hover:opacity-80 transition-opacity">
          <span className="text-sm font-bold text-slate-900 leading-none mb-1">{user.name}</span>
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{user.role}</span>
        </Link>
        <Link to="/profile">
          <img src={user.avatar} className="w-10 h-10 rounded-xl border-2 border-indigo-100 object-cover shadow-sm hover:scale-105 transition-transform" alt="avatar" />
        </Link>
        <button 
          onClick={logout}
          className="ml-4 text-[10px] font-black text-slate-300 hover:text-red-500 uppercase tracking-widest transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
