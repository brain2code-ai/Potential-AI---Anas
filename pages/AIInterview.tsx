
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { useLocation, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { supabase } from '../lib/supabase';

// Helper functions for audio encoding/decoding
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const NeuralParticles: React.FC<{ active: boolean; fast: boolean }> = ({ active, fast }) => {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full bg-indigo-400 blur-[1px] transition-all duration-1000 ${active ? 'opacity-100' : 'opacity-0'}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `float-particle ${fast ? p.duration * 0.5 : p.duration}s infinite linear ${p.delay}s`
          }}
        />
      ))}
    </div>
  );
};

const AIAvatar: React.FC<{ isThinking: boolean; isSpeaking: boolean; trustScore: number }> = ({ isThinking, isSpeaking, trustScore }) => {
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const requestRef = useRef<number>(0);
  const lastUpdate = useRef<number>(0);
  const targetPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const animate = (time: number) => {
      if (time - lastUpdate.current > (isThinking ? 300 : isSpeaking ? 800 : 2000)) {
        targetPos.current = {
          x: (Math.random() - 0.5) * (isThinking ? 16 : 10),
          y: (Math.random() - 0.5) * (isThinking ? 12 : 6)
        };
        lastUpdate.current = time;
      }
      setPupilPos(prev => ({
        x: prev.x + (targetPos.current.x - prev.x) * (isThinking ? 0.15 : 0.08),
        y: prev.y + (targetPos.current.y - prev.y) * (isThinking ? 0.15 : 0.08)
      }));
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isThinking, isSpeaking]);

  useEffect(() => {
    let blinkTimeout: any;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 120);
      blinkTimeout = setTimeout(triggerBlink, Math.random() * 3000 + 2000);
    };
    blinkTimeout = setTimeout(triggerBlink, 3000);
    return () => clearTimeout(blinkTimeout);
  }, []);

  const ambienceColor = trustScore < 50 
    ? 'rgba(239, 68, 68, 0.2)' // Red alert if trust is low
    : isThinking 
    ? 'rgba(168, 85, 247, 0.2)' 
    : isSpeaking 
    ? 'rgba(99, 102, 241, 0.3)'  
    : 'rgba(71, 85, 105, 0.1)'; 

  const coreGlow = isThinking ? 'shadow-[0_0_100px_rgba(168,85,247,0.3)]' : isSpeaking ? 'shadow-[0_0_100px_rgba(99,102,241,0.3)]' : 'shadow-none';

  return (
    <div className="relative w-80 h-80 mx-auto flex items-center justify-center select-none pointer-events-none">
      <style>{`
        @keyframes float-particle {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(140px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(140px) rotate(-360deg); }
        }
        .animate-orbit { animation: orbit 20s linear infinite; }
        .transition-ambience { transition: all 1s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>

      <div 
        className="absolute inset-0 rounded-full blur-[120px] transition-ambience"
        style={{ backgroundColor: ambienceColor, transform: `scale(${isSpeaking ? 1.5 : isThinking ? 1.2 : 1})` }}
      />
      
      <NeuralParticles active={true} fast={isThinking} />

      <div className={`absolute w-[320px] h-[320px] border border-white/5 rounded-full transition-all duration-1000 ${isThinking ? 'scale-110 opacity-40' : 'scale-100 opacity-10'}`}>
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-indigo-500 rounded-full animate-orbit blur-[1px]"></div>
      </div>

      <div className={`relative z-10 w-60 h-60 bg-slate-950 rounded-[4rem] border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-700 ${coreGlow}`}>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className={`absolute inset-0 bg-gradient-to-tr transition-all duration-1000 ${
          isThinking ? 'from-purple-900/40 via-transparent to-slate-900' : 
          isSpeaking ? 'from-indigo-900/40 via-transparent to-slate-900' : 
          'from-slate-950 via-slate-900 to-slate-950'
        }`}></div>

        <div className="relative flex flex-col items-center gap-10 w-full">
          <div className="flex gap-16 justify-center w-full">
            {[0, 1].map((i) => (
              <div key={i} className="relative">
                <div className={`w-16 h-16 bg-black rounded-full border border-white/10 relative overflow-hidden transition-all duration-500 ${isThinking ? 'scale-110 border-purple-500/50' : 'scale-100'}`}>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
                  <div className="absolute inset-0 transition-transform duration-300 ease-out" style={{ transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)` }}>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full blur-[0.5px] transition-all duration-1000 ${
                      isThinking ? 'bg-gradient-to-br from-purple-600 via-indigo-400 to-fuchsia-600' :
                      isSpeaking ? 'bg-gradient-to-br from-indigo-600 via-blue-400 to-indigo-600' :
                      'bg-gradient-to-br from-slate-700 via-slate-500 to-slate-700'
                    }`}></div>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black flex items-center justify-center transition-all duration-500 ${isSpeaking ? 'w-5 h-5' : 'w-4 h-4'}`}>
                       <div className={`w-2 h-2 rounded-full transition-all duration-1000 ${isThinking ? 'bg-purple-300/80 shadow-[0_0_8px_purple]' : 'bg-white/40'}`}></div>
                    </div>
                  </div>
                  <div className={`absolute inset-0 bg-slate-950 transition-transform duration-150 ease-in-out origin-top ${isBlinking ? 'translate-y-0' : '-translate-y-full'}`}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-end gap-2 h-12 px-8">
            {[...Array(13)].map((_, i) => {
              const baseHeight = isSpeaking ? (Math.random() * 80 + 20) : (isThinking ? (Math.random() * 30 + 10) : 10);
              return (
                <div 
                  key={i} 
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isThinking ? 'bg-purple-500 opacity-60' : 
                    isSpeaking ? 'bg-indigo-400 shadow-[0_0_100px_rgba(129,140,248,0.5)]' : 
                    'bg-slate-700 opacity-20'
                  }`}
                  style={{ 
                    height: `${baseHeight}%`,
                    animation: isSpeaking ? `speech-wave 0.4s ease-in-out infinite` : 'none',
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const AIInterview: React.FC<{ user: User }> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;

  const [isStarted, setIsStarted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<{role: 'ai' | 'user', text: string}[]>([]);
  const [trustScore, setTrustScore] = useState(100);
  const [clarity, setClarity] = useState(85);
  const [confidence, setConfidence] = useState(72);
  const [isPostInterview, setIsPostInterview] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Anti-cheat state
  const [isCheatWarning, setIsCheatWarning] = useState(false);
  const [redFlags, setRedFlags] = useState<{timestamp: string, reason: string}[]>([]);
  const lastActivityRef = useRef<number>(Date.now());
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const audioContextsRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const frameIntervalRef = useRef<number | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Anti-Cheat: Tab Switch Detection
  useEffect(() => {
    if (!isStarted || connectionStatus !== 'connected') return;

    const handleBlur = () => {
      const timestamp = new Date().toLocaleTimeString();
      setTrustScore(prev => Math.max(0, prev - 25));
      setRedFlags(prev => [...prev, { timestamp, reason: 'Tab Switch / Focus Lost' }]);
      setIsCheatWarning(true);
      setTimeout(() => setIsCheatWarning(false), 5000);
      
      // Notify the AI about the integrity breach
      sessionPromiseRef.current?.then(s => s.sendRealtimeInput({
        text: "[SYSTEM: Focus Lost. Integrity Breach Logged.]"
      }));
    };

    const handleFocus = () => {
      // Logic when user returns
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    
    // Idle Detection
    const activityTimer = setInterval(() => {
      if (Date.now() - lastActivityRef.current > 30000) { // 30 seconds idle
        const timestamp = new Date().toLocaleTimeString();
        setTrustScore(prev => Math.max(0, prev - 10));
        setRedFlags(prev => [...prev, { timestamp, reason: 'Prolonged Inactivity' }]);
        lastActivityRef.current = Date.now(); // Reset to prevent rapid spamming
      }
    }, 5000);

    const resetActivity = () => { lastActivityRef.current = Date.now(); };
    window.addEventListener('mousemove', resetActivity);
    window.addEventListener('keypress', resetActivity);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('mousemove', resetActivity);
      window.removeEventListener('keypress', resetActivity);
      clearInterval(activityTimer);
    };
  }, [isStarted, connectionStatus]);

  useEffect(() => {
    if (connectionStatus !== 'connected') return;
    const interval = setInterval(() => {
      setClarity(prev => Math.min(100, Math.max(60, prev + (Math.random() * 4 - 2))));
      setConfidence(prev => Math.min(100, Math.max(50, prev + (Math.random() * 6 - 3))));
    }, 3000);
    return () => clearInterval(interval);
  }, [connectionStatus]);

  // Attach stream whenever video element appears
  useEffect(() => {
    if (isStarted && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isStarted]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    };
  }, []);

  const startInterview = async () => {
    setConnectionStatus('connecting');
    setErrorMessage(null);
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasAudioInput = devices.some(device => device.kind === 'audioinput');
      const hasVideoInput = devices.some(device => device.kind === 'videoinput');

      if (!hasAudioInput) {
        throw new Error("No microphone detected. Microphones are required for AI verification.");
      }

      const constraints: MediaStreamConstraints = {
        audio: true,
        video: hasVideoInput ? { width: { ideal: 640 }, height: { ideal: 480 } } : false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      setIsStarted(true);

      recordedChunksRef.current = [];
      const supportedMimeTypes = [
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
        'audio/webm'
      ];
      const mimeType = supportedMimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || '';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setIsPostInterview(true);
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextsRef.current = { input: inputCtx, output: outputCtx };

      await inputCtx.resume();
      await outputCtx.resume();

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setConnectionStatus('connected');
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);

            const hasActiveVideo = stream.getVideoTracks().length > 0;
            if (hasActiveVideo) {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              frameIntervalRef.current = window.setInterval(() => {
                if (videoRef.current && ctx && videoRef.current.videoWidth > 0) {
                  canvas.width = 480;
                  canvas.height = (videoRef.current.videoHeight / videoRef.current.videoWidth) * 480;
                  ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                  canvas.toBlob(async (blob) => {
                    if (blob) {
                      const base64Data = await blobToBase64(blob);
                      sessionPromise.then(s => s.sendRealtimeInput({
                        media: { data: base64Data, mimeType: 'image/jpeg' }
                      }));
                    }
                  }, 'image/jpeg', 0.6);
                }
              }, 2000); 
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setIsSpeaking(true);
              setIsThinking(false);
              const nextStartTime = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const sourceNode = outputCtx.createBufferSource();
              sourceNode.buffer = buffer;
              sourceNode.connect(outputCtx.destination);
              sourceNode.onended = () => {
                sourcesRef.current.delete(sourceNode);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              };
              sourceNode.start(nextStartTime);
              nextStartTimeRef.current = nextStartTime + buffer.duration;
              sourcesRef.current.add(sourceNode);
            }

            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscript(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'ai') return [...prev.slice(0, -1), { role: 'ai', text: last.text + text }];
                return [...prev, { role: 'ai', text }];
              });
            }
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setTranscript(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'user') return [...prev.slice(0, -1), { role: 'user', text: last.text + text }];
                return [...prev, { role: 'user', text }];
              });
              setIsThinking(true);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }
          },
          onerror: (e) => {
             console.error("Live API Error:", e);
             setConnectionStatus('error');
             setErrorMessage("Connectivity loss detected. Neural re-sync required.");
          },
          onclose: () => {
             setIsStarted(false);
             setConnectionStatus('idle');
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
          },
          systemInstruction: `You are Aria, an HR Manager for ${job?.company || 'PotentialAI'}. 
          You are interviewing ${user.name} for ${job?.title || 'High-Potential Candidate'}.
          
          You can SEE the candidate via video frames.
          
          INTEGRITY AWARENESS:
          If you see system notifications like "[SYSTEM: Focus Lost]", you MUST comment on it professionaly. For example: "I noticed you stepped away from our conversation for a moment. Is everything okay?" or "Maintaining focus is critical in this role, let's continue."
          
          INTERVIEW PROTOCOL:
          - Greet warmly.
          - Ask about their most complex problem solved.
          - Ask how they handle ambiguity.
          
          Be professional, direct, and empathetic.`
        },
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (err: any) {
      console.error("Interview failure:", err);
      setConnectionStatus('error');
      setErrorMessage(err.message || "Hardware link failed. Ensure permissions are granted.");
    }
  };

  const concludeInterview = () => {
    sessionPromiseRef.current?.then(s => s.close());
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsStarted(false);
    setConnectionStatus('idle');
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('interviews').insert({
        candidate_id: user.id,
        transcript: transcript,
        clarity_score: Math.round(clarity),
        confidence_score: Math.round(confidence),
        trust_integrity_score: Math.round(trustScore),
        red_flags_count: redFlags.length,
        summary: `AI Evaluation for ${job?.title}. Match: High. Integrity: ${Math.round(trustScore)}%.`,
        video_url: recordedVideoUrl
      });
      if (error) throw error;
      alert("Neural sync complete. Data transmitted.");
      navigate('/dashboard');
    } catch (err: any) {
      alert(`Sync failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isPostInterview) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-12 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-slate-900 rounded-[3rem] border border-slate-800 p-12 text-center shadow-2xl relative overflow-hidden">
          <div className={`absolute top-0 right-0 p-8 text-right`}>
            <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">Final Integrity</span>
            <span className={`text-4xl font-black ${trustScore > 70 ? 'text-emerald-400' : 'text-red-500'}`}>{Math.round(trustScore)}%</span>
          </div>

          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 ${trustScore > 70 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
            {trustScore > 70 ? '✓' : '⚠️'}
          </div>
          <h2 className="text-4xl font-black mb-4 tracking-tight">
            {trustScore > 70 ? 'Interview Successfully Archived' : 'Integrity Verification Required'}
          </h2>
          <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">
            {trustScore > 70 
              ? 'Your high-potential signals have been captured and Aria is finalizing your report.' 
              : `Multiple integrity flags (${redFlags.length}) were detected. This session will be flagged for human audit.`}
          </p>
          
          <div className="bg-black/40 rounded-3xl overflow-hidden border border-slate-800 mb-12 max-w-2xl mx-auto relative group">
             <video src={recordedVideoUrl!} controls className="w-full aspect-video" />
             <div className="p-4 bg-slate-800/50 flex justify-between items-center px-8">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Live Recording Archive</span>
                <span className="text-xs font-bold text-indigo-400">Target: {job?.company || 'Hiring'} Team</span>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleSyncData}
              disabled={isSyncing}
              className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-indigo-200 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSyncing ? "Transmitting..." : `Transmit Session Data`}
            </button>
            <button 
              className="px-12 py-4 bg-white/5 text-slate-400 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
              onClick={() => {
                const a = document.createElement('a');
                a.href = recordedVideoUrl!;
                a.download = 'Interview_Archive.webm';
                a.click();
              }}
            >
              Download Local Copy
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col relative overflow-hidden">
      <style>{`
        @keyframes scan { from { transform: translateY(-100%); } to { transform: translateY(400%); } }
        .animate-scan { animation: scan 6s linear infinite; }
        @keyframes speech-wave { 0%, 100% { height: 10%; } 50% { height: 100%; } }
        .animate-speech-wave { animation: speech-wave 0.4s ease-in-out infinite; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
        .animate-shake { animation: shake 0.3s ease-in-out infinite; }
      `}</style>

      {/* ANTI-CHEAT ALERT BANNER */}
      {isCheatWarning && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-10 py-5 rounded-[2.5rem] shadow-[0_0_50px_rgba(220,38,38,0.5)] border-2 border-red-400 flex items-center gap-4 animate-shake">
          <div className="text-3xl">🛡️</div>
          <div>
            <div className="font-black uppercase tracking-widest text-[10px]">Anti-Cheat Mechanism Triggered</div>
            <div className="text-sm font-bold opacity-80">Tab switch detected. Trust score reduced. Integrity flag raised.</div>
          </div>
        </div>
      )}

      {!isStarted ? (
        <div className="relative z-10 max-w-2xl mx-auto text-center py-24 space-y-10 bg-slate-900/50 backdrop-blur-xl rounded-[3rem] border border-white/5 shadow-2xl mt-12">
          <div className="w-24 h-24 bg-indigo-600/10 text-indigo-600 rounded-[2rem] flex items-center justify-center text-4xl mx-auto border border-indigo-500/20">🎙️</div>
          <div>
            <h2 className="text-4xl font-black mb-4 tracking-tight">AI HR Interview with Aria</h2>
            <p className="text-slate-400 text-xl leading-relaxed">
              Applying for <span className="text-indigo-500 font-bold">{job?.title || 'High-Potential Candidate'}</span>.
            </p>
          </div>

          {errorMessage ? (
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl mx-12 text-center">
              <p className="text-red-400 font-bold text-sm mb-4">{errorMessage}</p>
              <button onClick={startInterview} className="text-xs font-black uppercase tracking-widest bg-red-500 px-6 py-2 rounded-lg">Retry Sync</button>
            </div>
          ) : (
            <button 
              onClick={startInterview}
              disabled={connectionStatus === 'connecting'}
              className="px-16 py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black text-xl hover:shadow-2xl hover:shadow-indigo-600/40 transition-all active:scale-95 disabled:opacity-50"
            >
              {connectionStatus === 'connecting' ? 'Calibrating...' : 'Initialize Recorded Session'}
            </button>
          )}
          
          <div className="px-12 flex flex-col gap-2">
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Integrity Monitoring Enabled</p>
             <p className="text-[9px] text-slate-600 font-medium">Focus loss or tab switching will result in immediate Trust Score penalties. Session recording is mandatory.</p>
          </div>
        </div>
      ) : (
        <div className="relative z-10 grid lg:grid-cols-12 gap-12 flex-1 mt-4">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="flex-1 bg-slate-900/40 backdrop-blur-md rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center border border-white/5">
              <div className="absolute top-10 left-10 flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Neural Link Recording</span>
              </div>
              
              <div className="absolute top-10 right-10 flex flex-col items-end">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Integrity signal</span>
                <span className={`text-2xl font-black transition-colors ${trustScore < 50 ? 'text-red-500 animate-pulse' : 'text-indigo-400'}`}>
                   {Math.round(trustScore)}%
                </span>
              </div>

              <AIAvatar isThinking={isThinking} isSpeaking={isSpeaking} trustScore={trustScore} />
              
              <div className="mt-16 text-center max-w-2xl min-h-[6rem] flex items-center justify-center">
                <div className="text-2xl font-medium text-white/90 leading-relaxed drop-shadow-lg">
                  {transcript.filter(t => t.role === 'ai').pop()?.text || "Synchronizing Neural Feed..."}
                </div>
              </div>

              <div className="absolute bottom-10 right-10 w-64 h-48 bg-black rounded-3xl overflow-hidden border-2 border-indigo-500 shadow-2xl">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover transition-all duration-700"
                  style={{ filter: trustScore < 50 ? 'sepia(0.5) hue-rotate(-50deg)' : 'grayscale(0.2) contrast(1.1)' }}
                />
                <div className="absolute inset-0 border-t border-white/10 opacity-20 animate-scan pointer-events-none"></div>
                <div className="absolute bottom-4 left-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">Active Monitor</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
               <div className="bg-slate-900/40 backdrop-blur-sm p-6 rounded-[2rem] border border-white/5 flex flex-col items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Speech Clarity</span>
                  <div className="text-2xl font-black text-indigo-400">{Math.round(clarity)}%</div>
               </div>
               <div className="bg-slate-900/40 backdrop-blur-sm p-6 rounded-[2rem] border border-white/5 flex flex-col items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Confidence Index</span>
                  <div className="text-2xl font-black text-emerald-400">{Math.round(confidence)}%</div>
               </div>
               <div className="bg-slate-900/40 backdrop-blur-sm p-6 rounded-[2rem] border border-white/5 flex flex-col items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Sync Status</span>
                  <div className="text-2xl font-black text-purple-400">{connectionStatus === 'connected' ? 'Stable' : 'Linking'}</div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* RED FLAGS LOG SECTION */}
            <div className="h-1/3 bg-red-950/20 backdrop-blur-xl rounded-[3rem] p-8 shadow-2xl flex flex-col overflow-hidden border border-red-500/10">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  Neural Red Flags
                </h4>
                <span className="text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full">{redFlags.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {redFlags.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-700">
                    <div className="text-4xl mb-2">🛡️</div>
                    <p className="text-[10px] font-black uppercase tracking-widest">No Integrity Issues</p>
                  </div>
                ) : (
                  redFlags.map((flag, i) => (
                    <div key={i} className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl flex justify-between items-center group hover:bg-red-500/10 transition-colors">
                      <div className="min-w-0">
                         <div className="text-[8px] font-black text-red-400 uppercase tracking-widest mb-1">@{flag.timestamp}</div>
                         <div className="text-xs font-bold text-red-200 truncate">{flag.reason}</div>
                      </div>
                      <div className="text-xs">⚠️</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex-1 bg-white/[0.03] backdrop-blur-xl rounded-[3rem] p-8 shadow-2xl flex flex-col overflow-hidden border border-white/5">
              <h4 className="text-sm font-black text-white/20 uppercase tracking-widest mb-8">Live Transcript</h4>
              <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
                {transcript.map((t, i) => (
                  <div key={i} className={`flex flex-col ${t.role === 'ai' ? 'items-start' : 'items-end'}`}>
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">{t.role === 'ai' ? 'Aria (HR)' : 'You'}</span>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      t.role === 'ai' 
                        ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/20' 
                        : 'bg-white/5 text-white/70 border border-white/5'
                    }`}>
                      {t.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={concludeInterview} className="w-full py-5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-red-950/20">
              Conclude & Archive Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInterview;
