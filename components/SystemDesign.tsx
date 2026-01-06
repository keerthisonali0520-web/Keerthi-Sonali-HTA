
import React from 'react';
import { Database, Code2, Workflow, Terminal, Layers, ShieldCheck, Activity, Cpu } from 'lucide-react';

const SystemDesign: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Architecture</h1>
        <p className="text-slate-500 font-medium">Industry-grade Multi-Agent Wellness System Technical Specification</p>
      </header>

      {/* High Level Architecture */}
      <section className="bg-indigo-900 text-white p-12 rounded-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Cpu className="w-64 h-64" />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center space-x-3 text-indigo-300">
            <Workflow className="w-6 h-6" />
            <h3 className="text-xl font-bold uppercase tracking-widest text-xs">Workflow Engine</h3>
          </div>
          <h2 className="text-4xl font-black max-w-2xl leading-tight">Autonomous Agentic Loop</h2>
          <p className="text-indigo-100/80 max-w-xl leading-relaxed">
            The system operates on a <strong>Observe-Orient-Decide-Act (OODA)</strong> loop. 
            Python agents poll the PostgreSQL stream, synchronize via shared memory, and push 
            recommendations through a Node.js WebSocket bridge.
          </p>
        </div>
      </section>

      {/* Tech Stack Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50 space-y-6">
          <div className="flex items-center space-x-3 text-indigo-600">
            <Layers className="w-6 h-6" />
            <h3 className="text-xl font-bold">The Tech Stack</h3>
          </div>
          <div className="space-y-4">
            <StackItem label="Intelligence" value="Gemini 1.5 Pro (Python SDK)" />
            <StackItem label="Backend AI" value="Python 3.11 + FastAPI" />
            <StackItem label="Orchestration" value="Node.js + BullMQ" />
            <StackItem label="Database" value="PostgreSQL 15 (Relational + JSONB)" />
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50 space-y-6">
          <div className="flex items-center space-x-3 text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
            <h3 className="text-xl font-bold">Privacy & Ethics</h3>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-slate-500 leading-relaxed">
              <strong>Non-Clinical Boundary:</strong> The system implements a hard filter on diagnostic language. Agents are restricted to "Wellness Suggestions" and "Mindfulness Nudges".
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              <strong>Data Sovereignty:</strong> Health logs are encrypted at rest. PII (Personally Identifiable Information) is scrubbed before passing context to LLM models.
            </p>
          </div>
        </div>
      </section>

      {/* Database Schema */}
      <section className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl space-y-6">
        <div className="flex items-center space-x-3 text-indigo-400">
          <Database className="w-6 h-6" />
          <h3 className="text-xl font-bold">PostgreSQL Schema (DDL)</h3>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 font-mono text-xs overflow-x-auto text-blue-100">
          <pre>
{`-- Agent Audit Trail for Explainability
CREATE TABLE agent_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    agent_name VARCHAR(50), 
    reasoning_process TEXT, -- Chain of Thought Storage
    recommendation TEXT NOT NULL,
    priority VARCHAR(20),
    context_snapshot JSONB, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time Health Stream
CREATE TABLE health_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    steps INTEGER,
    sleep_hours FLOAT,
    mood VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
          </pre>
        </div>
      </section>

      {/* Python Code Sample */}
      <section className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 text-slate-800">
          <Terminal className="w-6 h-6 text-indigo-500" />
          <h3 className="text-xl font-bold">Python Agent logic</h3>
        </div>
        <div className="bg-slate-50 rounded-2xl p-8 font-mono text-xs overflow-x-auto text-slate-700">
          <pre>
{`class WellnessAgent:
    def decide(self, user_context, recent_logs):
        # 1. Analyze Trends via Gemini
        prompt = f"Analyze activity for {user_context['name']}..."
        response = gemini.generate(prompt)
        
        # 2. Autonomous Decision Tree
        if response.fatigue_detected:
            return self.escalate_rest_plan()
        
        # 3. Synchronize with Nutrition Agent
        orchestrator.sync_context(response.decision)`}
          </pre>
        </div>
      </section>
    </div>
  );
};

const StackItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-transparent hover:border-indigo-100 transition-pastel">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-bold text-slate-700">{value}</span>
  </div>
);

export default SystemDesign;
