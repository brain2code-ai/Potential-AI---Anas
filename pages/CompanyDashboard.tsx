
import React from 'react';
import { User } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CompanyDashboard: React.FC<{ user: User }> = ({ user }) => {
  const data = [
    { name: 'Alex R.', potential: 94, learning: 98, trust: 100 },
    { name: 'Sarah C.', potential: 88, learning: 82, trust: 95 },
    { name: 'John D.', potential: 82, learning: 91, trust: 80 },
    { name: 'Elena G.', potential: 91, learning: 94, trust: 100 },
    { name: 'Marcus K.', potential: 76, learning: 65, trust: 100 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900">Talent Pipeline</h2>
          <p className="text-slate-500">Filtering candidates by Trajectory & Signal, not Keywords.</p>
        </div>
        <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold">Post New Job</button>
      </header>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Analytics Card */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold mb-8">Top Potential Candidates</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="potential" radius={[10, 10, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.potential > 90 ? '#6366f1' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters / Insights */}
        <div className="space-y-8">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white">
            <h3 className="text-xl font-bold mb-4">AI Recruiter Insight</h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6">
              "We've detected a high concentration of 'Late Bloomers' in your current pool. These candidates have lower current Performance scores but exceptionally high Learning Velocity and Adaptability."
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest">
              <span>💡</span> Strategy: Prioritize LV
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h4 className="font-bold mb-4">Trust Flags</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                <span className="text-xs font-bold text-red-700">Abnormal Latency (John D.)</span>
                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded uppercase font-black">Flagged</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-xs font-bold text-emerald-700">Perfect Integrity (Alex R.)</span>
                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded uppercase font-black">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Potential</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Learning Velocity</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trust</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((c, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6 font-bold text-slate-900">{c.name}</td>
                <td className="px-8 py-6 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${c.potential > 90 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                    {c.potential}
                  </span>
                </td>
                <td className="px-8 py-6 text-center font-medium text-slate-500">{c.learning}%</td>
                <td className="px-8 py-6 text-center">
                  <div className={`w-3 h-3 rounded-full mx-auto ${c.trust > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="text-indigo-600 font-bold text-sm">Review Signals</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyDashboard;
