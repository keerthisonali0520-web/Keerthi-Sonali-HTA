
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, UserCircle, Activity, BrainCircuit, ClipboardList, BookOpen, Sparkles, Heart, Apple, Bell, MessageCircle, Terminal, LogOut } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Logs from './components/Logs';
import AgentMonitor from './components/AgentMonitor';
import SystemDesign from './components/SystemDesign';
import WellnessStudio from './components/WellnessStudio';
import PhysicalHealth from './components/PhysicalHealth';
import MentalHealth from './components/MentalHealth';
import Reminders from './components/Reminders';
import Chatbot from './components/Chatbot';
import Login from './components/Login';
import { AppState, HealthLog, UserProfile, Reminder, WellnessTask } from './types';
import { runAgentCycle } from './services/agentSystem';

const STORAGE_KEY = 'fitcare_user_registry';

const INITIAL_REMINDERS: Reminder[] = [
  { id: '1', title: 'Hydration Break', time: '10:00 AM', active: true, category: 'hydration' },
  { id: '2', title: 'Stretching', time: '2:00 PM', active: true, category: 'exercise' }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs' | 'physical' | 'mental' | 'reminders' | 'agents' | 'studio' | 'profile' | 'design'>('dashboard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [library, setLibrary] = useState<any[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [physicalAnalysis, setPhysicalAnalysis] = useState<any>(null);
  const [mentalAnalysis, setMentalAnalysis] = useState<any>(null);

  // Load user data from registry when current user changes or on boot
  const saveUserToRegistry = (user: UserProfile) => {
    const registry = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    registry[user.id] = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
  };

  useEffect(() => {
    const triggerAgents = async () => {
      if (!currentUser || currentUser.logs.length === 0) return;
      setIsProcessing(true);
      try {
        // Construct a temporary AppState for the agent runner that matches the interface
        const mockState: AppState = { 
          user: currentUser, 
          logs: currentUser.logs, 
          tasks: currentUser.tasks, 
          decisions: currentUser.decisions,
          isLoggedIn: true,
          library,
          reminders
        };
        const { decisions, tasks } = await runAgentCycle(mockState);
        
        // Explicitly type updatedUser as UserProfile to avoid type widening issues with the tasks array
        const updatedUser: UserProfile = {
          ...currentUser,
          decisions: [...decisions, ...currentUser.decisions].slice(0, 20),
          tasks: [...tasks, ...currentUser.tasks].slice(0, 10)
        };
        setCurrentUser(updatedUser);
        saveUserToRegistry(updatedUser);
      } catch (error) {
        console.error("Agent cycle failed", error);
      } finally {
        setIsProcessing(false);
      }
    };

    if (currentUser && currentUser.logs.length > 0) {
      // Only run agents if we have new logs since last check
      // For demo, we'll run it when logs length changes
      triggerAgents();
    }
  }, [currentUser?.logs.length]);

  const handleLogin = (profile: UserProfile) => {
    setCurrentUser(profile);
    saveUserToRegistry(profile);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const addLog = (log: Omit<HealthLog, 'id'>) => {
    const newLog = { ...log, id: Math.random().toString(36).substr(2, 9) };
    const updatedUser = { ...currentUser, logs: [newLog, ...currentUser.logs] };
    setCurrentUser(updatedUser);
    saveUserToRegistry(updatedUser);
  };

  const toggleTask = (id: string) => {
    const updatedUser = {
      ...currentUser,
      tasks: currentUser.tasks.map(t => t.id === id ? { ...t, status: (t.status === 'completed' ? 'pending' : 'completed') as WellnessTask['status'] } : t)
    };
    setCurrentUser(updatedUser);
    saveUserToRegistry(updatedUser);
  };

  const updateLogs = (logs: any[]) => {
    const updatedUser = { ...currentUser, logs };
    setCurrentUser(updatedUser);
    saveUserToRegistry(updatedUser);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <nav className="w-72 bg-white border-r border-slate-100 flex flex-col p-8 space-y-10 flex-shrink-0">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-sky-50 text-sky-500 rounded-2xl">
            <Activity className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">FitCare</span>
        </div>

        <div className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Health Hub</p>
          <SidebarLink active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard className="w-5 h-5" />} label="Home" colorClass="hover:bg-indigo-50 hover:text-indigo-600" activeClass="bg-indigo-50 text-indigo-600 shadow-sm" />
          <SidebarLink active={activeTab === 'physical'} onClick={() => setActiveTab('physical')} icon={<Apple className="w-5 h-5" />} label="Physical Health" colorClass="hover:bg-sky-50 hover:text-sky-600" activeClass="bg-sky-50 text-sky-600 shadow-sm" />
          <SidebarLink active={activeTab === 'mental'} onClick={() => setActiveTab('mental')} icon={<Heart className="w-5 h-5" />} label="Mental Health" colorClass="hover:bg-rose-50 hover:text-rose-600" activeClass="bg-rose-50 text-rose-600 shadow-sm" />
          <SidebarLink active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<ClipboardList className="w-5 h-5" />} label="Journal" colorClass="hover:bg-emerald-50 hover:text-emerald-600" activeClass="bg-emerald-50 text-emerald-600 shadow-sm" />
          <SidebarLink active={activeTab === 'reminders'} onClick={() => setActiveTab('reminders')} icon={<Bell className="w-5 h-5" />} label="Reminders" colorClass="hover:bg-orange-50 hover:text-orange-600" activeClass="bg-orange-50 text-orange-600 shadow-sm" />
          
          <div className="pt-6 pb-2"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Intelli-Suite</p></div>
          <SidebarLink active={activeTab === 'studio'} onClick={() => setActiveTab('studio')} icon={<Sparkles className="w-5 h-5" />} label="Studio" colorClass="hover:bg-purple-50 hover:text-purple-600" activeClass="bg-purple-50 text-purple-600 shadow-sm" />
          <SidebarLink active={activeTab === 'agents'} onClick={() => setActiveTab('agents')} icon={<BrainCircuit className="w-5 h-5" />} label="AI Agents" colorClass="hover:bg-indigo-50 hover:text-indigo-600" activeClass="bg-indigo-50 text-indigo-600 shadow-sm" />
          
          <div className="pt-6 pb-2"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Developer</p></div>
          <SidebarLink active={activeTab === 'design'} onClick={() => setActiveTab('design')} icon={<Terminal className="w-5 h-5" />} label="System Design" colorClass="hover:bg-slate-100 hover:text-slate-700" activeClass="bg-slate-100 text-slate-700 shadow-sm" />
        </div>

        <div className="pt-6 border-t border-slate-50 space-y-2">
          <SidebarLink active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<UserCircle className="w-5 h-5" />} label="Profile" colorClass="hover:bg-slate-100 hover:text-slate-700" activeClass="bg-slate-100 text-slate-700 shadow-sm" />
          <button onClick={handleLogout} className="w-full flex items-center space-x-3.5 p-3.5 rounded-2xl transition-pastel font-medium text-sm text-rose-400 hover:bg-rose-50">
            <LogOut className="w-5 h-5" />
            <span>Switch Profile</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto relative bg-[#fbfcfd]">
        {isProcessing && (
          <div className="absolute top-8 right-10 z-50 flex items-center space-x-3 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-sm border border-indigo-50 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.15em]">Analyzing Reality...</span>
          </div>
        )}

        <div className="max-w-6xl mx-auto p-12">
          {activeTab === 'dashboard' && <Dashboard state={{ user: currentUser, logs: currentUser.logs, tasks: currentUser.tasks, decisions: currentUser.decisions, isLoggedIn: true, library, reminders }} onToggleTask={toggleTask} onUpdateLogs={updateLogs} onNavigate={(tab) => setActiveTab(tab)} />}
          {activeTab === 'physical' && <PhysicalHealth analysis={physicalAnalysis} onUpdateAnalysis={setPhysicalAnalysis} />}
          {activeTab === 'mental' && <MentalHealth analysis={mentalAnalysis} onUpdateAnalysis={setMentalAnalysis} />}
          {activeTab === 'logs' && <Logs onAddLog={addLog} logs={currentUser.logs} />}
          {activeTab === 'reminders' && <Reminders reminders={reminders} onToggle={(id) => setReminders(prev => prev.map(r => r.id === id ? {...r, active: !r.active} : r))} />}
          {activeTab === 'studio' && <WellnessStudio user={currentUser} onAddToLibrary={(c) => setLibrary(prev => [c, ...prev])} library={library} />}
          {activeTab === 'agents' && <AgentMonitor decisions={currentUser.decisions} />}
          {activeTab === 'profile' && <Profile user={currentUser} />}
          {activeTab === 'design' && <SystemDesign />}
        </div>
        
        <button 
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-sky-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-pastel z-40"
        >
          <MessageCircle className="w-8 h-8" />
        </button>
        {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
      </main>
    </div>
  );
};

const SidebarLink = ({ active, onClick, icon, label, colorClass, activeClass }: any) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3.5 p-3.5 rounded-2xl transition-pastel font-medium text-sm ${active ? activeClass : `text-slate-400 ${colorClass}`}`}>
    {icon}
    <span>{label}</span>
  </button>
);

export default App;
