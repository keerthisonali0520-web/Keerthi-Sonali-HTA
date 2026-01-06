
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const DEFAULT_MODEL = 'gemini-3-pro-preview';

export const analyzeHealthReport = async (base64Image?: string, mimeType?: string, textPrompt?: string) => {
  const model = 'gemini-3-pro-preview';
  const prompt = `
    Analyze this health report: "${textPrompt || 'User uploaded a medical report'}".
    Identify nutritional deficiencies.
    Provide:
    1. A list of deficiencies.
    2. A summary of health state.
    3. A diet plan (Breakfast, Lunch, Snack, Dinner) rich in missing nutrients.
    4. Crucial meal-time cautions (e.g., "Do not eat heavy protein like chicken late at night as it might disturb sleep").
    5. A personalized workout plan broken down into 4-6 specific actionable exercise tasks.
    Respond in valid JSON.
  `;

  const contents = base64Image 
    ? { 
        parts: [
          { 
            inlineData: { 
              data: base64Image, 
              mimeType: mimeType || 'image/jpeg' 
            } 
          }, 
          { text: prompt }
        ] 
      }
    : prompt;

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          deficiencies: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING },
          dietPlan: {
            type: Type.OBJECT,
            properties: {
              breakfast: { type: Type.STRING },
              lunch: { type: Type.STRING },
              snack: { type: Type.STRING },
              dinner: { type: Type.STRING },
              cautions: { type: Type.STRING }
            },
            required: ["breakfast", "lunch", "snack", "dinner", "cautions"]
          },
          workoutTasks: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["deficiencies", "summary", "dietPlan", "workoutTasks"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const explainAgentLogic = async (agentName: string, decision: string, recommendation: string) => {
  const prompt = `
    As an AI Systems Engineer, explain the internal logic behind this ${agentName} agent decision.
    Decision: "${decision}"
    Recommendation: "${recommendation}"
    
    Explain the "Chain of Thought":
    1. What data markers were likely triggered?
    2. How does this align with physiological or psychological best practices?
    3. Why was this specific priority level assigned?
    
    Keep the explanation technical but accessible. Limit to 3 short paragraphs.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });

  return response.text || "Logic explanation unavailable at this time.";
};

export const regenerateMeal = async (mealType: string, currentPlan: any, deficiencies: string[]) => {
  const prompt = `The user has these deficiencies: ${deficiencies.join(', ')}. 
  The current ${mealType} suggestion is "${currentPlan[mealType.toLowerCase()]}".
  Provide ONE alternative healthy ${mealType} suggestion that addresses the deficiencies. 
  Avoid heavy proteins if the meal is 'Dinner' and mention why if relevant.
  Respond with just the name of the dish and a brief 1-sentence description.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });

  return response.text || "Fresh Salad - A nutritious alternative.";
};

export const analyzeMentalQuiz = async (answers: string[]) => {
  const prompt = `Interpret these psychological self-report answers: ${answers.join(', ')}. 
  Provide a summary of mental state, 3 personalized affirmations, and a general wellness recommendation. 
  Non-clinical. Respond in JSON.`;

  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          affirmations: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendation: { type: Type.STRING }
        },
        required: ["summary", "affirmations", "recommendation"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const getChatbotResponse = async (history: { role: string, text: string }[], message: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      { text: "You are FitCare assistant, a friendly wellness chatbot. Provide helpful, non-clinical health and mental health advice." },
      ...history.map(h => ({ text: `${h.role}: ${h.text}` })),
      { text: `User: ${message}` }
    ]
  });
  return response.text || "I'm here to help with your wellness journey!";
};

export const generateAgentAdvice = async (
  agentType: 'Fitness' | 'Mental Health' | 'Nutrition',
  userContext: string,
  historicalLogs: string
) => {
  const systemInstructions = {
    'Fitness': `You are an expert Fitness Coach AI Agent. Analyze user data. Decompose goals into daily tasks. Non-clinical.`,
    'Mental Health': `You are a compassionate Mental Health Wellness Agent. Suggest mindfulness or breathing exercises. Non-clinical.`,
    'Nutrition': `You are a Nutritionist AI Agent. Monitor hydration and meals. Suggest improvements. Non-clinical.`
  };

  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: `User Context: ${userContext}. Recent Data: ${historicalLogs}. Task: Provide an autonomous decision.`,
    config: {
      systemInstruction: systemInstructions[agentType],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          decision: { type: Type.STRING },
          priority: { type: Type.STRING },
          recommendation: { type: Type.STRING },
          tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["decision", "priority", "recommendation", "tasks"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return null;
  }
};

export const generateWellnessContent = async (
  type: 'Workout Plan' | 'Nutrition Tips' | 'Mindfulness' | 'Motivation',
  userContext: string
) => {
  const prompts = {
    'Workout Plan': 'Generate a 15-minute home workout plan.',
    'Nutrition Tips': 'Provide 5 practical nutrition tips.',
    'Mindfulness': 'Guide through a 5-minute breathing exercise.',
    'Motivation': 'Craft a personalized motivational message.'
  };

  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: `User: ${userContext}. Request: ${prompts[type]}`,
    config: {
      systemInstruction: "Format in clean Markdown.",
    }
  });

  return response.text || "Content generation failed.";
};
