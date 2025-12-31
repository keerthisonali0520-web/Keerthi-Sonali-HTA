
import React, { useState } from 'react';
import { Activity, ArrowRight } from 'lucide-react';

interface Props {
  onLogin: (name: string) => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [name, setName] = useState('');

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#f8fafc] p-6">
      <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-xl border border-slate-50 space-y-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mb-6">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Zenith AI</h1>
          <p className="text-slate-400 font-medium leading-relaxed">Your peaceful, personalized companion for physical and mental health.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-transparent rounded-[1.5rem] p-5 focus:bg-white focus:border-indigo-100 outline-none transition-pastel text-slate-700 font-semibold"
              placeholder="How should we call you?"
            />
          </div>
          <button 
            onClick={() => name.length > 1 && onLogin(name)}
            disabled={name.length < 2}
            className="w-full bg-indigo-500 text-white p-5 rounded-[1.5rem] font-bold text-lg hover:bg-indigo-600 shadow-xl shadow-indigo-100 transition-pastel flex items-center justify-center group disabled:opacity-50"
          >
            <span>Enter Studio</span>
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-pastel" />
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Non-clinical wellness companion</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
