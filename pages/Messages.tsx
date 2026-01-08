
import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';

const Messages: React.FC<{ user: User }> = ({ user }) => {
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const contacts = [
    { id: 'u2', name: 'Sarah Chen', avatar: 'https://picsum.photos/id/65/200/200', lastMsg: 'Your potential score is amazing!', status: 'online' },
    { id: 'u3', name: 'Jordan Smith', avatar: 'https://picsum.photos/id/12/200/200', lastMsg: 'Are you available for a quick chat?', status: 'offline' },
    { id: 'u4', name: 'Dr. Elena Rossi', avatar: 'https://picsum.photos/id/60/100/100', lastMsg: 'The assessment analysis is ready.', status: 'online' },
  ];

  // Initialize Real-time Channel
  useEffect(() => {
    channelRef.current = new BroadcastChannel('potential_ai_chat');
    
    channelRef.current.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'NEW_MESSAGE' && payload.receiverId === user.id) {
        // Only update if we are looking at the sender or to show general notification
        setChatHistory(prev => [...prev, payload]);
      }
    };

    return () => {
      channelRef.current?.close();
    };
  }, [user.id]);

  useEffect(() => {
    if (selectedContact) {
      // Mock loading history from "database"
      setChatHistory([
        { id: 'm1', senderId: selectedContact.id, receiverId: user.id, text: `Hi ${user.name.split(' ')[0]}!`, timestamp: '10:00 AM' },
        { id: 'm2', senderId: selectedContact.id, receiverId: user.id, text: selectedContact.lastMsg, timestamp: '10:02 AM' },
      ]);
    }
  }, [selectedContact, user.id, user.name]);

  useEffect(() => {
    // Scroll to bottom whenever history or typing status changes
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedContact) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: selectedContact.id,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Update local state (Optimistic UI)
    setChatHistory(prev => [...prev, newMsg]);
    
    // Broadcast to other tabs (Real-time Sync)
    channelRef.current?.postMessage({ type: 'NEW_MESSAGE', payload: newMsg });
    
    setInputText('');

    // Mock AI/External Partner response logic
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const echoMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedContact.id,
        receiverId: user.id,
        text: `I've received your message. Our AI scoring engine is evaluating the context of this conversation to update your Trust and Adaptability signals in real-time.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory(prev => [...prev, echoMsg]);
      // Broadcast the incoming message too
      channelRef.current?.postMessage({ type: 'NEW_MESSAGE', payload: echoMsg });
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 h-[calc(100vh-100px)]">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden flex h-full">
        {/* Contact List */}
        <div className="w-80 border-r border-slate-50 flex flex-col bg-slate-50/20">
          <div className="p-6 border-b border-slate-50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900">Inbox</h2>
              <span className="bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-lg font-black">LIVE</span>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
              <span className="absolute left-4 top-3.5 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`w-full px-6 py-4 flex gap-4 items-center hover:bg-white transition-all group relative ${
                  selectedContact?.id === contact.id ? 'bg-white' : ''
                }`}
              >
                {selectedContact?.id === contact.id && (
                  <div className="absolute left-0 top-4 bottom-4 w-1.5 bg-indigo-600 rounded-r-full"></div>
                )}
                <div className="relative flex-shrink-0">
                  <img src={contact.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt={contact.name} />
                  {contact.status === 'online' && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{contact.name}</h4>
                    <span className="text-[10px] text-slate-400 font-bold">10:02 AM</span>
                  </div>
                  <p className={`text-xs truncate ${selectedContact?.id === contact.id ? 'text-indigo-600 font-semibold' : 'text-slate-400'}`}>
                    {contact.lastMsg}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedContact ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="p-6 border-b border-slate-50 flex items-center justify-between px-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={selectedContact.avatar} className="w-12 h-12 rounded-2xl object-cover shadow-md" />
                  <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black">
                    88% Match
                  </div>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{selectedContact.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">End-to-End Encrypted</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </button>
                <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/30">
              <div className="text-center">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] bg-white px-4 py-1 rounded-full border border-slate-100">
                  Today
                </span>
              </div>
              
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[70%] group flex flex-col ${msg.senderId === user.id ? 'items-end' : 'items-start'}`}>
                    <div className={`px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                      msg.senderId === user.id 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                    }`}>
                      {msg.text}
                    </div>
                    <div className="mt-2 flex items-center gap-2 px-1">
                      <span className="text-[10px] text-slate-400 font-bold">{msg.timestamp}</span>
                      {msg.senderId === user.id && (
                        <span className="text-indigo-500 text-[10px]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-white px-5 py-3 rounded-3xl rounded-tl-none border border-slate-100 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input Form */}
            <div className="p-8 bg-white border-t border-slate-100">
              <form onSubmit={handleSendMessage} className="flex gap-4 items-center bg-slate-50 p-2 rounded-[2rem] border border-slate-100 focus-within:border-indigo-200 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
                <button type="button" className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white rounded-full transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </button>
                <input 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  type="text" 
                  placeholder="Draft your response..." 
                  className="flex-1 bg-transparent border-none px-4 py-3 text-sm focus:ring-0 outline-none font-medium text-slate-700"
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </form>
              <p className="text-[10px] text-center mt-4 text-slate-400 font-bold uppercase tracking-widest">
                Conversations impact your <span className="text-indigo-600">Integrity Signal</span>. Be professional.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/20">
            <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-5xl mb-8 animate-bounce duration-[3s]">
              📬
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Your Professional Inbox</h3>
            <p className="text-sm text-slate-400 max-w-xs text-center leading-relaxed">
              Select a candidate or recruiter to discuss future potential and career trajectories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
