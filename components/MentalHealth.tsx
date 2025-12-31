
import React, { useState } from 'react';
import { Heart, Sparkles, Brain, CheckCircle2, ChevronRight, Loader2, Quote } from 'lucide-react';
import { analyzeMentalQuiz } from '../services/gemini';
import { MentalStateAnalysis } from '../types';

const QUESTIONS = [
  "How often have you felt unable to control important things in your life lately?",
  "How often have you felt confident about your ability to handle personal problems?",
  "How often have you felt that things were going your way?",
  "How often have you felt difficulties were piling up so high that you could not overcome them?",
  "How often have you been able to control irritations in your life?"
];

const OPTIONS = ["Never", "Rarely", "Sometimes", "Often", "Always"];

interface Props {
  analysis?: MentalStateAnalysis;
  onUpdateAnalysis: (a: MentalStateAnalysis) => void;
}

const MentalHealth: React.FC<Props> = ({ analysis, onUpdateAnalysis }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnswer = (option: string) => {
    const newAnswers = [...answers, option];
    if (currentStep < QUESTIONS.length - 1) {
      setAnswers(newAnswers);
      setCurrentStep(currentStep + 1);
    } else {
      setAnswers(newAnswers);
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = async (finalAnswers: string[]) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeMentalQuiz(finalAnswers);
      onUpdateAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <header className="">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Emotional Sanctuary</h1>
        <p className="text-slate-400 font-medium mt-1">Nurture your mindset through self-reflection.</p>
      </header>

      {!analysis && !isAnalyzing && (
        <div className="bg-white p-12 sm:p-20 rounded-[3rem] border border-slate-50 shadow-sm text-center space-y-10">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-rose-200" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">State Awareness Quiz</h2>
            <p className="text-slate-400 max-w-sm mx-auto font-medium">A quick psychological self-report to help us understand your current mental landscape.</p>
          </div>

          <div className="max-w-md mx-auto space-y-8">
            <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-50 text-left">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Question {currentStep + 1} of {QUESTIONS.length}</p>
              <h3 className="text-lg font-bold text-slate-700 leading-snug">{QUESTIONS[currentStep]}</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {OPTIONS.map(opt => (
                <button 
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="w-full p-5 bg-white border border-slate-100 rounded-2xl text-slate-600 font-bold hover:bg-rose-50 hover:border-rose-100 hover:text-rose-500 transition-pastel text-left flex justify-between items-center group"
                >
                  <span>{opt}</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-pastel" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isAnalyzing && (
        <div className="h-96 flex flex-col items-center justify-center space-y-6">
          <Loader2 className="w-12 h-12 text-rose-300 animate-spin" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Consulting the Oracle...</p>
        </div>
      )}

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-12 rounded-[3rem] border border-slate-50 shadow-sm space-y-8">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6 text-rose-300" />
                <h3 className="text-xl font-bold text-slate-800">State Summary</h3>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed text-lg">
                {analysis.summary}
              </p>
              <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-50 flex items-start space-x-5">
                <Quote className="w-8 h-8 text-rose-100 flex-shrink-0" />
                <p className="text-slate-500 italic font-medium">"{analysis.recommendation}"</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] ml-2">Daily Affirmations</h3>
            <div className="space-y-4">
              {analysis.affirmations.map((aff, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center space-x-5 group hover:-translate-y-1 transition-pastel">
                  <div className="p-3 bg-rose-50 text-rose-400 rounded-2xl group-hover:bg-rose-400 group-hover:text-white transition-pastel">
                    <Heart className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-slate-700 leading-tight">{aff}</p>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => { setAnswers([]); setCurrentStep(0); onUpdateAnalysis(null as any); }}
              className="w-full p-5 bg-slate-50 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-2xl border border-transparent hover:border-slate-100 transition-pastel"
            >
              Retake Pulse Check
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentalHealth;
