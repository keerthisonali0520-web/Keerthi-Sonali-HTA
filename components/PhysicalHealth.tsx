
import React, { useState, useRef } from 'react';
import { Camera, Upload, Apple, Dumbbell, AlertTriangle, FileText, Loader2, Info, RefreshCw, CheckSquare, Square, X } from 'lucide-react';
import { analyzeHealthReport, regenerateMeal } from '../services/gemini';
import { ReportAnalysis } from '../types';

interface Props {
  analysis?: ReportAnalysis & { workoutTasks?: string[] };
  onUpdateAnalysis: (a: any) => void;
}

const PhysicalHealth: React.FC<Props> = ({ analysis, onUpdateAnalysis }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [refreshingMeal, setRefreshingMeal] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, isCamera: boolean = false) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setShowUploadOptions(false);
    setIsAnalyzing(true);
    
    // Capture MIME type to send to API
    const mimeType = file.type;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result?.toString().split(',')[1];
      try {
        if (!base64) throw new Error("Could not read file data.");
        
        const result = await analyzeHealthReport(
          base64, 
          mimeType, 
          `Medical report analysis from ${isCamera ? 'camera' : 'file upload'}.`
        );
        onUpdateAnalysis(result);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to analyze report. Please ensure the file is a clear image or PDF.");
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.onerror = () => {
      setError("File reading failed.");
      setIsAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRefreshMeal = async (mealType: string) => {
    if (!analysis) return;
    setRefreshingMeal(mealType);
    setError(null);
    try {
      const newMeal = await regenerateMeal(mealType, analysis.dietPlan, analysis.deficiencies);
      const updatedAnalysis = {
        ...analysis,
        dietPlan: {
          ...analysis.dietPlan,
          [mealType.toLowerCase()]: newMeal
        }
      };
      onUpdateAnalysis(updatedAnalysis);
    } catch (e) {
      console.error(e);
      setError("Failed to refresh meal.");
    } finally {
      setRefreshingMeal(null);
    }
  };

  const toggleExercise = (ex: string) => {
    setCompletedExercises(prev => 
      prev.includes(ex) ? prev.filter(i => i !== ex) : [...prev, ex]
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Physical Vitality</h1>
          <p className="text-slate-400 font-medium mt-1">Acquire reports to optimize your biological state.</p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowUploadOptions(!showUploadOptions)}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 bg-sky-500 text-white px-8 py-4 rounded-[1.5rem] hover:bg-sky-600 transition-pastel shadow-lg shadow-sky-100 font-bold"
          >
            {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
            <span>{isAnalyzing ? "Analyzing..." : "Acquire Health Report"}</span>
          </button>

          {showUploadOptions && (
            <div className="absolute top-full mt-4 right-0 w-64 bg-white rounded-3xl shadow-2xl border border-slate-50 p-3 z-50 animate-in slide-in-from-top-2 duration-300">
              <input type="file" ref={fileInputRef} onChange={(e) => handleFileUpload(e, false)} className="hidden" accept="image/*,application/pdf" />
              <input type="file" ref={cameraInputRef} onChange={(e) => handleFileUpload(e, true)} className="hidden" accept="image/*" capture="environment" />
              
              <button 
                onClick={() => cameraInputRef.current?.click()}
                className="w-full flex items-center space-x-3 p-4 hover:bg-sky-50 rounded-2xl transition-pastel text-slate-600 font-bold"
              >
                <Camera className="w-5 h-5 text-sky-400" />
                <span>Take Photo</span>
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center space-x-3 p-4 hover:bg-sky-50 rounded-2xl transition-pastel text-slate-600 font-bold"
              >
                <Upload className="w-5 h-5 text-sky-400" />
                <span>Upload from Files</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {error && (
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl flex items-center space-x-4 text-rose-600 animate-in slide-in-from-top-2">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <p className="font-medium">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-rose-100 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {!analysis ? (
        <div className="bg-white p-20 rounded-[3rem] border border-slate-50 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mb-6">
            <FileText className="w-10 h-10 text-sky-200" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No Biological Data</h3>
          <p className="text-slate-400 max-w-xs mt-3 font-medium leading-relaxed">
            Scan your reports using the camera or upload medical files (Image/PDF) to unlock personalized guidance.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Insights & Deficiencies */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                <Info className="w-4 h-4 mr-2" /> Biological Insights
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed">{analysis.summary}</p>
              <div className="space-y-3 pt-4">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Detected Deficiencies</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.deficiencies.map((d, i) => (
                    <span key={i} className="px-4 py-2 bg-rose-50 text-rose-500 text-xs font-bold rounded-xl border border-rose-100">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-orange-50/50 p-8 rounded-[2.5rem] border border-orange-100 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-orange-400 uppercase tracking-[0.2em] flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" /> Chrono-Nutrition Alerts
              </h3>
              <p className="text-orange-700/80 font-medium text-sm leading-relaxed italic">
                {analysis.dietPlan.cautions}
              </p>
            </div>
          </div>

          {/* Precision Nutrition & Movement */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm">
              <div className="flex items-center space-x-3 mb-8">
                <Apple className="w-6 h-6 text-emerald-400" />
                <h3 className="text-xl font-bold text-slate-800">Precision Diet Plan</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <MealCard 
                  label="Breakfast" 
                  text={analysis.dietPlan.breakfast} 
                  icon="🌅" 
                  onRefresh={() => handleRefreshMeal('Breakfast')}
                  isRefreshing={refreshingMeal === 'Breakfast'}
                />
                <MealCard 
                  label="Lunch" 
                  text={analysis.dietPlan.lunch} 
                  icon="☀️" 
                  onRefresh={() => handleRefreshMeal('Lunch')}
                  isRefreshing={refreshingMeal === 'Lunch'}
                />
                <MealCard 
                  label="Snack" 
                  text={analysis.dietPlan.snack} 
                  icon="🍎" 
                  onRefresh={() => handleRefreshMeal('Snack')}
                  isRefreshing={refreshingMeal === 'Snack'}
                />
                <MealCard 
                  label="Dinner" 
                  text={analysis.dietPlan.dinner} 
                  icon="🌙" 
                  onRefresh={() => handleRefreshMeal('Dinner')}
                  isRefreshing={refreshingMeal === 'Dinner'}
                />
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm">
              <div className="flex items-center space-x-3 mb-8">
                <Dumbbell className="w-6 h-6 text-sky-400" />
                <h3 className="text-xl font-bold text-slate-800">Dynamic Training Checklist</h3>
              </div>
              <div className="space-y-3">
                {analysis.workoutTasks?.map((task, idx) => (
                  <button 
                    key={idx}
                    onClick={() => toggleExercise(task)}
                    className={`w-full flex items-center p-5 rounded-2xl border transition-pastel text-left ${
                      completedExercises.includes(task)
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                      : 'bg-slate-50 border-transparent text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {completedExercises.includes(task) ? <CheckSquare className="w-5 h-5 mr-4" /> : <Square className="w-5 h-5 mr-4" />}
                    <span className={`font-semibold ${completedExercises.includes(task) ? 'line-through opacity-60' : ''}`}>
                      {task}
                    </span>
                  </button>
                )) || (
                  <p className="text-slate-400 italic">Generate a plan by uploading a health report.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MealCard = ({ label, text, icon, onRefresh, isRefreshing }: any) => (
  <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-50 transition-pastel hover:bg-white hover:shadow-sm group relative">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <span>{icon}</span>
    </div>
    <p className="text-sm font-medium text-slate-700 leading-relaxed pr-8">{text}</p>
    <button 
      onClick={(e) => { e.stopPropagation(); onRefresh(); }}
      className={`absolute bottom-6 right-6 text-slate-300 hover:text-indigo-400 transition-pastel p-2 bg-white rounded-xl shadow-sm border border-slate-50 ${isRefreshing ? 'animate-spin text-indigo-400' : 'opacity-0 group-hover:opacity-100'}`}
      title="Regenerate this meal"
    >
      <RefreshCw className="w-4 h-4" />
    </button>
  </div>
);

export default PhysicalHealth;
