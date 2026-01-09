
import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts';

interface Candidate {
  id: string;
  name: string;
  role: string;
  potential: number;
  integrity: number;
  velocity: string;
  status: string;
  jobId: string;
  timestamp: string;
  metrics: {
    learning: number;
    adaptability: number;
    curiosity: number;
    performance: number;
  };
}

interface NewJobPost {
  title: string;
  description: string;
  skills: string[];
  salaryMin: string;
  salaryMax: string;
  location: string;
  dna: string;
}

const CompanyDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [activeStage, setActiveStage] = useState<'Applied' | 'Interviewed' | 'HumanReview'>('Interviewed');
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  
  // New Job State
  const [newJob, setNewJob] = useState<NewJobPost>({
    title: '',
    description: '',
    skills: [],
    salaryMin: '',
    salaryMax: '',
    location: 'Remote',
    dna: ''
  });
  const [skillInput, setSkillInput] = useState('');

  const [activeJobs, setActiveJobs] = useState([
    { id: 'j1', title: 'Senior Systems Architect', applicants: 12, openSince: '4 days ago' },
    { id: 'j2', title: 'Growth Engineer', applicants: 45, openSince: '1 week ago' },
    { id: 'j3', title: 'AI Model Safety', applicants: 8, openSince: '2 days ago' },
  ]);

  const candidates: Candidate[] = useMemo(() => [
    { id: 'c1', name: 'Alex Rivera', role: 'Full Stack', potential: 96, integrity: 100, velocity: 'Exponential', status: 'Interviewed', jobId: 'j1', timestamp: '2h ago', metrics: { learning: 98, adaptability: 94, curiosity: 90, performance: 88 } },
    { id: 'c2', name: 'Sarah Chen', role: 'UI Architect', potential: 92, integrity: 95, velocity: 'High', status: 'HumanReview', jobId: 'j2', timestamp: '5h ago', metrics: { learning: 92, adaptability: 95, curiosity: 88, performance: 85 } },
    { id: 'c3', name: 'Marcus V.', role: 'DevOps', potential: 84, integrity: 42, velocity: 'Stable', status: 'Applied', jobId: 'j1', timestamp: '1d ago', metrics: { learning: 75, adaptability: 80, curiosity: 82, performance: 84 } },
    { id: 'c4', name: 'Elena Rossi', role: 'Lead Data', potential: 98, integrity: 100, velocity: 'High', status: 'Interviewed', jobId: 'j3', timestamp: '1h ago', metrics: { learning: 99, adaptability: 96, curiosity: 94, performance: 92 } },
    { id: 'c5', name: 'Lila Vance', role: 'Product Lead', potential: 89, integrity: 88, velocity: 'Consistent', status: 'HumanReview', jobId: 'j2', timestamp: '3h ago', metrics: { learning: 85, adaptability: 88, curiosity: 92, performance: 89 } },
    { id: 'c6', name: 'James Wilson', role: 'Backend Lead', potential: 94, integrity: 98, velocity: 'High', status: 'Interviewed', jobId: 'j1', timestamp: '30m ago', metrics: { learning: 95, adaptability: 92, curiosity: 88, performance: 96 } },
  ], []);

  const chartData = [
    { name: 'Learning', value: 88 },
    { name: 'Adaptability', value: 92 },
    { name: 'Performance', value: 75 },
    { name: 'Curiosity', value: 82 },
  ];

  const filteredCandidates = candidates.filter(c => {
    const stageMatch = c.status === activeStage;
    const jobMatch = selectedJobId === 'all' || c.jobId === selectedJobId;
    return stageMatch && jobMatch;
  });

  const toggleCandidateSelection = (id: string) => {
    setSelectedCandidateIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      setNewJob(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setNewJob(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handlePostJob = () => {
    const id = `j${activeJobs.length + 1}`;
    setActiveJobs(prev => [...prev, { id, title: newJob.title, applicants: 0, openSince: 'Just now' }]);
    setIsPostJobModalOpen(false);
    setNewJob({ title: '', description: '', skills: [], salaryMin: '', salaryMax: '', location: 'Remote', dna: '' });
  };

  const selectedCandidatesForComparison = candidates.filter(c => selectedCandidateIds.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            Enterprise Command
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Talent Acquisition Center</h2>
          <p className="text-slate-500">Managing {candidates.length} active neural candidates across {activeJobs.length} roles.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-3 bg-white border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Export Archive
          </button>
          <button 
            onClick={() => setIsPostJobModalOpen(true)}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 hover:scale-105 transition-all active:scale-95"
          >
            + Post Neural Role
          </button>
        </div>
      </header>

      {/* High Level Stats Matrix */}
      <div className="grid lg:grid-cols-4 gap-8 mb-12">
        {[
          { label: 'Applied', key: 'Applied', color: 'bg-slate-50', text: 'text-slate-900', count: candidates.filter(c => c.status === 'Applied').length },
          { label: 'Aria Interviewed', key: 'Interviewed', color: 'bg-indigo-600', text: 'text-white', count: candidates.filter(c => c.status === 'Interviewed').length },
          { label: 'Human Review', key: 'HumanReview', color: 'bg-emerald-500', text: 'text-white', count: candidates.filter(c => c.status === 'HumanReview').length },
        ].map(stage => (
          <button 
            key={stage.key}
            onClick={() => { setActiveStage(stage.key as any); setSelectedCandidateIds([]); }}
            className={`p-8 rounded-[2.5rem] border-2 text-left transition-all relative overflow-hidden group ${
              activeStage === stage.key ? `border-indigo-600 ${stage.color} shadow-2xl` : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
            }`}
          >
            <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${activeStage === stage.key ? 'opacity-80' : 'text-slate-400'}`}>{stage.label}</div>
            <div className={`text-4xl font-black ${activeStage === stage.key ? 'text-white' : 'text-slate-900'}`}>
              {stage.count}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className={`h-1.5 w-12 rounded-full overflow-hidden ${activeStage === stage.key ? 'bg-white/20' : 'bg-slate-100'}`}>
                <div className={`h-full ${activeStage === stage.key ? 'bg-white' : 'bg-indigo-600'} w-2/3`}></div>
              </div>
              <span className={`text-[10px] font-bold ${activeStage === stage.key ? 'text-white' : 'text-indigo-600'}`}>+12.4% Neural Inflow</span>
            </div>
          </button>
        ))}
        <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-center border border-white/5 shadow-2xl">
           <div className="relative z-10">
             <div className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">Aria Intelligence</div>
             <p className="text-sm font-medium leading-relaxed">System recommends prioritizing <span className="text-indigo-400 font-bold">Growth Engineer</span> applicants today.</p>
           </div>
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[60px] rounded-full -mr-16 -mt-16"></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 mb-24">
        {/* Left: Application Tracker */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
            <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Application Feed</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Stage: {activeStage}</p>
              </div>
              
              <div className="flex gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100 self-stretch sm:self-auto">
                <button 
                  onClick={() => setSelectedJobId('all')}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${selectedJobId === 'all' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  All Roles
                </button>
                {activeJobs.map(job => (
                  <button 
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${selectedJobId === job.id ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {job.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((c, i) => (
                  <div key={i} className={`p-8 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-all flex flex-wrap lg:flex-nowrap items-center gap-8 group ${selectedCandidateIds.includes(c.id) ? 'bg-indigo-50/30' : ''}`}>
                    <div className="flex items-center gap-4">
                      <input 
                        type="checkbox" 
                        checked={selectedCandidateIds.includes(c.id)}
                        onChange={() => toggleCandidateSelection(c.id)}
                        className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-100 cursor-pointer"
                      />
                      <div className="relative shrink-0">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`} className="w-16 h-16 bg-slate-100 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt={c.name} />
                        <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-white ${c.potential > 90 ? 'bg-indigo-600' : 'bg-slate-400'}`}>
                          {c.potential}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 text-lg leading-none">{c.name}</h4>
                        {c.integrity < 60 && (
                          <span className="bg-red-500/10 text-red-600 text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                            Risk Alert
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 font-medium">Applied for <span className="text-slate-900 font-bold">{activeJobs.find(j => j.id === c.jobId)?.title || 'Neural Role'}</span></p>
                    </div>

                    <div className="flex gap-8 shrink-0">
                      <div className="text-center w-24">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Potential</div>
                        <div className="text-2xl font-black text-slate-900 tracking-tighter">{c.potential}%</div>
                      </div>
                      <div className="text-center w-24 border-l border-slate-100 pl-8">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Velocity</div>
                        <div className="text-sm font-black text-indigo-600 uppercase tracking-widest">{c.velocity}</div>
                      </div>
                    </div>

                    <div className="shrink-0 flex gap-2">
                      <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-xs hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm">
                        Neural Archive
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-slate-300">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-6">🔍</div>
                  <h4 className="text-xl font-bold text-slate-400">No neural signals in this sector</h4>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Insights */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm overflow-hidden relative">
            <h3 className="text-xl font-bold mb-8">Talent Quality Mix</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value > 85 ? '#6366f1' : '#cbd5e1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col items-center text-center shadow-2xl relative overflow-hidden group">
            <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center text-4xl mb-8 relative z-10">📹</div>
            <h4 className="text-2xl font-black mb-4 relative z-10">Neural Interview Vault</h4>
            <p className="text-slate-400 text-sm mb-10 leading-relaxed relative z-10 px-4">
              Access the session archives for candidates in <span className="text-white font-bold">Interviewed</span> stage.
            </p>
            <button className="w-full py-5 bg-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95 relative z-10">
              Launch Global Reviewer
            </button>
          </div>
        </div>
      </div>

      {/* Post Neural Role Modal */}
      {isPostJobModalOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[4rem] w-full max-w-4xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Post Neural Role</h3>
                <p className="text-slate-500 font-medium">Define role parameters for the Aria matching engine.</p>
              </div>
              <button onClick={() => setIsPostJobModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              {/* Row 1: Core Info */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Role Title</label>
                  <input 
                    type="text" 
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                    placeholder="e.g. Lead Neural Architect"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 focus:bg-white focus:border-indigo-600 transition-all outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Location</label>
                  <select 
                    value={newJob.location}
                    onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 focus:bg-white focus:border-indigo-600 transition-all outline-none font-bold"
                  >
                    <option>Remote</option>
                    <option>On-site (SF)</option>
                    <option>On-site (NY)</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Salary & Skills */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Salary Band (Annual)</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="text" 
                      placeholder="Min ($)"
                      value={newJob.salaryMin}
                      onChange={(e) => setNewJob({...newJob, salaryMin: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 focus:bg-white focus:border-indigo-600 transition-all outline-none font-bold"
                    />
                    <span className="text-slate-300 font-black">-</span>
                    <input 
                      type="text" 
                      placeholder="Max ($)"
                      value={newJob.salaryMax}
                      onChange={(e) => setNewJob({...newJob, salaryMax: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 focus:bg-white focus:border-indigo-600 transition-all outline-none font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Neural Skills (Press Enter)</label>
                  <input 
                    type="text" 
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="e.g. Distributed Systems"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 focus:bg-white focus:border-indigo-600 transition-all outline-none font-bold"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newJob.skills.map(skill => (
                      <span key={skill} className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-lg flex items-center gap-2">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: Company DNA */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Company Pulse / Mission</label>
                <textarea 
                  rows={3}
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  placeholder="Describe your company trajectory and culture..."
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-4 px-6 focus:bg-white focus:border-indigo-600 transition-all outline-none font-bold resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Aria Evaluation Focus (DNA)</label>
                <textarea 
                  rows={2}
                  value={newJob.dna}
                  onChange={(e) => setNewJob({...newJob, dna: e.target.value})}
                  placeholder="What neural traits should Aria prioritize? (e.g. Curiosity, High Velocity Thinking)"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-4 px-6 focus:bg-white focus:border-indigo-600 transition-all outline-none font-bold resize-none"
                />
              </div>
            </div>

            <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
              <button 
                onClick={() => setIsPostJobModalOpen(false)}
                className="px-8 py-4 bg-white border border-slate-200 text-slate-500 hover:text-slate-700 rounded-2xl font-bold transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handlePostJob}
                disabled={!newJob.title}
                className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                Deploy Neural Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Comparison Dock */}
      {selectedCandidateIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] w-full max-w-2xl px-6 animate-in slide-in-from-bottom-10">
          <div className="bg-slate-950 rounded-[2.5rem] p-4 border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-center justify-between backdrop-blur-xl">
            <div className="flex items-center gap-4 pl-4">
              <div className="flex -space-x-3">
                {selectedCandidatesForComparison.map(c => (
                  <img key={c.id} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`} className="w-12 h-12 rounded-xl border-4 border-slate-900 bg-white" alt={c.name} />
                ))}
              </div>
              <div>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">Neural Comparison</span>
                <span className="text-white font-bold text-sm">{selectedCandidateIds.length}/3 Candidates Selected</span>
              </div>
            </div>
            <div className="flex gap-2 pr-2">
              <button 
                onClick={() => setSelectedCandidateIds([])}
                className="px-6 py-3 bg-white/5 text-white/50 hover:text-white rounded-2xl text-xs font-bold transition-all"
              >
                Clear
              </button>
              <button 
                onClick={() => setIsCompareModalOpen(true)}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                Compare Metrics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Comparison Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
          <div className="bg-white rounded-[4rem] w-full max-w-6xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Neural Trajectory Comparison</h3>
                <p className="text-slate-500 font-medium">Side-by-side behavioral analysis generated by Aria HR.</p>
              </div>
              <button onClick={() => setIsCompareModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-x-auto p-10">
              <div className="grid grid-cols-4 gap-8 min-w-[1000px]">
                <div className="flex flex-col justify-end gap-16 pb-12">
                   <div className="space-y-24">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Neural Match Score</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Integrity Index</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Growth Velocity</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Trajectory Map</div>
                   </div>
                </div>

                {selectedCandidatesForComparison.map(c => (
                  <div key={c.id} className="bg-slate-50/50 rounded-[3rem] p-8 border border-slate-100 flex flex-col items-center text-center">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`} className="w-24 h-24 rounded-3xl bg-white shadow-xl mb-4" alt={c.name} />
                    <h4 className="text-xl font-bold text-slate-900 mb-1">{c.name}</h4>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-12">{c.role}</span>

                    <div className="space-y-16 w-full">
                       <div className="flex flex-col items-center">
                          <span className="text-5xl font-black text-slate-900 tracking-tighter mb-2">{c.potential}%</span>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${c.potential}%` }}></div>
                          </div>
                       </div>
                       <div className="flex flex-col items-center">
                          <span className={`text-3xl font-black tracking-tighter mb-2 ${c.integrity < 60 ? 'text-red-500' : 'text-emerald-500'}`}>{c.integrity}%</span>
                          <div className={`w-full h-1.5 rounded-full overflow-hidden ${c.integrity < 60 ? 'bg-red-100' : 'bg-emerald-100'}`}>
                             <div className={`h-full transition-all duration-1000 ${c.integrity < 60 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${c.integrity}%` }}></div>
                          </div>
                       </div>
                       <div className="bg-white p-4 rounded-2xl border border-slate-200 w-full">
                          <span className="text-sm font-black text-indigo-600 uppercase tracking-widest">{c.velocity}</span>
                       </div>
                       <div className="h-[200px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <RadarChart cx="50%" cy="50%" outerRadius="60%" data={[
                                { subject: 'Learn', A: c.metrics.learning },
                                { subject: 'Adapt', A: c.metrics.adaptability },
                                { subject: 'Curious', A: c.metrics.curiosity },
                                { subject: 'Perf', A: c.metrics.performance }
                             ]}>
                                <PolarGrid stroke="#cbd5e1" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: 800 }} />
                                <Radar name={c.name} dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                             </RadarChart>
                          </ResponsiveContainer>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-10 bg-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl">🧠</div>
                  <div>
                     <h4 className="text-lg font-bold">Aria Strategic Insight</h4>
                     <p className="text-slate-400 text-sm max-w-xl">
                        Aria is analyzing the potential match based on your deployed roles. High learning velocity is trending among top candidates.
                     </p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => setIsCompareModalOpen(false)} className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all">Close Analysis</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;
