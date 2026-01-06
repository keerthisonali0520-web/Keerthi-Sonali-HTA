
import { AppState, AgentDecision, WellnessTask } from '../types';
import { generateAgentAdvice } from './gemini';

export const runAgentCycle = async (state: AppState): Promise<{ decisions: AgentDecision[], tasks: WellnessTask[] }> => {
  // Access properties from the updated AppState interface
  const { user, logs } = state;
  const recentLogs = logs.slice(0, 3);
  
  const contextStr = JSON.stringify(user);
  const logsStr = JSON.stringify(recentLogs);

  const agents: Array<'Fitness' | 'Mental Health' | 'Nutrition'> = ['Fitness', 'Mental Health', 'Nutrition'];
  
  const agentPromises = agents.map(async (type) => {
    const aiOutput = await generateAgentAdvice(type, contextStr, logsStr);
    if (aiOutput) {
      const decision: AgentDecision = {
        agentName: type,
        decision: aiOutput.decision,
        priority: aiOutput.priority as any,
        recommendation: aiOutput.recommendation,
        tasks: aiOutput.tasks,
        timestamp: new Date()
      };
      
      // Explicitly type the map return and cast status to 'pending' as a constant to avoid type widening to string
      const tasks: WellnessTask[] = (aiOutput.tasks || []).map((t: string): WellnessTask => ({
        id: Math.random().toString(36).substr(2, 9),
        title: t,
        category: type === 'Mental Health' ? 'Mental' : (type === 'Fitness' ? 'Fitness' : 'Nutrition'),
        status: 'pending' as 'pending',
        assignedBy: type
      }));

      return { decision, tasks };
    }
    return null;
  });

  const results = await Promise.all(agentPromises);
  const validResults = results.filter((r): r is { decision: AgentDecision, tasks: WellnessTask[] } => r !== null);
  
  return {
    decisions: validResults.map(r => r.decision),
    tasks: validResults.flatMap(r => r.tasks)
  };
};
