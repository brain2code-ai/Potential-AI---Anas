
import React, { useState, useEffect } from 'react';
import { User } from '../types';

const Assessment: React.FC<{ user: User }> = ({ user }) => {
  const [step, setStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [trustScore, setTrustScore] = useState(100);
  const [isCheatWarning, setIsCheatWarning] = useState(false);

  // Anti-cheat logic
  useEffect(() => {
    const handleBlur = () => {
      setTrustScore(prev => Math.max(0, prev - 15));
      setIsCheatWarning(true);
      setTimeout(() => setIsCheatWarning(false), 3000);
    };

    window.addEventListener('blur', handleBlur);
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);

    return () => {
      window.removeEventListener('blur', handleBlur);
      clearInterval(timer);
    };
  }, []);

  const questions = [
    { text: "If a workflow requires 5 steps to complete, but the environment changes every 2 steps, how would you optimize the caching strategy?", type: 'Adaptive' },
    { text: "Describe a situation where you had to unlearn a deeply held technical belief. What was the catalyst?", type: 'Curiosity' }
  ];

  if (step >= questions.length) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-8">✓</div>
        <h2 className="text-4xl font-bold mb-4">Assessment Complete</h2>
        <p className="text-slate-500 mb-8">Our AI is analyzing your response patterns, learning velocity, and adaptability signals.</p>
        <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left">
          <div className="flex justify-between mb-2">
            <span className="font-bold">Final Trust Score</span>
            <span className={`font-bold ${trustScore > 80 ? 'text-green-600' : 'text-amber-500'}`}>{trustScore}/100</span>
          </div>
          <p className="text-xs text-slate-400">Integrity verification was active during the session. Low focus loss detected.</p>
        </div>
        <button onClick={() => window.location.hash = '#/dashboard'} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold">Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {isCheatWarning && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl animate-bounce z-[100]">
          ⚠️ Focus Lost! Trust Score Penalized.
        </div>
      )}

      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-slate-900 text-white rounded-xl font-mono text-xl">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <div className="text-sm font-bold text-slate-400">Time Remaining</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trust Integrity</div>
            <div className={`text-xl font-black ${trustScore > 80 ? 'text-indigo-600' : 'text-amber-500'}`}>{trustScore}%</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-indigo-500 animate-spin"></div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 px-6 py-2 bg-indigo-50 text-indigo-600 text-xs font-black rounded-bl-3xl">
          {questions[step].type.toUpperCase()} SIGNAL
        </div>
        
        <h3 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] mb-4">Question {step + 1} of 10</h3>
        <p className="text-3xl font-extrabold text-slate-900 leading-tight mb-12">
          {questions[step].text}
        </p>

        <textarea 
          placeholder="Type your structured thoughts here... AI will analyze your drafting patterns, revisions, and structural logic."
          className="w-full h-48 bg-slate-50 border-none rounded-2xl p-6 text-lg focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
        />

        <div className="flex justify-end mt-8">
          <button 
            onClick={() => setStep(step + 1)}
            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
          >
            Submit Response
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-center text-slate-400 text-sm">
        Our system is tracking <span className="text-slate-600 font-bold">Biometric Signals</span> and <span className="text-slate-600 font-bold">Keyboard Dynamics</span> for validation.
      </p>
    </div>
  );
};

export default Assessment;
