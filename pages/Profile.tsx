import React, { useState } from 'react';
import { User, Experience, PotentialScores } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ProfileProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  traits: PotentialScores;
}

const Profile: React.FC<ProfileProps> = ({ user, setUser, traits }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const radarData = [
    { subject: 'Technical', A: traits.performance, fullMark: 100 },
    { subject: 'Learning', A: traits.learning, fullMark: 100 },
    { subject: 'Adaptability', A: traits.adaptability, fullMark: 100 },
    { subject: 'Curiosity', A: traits.curiosity, fullMark: 100 },
    { subject: 'Trust', A: traits.trust, fullMark: 100 },
  ];

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    const updatedExp = user.experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setUser(prev => prev ? { ...prev, experience: updatedExp } : null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      {/* Header Profile Card */}
      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in duration-700">
        <div className="h-64 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 via-purple-600/30 to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <button className="absolute top-8 right-8 px-6 py-2.5 bg-white/10 backdrop-blur-md text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all">
            Update Archive
          </button>
        </div>
        
        <div className="px-8 md:px-16 pb-16 relative">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end -mt-20 mb-12 gap-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[3.2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <img 
                src={user.avatar} 
                className="relative w-48 h-48 rounded-[3rem] border-[12px] border-white shadow-2xl object-cover bg-white" 
                alt="Profile" 
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                {isEditingProfile ? (
                  <input 
                    type="text" 
                    value={user.name} 
                    onChange={(e) => setUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="text-5xl font-black text-slate-900 bg-slate-50 rounded-2xl px-4 py-2 outline-none border-2 border-indigo-100 focus:border-indigo-400 transition-all w-full lg:w-auto"
                  />
                ) : (
                  <h1 className="text-5xl font-black text-slate-900 tracking-tight">{user.name}</h1>
                )}
                <div className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
              </div>
              
              <div className="mb-6">
                {isEditingProfile ? (
                  <input 
                    type="text" 
                    value={user.headline} 
                    onChange={(e) => setUser(prev => prev ? { ...prev, headline: e.target.value } : null)}
                    className="text-2xl text-indigo-600 font-bold bg-slate-50 rounded-2xl px-4 py-2 block w-full outline-none border-2 border-indigo-50 focus:border-indigo-400 transition-all"
                  />
                ) : (
                  <p className="text-2xl text-indigo-600 font-bold">{user.headline}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 bg-slate-900 text-white px-6 py-2.5 rounded-2xl shadow-xl">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Potential Index</span>
                  <span className="text-2xl font-black">{user.potentialScore}</span>
                </div>
                <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-2.5 rounded-2xl border border-emerald-100">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Verified Trust</span>
                  <span className="text-2xl font-black">{user.trustScore}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className={`w-full lg:w-auto px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                isEditingProfile 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-200' 
                  : 'bg-indigo-600 text-white hover:shadow-2xl hover:shadow-indigo-200'
              }`}
            >
              {isEditingProfile ? 'Save Archive' : 'Edit Profile'}
            </button>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-12">
              <section>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Trajectory Synthesis</h3>
                {isEditingProfile ? (
                  <textarea 
                    value={user.bio}
                    onChange={(e) => setUser(prev => prev ? { ...prev, bio: e.target.value } : null)}
                    className="w-full text-slate-600 leading-relaxed text-xl bg-slate-50 border-2 border-indigo-50 rounded-[2rem] p-8 min-h-[200px] outline-none transition-all resize-none"
                  />
                ) : (
                  <p className="text-slate-600 leading-relaxed text-2xl font-medium">{user.bio}</p>
                )}
              </section>

              <section className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100">
                <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
                  Experience
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                </h3>
                <div className="space-y-12">
                  {user.experience.map(exp => (
                    <div key={exp.id} className="flex gap-8 group">
                      <div className="w-20 h-20 bg-white rounded-3xl flex-shrink-0 flex items-center justify-center text-4xl shadow-sm group-hover:shadow-md transition-all">🏢</div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                          <div className="flex-1 w-full">
                            {isEditingProfile ? (
                              <div className="space-y-2 mb-4">
                                <input value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} className="font-black text-slate-900 text-xl w-full bg-white rounded-xl px-3 py-1.5 outline-none border border-slate-200" />
                                <input value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="text-indigo-600 font-bold w-full bg-white rounded-xl px-3 py-1.5 outline-none border border-slate-200" />
                              </div>
                            ) : (
                              <>
                                <h4 className="font-black text-slate-900 text-2xl group-hover:text-indigo-600 transition-colors">{exp.role}</h4>
                                <p className="text-indigo-600 font-bold text-lg">{exp.company}</p>
                              </>
                            )}
                          </div>
                          <span className="px-4 py-1.5 bg-white rounded-xl text-xs font-black text-slate-400 uppercase tracking-widest shadow-sm">{exp.duration}</span>
                        </div>
                        <p className="text-slate-500 leading-relaxed font-medium">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl lg:sticky lg:top-24">
                <h3 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-widest text-center">Neural Loadout</h3>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#e2e8f0" strokeWidth={1} />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800 }} 
                      />
                      <Radar 
                        name="Growth" 
                        dataKey="A" 
                        stroke="#6366f1" 
                        strokeWidth={3}
                        fill="#6366f1" 
                        fillOpacity={0.4} 
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="p-6 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Global Ranking</span>
                    <span className="text-xl font-black text-indigo-600">Top 2%</span>
                  </div>
                  <div className="p-6 bg-indigo-600 text-white rounded-2xl text-center">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Verify My Profile</p>
                    <p className="text-lg font-black tracking-tight">Sync Behavioral Data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;