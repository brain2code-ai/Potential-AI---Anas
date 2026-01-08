
import React, { useState, useMemo } from 'react';
import { User, Post } from '../types';

const SocialFeed: React.FC<{ user: User; onSignal: (type: 'LIKE' | 'COMMENT' | 'CONNECTION' | 'POST') => void }> = ({ user, onSignal }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'discover'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [minPotential, setMinPotential] = useState(0);
  const [roleFilter, setRoleFilter] = useState('All');
  const [postText, setPostText] = useState('');

  const [requests, setRequests] = useState([
    { id: 'r1', name: 'James Wilson', title: 'Full Stack Architect', avatar: 'https://picsum.photos/id/22/100/100', potential: 89 },
    { id: 'r2', name: 'Lila Vance', title: 'Product Strategist', avatar: 'https://picsum.photos/id/44/100/100', potential: 95 }
  ]);

  const handleAccept = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    onSignal('CONNECTION');
  };

  const handleDecline = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const handlePost = () => {
    if (!postText.trim()) return;
    onSignal('POST');
    setPostText('');
  };

  const discoveryTalent = [
    { id: 't1', name: 'Ethan Hunt', role: 'Security Engineer', potential: 96, skills: ['Rust', 'Zero Trust', 'Cloud'], avatar: 'https://picsum.photos/id/1/200/200' },
    { id: 't2', name: 'Sofia Vergara', role: 'UI/UX Lead', potential: 91, skills: ['Figma', 'System Design'], avatar: 'https://picsum.photos/id/2/200/200' },
    { id: 't3', name: 'David Goggins', role: 'Performance Coach', potential: 98, skills: ['Endurance', 'Mindset'], avatar: 'https://picsum.photos/id/3/200/200' },
    { id: 't4', name: 'Maya Angelou', role: 'Creative Director', potential: 88, skills: ['Storytelling', 'Copy'], avatar: 'https://picsum.photos/id/4/200/200' },
    { id: 't5', name: 'Nikola Tesla', role: 'Energy Architect', potential: 99, skills: ['AC', 'Innovation'], avatar: 'https://picsum.photos/id/5/200/200' },
    { id: 't6', name: 'Ada Lovelace', role: 'Algorithm Scientist', potential: 97, skills: ['Computation', 'Logic'], avatar: 'https://picsum.photos/id/6/200/200' },
  ];

  const filteredTalent = useMemo(() => {
    return discoveryTalent.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           t.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPotential = t.potential >= minPotential;
      const matchesRole = roleFilter === 'All' || t.role.includes(roleFilter);
      return matchesSearch && matchesPotential && matchesRole;
    });
  }, [searchQuery, minPotential, roleFilter]);

  const posts: Post[] = [
    {
      id: 'p1',
      author: {
        id: 'u2',
        name: 'Sarah Chen',
        role: 'Candidate',
        avatar: 'https://picsum.photos/id/65/200/200',
        potentialScore: 92,
        trustScore: 100
      } as any,
      content: "Just completed the AI Adaptive Assessment on PotentialAI! The system really pushed my logical reasoning boundaries. Proud to share that my Learning Velocity is now in the top 5% globally. #FutureHiring #PotentialScore",
      likes: 24,
      comments: 5,
      timestamp: '2h ago'
    },
    {
      id: 'p2',
      author: {
        id: 'u3',
        name: 'Jordan Smith',
        role: 'Company',
        avatar: 'https://picsum.photos/id/12/200/200',
        potentialScore: 0,
        trustScore: 100
      } as any,
      content: "We're officially switching all our technical hiring to Potential Score insights. Stop looking at resumes, start looking at trajectory! We have 5 new roles open for high-potential growth engineers.",
      likes: 156,
      comments: 42,
      timestamp: '5h ago'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-12">
      {/* Sidebar Profile */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm text-center">
          <img src={user.avatar} className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-indigo-50 object-cover" alt="avatar" />
          <h3 className="font-bold text-xl">{user.name}</h3>
          <p className="text-sm text-slate-500 mb-6 uppercase tracking-widest text-[10px] font-black">Verified Professional</p>
          <div className="bg-indigo-50 p-4 rounded-2xl mb-4">
            <div className="text-xs font-bold text-indigo-600 uppercase mb-1">Potential Score</div>
            <div className="text-2xl font-black text-indigo-900 animate-pulse-subtle">{user.potentialScore}</div>
          </div>
          <button className="w-full py-2 text-indigo-600 font-bold text-sm hover:underline">View Profile</button>
        </div>

        {/* Pending Requests Section */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm overflow-hidden">
          <h4 className="font-bold mb-4 flex items-center justify-between text-slate-900">
            Pending Requests
            <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-full text-[10px] font-black">{requests.length}</span>
          </h4>
          <div className="space-y-4">
            {requests.length > 0 ? (
              requests.map(req => (
                <div key={req.id} className="pb-4 border-b border-slate-50 last:border-0 last:pb-0 group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <img src={req.avatar} className="w-10 h-10 rounded-full object-cover border border-slate-100" alt={req.name} />
                      <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                        {req.potential}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold truncate text-slate-900">{req.name}</div>
                      <div className="text-[10px] text-slate-400 truncate uppercase tracking-tight">{req.title}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleAccept(req.id)}
                      className="py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-indigo-100 transition-all active:scale-95"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleDecline(req.id)}
                      className="py-1.5 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all active:scale-95"
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No pending requests</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-9 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-8 border-b border-slate-100 pb-2">
          <button 
            onClick={() => setActiveTab('feed')}
            className={`text-sm font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'feed' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Social Feed
          </button>
          <button 
            onClick={() => setActiveTab('discover')}
            className={`text-sm font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === 'discover' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Discover Talent
          </button>
        </div>

        {activeTab === 'feed' ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex gap-4 mb-4">
                  <img src={user.avatar} className="w-12 h-12 rounded-full object-cover" alt="user" />
                  <textarea 
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="Post an AI-verified achievement or insight..."
                    className="flex-1 bg-slate-50 rounded-2xl p-4 text-sm border-none focus:ring-2 focus:ring-indigo-100 outline-none resize-none placeholder:text-slate-400"
                    rows={2}
                  />
                </div>
                <div className="flex justify-between border-t border-slate-50 pt-4">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-xs font-bold transition-colors">
                      <span className="text-base">📷</span> Photo
                    </button>
                    <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-xs font-bold transition-colors">
                      <span className="text-base">📹</span> Video
                    </button>
                  </div>
                  <button 
                    onClick={handlePost}
                    disabled={!postText.trim()}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-indigo-100 transition-all disabled:opacity-50"
                  >
                    Post Signal
                  </button>
                </div>
              </div>

              {posts.map(post => (
                <div key={post.id} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-4 transition-all hover:border-slate-200">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="relative">
                        <img src={post.author.avatar} className="w-12 h-12 rounded-full object-cover" alt={post.author.name} />
                        {post.author.potentialScore > 0 && (
                          <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                            <div className="bg-indigo-600 text-white text-[7px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                              {post.author.potentialScore}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900">{post.author.name}</h4>
                          {post.author.potentialScore > 90 && (
                            <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-black tracking-tighter uppercase">High Potential</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-medium">{post.timestamp}</p>
                      </div>
                    </div>
                    <button className="text-slate-300 hover:text-slate-600 transition-colors px-2">•••</button>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-sm md:text-base">{post.content}</p>
                  <div className="flex gap-6 pt-4 border-t border-slate-50">
                    <button 
                      onClick={() => onSignal('LIKE')}
                      className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 text-xs font-bold transition-colors group"
                    >
                      <span className="text-base group-active:scale-150 transition-transform">⚡</span> {post.likes} Boosts
                    </button>
                    <button 
                      onClick={() => onSignal('COMMENT')}
                      className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 text-xs font-bold transition-colors"
                    >
                      <span className="text-base">💬</span> {post.comments} Thoughts
                    </button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 text-xs font-bold transition-colors ml-auto">
                      <span>🔗</span> Share
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                <h4 className="font-bold mb-6 text-slate-900">Trending Growth Signals</h4>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                    <span className="text-slate-500 font-medium group-hover:text-indigo-600">#Adaptability</span>
                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg text-[10px]">1.2k</span>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                    <span className="text-slate-500 font-medium group-hover:text-indigo-600">#LVSignal</span>
                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg text-[10px]">850</span>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                    <span className="text-slate-500 font-medium group-hover:text-indigo-600">#ScaleReady</span>
                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg text-[10px]">420</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                <h4 className="font-bold mb-6 text-slate-900">AI Suggested Connections</h4>
                <div className="space-y-6">
                  {[
                    { name: 'Dr. Elena Rossi', title: 'Neuroscience @ MIT', avatar: 'https://picsum.photos/id/60/100/100' },
                    { name: 'Marcus Wong', title: 'Senior Product Designer', avatar: 'https://picsum.photos/id/32/100/100' }
                  ].map((p, i) => (
                    <div key={i} className="flex items-center gap-3 group cursor-pointer">
                      <img src={p.avatar} className="w-10 h-10 rounded-full object-cover border border-slate-50" alt={p.name} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold truncate text-slate-900 group-hover:text-indigo-600 transition-colors">{p.name}</div>
                        <div className="text-[10px] text-slate-400 truncate uppercase tracking-widest">{p.title}</div>
                      </div>
                      <button 
                        onClick={() => onSignal('CONNECTION')}
                        className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* DISCOVER TAB VIEW */
          <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* ... Discovery UI remains similar but triggers CONNECTION signal ... */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, skills, or professional role..." 
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
                  />
                  <span className="absolute left-4 top-4 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                </div>
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Engineer">Engineers</option>
                  <option value="Designer">Designers</option>
                  <option value="Lead">Leadership</option>
                  <option value="Scientist">Scientists</option>
                </select>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Minimum Potential Score: <span className="text-indigo-600">{minPotential}</span></label>
                  <span className="text-[10px] text-slate-300 font-bold uppercase">Predictive Value Filter</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={minPotential}
                  onChange={(e) => setMinPotential(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTalent.length > 0 ? (
                filteredTalent.map(talent => (
                  <div key={talent.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all flex flex-col items-center text-center group">
                    <div className="relative mb-6">
                      <img src={talent.avatar} className="w-24 h-24 rounded-[2rem] object-cover shadow-lg group-hover:scale-105 transition-transform duration-500" alt={talent.name} />
                      <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white w-10 h-10 rounded-2xl flex flex-col items-center justify-center border-4 border-white">
                        <span className="text-[10px] font-black leading-none">{talent.potential}</span>
                        <span className="text-[6px] font-bold uppercase leading-none mt-0.5">PS</span>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">{talent.name}</h4>
                    <p className="text-xs text-indigo-500 font-black uppercase tracking-widest mb-4">{talent.role}</p>
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                      {talent.skills.map(skill => (
                        <span key={skill} className="bg-slate-50 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-bold border border-slate-100">{skill}</span>
                      ))}
                    </div>
                    <button 
                      onClick={() => onSignal('CONNECTION')}
                      className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-indigo-100 transition-all active:scale-95"
                    >
                      Send Connection Request
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-24 flex flex-col items-center justify-center text-slate-300">
                  <div className="text-6xl mb-4">🔍</div>
                  <h4 className="text-xl font-bold text-slate-400">No high-potential talent matches your filters</h4>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialFeed;
