
import React, { useState, useCallback, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SocialFeed from './pages/SocialFeed';
import Assessment from './pages/Assessment';
import AIInterview from './pages/AIInterview';
import JobMarket from './pages/JobMarket';
import CompanyDashboard from './pages/CompanyDashboard';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import AuthPage from './pages/AuthPage';
import Navbar from './components/Navbar';
import { UserRole, User, PotentialScores } from './types';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signalNotification, setSignalNotification] = useState<{ message: string; trait: string } | null>(null);

  const [traits, setTraits] = useState<PotentialScores>({
    performance: 75,
    learning: 80,
    adaptability: 70,
    trust: 100,
    curiosity: 65
  });

  const calculatePotential = (t: PotentialScores) => {
    const score = (t.learning * 0.35) + (t.adaptability * 0.25) + (t.curiosity * 0.2) + (t.performance * 0.15) + (t.trust * 0.05);
    return Math.round(score);
  };

  const loginUser = useCallback((supabaseUser: any) => {
    const metadata = supabaseUser.user_metadata;
    const role = metadata.role || UserRole.CANDIDATE;
    const id = supabaseUser.id;
    const name = metadata.full_name || 'Anonymous User';

    const initialTraits = {
      performance: metadata.potential_initialized ? 82 : 75,
      learning: metadata.potential_initialized ? 94 : 80,
      adaptability: metadata.potential_initialized ? 91 : 70,
      trust: 100,
      curiosity: metadata.potential_initialized ? 89 : 65
    };

    setTraits(initialTraits);
    setUser({
      id: id,
      name: name,
      role: role as UserRole,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
      potentialScore: calculatePotential(initialTraits),
      trustScore: 100,
      headline: role === UserRole.CANDIDATE ? 'High Potential Talent' : 'Recruitment Partner',
      bio: 'Ready to showcase future potential in a modern professional ecosystem.',
      experience: [
        { id: 'e1', company: 'Innovation Hub', role: 'Growth Partner', duration: '2022 - Present', description: 'Driving adaptive strategies.', verified: true }
      ],
      education: [],
      skills: [
        { name: 'Adaptability', level: 90, category: 'Cognitive', verified: true }
      ]
    });
  }, []);

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        loginUser(session.user);
      }
      setLoading(false);
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loginUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [loginUser]);

  const recordSignal = useCallback((type: 'LIKE' | 'COMMENT' | 'CONNECTION' | 'POST') => {
    setTraits(prev => {
      let next = { ...prev };
      let message = "";
      let trait = "";

      switch (type) {
        case 'LIKE':
          next.curiosity = Math.min(100, next.curiosity + 0.5);
          message = "+0.5 Curiosity Signal";
          trait = "Curiosity";
          break;
        case 'COMMENT':
          next.learning = Math.min(100, next.learning + 1.2);
          next.performance = Math.min(100, next.performance + 0.3);
          message = "+1.2 Learning Velocity";
          trait = "Learning";
          break;
        case 'CONNECTION':
          next.adaptability = Math.min(100, next.adaptability + 2.0);
          message = "+2.0 Adaptability Index";
          trait = "Adaptability";
          break;
        case 'POST':
          next.performance = Math.min(100, next.performance + 1.5);
          next.curiosity = Math.min(100, next.curiosity + 1.0);
          message = "+2.5 Knowledge Synthesis";
          trait = "Growth";
          break;
      }

      setSignalNotification({ message, trait });
      setTimeout(() => setSignalNotification(null), 3000);

      if (user) {
        setUser({
          ...user,
          potentialScore: calculatePotential(next)
        });
      }
      return next;
    });
  }, [user]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-indigo-600 uppercase tracking-widest">AI</div>
      </div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen flex flex-col relative">
        {signalNotification && (
          <div className="fixed top-24 right-6 z-[100] animate-in slide-in-from-right-10 fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-[1.5rem] shadow-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-xl">🧠</div>
              <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Neural Signal Captured</p>
                <p className="font-bold text-sm">{signalNotification.message}</p>
              </div>
            </div>
          </div>
        )}

        {user && <Navbar user={user} logout={logout} />}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
            <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? (user.role === UserRole.CANDIDATE ? <Dashboard user={user} traits={traits} /> : <CompanyDashboard user={user} />) : <Navigate to="/auth" />} />
            <Route path="/feed" element={user ? <SocialFeed user={user} onSignal={recordSignal} /> : <Navigate to="/auth" />} />
            <Route path="/assessment" element={user ? <Assessment user={user} /> : <Navigate to="/auth" />} />
            <Route path="/interview" element={user ? <AIInterview user={user} /> : <Navigate to="/auth" />} />
            <Route path="/jobs" element={user ? <JobMarket user={user} /> : <Navigate to="/auth" />} />
            <Route path="/messages" element={user ? <Messages user={user} /> : <Navigate to="/auth" />} />
            <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} traits={traits} /> : <Navigate to="/auth" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
