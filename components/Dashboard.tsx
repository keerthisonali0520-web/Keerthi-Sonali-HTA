
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AppState, WellnessTask } from '../types';
import { Droplets, Footprints, Moon, Heart, Activity, CheckCircle2, Circle, Clock, MessageSquare, Star, Smartphone, RefreshCw, Scan, Brain, PlusCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  state: AppState;
  onToggleTask: (id: string) => void;
  onUpdateLogs: (newLogs: any[]) => void;
  onNavigate: (tab: any) => void;
}

const Dashboard: React.FC<Props> = ({ state, onToggleTask, onUpdateLogs, onNavigate }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Use state.logs from the corrected AppState interface
  const chartData = [...state.logs].reverse().map(log => ({
    date: new Date(log.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
    steps: log.steps,
    sleep: log.sleepHours,
    water: log.waterIntake
  }));

  const latest = state.logs[0] || { steps: 0, waterIntake: 0, sleepHours: 0, mood: 'N/A' };
  const pendingTasks = state.tasks.filter(t => t.status === 'pending');

  // Automatic Data Acquisition simulation from "Phone"
  useEffect(() => {
    const autoSync = () => {
      // Sync logic to mimic "Extraction from Mobile"
      const lastLogDate = state.logs[0]?.timestamp ? new Date(state.logs[0].timestamp).toDateString() : null;
      const today = new Date().toDateString();
      
      if (lastLogDate !== today || state.logs[0]?.mealDescription === 'Late night work session') {
        acquireDeviceData();
      }
    };
    
    const timer = setTimeout(autoSync, 2000);
    return () => clearTimeout(timer);
  }, []);

  const acquireDeviceData = () => {
    setIsSyncing(true);
    // Simulate fetching from Apple Health / Google Fit
    setTimeout(() => {
      const simulatedSteps = Math.floor(Math.random() * 5000) + 7000;
      const simulatedSleep = parseFloat((Math.random() * 2 + 7).toFixed(1));
      
      const newLog = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        steps: simulatedSteps,
        waterIntake: 1800,
        sleepHours: simulatedSleep,
        mood: state.logs[0]?.mood || 'Happy',
        mealDescription: 'Extracted from Mobile Health Core'
      };
      
      onUpdateLogs([newLog, ...state.logs]);
      setIsSyncing(false);
    }, 2500);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">FitCare Dashboard</h1>
          {/* Access user from state directly as defined in the updated AppState */}
          <p className="text-slate-400 font-medium mt-1">Hello {state.user.name.split(' ')[0]}, your mobile health data is synchronized.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-2xl shadow-sm border transition-pastel ${isSyncing ? 'bg-sky-50 border-sky-100 text-sky-500 animate-pulse' : 'bg-white border-slate-100 text-slate-400'}`}>
            {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
            <span>{isSyncing ? "Extracting Mobile Data..." : "Device Encrypted & Synced"}</span>
          </div>
          <button 
            onClick={() => setShowFeedback(true)}
            className="flex items-center space-x-2 text-sky-500 text-xs font-bold uppercase tracking-widest bg-sky-50 px-5 py-3 rounded-2xl shadow-sm border border-sky-100 hover:bg-sky-100 transition-pastel"
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Tuning</span>
          </button>
        </div>
      </header>

      {/* Quick Navigation Buttons */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <NavActionCard 
          icon={<Scan className="w-6 h-6" />}
          label="Analyze Report"
          desc="Scan medical data"
          color="sky"
          onClick={() => onNavigate('physical')}
        />
        <NavActionCard 
          icon={<Brain className="w-6 h-6" />}
          label="Mental Check"
          desc="Take pulse check"
          color="rose"
          onClick={() => onNavigate('mental')}
        />
        <NavActionCard 
          icon={<PlusCircle className="w-6 h-6" />}
          label="New Entry"
          desc="Log manual activity"
          color="emerald"
          onClick={() => onNavigate('logs')}
        />
      </section>

      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-lg w-full space-y-8 animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-800">Agent Personalization</h2>
              <p className="text-slate-400 font-medium">Was today's "Mobile Extraction" for steps ({latest.steps}) accurate?</p>
            </div>
            <div className="grid grid-cols-5 gap-4">
               {[1,2,3,4,5].map(n => <button key={n} className="aspect-square bg-slate-50 rounded-2xl text-xl hover:bg-sky-50 hover:text-sky-500 transition-pastel">⭐</button>)}
            </div>
            <textarea className="w-full bg-slate-50 border-transparent rounded-2xl p-4 text-sm outline-none focus:bg-white focus:border-sky-100 transition-pastel min-h-[100px]" placeholder="How can the AI serve you better?"></textarea>
            <button onClick={() => setShowFeedback(false)} className="w-full p-5 bg-sky-500 text-white font-bold rounded-2xl shadow-xl shadow-sky-100 hover:bg-sky-600 transition-pastel">Confirm Tuning</button>
          </div>
        </div>
      )}

      {/* Quick Stats - Mobile Source Labeled */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Footprints/>} color="sky" label="Mobile Steps" value={latest.steps.toLocaleString()} unit="extracted" />
        <StatCard icon={<Droplets/>} color="teal" label="Hydration" value={`${latest.waterIntake}`} unit="ml" />
        <StatCard icon={<Moon/>} color="indigo" label="Mobile Sleep" value={`${latest.sleepHours}`} unit="extracted" />
        <StatCard icon={<Heart/>} color="rose" label="Mood State" value={latest.mood} unit="current" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Actionable Tasks (Agentic AI Suggestions) */}
        <div className="xl:col-span-4 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-400" />
              Agentic Objectives
            </h3>
            {/* Access tasks from state directly */}
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{pendingTasks.length} Pending</span>
          </div>
          
          <div className="flex-1 space-y-4">
            {state.tasks.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                   <Activity className="w-6 h-6 text-slate-200" />
                </div>
                <p className="text-slate-400 text-sm italic font-medium">Agents are analyzing extracted mobile data...</p>
              </div>
            ) : (
              state.tasks.map(task => (
                <button 
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`w-full flex items-center p-4.5 rounded-2xl transition-pastel text-left border ${
                    task.status === 'completed' 
                    ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600 opacity-60' 
                    : 'bg-[#fafbfc] border-slate-100 text-slate-700 hover:border-sky-100 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className={`mr-4 ${task.status === 'completed' ? 'text-emerald-500' : 'text-slate-300'}`}>
                    {task.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold text-sm leading-tight ${task.status === 'completed' ? 'line-through text-emerald-600/70' : 'text-slate-700'}`}>
                      {task.title}
                    </p>
                    <span className="text-[10px] uppercase font-black tracking-widest opacity-40 mt-1 block">
                      {task.assignedBy} AI
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Charts Container */}
        <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <ChartCard 
             title="Mobile Activity (Steps)" 
             icon={<Activity className="w-4 h-4 text-sky-400" />}
             data={chartData} 
             dataKey="steps" 
             stroke="#7dd3fc" 
          />
          <ChartCard 
             title="Extracted Sleep Cycles" 
             icon={<Moon className="w-4 h-4 text-indigo-400" />}
             data={chartData} 
             dataKey="sleep" 
             stroke="#a5b4fc" 
             isBar
             dataKey2="water"
             stroke2="#99f6e4"
          />
        </div>
      </div>
    </div>
  );
};

const NavActionCard = ({ icon, label, desc, color, onClick }: any) => {
  const colors: any = {
    sky: 'bg-sky-50 text-sky-500 border-sky-100 hover:bg-sky-100',
    rose: 'bg-rose-50 text-rose-500 border-rose-100 hover:bg-rose-100',
    emerald: 'bg-emerald-50 text-emerald-500 border-emerald-100 hover:bg-emerald-100'
  };
  return (
    <button 
      onClick={onClick}
      className={`p-6 rounded-[2.5rem] border flex items-center justify-between transition-pastel group ${colors[color]}`}
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="text-left">
          <p className="font-bold text-slate-800 tracking-tight">{label}</p>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{desc}</p>
        </div>
      </div>
      <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-pastel" />
    </button>
  );
};

const StatCard = ({ icon, color, label, value, unit }: any) => {
  const colors: any = {
    sky: 'bg-sky-50 text-sky-400 border-sky-100',
    teal: 'bg-teal-50 text-teal-400 border-teal-100',
    indigo: 'bg-indigo-50 text-indigo-400 border-indigo-100',
    rose: 'bg-rose-50 text-rose-400 border-rose-100'
  };
  return (
    <div className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-slate-50 flex items-center space-x-5 transition-pastel hover:shadow-md hover:-translate-y-1">
      <div className={`p-4 rounded-[1.5rem] border ${colors[color]}`}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: 'w-6 h-6' }) : icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">{label}</p>
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold text-slate-800">{value}</span>
          <span className="text-[10px] font-bold text-slate-400 lowercase">{unit}</span>
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, icon, data, dataKey, stroke, isBar, dataKey2, stroke2 }: any) => (
  <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col h-full">
    <div className="flex items-center space-x-3 mb-10">
      <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
    </div>
    <div className="h-64 flex-1">
      <ResponsiveContainer width="100%" height="100%">
        {isBar ? (
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f8fafc" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#cbd5e1', fontSize: 10, fontWeight: 700}} dy={15} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#cbd5e1', fontSize: 10, fontWeight: 700}} />
            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)'}} />
            <Bar dataKey={dataKey} fill={stroke} radius={[10, 10, 10, 10]} barSize={12} />
            {dataKey2 && <Bar dataKey={dataKey2} fill={stroke2} radius={[10, 10, 10, 10]} barSize={12} />}
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f8fafc" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#cbd5e1', fontSize: 10, fontWeight: 700}} dy={15} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#cbd5e1', fontSize: 10, fontWeight: 700}} />
            <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)'}} />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={stroke} 
              strokeWidth={4} 
              dot={{fill: stroke, r: 6, strokeWidth: 4, stroke: '#fff'}} 
              activeDot={{r: 8, strokeWidth: 0}} 
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  </div>
);

export default Dashboard;
