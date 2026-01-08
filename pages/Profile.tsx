
import React, { useState } from 'react';
import { User, Skill, Experience, Education, PotentialScores } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ProfileProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  traits: PotentialScores;
}

const Profile: React.FC<ProfileProps> = ({ user, setUser, traits }) => {
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Technical' as const });

  const growthData = [
    { month: 'Jan', score: user.potentialScore - 15 },
    { month: 'Feb', score: user.potentialScore - 10 },
    { month: 'Mar', score: user.potentialScore - 5 },
    { month: 'Apr', score: user.potentialScore - 2 },
    { month: 'May', score: user.potentialScore },
  ];

  const radarData = [
    { subject: 'Technical', A: traits.performance, fullMark: 100 },
    { subject: 'Learning', A: traits.learning, fullMark: 100 },
    { subject: 'Adaptability', A: traits.adaptability, fullMark: 100 },
    { subject: 'Curiosity', A: traits.curiosity, fullMark: 100 },
    { subject: 'Trust', A: traits.trust, fullMark: 100 },
  ];

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    const skillToAdd: Skill = {
      name: newSkill.name,
      level: 50,
      category: newSkill.category as any,
      verified: false
    };

    setUser({
      ...user,
      skills: [...user.skills, skillToAdd]
    });

    setNewSkill({ name: '', category: 'Technical' });
    setIsAddingSkill(false);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    const updatedExp = user.experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setUser({ ...user, experience: updatedExp });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 relative">
          <button className="absolute top-6 right-8 px-6 py-2 bg-white/20 backdrop-blur-md text-white rounded-xl font-bold text-sm border border-white/30 hover:bg-white/30 transition-all">
            Edit Cover
          </button>
        </div>
        <div className="px-12 pb-12 relative">
          <div className="flex flex-col md:flex-row justify-between items-end -mt-16 mb-8 gap-6">
            <div className="relative group">
              <img 
                src={user.avatar} 
                className="w-40 h-40 rounded-[2.5rem] border-8 border-white shadow-2xl object-cover bg-white" 
                alt="Profile" 
              />
              <div className="absolute inset-0 bg-black/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white font-bold text-sm">
                Change
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 mb-1">
                {isEditingProfile ? (
                  <input 
                    type="text" 
                    value={user.name} 
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="text-4xl font-black text-slate-900 bg-slate-50 rounded-xl px-2 py-1 outline-none border-2 border-indigo-100 focus:border-indigo-400 transition-all"
                  />
                ) : (
                  <h1 className="text-4xl font-black text-slate-900">{user.name}</h1>
                )}
              </div>
              
              {isEditingProfile ? (
                <input 
                  type="text" 
                  value={user.headline} 
                  onChange={(e) => setUser({ ...user, headline: e.target.value })}
                  className="text-xl text-indigo-600 font-bold mb-4 bg-slate-50 rounded-xl px-2 py-1 block w-full outline-none border-2 border-indigo-50 focus:border-indigo-400 transition-all"
                />
              ) : (
                <p className="text-xl text-indigo-600 font-bold mb-4">{user.headline}</p>
              )}

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <span className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-black animate-pulse-subtle">
                  Potential Index: {user.potentialScore}%
                </span>
                <span className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-black">
                  Verified Trust: {user.trustScore}%
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className={`px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${
                  isEditingProfile 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100' 
                    : 'bg-indigo-600 text-white hover:shadow-lg hover:shadow-indigo-200'
                }`}
              >
                {isEditingProfile ? (
                  <><span>✓</span> Save Changes</>
                ) : (
                  <><span>✎</span> Edit Profile</>
                )}
              </button>
            </div>
          </div>
          <div className="max-w-3xl">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">About Me</h3>
            {isEditingProfile ? (
              <textarea 
                value={user.bio}
                onChange={(e) => setUser({ ...user, bio: e.target.value })}
                className="w-full text-slate-600 leading-relaxed text-lg bg-slate-50 border-2 border-indigo-50 rounded-2xl p-4 min-h-[150px] focus:border-indigo-400 focus:ring-0 outline-none transition-all resize-y"
              />
            ) : (
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">{user.bio}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <h3 className="text-2xl font-black text-slate-900 mb-8">Experience</h3>
            <div className="space-y-10">
              {user.experience.map(exp => (
                <div key={exp.id} className="flex gap-6 group">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl">🏢</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {isEditingProfile ? (
                          <>
                            <input value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} className="font-bold text-slate-900 text-lg w-full bg-slate-50 rounded-lg px-2 py-1 outline-none border-b-2 border-transparent focus:border-indigo-400" />
                            <input value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="text-indigo-600 font-bold w-full bg-slate-50 rounded-lg px-2 py-1 outline-none border-b-2 border-transparent focus:border-indigo-400" />
                          </>
                        ) : (
                          <>
                            <h4 className="font-bold text-slate-900 text-lg">{exp.role}</h4>
                            <p className="text-indigo-600 font-bold">{exp.company}</p>
                          </>
                        )}
                      </div>
                      <span className="text-sm text-slate-400 font-bold">{exp.duration}</span>
                    </div>
                    <p className="mt-3 text-slate-500 leading-relaxed text-sm">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-6">AI Behavioral Radar</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                  <Radar name="Growth" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
