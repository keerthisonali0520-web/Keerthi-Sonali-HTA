
export enum Mood {
  EXCITED = 'Excited',
  HAPPY = 'Happy',
  NEUTRAL = 'Neutral',
  STRESSED = 'Stressed',
  SAD = 'Sad',
  ANXIOUS = 'Anxious'
}

export interface HealthLog {
  id: string;
  timestamp: Date;
  steps: number;
  waterIntake: number; // in ml
  sleepHours: number;
  mood: Mood;
  mealDescription?: string;
}

export interface UserProfile {
  id: string; // Unique identifier for isolating data
  name: string;
  age: number;
  weight: number;
  height: number;
  fitnessGoal: string;
  logs: HealthLog[];
  decisions: AgentDecision[];
  tasks: WellnessTask[];
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  active: boolean;
  category: 'hydration' | 'exercise' | 'medication' | 'mindfulness';
}

export interface ReportAnalysis {
  deficiencies: string[];
  summary: string;
  dietPlan: {
    breakfast: string;
    lunch: string;
    snack: string;
    dinner: string;
    cautions: string;
  };
  workoutPlan: string;
}

export interface MentalStateAnalysis {
  summary: string;
  affirmations: string[];
  recommendation: string;
}

export interface WellnessTask {
  id: string;
  title: string;
  category: 'Fitness' | 'Mental' | 'Nutrition';
  status: 'pending' | 'completed';
  assignedBy: string;
}

export interface GeneratedContent {
  id: string;
  type: 'Workout Plan' | 'Nutrition Tips' | 'Mindfulness' | 'Motivation';
  title: string;
  content: string;
  timestamp: Date;
}

export interface AgentDecision {
  agentName: 'Fitness' | 'Mental Health' | 'Nutrition';
  decision: string;
  priority: 'Low' | 'Medium' | 'High';
  recommendation: string;
  tasks?: string[]; 
  timestamp: Date;
}

export interface AppState {
  user: UserProfile;
  isLoggedIn: boolean;
  library: GeneratedContent[];
  reminders: Reminder[];
  physicalAnalysis?: ReportAnalysis;
  mentalAnalysis?: MentalStateAnalysis;
  logs: HealthLog[];
  tasks: WellnessTask[];
  decisions: AgentDecision[];
}
