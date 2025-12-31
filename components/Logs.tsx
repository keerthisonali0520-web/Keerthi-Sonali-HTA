
import React, { useState } from 'react';
import { HealthLog, Mood } from '../types';
import { Plus, Coffee, GlassWater, Footprints, Moon, Smile, X } from 'lucide-react';

interface Props {
  logs: HealthLog[];
  onAddLog: (log: Omit<HealthLog, 'id'>) => void;
}

const Logs: React.FC<Props> = ({ logs, onAddLog }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    steps: 0,
    waterIntake: 0,
    sleepHours: 0,
    mood: Mood.NEUTRAL,
    mealDescription: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLog({
      ...formData,
      timestamp: new Date()
    });
    setFormData({ steps: 0, waterIntake: 0, sleepHours: 0, mood: Mood.NEUTRAL, mealDescription: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Wellness Journal</h1>
          <p className="text-slate-400 font-medium mt-1">Reflect on your day and keep the momentum.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="group flex items-center space-x-2 bg-indigo-500 text-white px-8 py-4 rounded-[1.5rem] hover:bg-indigo-600 transition-pastel shadow-lg shadow-indigo-100 font-bold"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-pastel" />
            <span>New Entry</span>
          </button>
        )}
      </header>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-slate-50 space-y-8 animate-in slide-in-from-top-4 duration-500 relative overflow-hidden">
          <button 
             type="button" 
             onClick={() => setShowForm(false)}
             className="absolute top-8 right-8 text-slate-300 hover:text-slate-500 transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormInput 
              icon={<Footprints className="text-sky-400" />} 
              label="Steps Taken" 
              type="number"
              value={formData.steps}
              onChange={(v) => setFormData({...formData, steps: Number(v)})}
              placeholder="e.g. 10000"
            />
            <FormInput 
              icon={<GlassWater className="text-teal-400" />} 
              label="Water (ml)" 
              type="number"
              value={formData.waterIntake}
              onChange={(v) => setFormData({...formData, waterIntake: Number(v)})}
              placeholder="e.g. 2500"
            />
            <FormInput 
              icon={<Moon className="text-indigo-400" />} 
              label="Sleep (hrs)" 
              type="number"
              step="0.5"
              value={formData.sleepHours}
              onChange={(v) => setFormData({...formData, sleepHours: Number(v)})}
              placeholder="e.g. 8"
            />
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <Smile className="w-4 h-4 mr-2 text-rose-300" />
                Current Mood
              </label>
              <select 
                value={formData.mood}
                onChange={e => setFormData({...formData, mood: e.target.value as Mood})}
                className="w-full bg-slate-50 border border-transparent rounded-[1.25rem] p-4.5 focus:bg-white focus:border-rose-100 outline-none transition-pastel text-slate-700 font-medium appearance-none"
              >
                {Object.values(Mood).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <Coffee className="w-4 h-4 mr-2 text-orange-300" />
                Meal Highlights
              </label>
              <input 
                type="text" 
                value={formData.mealDescription}
                onChange={e => setFormData({...formData, mealDescription: e.target.value})}
                className="w-full bg-slate-50 border border-transparent rounded-[1.25rem] p-4.5 focus:bg-white focus:border-orange-100 outline-none transition-pastel text-slate-700 font-medium"
                placeholder="What did you fuel with today?"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button 
              type="submit" 
              className="px-12 py-4 bg-indigo-500 text-white font-bold rounded-[1.5rem] hover:bg-indigo-600 shadow-xl shadow-indigo-100 transition-pastel"
            >
              Confirm Journal Entry
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Past entries</p>
        {logs.map((log) => (
          <div key={log.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col md:flex-row md:items-center justify-between space-y-6 md:space-y-0 hover:border-slate-100 transition-pastel group">
            <div className="flex items-center space-x-8">
              <div className="flex flex-col items-center justify-center bg-slate-50 w-20 h-20 rounded-[1.5rem] border border-slate-50 transition-pastel group-hover:bg-white group-hover:shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short' })}</span>
                <span className="text-2xl font-bold text-slate-800">{new Date(log.timestamp).getDate()}</span>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-700 text-lg">{log.mealDescription || "Quiet day of reflection"}</h4>
                <div className="flex flex-wrap items-center gap-5">
                  <StatSnippet icon={<Footprints className="w-3.5 h-3.5" />} value={log.steps} unit="steps" color="text-sky-400" />
                  <StatSnippet icon={<GlassWater className="w-3.5 h-3.5" />} value={log.waterIntake} unit="ml" color="text-teal-400" />
                  <StatSnippet icon={<Moon className="w-3.5 h-3.5" />} value={log.sleepHours} unit="hrs" color="text-indigo-400" />
                </div>
              </div>
            </div>
            <div className="flex items-center self-start md:self-center px-5 py-2.5 bg-slate-50 rounded-2xl border border-transparent transition-pastel group-hover:bg-white group-hover:border-slate-100 group-hover:shadow-sm">
              <span className={`w-2.5 h-2.5 rounded-full mr-3 ${
                log.mood === Mood.STRESSED || log.mood === Mood.ANXIOUS ? 'bg-rose-300' : 'bg-emerald-300'
              }`}></span>
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{log.mood}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FormInput = ({ icon, label, ...props }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
      {React.cloneElement(icon, { className: 'w-4 h-4 mr-2' })}
      {label}
    </label>
    <input 
      {...props}
      onChange={e => props.onChange(e.target.value)}
      className="w-full bg-slate-50 border border-transparent rounded-[1.25rem] p-4.5 focus:bg-white focus:border-slate-100 outline-none transition-pastel text-slate-700 font-medium"
    />
  </div>
);

const StatSnippet = ({ icon, value, unit, color }: any) => (
  <span className={`flex items-center text-xs font-bold ${color} opacity-80`}>
    {icon} <span className="ml-1.5 text-slate-500">{value} <span className="text-slate-300 font-medium">{unit}</span></span>
  </span>
);

export default Logs;
