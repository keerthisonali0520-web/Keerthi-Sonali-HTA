
import React from 'react';
import { Database, Code2, Workflow, Terminal, Layers } from 'lucide-react';

const SystemDesign: React.FC = () => {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">System Architecture</h1>
        <p className="text-slate-500">Industry-grade Multi-Agent Wellness System Technical Specification</p>
      </header>

      {/* Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center space-x-3 text-indigo-600">
            <Layers className="w-6 h-6" />
            <h3 className="text-xl font-bold">Tech Stack</h3>
          </div>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-center"><div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div> <strong>Backend AI:</strong> Python (FastAPI + LangGraph)</li>
            <li className="flex items-center"><div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div> <strong>Orchestration:</strong> Node.js (TypeScript + BullMQ)</li>
            <li className="flex items-center"><div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div> <strong>Database:</strong> PostgreSQL with pgvector</li>
            <li className="flex items-center"><div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div> <strong>AI Models:</strong> Gemini 3 Pro (Generative + Reasoning)</li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center space-x-3 text-emerald-600">
            <Workflow className="w-6 h-6" />
            <h3 className="text-xl font-bold">Agentic Workflow</h3>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            The system employs a <strong>Shared Context Memory</strong> pattern. When a log is received, three autonomous agents (Fitness, Mental, Nutrition) pull recent history and user profile to reason independently. Decisions are audited by a Supervisor agent before being pushed to the user via WebSockets.
          </p>
        </div>
      </section>

      {/* Database Schema */}
      <section className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="flex items-center space-x-3 text-indigo-400">
          <Database className="w-6 h-6" />
          <h3 className="text-xl font-bold">PostgreSQL Schema Design</h3>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 font-mono text-sm overflow-x-auto">
          <pre className="text-blue-300">
{`CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(100),
  profile_data JSONB, -- Stores goals, height, weight
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE health_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  steps INTEGER,
  water_ml INTEGER,
  sleep_hours FLOAT,
  mood VARCHAR(20),
  meal_content TEXT,
  raw_report_url TEXT, -- Link to PDF/Images
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE agent_decisions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  agent_type VARCHAR(50),
  decision_title TEXT,
  recommendation TEXT,
  priority_level VARCHAR(20),
  context_snapshot JSONB,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
          </pre>
        </div>
      </section>

      {/* Code Sample */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center space-x-3 text-slate-800">
          <Terminal className="w-6 h-6" />
          <h3 className="text-xl font-bold">Agent Logic (Python Prototype)</h3>
        </div>
        <div className="bg-slate-50 rounded-2xl p-6 font-mono text-xs overflow-x-auto text-slate-700">
          <pre>
{`class FitnessAgent(BaseAgent):
    def process(self, context: UserContext):
        # 1. Analyze trends
        step_avg = sum(log.steps for log in context.recent_logs) / 7
        
        # 2. Autonomous Decision Tree
        if step_avg < context.goal.target_steps * 0.7:
            return self.generate_nudge(
                priority="High",
                reason="Weekly steps down by 30%",
                message="You've been a bit sedentary this week. Let's aim for a 15-min walk tonight!"
            )
        
        # 3. Dynamic Adaptation
        if context.fatigue_reported:
            return self.adjust_plan(reduce_intensity=True)`}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default SystemDesign;
