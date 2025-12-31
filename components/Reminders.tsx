
import React from 'react';
import { Bell, Droplets, Dumbbell, Brain, Pill, Plus } from 'lucide-react';
import { Reminder } from '../types';

interface Props {
  reminders: Reminder[];
  onToggle: (id: string) => void;
}

const Reminders: React.FC<Props> = ({ reminders, onToggle }) => {
  const getIcon = (category: Reminder['category']) => {
    switch (category) {
      case 'hydration': return <Droplets className="w-5 h-5 text-sky-400" />;
      case 'exercise': return <Dumbbell className="w-5 h-5 text-emerald-400" />;
      case 'mindfulness': return <Brain className="w-5 h-5 text-rose-400" />;
      case 'medication': return <Pill className="w-5 h-5 text-orange-400" />;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Sync & Schedule</h1>
          <p className="text-slate-400 font-medium mt-1">Gentle nudges to keep your systems optimal.</p>
        </div>
        <button className="flex items-center space-x-2 bg-indigo-50 text-indigo-500 px-6 py-3 rounded-2xl hover:bg-indigo-100 transition-pastel font-bold text-sm">
          <Plus className="w-4 h-4" />
          <span>New Alert</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {reminders.map((r) => (
          <div key={r.id} className={`bg-white p-8 rounded-[2.5rem] shadow-sm border transition-pastel flex items-center justify-between ${r.active ? 'border-slate-50' : 'opacity-60 grayscale'}`}>
            <div className="flex items-center space-x-5">
              <div className="p-4 bg-slate-50 rounded-[1.5rem]">{getIcon(r.category)}</div>
              <div>
                <h4 className="font-bold text-slate-800">{r.title}</h4>
                <p className="text-xs font-black text-slate-300 uppercase tracking-widest mt-1">{r.time}</p>
              </div>
            </div>
            <button 
              onClick={() => onToggle(r.id)}
              className={`w-14 h-8 rounded-full transition-pastel relative ${r.active ? 'bg-indigo-400' : 'bg-slate-200'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-sm absolute top-1 transition-all ${r.active ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="bg-indigo-50/50 p-10 rounded-[3rem] border border-indigo-100/50 flex flex-col md:flex-row items-center gap-8">
         <div className="p-4 bg-white rounded-3xl shadow-sm text-indigo-400">
           <Bell className="w-8 h-8" />
         </div>
         <div className="flex-1 text-center md:text-left">
           <h3 className="text-lg font-bold text-slate-800">Smart Nudge System</h3>
           <p className="text-slate-500 font-medium leading-relaxed">Our AI agents monitor your activity logs and will automatically suggest adding reminders if they notice missing patterns in hydration or movement.</p>
         </div>
         <button className="px-8 py-3 bg-white text-indigo-500 rounded-2xl font-bold shadow-sm hover:shadow-md transition-pastel">Configure Agents</button>
      </div>
    </div>
  );
};

export default Reminders;
