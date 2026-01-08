
import React from 'react';
import { Link } from 'react-router-dom';
import PotentialCard from '../components/PotentialCard';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              The Future of Hiring is AI-Powered
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8">
              Hire for Future <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Potential</span>, Not Past Performance.
            </h1>
            <p className="text-xl text-slate-500 mb-10 max-w-xl leading-relaxed">
              Traditional resumes are dead. Use our AI scoring engine to find high-growth talent through adaptive assessments and behavioral analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/auth?mode=signup&role=CANDIDATE"
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-center font-bold text-lg hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
              >
                Join as Candidate
              </Link>
              <Link 
                to="/auth?mode=signup&role=COMPANY"
                className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-700 text-center rounded-2xl font-bold text-lg hover:border-indigo-100 transition-all active:scale-95"
              >
                For Companies
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <span className="text-slate-400 text-sm font-medium">Already using PotentialAI?</span>
              <Link to="/auth?mode=login" className="text-indigo-600 font-bold hover:underline">Sign In</Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
            
            <div className="relative z-10 scale-110">
              <PotentialCard 
                score={94} 
                metrics={{
                  performance: 88,
                  learning: 98,
                  adaptability: 96,
                  trust: 100,
                  curiosity: 92
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Meet Aria Section */}
      <section className="bg-slate-950 py-32 px-6 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[30%] h-[30%] bg-indigo-600 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-purple-600 rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
          <div className="order-2 lg:order-1 flex justify-center">
            {/* Visual Representation of the AI Agent */}
            <div className="relative w-80 h-80 flex items-center justify-center">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse"></div>
              <div className="relative w-64 h-64 bg-slate-900 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
                <div className="flex gap-12 mb-8">
                  <div className="w-12 h-12 bg-black rounded-full border border-indigo-500/30 flex items-center justify-center">
                    <div className="w-6 h-6 bg-indigo-500 rounded-full blur-[4px] opacity-60"></div>
                    <div className="absolute w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="w-12 h-12 bg-black rounded-full border border-indigo-500/30 flex items-center justify-center">
                    <div className="w-6 h-6 bg-indigo-500 rounded-full blur-[4px] opacity-60"></div>
                    <div className="absolute w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex gap-1 h-8 items-end">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-1 bg-indigo-500 rounded-full animate-pulse" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.1}s` }}></div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-3">
                 <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Aria HR v2.5</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 text-white">
            <h4 className="text-indigo-400 font-black uppercase tracking-[0.3em] text-sm mb-6">Neural Interview Tech</h4>
            <h2 className="text-5xl font-black mb-8 leading-tight">Meet Aria, Your AI <br/>Career Architect.</h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              Don't just apply. Start a conversation with Aria. Our proprietary AI agent evaluates your 
              cognitive load, technical depth, and adaptive reasoning in real-time, delivering a 
              potential report that outshines any resume.
            </p>
            <ul className="space-y-4 mb-12">
              {[
                'Real-time Sentiment & Technical Depth Analysis',
                'Recorded Session Archives for Hiring Teams',
                'Instant Predictive Potential Scoring',
                'Human-in-the-loop Final Verification'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-200 font-medium">
                  <span className="text-indigo-500">✓</span> {item}
                </li>
              ))}
            </ul>
            <Link 
              to="/auth?mode=signup"
              className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-lg transition-all inline-block shadow-xl shadow-indigo-900/40"
            >
              Experience the Interview
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Unlocking Human Intelligence</h2>
            <p className="text-slate-500">Our proprietary engine measures what matters for tomorrow's challenges.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Adaptive Assessments', desc: 'Difficulty shifts in real-time based on cognitive load and accuracy.', icon: '🧠' },
              { title: 'AI Video Interviews', desc: 'Real-time sentiment and technical depth analysis with our proprietary AI bots.', icon: '📹' },
              { title: 'Trust-Score Verified', desc: 'Continuous anti-cheat monitoring ensures profile integrity and authenticity.', icon: '🛡️' }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
