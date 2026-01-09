
import React, { useState, useEffect, useMemo } from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  text: string;
  category: 'performance' | 'learning' | 'adaptability' | 'curiosity';
  options: { text: string; score: number }[];
}

const Assessment: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(600);
  const [trustScore, setTrustScore] = useState(100);
  const [isCheatWarning, setIsCheatWarning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const questions: Question[] = useMemo(() => [
    {
      id: 'q1',
      category: 'adaptability',
      text: "A project requirement shifts 48 hours before the deadline due to a critical API change. Your current implementation is 90% complete. What is your primary focus?",
      options: [
        { text: "Analyze the delta and pivot immediately using high-velocity refactoring.", score: 10 },
        { text: "Push back on the requirement to protect the original delivery timeline.", score: 3 },
        { text: "Implement a shim layer to maintain original logic while satisfying the new API.", score: 7 },
        { text: "Request a timeline extension and restart the module from scratch.", score: 5 }
      ]
    },
    {
      id: 'q2',
      category: 'learning',
      text: "You are tasked with maintaining a legacy codebase in a language you haven't used in 5 years. Documentation is sparse. How do you approach the first 4 hours?",
      options: [
        { text: "Run the build, trigger break-points, and map the execution flow manually.", score: 10 },
        { text: "Search for external tutorials and refresh your language knowledge first.", score: 6 },
        { text: "Refactor a small, non-critical component to test your assumptions.", score: 8 },
        { text: "Wait for a senior developer to provide an architectural walkthrough.", score: 2 }
      ]
    },
    {
      id: 'q3',
      category: 'curiosity',
      text: "You notice an intermittent 50ms latency spike in an internal dashboard that only 10 people use. What do you do?",
      options: [
        { text: "Ignore it; the user base is too small for the engineering cost.", score: 0 },
        { text: "Profile the network stack and DB queries during off-hours to find the root.", score: 10 },
        { text: "Ask the team if anyone else has noticed it and log it as a low priority.", score: 5 },
        { text: "Scale the instance horizontally to see if it resolves under less load.", score: 3 }
      ]
    }
  ], []);

  useEffect(() => {
    if (isFinished) return;
    const handleBlur = () => {
      setTrustScore(prev => Math.max(0, prev - 20));
      setIsCheatWarning(true);
      setTimeout(() => setIsCheatWarning(false), 4000);
    };
    window.addEventListener('blur', handleBlur);
    const timer = setInterval(() => setTimeLeft(p => p > 0 ? p - 1 : 0), 1000);
    return () => {
      window.removeEventListener('blur', handleBlur);
      clearInterval(timer);
    };
  }, [isFinished]);

  const handleSelect = (score: number) => {
    const next = [...answers, score];
    setAnswers(next);
    if (currentStep < questions.length - 1) setCurrentStep(c => c + 1);
    else setIsFinished(true);
  };

  if (isFinished) {
    const finalScore = Math.round((answers.reduce((a, b) => a + b, 0) / questions.length) * (trustScore / 100) * 10);
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white rounded-[3.5rem] p-12 text-center shadow-2xl">
          <div className="w-20 h-20 bg-indigo-600/10 text-indigo-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-8">✓</div>
          <h2 className="text-4xl font-black mb-4">Neural Sync Complete</h2>
          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="bg-indigo-50 p-6 rounded-3xl">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Potential Boost</span>
              <span className="text-3xl font-black text-indigo-600">+{finalScore}</span>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Trust Integrity</span>
              <span className="text-3xl font-black text-slate-900">{trustScore}%</span>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black">Sync with Profile</button>
        </div>
      </div>
    );
  }

  const q = questions[currentStep];
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-12 bg-white p-6 rounded-3xl shadow-sm">
        <div className="text-2xl font-mono font-black bg-slate-900 text-white px-6 py-2 rounded-xl">
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
        <div className="flex-1 mx-12">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all duration-700" style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>
        <div className={`text-xl font-black ${trustScore < 70 ? 'text-red-500 animate-pulse' : 'text-indigo-600'}`}>{trustScore}% Trust</div>
      </div>

      <div className="bg-white rounded-[4rem] p-16 shadow-2xl relative overflow-hidden">
        {isCheatWarning && <div className="absolute top-0 left-0 w-full py-3 bg-red-600 text-white text-center font-black animate-bounce uppercase text-xs tracking-widest">Focus Lost - Trust Penalty Applied</div>}
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4 block">{q.category} SIGNAL</span>
        <h3 className="text-3xl font-black text-slate-900 mb-12 leading-tight">{q.text}</h3>
        <div className="grid gap-4">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => handleSelect(opt.score)} className="p-8 bg-slate-50 border-2 border-transparent hover:border-indigo-600 hover:bg-indigo-50/50 rounded-[2.5rem] text-left transition-all font-bold text-lg text-slate-700">
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assessment;
