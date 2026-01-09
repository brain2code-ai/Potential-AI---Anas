
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { useLocation, useNavigate } from 'react-router-dom';
import { User } from '../types';

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

const AIAvatarMini: React.FC<{ isThinking: boolean; isSpeaking: boolean }> = ({ isThinking, isSpeaking }) => (
  <div className="relative w-24 h-24 flex items-center justify-center">
    <div className={`absolute inset-0 rounded-full blur-[30px] opacity-40 transition-all duration-500 ${isSpeaking ? 'bg-indigo-500 scale-125' : isThinking ? 'bg-purple-500' : 'bg-slate-700'}`} />
    <div className="relative w-20 h-20 bg-slate-900 rounded-2xl border border-white/10 flex flex-col items-center justify-center overflow-hidden">
      <div className="flex gap-2 mb-2">
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-75"></div>
      </div>
      <div className="flex gap-0.5 h-4 items-end">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`w-0.5 rounded-full ${isSpeaking ? 'bg-indigo-400' : 'bg-slate-700'}`} style={{ height: isSpeaking ? `${30 + Math.random() * 70}%` : '20%' }}></div>
        ))}
      </div>
    </div>
  </div>
);

const AIInterview: React.FC<{ user: User }> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;

  const [isStarted, setIsStarted] = useState(false);
  const [videoQuality, setVideoQuality] = useState<'720p' | '1080p'>('720p');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<{role: 'ai' | 'user', text: string}[]>([]);
  const [isPostInterview, setIsPostInterview] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  
  const [trustScore, setTrustScore] = useState(100);
  const [integrityFlags, setIntegrityFlags] = useState<{type: string, time: string}[]>([]);
  const [showIntegrityAlert, setShowIntegrityAlert] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const audioContextsRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const frameIntervalRef = useRef<number | null>(null);
  const isSessionActiveRef = useRef(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // VIDEO WATCHDOG: Ensures video element is always showing the live stream
  useEffect(() => {
    if (isStarted && streamRef.current && videoRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        console.debug("Video Watchdog: Re-binding stream to element");
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(e => console.error("Video play error:", e));
      }
    }
  }, [isStarted, connectionStatus, isPostInterview]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isSessionActiveRef.current) {
        setTrustScore(prev => Math.max(0, prev - 15));
        setIntegrityFlags(prev => [...prev, { type: 'TAB_SWITCH', time: new Date().toLocaleTimeString() }]);
        setShowIntegrityAlert(true);
        setTimeout(() => setShowIntegrityAlert(false), 3000);
      }
    };
    const handleBlur = () => {
        if (isSessionActiveRef.current) {
            setTrustScore(prev => Math.max(0, prev - 10));
            setIntegrityFlags(prev => [...prev, { type: 'FOCUS_LOST', time: new Date().toLocaleTimeString() }]);
            setShowIntegrityAlert(true);
            setTimeout(() => setShowIntegrityAlert(false), 3000);
        }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    return () => {
      cleanupSession();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const cleanupSession = () => {
    isSessionActiveRef.current = false;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch(e) {}
    }
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(s => { try { s.close(); } catch(e) {} });
      sessionPromiseRef.current = null;
    }
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesRef.current.clear();
    if (audioContextsRef.current) {
      try { audioContextsRef.current.input.close(); audioContextsRef.current.output.close(); } catch(e) {}
      audioContextsRef.current = null;
    }
  };

  const handleStartSession = async () => {
    setIsStarted(true);
    setConnectionStatus('connecting');
    try {
      const resolution = videoQuality === '1080p' ? { width: { ideal: 1920 }, height: { ideal: 1080 } } : { width: { ideal: 1280 }, height: { ideal: 720 } };
      
      // Step 1: Capture Media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: { ...resolution, frameRate: { ideal: 30 } } 
      });
      streamRef.current = stream;

      // Step 2: Immediate Bind (Prevents Black Screen)
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      // Step 3: Initialize Recording
      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        setRecordedVideoUrl(URL.createObjectURL(blob));
        setIsPostInterview(true);
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); 

      // Step 4: AI Context Synthesis
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextsRef.current = { input: inputCtx, output: outputCtx };

      if (inputCtx.state === 'suspended') await inputCtx.resume();
      if (outputCtx.state === 'suspended') await outputCtx.resume();

      const jobContext = job ? `You are interviewing for "${job.title}" at "${job.company}". Requirements: High ${job.potentialMatch}% potential match.` : 'You are interviewing for a generic high-potential role.';
      const candidateContext = `The candidate is ${user.name}. Headline: ${user.headline}. Skills: ${user.skills.map(s => s.name).join(', ')}. Potential Score: ${user.potentialScore}.`;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            isSessionActiveRef.current = true;
            setConnectionStatus('connected');
            sessionPromise.then(s => {
              if (isSessionActiveRef.current) {
                s.sendRealtimeInput({ text: `[START INTERVIEW] Hello ${user.name.split(' ')[0]}. I am Aria. I've accessed your potential profile and am ready to discuss the ${job?.title || 'position'}. Let's begin.` });
              }
            });

            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              if (!isSessionActiveRef.current) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(s => { if (isSessionActiveRef.current) s.sendRealtimeInput({ media: pcmBlob }); });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            frameIntervalRef.current = window.setInterval(() => {
              if (videoRef.current && ctx && isSessionActiveRef.current && videoRef.current.readyState >= 2) {
                canvas.width = 320; canvas.height = 180;
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(async (blob) => {
                  if (blob && isSessionActiveRef.current) {
                    const base64Data = await blobToBase64(blob);
                    sessionPromise.then(s => { if (isSessionActiveRef.current) s.sendRealtimeInput({ media: { data: base64Data, mimeType: 'image/jpeg' } }); });
                  }
                }, 'image/jpeg', 0.6);
              }
            }, 1000);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) { try { source.stop(); } catch(e) {} sourcesRef.current.delete(source); }
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && isSessionActiveRef.current) {
              setIsSpeaking(true); setIsThinking(false);
              const nextStartTime = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const sourceNode = outputCtx.createBufferSource();
              sourceNode.buffer = buffer;
              sourceNode.connect(outputCtx.destination);
              sourceNode.onended = () => { sourcesRef.current.delete(sourceNode); if (sourcesRef.current.size === 0) setIsSpeaking(false); };
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
          },
          onerror: () => setConnectionStatus('error'),
          onclose: () => setConnectionStatus('idle')
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: `You are Aria, lead AI HR Evaluator. Conduct a professional 5-question interview.
          CONTEXT: ${jobContext}
          CANDIDATE: ${candidateContext}
          
          PHASES: 1. Introduction. 2. Technical Challenge. 3. Adaptability/Behavioral. 4. Growth Mindset. 5. Conclusion.
          Ask ONLY one question at a time. Keep it brief and high-impact.`
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (err) { setConnectionStatus('error'); }
  };

  const handleDownloadSession = () => {
    if (recordedVideoUrl) {
      const a = document.createElement('a');
      a.href = recordedVideoUrl;
      a.download = `potential_ai_session_${Date.now()}.webm`;
      a.click();
    }
  };

  if (isPostInterview) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full bg-slate-900 rounded-[3rem] p-8 md:p-12 text-center border border-white/5 shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">📂</div>
          <h2 className="text-4xl font-black mb-4 tracking-tight">Session Archived</h2>
          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Integrity Score</span>
                <span className={`text-3xl font-black ${trustScore < 70 ? 'text-red-500' : 'text-emerald-400'}`}>{trustScore}%</span>
             </div>
             <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Quality</span>
                <span className="text-3xl font-black text-white">{videoQuality}</span>
             </div>
          </div>
          <div className="rounded-[2.5rem] overflow-hidden border-8 border-white/5 mb-8 bg-black">
            <video src={recordedVideoUrl!} controls className="w-full aspect-video" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleDownloadSession} className="px-10 py-5 bg-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl">
              Export Archive
            </button>
            <button onClick={() => navigate('/dashboard')} className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">
              Return Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col overflow-hidden font-sans relative">
      {!isStarted && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-1000">
           <div className="text-center max-w-2xl">
             <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto mb-8 flex items-center justify-center text-4xl shadow-2xl shadow-indigo-500/20">🎙️</div>
             <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase italic">Archive Initiation</h1>
             <p className="text-slate-400 text-lg">Aria is ready to analyze your career trajectory for <span className="text-indigo-400 font-bold">{job?.title || 'the role'}</span>.</p>
           </div>
           
           <div className="bg-slate-900/50 p-10 rounded-[3rem] border border-white/5 w-full max-w-2xl space-y-8">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest text-center">Video Configuration</h4>
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => setVideoQuality('720p')} className={`p-6 rounded-3xl border-2 transition-all text-left ${videoQuality === '720p' ? 'border-indigo-600 bg-indigo-600/10' : 'border-white/5 bg-black/40 text-slate-500'}`}>
                   <span className="block font-black text-xl mb-1">Standard HD</span>
                   <span className="text-[10px] uppercase font-bold">720p</span>
                 </button>
                 <button onClick={() => setVideoQuality('1080p')} className={`p-6 rounded-3xl border-2 transition-all text-left ${videoQuality === '1080p' ? 'border-indigo-600 bg-indigo-600/10' : 'border-white/5 bg-black/40 text-slate-500'}`}>
                   <span className="block font-black text-xl mb-1">Neural Ultra</span>
                   <span className="text-[10px] uppercase font-bold">1080p</span>
                 </button>
              </div>
           </div>

           <button onClick={handleStartSession} className="px-16 py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black text-xl transition-all shadow-2xl shadow-indigo-600/20 active:scale-95 flex items-center gap-4 group">
             Initialize Interview
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
           </button>
        </div>
      )}

      {isStarted && connectionStatus === 'connecting' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
           <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
           <h2 className="text-xl font-black uppercase tracking-[0.3em] text-indigo-400">Locking Signals...</h2>
        </div>
      )}

      {isStarted && connectionStatus === 'connected' && (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 h-full relative z-10">
          <div className="flex-1 relative bg-slate-900 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
             <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
             
             <div className="absolute bottom-16 left-12 right-12 z-20">
                <div className="max-w-4xl mx-auto">
                   {transcript.slice(-1).map((t, i) => (
                     <div key={i} className={`flex ${t.role === 'ai' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-4`}>
                        <div className={`px-12 py-8 rounded-[2.5rem] text-3xl font-black shadow-2xl backdrop-blur-2xl ${t.role === 'ai' ? 'bg-indigo-600/95 text-white border-l-[12px] border-white' : 'bg-white/10 text-slate-100 border border-white/20'}`}>
                           {t.text}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             
             <div className="absolute top-10 left-10 flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Live Evaluation Active</span>
             </div>
          </div>

          <div className="lg:w-96 flex flex-col gap-6">
             <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/5 flex flex-col items-center text-center">
                <AIAvatarMini isThinking={isThinking} isSpeaking={isSpeaking} />
                <h3 className="mt-8 font-black text-indigo-400 uppercase tracking-[0.4em] text-xs">HR Agent Aria</h3>
             </div>

             <div className="flex-1 bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/5 flex flex-col">
                <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-10 text-center">Neural Integrity</h4>
                <div className="space-y-10 flex-1">
                   <div className="space-y-4">
                        <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                           <span>Trust Index</span>
                           <span className={trustScore < 70 ? 'text-red-500' : 'text-indigo-400'}>{trustScore}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <div className={`h-full transition-all duration-1000 ${trustScore < 70 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${trustScore}%` }} />
                        </div>
                   </div>
                </div>
                <div className="pt-10">
                   <button onClick={() => { cleanupSession(); }} className="w-full py-6 bg-red-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-red-900/10">
                     Terminate & Archive
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInterview;
