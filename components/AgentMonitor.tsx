
import React, { useState } from 'react';
import { AgentDecision } from '../types';
import { BrainCircuit, Zap, AlertCircle, Info, CheckCircle2, ListTodo, X, Loader2 } from 'lucide-react';
import { explainAgentLogic } from '../services/gemini';

interface Props {
  decisions: AgentDecision[];
}

const AgentMonitor: React.FC<Props> = ({ decisions }) => {
  const [explainingDecision, setExplainingDecision] = useState<AgentDecision | null>(null);
  const [logicExplanation, setLogicExplanation] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  const handleExplain = async (decision: AgentDecision) => {
    setExplainingDecision(decision);
    setLogicExplanation(null);
    setIsLoadingExplanation(true);
    try {
      const explanation = await explainAgentLogic(decision.agentName, decision.decision, decision.recommendation);
      setLogicExplanation(explanation);
    } catch (e) {
      console.error(e);
      setLogicExplanation("Could not retrieve reasoning at this moment.");
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const getAgentStyles = (name: string) => {
    switch (name) {
      case 'Fitness': return 'text-sky-500 bg-sky-50 border-sky-100';
      case 'Mental Health': return 'text-purple-500 bg-purple-50 border-purple-100';
      case 'Nutrition': return 'text-teal-500 bg-teal-50 border-teal-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return <Zap className="w-3.5 h-3.5 text-rose-400" />;
      case 'Medium': return <AlertCircle className="w-3.5 h-3.5 text-orange-400" />;
      default: return <Info className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-6 duration-700">
      <header className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="p-5 bg-white border border-slate-50 rounded-[2rem] shadow-sm text-sky-400 w-fit">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">AI Agent Network</h1>
          <p className="text-slate-400 font-medium">Observing the reasoning behind every proactive wellness suggestion.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
        {decisions.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border border-slate-50 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <BrainCircuit className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Awaiting Data Streams</h3>
            <p className="text-slate-400 max-w-xs mt-3 font-medium leading-relaxed">
              When you add daily entries, our multi-agent system will populate this dashboard with its live reasoning.
            </p>
          </div>
        ) : (
          decisions.map((decision, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-12 animate-in slide-in-from-bottom-8 duration-500 hover:shadow-md transition-pastel">
              <div className="flex-shrink-0 flex lg:flex-col items-center justify-between lg:justify-start space-x-4 lg:space-x-0 lg:space-y-6 lg:w-52">
                <div className={`w-full text-center py-3 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] ${getAgentStyles(decision.agentName)}`}>
                  {decision.agentName}
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-slate-50/50 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-50">
                  {getPriorityIcon(decision.priority)}
                  <span>{decision.priority} Logic</span>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{decision.decision}</h3>
                  <div className="bg-slate-50 px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-50">
                    {new Date(decision.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                <div className="bg-[#fafbfc] p-8 rounded-[2rem] border border-slate-50 relative group">
                  <div className="absolute top-8 left-0 w-1 h-12 bg-sky-200 rounded-r-full group-hover:bg-sky-400 transition-colors"></div>
                  <p className="text-slate-600 leading-relaxed font-medium italic">
                    "{decision.recommendation}"
                  </p>
                </div>

                {decision.tasks && decision.tasks.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center ml-2">
                      <ListTodo className="w-3.5 h-3.5 mr-2 opacity-50" /> 
                      Assigned Objectives
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {decision.tasks.map((task, i) => (
                        <div key={i} className="px-5 py-2.5 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 shadow-sm flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-sky-200 rounded-full"></div>
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center space-x-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Agent Reason Verified</span>
                  </div>
                  <button 
                    onClick={() => handleExplain(decision)}
                    className="text-[10px] font-black text-sky-400 uppercase tracking-widest hover:text-sky-600 transition-colors"
                  >
                    Explain Logic
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Logic Explanation Modal */}
      {explainingDecision && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-2xl w-full space-y-8 animate-in zoom-in-95 duration-500 relative overflow-hidden">
            <button 
              onClick={() => setExplainingDecision(null)}
              className="absolute top-8 right-8 text-slate-300 hover:text-slate-500 p-2"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl border ${getAgentStyles(explainingDecision.agentName)}`}>
                   <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Chain of Thought</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{explainingDecision.agentName} reasoning core</p>
                </div>
              </div>

              {isLoadingExplanation ? (
                <div className="py-12 flex flex-col items-center space-y-4">
                  <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest animate-pulse">Decompressing Logic...</p>
                </div>
              ) : (
                <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-50 prose prose-slate max-w-none">
                  <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                    {logicExplanation}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-4">
                 <button 
                   onClick={() => setExplainingDecision(null)}
                   className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-slate-200"
                 >
                   Understood
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentMonitor;
