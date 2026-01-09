import React from 'react';
import { User, UserRole, PotentialScores } from '../types';
import PotentialCard from '../components/PotentialCard';
import { Link } from 'react-router-dom';

const Dashboard: React.FC<{ user: User; traits: PotentialScores }> = ({ user, traits }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Score Overview (Sticky on Desktop) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="lg:sticky lg:top-24">
            <PotentialCard 
              score={user.potentialScore}
              metrics={traits}
              name={user.name}
            />
            
            <div className="mt-8 bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-xl shadow-indigo-200/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-125 transition-transform duration-1000"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-2xl">⚡</div>
                <h4 className="text-xl font-bold mb-2">Next Step: Interview</h4>
                <p className="text-indigo-100 text-sm mb-8 leading-relaxed">
                  Your potential score is in the top 5% globally. Unlock high-growth opportunities now.
                </p>
                <Link to="/interview" className="block w-full py-4 bg-white text-indigo-600 text-center rounded-2xl font-black hover:bg-slate-50 transition-all shadow-xl active:scale-95">
                  Start AI Interview
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Activities & Recommendations */}
        <div className="lg:col-span-8 space-y-12">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                Session Active
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
                Hello, {user.name.split(' ')[0]}
              </h2>
              <p className="text-slate-500 text-lg">
                Your potential engine is <span className="text-indigo-600 font-bold">Exponential</span>. Trajectory looks clear.
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+20}`} alt="user" />
                   </div>
                 ))}
               </div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                 <span className="text-emerald-500">Live</span> Sync
               </div>
            </div>
          </header>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900">Priority Missions</h3>
              <button className="text-indigo-600 text-sm font-bold hover:underline">View All</button>
            </div>
            <div className="grid gap-6">
              {[
                { title: 'Adaptive Logical Reasoning', time: '15 mins', boost: '+5 Potential', icon: '🧩', color: 'bg-blue-50 text-blue-600', border: 'hover:border-blue-200' },
                { title: 'Technical Capability Verification', time: '20 mins', boost: 'Verified Badge', icon: '💻', color: 'bg-purple-50 text-purple-600', border: 'hover:border-purple-200' },
              ].map((action, i) => (
                <Link key={i} to="/assessment" className={`group bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col sm:flex-row items-center justify-between hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 ${action.border}`}>
                  <div className="flex items-center gap-8 text-center sm:text-left">
                    <div className={`w-16 h-16 rounded-2xl ${action.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner`}>
                      {action.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-xl mb-1">{action.title}</h4>
                      <div className="flex items-center gap-3 justify-center sm:justify-start">
                        <span className="text-sm text-slate-400 font-bold">{action.time}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Analysis Ready</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 sm:mt-0">
                    <span className="inline-block px-6 py-3 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest group-hover:bg-indigo-600 transition-colors">
                      {action.boost}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900">Recommended Trajectory</h3>
              <Link to="/jobs" className="px-6 py-2 bg-slate-100 rounded-xl text-xs font-black text-slate-600 hover:bg-indigo-600 hover:text-white transition-all">Marketplace →</Link>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { company: 'Stripe', role: 'Growth Engineer', match: 98, icon: '💳', accent: 'bg-emerald-50 text-emerald-600' },
                { company: 'OpenAI', role: 'Technical Lead', match: 92, icon: '🧠', accent: 'bg-indigo-50 text-indigo-600' },
              ].map((job, i) => (
                <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 card-hover group">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 bg-slate-50 rounded-[1.25rem] flex items-center justify-center text-3xl group-hover:bg-indigo-50 transition-colors shadow-sm">{job.icon}</div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${job.accent}`}>Match Predicted</span>
                  </div>
                  <h4 className="font-black text-slate-900 text-xl mb-1">{job.role}</h4>
                  <p className="text-slate-500 font-bold mb-8">{job.company}</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Fit</span>
                      <span className="text-2xl font-black text-indigo-600 tracking-tighter">{job.match}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${job.match}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;