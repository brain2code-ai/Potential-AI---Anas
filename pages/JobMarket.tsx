
import React, { useState } from 'react';
import { User, Job } from '../types';
import { useNavigate } from 'react-router-dom';

const JobMarket: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);

  const jobs: Job[] = [
    { id: 'j1', company: 'Linear', title: 'Senior Systems Architect', location: 'Remote', salary: '$180k - $240k', potentialMatch: 97 },
    { id: 'j2', company: 'Anthropic', title: 'Model Safety Engineer', location: 'San Francisco', salary: '$220k - $310k', potentialMatch: 84 },
    { id: 'j3', company: 'Figma', title: 'Design Technologist', location: 'New York', salary: '$160k - $210k', potentialMatch: 76 },
    { id: 'j4', company: 'OpenAI', title: 'Technical Staff', location: 'SF/Remote', salary: '$300k - $450k', potentialMatch: 92 }
  ];

  const handleApply = (job: Job) => {
    setApplyingJob(job);
  };

  const confirmApplication = () => {
    if (applyingJob) {
      // Pass the job details to the interview page
      navigate('/interview', { state: { job: applyingJob } });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">The Potential Market</h2>
        <p className="text-slate-500">Jobs that match your trajectory, not just your history.</p>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Discovery Filters</h4>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3">Min Potential Match</label>
                <input type="range" className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
              </div>
              <div className="space-y-3">
                {['Remote', 'Full-time', 'Contract'].map(opt => (
                  <label key={opt} className="flex items-center gap-3 text-sm font-medium text-slate-600 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-100 transition-all" /> 
                    <span className="group-hover:text-indigo-600 transition-colors">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          {jobs.map(job => (
            <div key={job.id} className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl group-hover:bg-indigo-50 transition-colors shrink-0">
                {job.company === 'Linear' ? '📐' : job.company === 'Anthropic' ? '🤖' : job.company === 'Figma' ? '🎨' : '🌐'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest">{job.company}</span>
                </div>
                <div className="flex gap-4 text-sm font-medium text-slate-400">
                  <span className="flex items-center gap-1.5">📍 {job.location}</span>
                  <span className="flex items-center gap-1.5">💰 {job.salary}</span>
                </div>
              </div>
              <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-slate-50 pt-6 md:pt-0 md:pl-10 shrink-0">
                <div className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">Potential Match</div>
                <div className="text-4xl font-black text-slate-900 mb-6 tracking-tighter">{job.potentialMatch}%</div>
                <button 
                  onClick={() => handleApply(job)}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
                >
                  Apply Instantly
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Confirmation Modal */}
      {applyingJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl border border-slate-100">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-8">🚀</div>
            <h3 className="text-3xl font-black text-slate-900 text-center mb-4 tracking-tight">Initialize HR Sync?</h3>
            <p className="text-slate-500 text-center mb-10 leading-relaxed">
              Applying for <span className="font-bold text-slate-900">{applyingJob.title}</span> at <span className="font-bold text-indigo-600">{applyingJob.company}</span>. 
              Our AI HR agent, <span className="font-bold text-slate-900">Aria</span>, will conduct your potential evaluation immediately.
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={confirmApplication}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
              >
                Start AI Interview
              </button>
              <button 
                onClick={() => setApplyingJob(null)}
                className="w-full py-4 bg-white text-slate-400 font-bold hover:text-slate-600 transition-colors"
              >
                Cancel Application
              </button>
            </div>
            <p className="mt-8 text-[10px] text-center font-black text-slate-300 uppercase tracking-widest">
              Camera & Microphone access required for recording
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobMarket;
