
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <style>{`
        @keyframes neural-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        .neural-bg {
          background-image: radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.15) 1px, transparent 0);
          background-size: 32px 32px;
        }
        .floating-orb {
          filter: blur(80px);
          animation: neural-pulse 8s infinite ease-in-out;
        }
      `}</style>

      {/* Futuristic Background Layer */}
      <div className="absolute inset-0 neural-bg pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full floating-orb"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full floating-orb delay-1000"></div>

      <div className="w-full max-w-6xl bg-white/95 backdrop-blur-xl rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden flex flex-col md:flex-row relative z-10 transition-all duration-700">
        
        {/* Left Interactive Panel */}
        <div className="md:w-5/12 bg-slate-900 p-12 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-12 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-500/50">P</div>
              <span className="text-2xl font-black tracking-tighter">PotentialAI</span>
            </Link>
            
            <h2 className="text-4xl lg:text-5xl font-black leading-[1.1] mb-8">
              {isLogin ? (
                <>Return to the <br/><span className="text-indigo-400">Frontier.</span></>
              ) : (
                <>Calibrate your <br/><span className="text-indigo-400">Trajectory.</span></>
              )}
            </h2>
            
            <p className="text-slate-400 text-lg leading-relaxed font-medium mb-12 max-w-xs">
              {isLogin 
                ? "Your verified potential awaits. Re-sync with our AI recruitment cloud." 
                : "Proof of talent, beyond the CV. Start your neural career mapping."}
            </p>

            <div className="space-y-6">
              <div className="flex -space-x-3">
                {[...Array(5)].map((_, i) => (
                  <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 40}`} className="w-12 h-12 rounded-2xl border-4 border-slate-900 bg-white" alt="active user" />
                ))}
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 border-4 border-slate-900 flex items-center justify-center text-[10px] font-black">2.4k+</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Network Growth Pulse</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                </div>
                <div className="text-3xl font-black tabular-nums">142,892</div>
                <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase">Signals Synchronized Today</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            Powered by GPT-4o-Neural-Engine
          </div>
        </div>

        {/* Right Auth Form */}
        <div className="md:w-7/12 p-8 lg:p-20 flex flex-col justify-center bg-white">
          <div className="flex justify-between items-center mb-12">
            <div className="inline-flex bg-slate-100 p-1.5 rounded-[2rem] border border-slate-200">
              <button 
                onClick={() => { setIsLogin(true); setError(null); }}
                className={`px-10 py-3 rounded-[1.5rem] text-xs font-black transition-all ${isLogin ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-indigo-600'}`}
              >
                Calibration (Login)
              </button>
              <button 
                onClick={() => { setIsLogin(false); setError(null); }}
                className={`px-10 py-3 rounded-[1.5rem] text-xs font-black transition-all ${!isLogin ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-indigo-600'}`}
              >
                Initialization (Signup)
              </button>
            </div>
            <Link to="/" className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-slate-50 rounded-2xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          </div>

          {error && (
            <div className="mb-8 p-6 bg-red-50 border border-red-100 text-red-600 rounded-[2rem] text-sm font-bold flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">⚠️</div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-6">
                <button 
                  type="button"
                  onClick={() => setRole(UserRole.CANDIDATE)}
                  className={`relative p-6 rounded-[2.5rem] border-2 text-left transition-all ${role === UserRole.CANDIDATE ? 'border-indigo-600 bg-indigo-50/30 ring-4 ring-indigo-50' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'}`}
                >
                  <span className="text-3xl mb-3 block">🧬</span>
                  <span className="block font-black text-slate-900">Candidate</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Sync Talent</span>
                  {role === UserRole.CANDIDATE && <div className="absolute top-4 right-4 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>}
                </button>
                <button 
                  type="button"
                  onClick={() => setRole(UserRole.COMPANY)}
                  className={`relative p-6 rounded-[2.5rem] border-2 text-left transition-all ${role === UserRole.COMPANY ? 'border-indigo-600 bg-indigo-50/30 ring-4 ring-indigo-50' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'}`}
                >
                  <span className="text-3xl mb-3 block">🛰️</span>
                  <span className="block font-black text-slate-900">Enterprise</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Deploy Roles</span>
                  {role === UserRole.COMPANY && <div className="absolute top-4 right-4 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>}
                </button>
              </div>
            )}

            <div className="space-y-6">
              {!isLogin && (
                <div className="group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2 block group-focus-within:text-indigo-600 transition-colors">Neural Signature (Full Name)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      placeholder="E.g. Elon Musk"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] py-5 px-8 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-slate-300 font-bold text-slate-900"
                    />
                  </div>
                </div>
              )}

              <div className="group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2 block group-focus-within:text-indigo-600 transition-colors">Digital Identity (Email)</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@neural.link"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] py-5 px-8 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-slate-300 font-bold text-slate-900"
                />
              </div>

              <div className="group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2 block group-focus-within:text-indigo-600 transition-colors">Access Key (Password)</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] py-5 px-8 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-slate-300 font-bold text-slate-900"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-[0.2em] transition-colors">Restore Neural Link?</button>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-lg hover:bg-indigo-600 hover:shadow-[0_25px_50px_-15px_rgba(79,70,229,0.5)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-4 relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center gap-4">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Syncing Neural Data...
                  </>
                ) : (
                  <>
                    {isLogin ? "Synchronize Session" : "Deploy AI Profile"}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest leading-relaxed max-w-[280px]">
              By authenticating, you establish a <span className="text-indigo-600">verified cognitive anchor</span> in our talent ecosystem.
            </p>
            <div className="h-px w-12 bg-slate-100"></div>
            <p className="text-xs font-bold text-slate-400">
              New to PotentialAI? <button onClick={() => setIsLogin(false)} className="text-indigo-600 hover:underline">Begin Initialization</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
