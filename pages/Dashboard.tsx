
import React from 'react';
import { User, UserRole, PotentialScores } from '../types';
import PotentialCard from '../components/PotentialCard';
import { Link } from 'react-router-dom';

const Dashboard: React.FC<{ user: User; traits: PotentialScores }> = ({ user, traits }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left: Score Overview */}
        <div className="lg:col-span-1">
          <PotentialCard 
            score={user.potentialScore}
            metrics={traits}
            name={user.name}
          />
          
          <div className="mt-8 bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group shadow-xl shadow-indigo-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-125 transition-transform duration-1000"></div>
            <h4 className="text-xl font-bold mb-2">Next Step: Interview</h4>
            <p className="text-indigo-100 text-sm mb-6">Your potential score is high enough to unlock AI-First Interviewing for 12 open roles.</p>
            <Link to="/interview" className="relative z-10 block w-full py-3 bg-white text-indigo-600 text-center rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg">
              Start AI Interview
            </Link>
          </div>
        </div>

        {/* Right: Activities & Recommendations */}
        <div className="lg:col-span-2 space-y-8">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Welcome back, {user.name.split(' ')[0]}</h2>
              <p className="text-slate-500 text-lg">Your potential engine is active. Your current trajectory is <span className="text-indigo-600 font-bold">Exponential</span>.</p>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Link Syncing</span>
            </div>
          </header>

          <section>
            <h3 className="text-xl font-bold mb-6 flex items-center justify-between">
              Pending Actions
              <span className="text-indigo-600 text-sm font-semibold cursor-pointer hover:underline">View All</span>
            </h3>
            <div className="grid gap-4">
              {[
                { title: 'Adaptive Logical Reasoning', time: '15 mins', score: 'Unlock +5 Potential', icon: '🧩', path: '/assessment', color: 'bg-blue-50 text-blue-600' },
                { title: 'Technical Capability Verification', time: '20 mins', score: 'Unlock Verified Badge', icon: '💻', path: '/assessment', color: 'bg-purple-50 text-purple-600' },
              ].map((action, i) => (
                <Link key={i} to={action.path} className="group bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{action.title}</h4>
                      <p className="text-sm text-slate-400 font-medium">{action.time} • Behavioral Analysis Active</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full uppercase tracking-widest">
                      {action.score}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">High Trajectory Matches</h3>
              <Link to="/jobs" className="text-sm font-bold text-indigo-600 hover:underline">Marketplace →</Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { company: 'Stripe', role: 'Growth Engineer', match: 98, icon: '💳' },
                { company: 'OpenAI', role: 'Technical Lead', match: 92, icon: '🧠' },
              ].map((job, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-500 group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-50 transition-colors">{job.icon}</div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest">Top Predict Match</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">{job.role}</h4>
                  <p className="text-sm text-slate-500 font-medium mb-6">{job.company}</p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-black text-indigo-600 uppercase tracking-widest">
                      <span>Neural Match</span>
                      <span>{job.match}%</span>
                    </div>
                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${job.match}%` }}></div>
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
