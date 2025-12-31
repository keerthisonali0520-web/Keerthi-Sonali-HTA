
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, User, Loader2 } from 'lucide-react';
import { getChatbotResponse } from '../services/gemini';

interface Props {
  onClose: () => void;
}

const Chatbot: React.FC<Props> = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Hello! I am Zenith. How can I assist with your wellness journey today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await getChatbotResponse(messages, userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg h-[600px] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-slate-50 animate-in zoom-in-95 duration-500">
        <header className="p-8 border-b border-slate-50 flex items-center justify-between bg-[#fafbfc]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-2xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 tracking-tight">Zenith AI</h3>
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Always Active</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-500 transition-pastel"><X className="w-6 h-6" /></button>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] flex items-start space-x-3 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`p-2.5 rounded-xl ${m.role === 'user' ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-50 text-slate-400'}`}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>
                <div className={`p-5 rounded-[1.75rem] text-sm font-medium leading-relaxed ${m.role === 'user' ? 'bg-indigo-500 text-white rounded-tr-none' : 'bg-slate-50 text-slate-700 rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
               <div className="bg-slate-50 p-4 rounded-full flex items-center space-x-2">
                 <Loader2 className="w-4 h-4 text-indigo-300 animate-spin" />
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Thinking</span>
               </div>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-slate-50 bg-[#fafbfc]">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about your wellness..."
              className="w-full bg-white border border-slate-100 rounded-[1.5rem] p-5 pr-16 outline-none focus:border-indigo-100 transition-pastel text-sm font-medium shadow-sm"
            />
            <button 
              onClick={handleSend}
              className="absolute right-3 top-3 p-2.5 bg-indigo-500 text-white rounded-2xl hover:bg-indigo-600 transition-pastel shadow-lg shadow-indigo-100"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
