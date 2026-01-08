
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { supabase } from '../lib/supabase';

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'signup');
  const [role, setRole] = useState<UserRole>((searchParams.get('role') as UserRole) || UserRole.CANDIDATE);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLogin(searchParams.get('mode') !== 'signup');
    if (searchParams.get('role')) {
      setRole(searchParams.get('role') as UserRole);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        if (data.user) {
          // Navigation is handled by App.tsx onAuthStateChange listener
          navigate('/dashboard');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
              role: role,
              potential_initialized: true
            }
          }
        });
        if (error) throw error;
        
        if (data.user && data.session) {
           navigate('/dashboard');
        } else {
           alert("Neural link established. Please check your email to verify your cognitive footprint.");
           setIsLogin(true);
        }
      }
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden flex flex-col md:flex-row relative z-10 transition-all duration-500">
        {/* Left Branding Side */}
        <div className="md:w-5/12 bg-indigo-600 p-12 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full -ml-20 -mb-20 blur-2xl"></div>
          
          <div className="relative z-10">
            <Link to="/" className="text-3xl font-black mb-12 block tracking-tighter">PotentialAI</Link>
            <h2 className="text-4xl lg:text-5xl font-extrabold leading-[1.1] mb-8">
              {isLogin ? "Welcome back to the future." : "Uncover your hidden trajectory."}
            </h2>
            <p className="text-indigo-100 text-lg opacity-80 leading-relaxed font-medium">
              {isLogin 
                ? "Sign in to monitor your verified growth signals and continue your professional evolution." 
                : "Join a network of 120,000+ professionals proving their future value through AI-verified potential."}
            </p>
          </div>

          <div className="relative z-10 pt-12 border-t border-white/10 space-y-6">
            <div className="flex -space-x-3 mb-4">
              {[1, 2, 3, 4].map(i => (
                <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-white shadow-sm" alt="user" />
              ))}
              <div className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-indigo-600 flex items-center justify-center text-[10px] font-black">+3k</div>
            </div>
            <div>
              <p className="text-xs font-black text-indigo-200 uppercase tracking-[0.2em] mb-1">Growth Signals Captured Today</p>
              <div className="flex items-center gap-2">
                 <span className="text-xl font-black tabular-nums">14,282</span>
                 <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,1)]"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="md:w-7/12 p-12 lg:p-20 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-12">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              <button 
                onClick={() => { setIsLogin(true); setError(null); }}
                className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Log In
              </button>
              <button 
                onClick={() => { setIsLogin(false); setError(null); }}
                className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${!isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Sign Up
              </button>
            </div>
            <Link to="/" className="text-slate-300 hover:text-slate-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold animate-in slide-in-from-top-2 duration-300">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setRole(UserRole.CANDIDATE)}
                  className={`p-5 rounded-3xl border-2 text-left transition-all ${role === UserRole.CANDIDATE ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100/50' : 'border-slate-100 hover:border-slate-200'}`}
                >
                  <span className="text-2xl mb-2 block">🎯</span>
                  <span className="block font-black text-slate-900 text-sm">Candidate</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Prove Potential</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setRole(UserRole.COMPANY)}
                  className={`p-5 rounded-3xl border-2 text-left transition-all ${role === UserRole.COMPANY ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100/50' : 'border-slate-100 hover:border-slate-200'}`}
                >
                  <span className="text-2xl mb-2 block">🏢</span>
                  <span className="block font-black text-slate-900 text-sm">Company</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Hire Trajectory</span>
                </button>
              </div>
            )}

            <div className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="E.g. Alex Rivera"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4.5 px-6 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-slate-300 font-medium"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Neural ID (Email)</label>
                <input 
                  type="email" 
                  required
                  placeholder="alex@potential.ai"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4.5 px-6 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-slate-300 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Secure Passkey</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4.5 px-6 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-slate-300 font-medium"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-xs font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">Restore Link?</button>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5.5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg hover:bg-indigo-700 hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Syncing Neural Data...
                </>
              ) : (
                isLogin ? "Authenticate to Session" : "Initialize My AI Profile"
              )}
            </button>
          </form>

          <p className="mt-12 text-center text-xs text-slate-400 font-medium leading-relaxed max-w-sm mx-auto">
            By authenticating, you agree to our <span className="text-slate-900 font-bold underline cursor-pointer">Potential Verification Terms</span> and neural data privacy protocols.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
