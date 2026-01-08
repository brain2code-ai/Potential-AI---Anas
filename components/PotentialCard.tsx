
import React from 'react';
import { PotentialScores } from '../types';

interface PotentialCardProps {
  score: number;
  metrics: PotentialScores;
  name?: string;
}

const PotentialCard: React.FC<PotentialCardProps> = ({ score, metrics, name }) => {
  const getProgressColor = (val: number) => {
    if (val > 90) return 'stroke-indigo-600';
    if (val > 70) return 'stroke-purple-500';
    return 'stroke-amber-500';
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 p-8 border border-slate-100 max-w-md mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Potential Score</h3>
          <p className="text-2xl font-bold text-slate-900">{name || 'High Growth Talent'}</p>
        </div>
        <div className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">
          AI Verified
        </div>
      </div>

      <div className="flex justify-center mb-10 relative">
        <svg className="w-48 h-48 transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-50"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 88}
            strokeDashoffset={2 * Math.PI * 88 * (1 - score / 100)}
            strokeLinecap="round"
            className={`${getProgressColor(score)} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-slate-900 tracking-tighter">{score}</span>
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Predictive %</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Performance', val: metrics.performance, color: 'bg-blue-100 text-blue-700' },
          { label: 'Learning', val: metrics.learning, color: 'bg-purple-100 text-purple-700' },
          { label: 'Adaptability', val: metrics.adaptability, color: 'bg-indigo-100 text-indigo-700' },
          { label: 'Trust Score', val: metrics.trust, color: 'bg-emerald-100 text-emerald-700' }
        ].map((m) => (
          <div key={m.label} className={`${m.color} rounded-2xl p-4 flex flex-col items-center justify-center text-center`}>
            <span className="text-xs font-bold opacity-70 mb-1">{m.label}</span>
            <span className="text-lg font-black">{m.val}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-50">
        <p className="text-sm text-slate-500 italic">
          "Exhibits exceptional learning velocity and adaptive reasoning. Predicted 3.4x growth in technical leadership within 18 months."
        </p>
      </div>
    </div>
  );
};

export default PotentialCard;
