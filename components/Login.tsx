
import React, { useState, useEffect } from 'react';
import { Activity, ArrowRight, ArrowLeft, Scale, Ruler, HeartPulse, Target, User, Sparkles, UserCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  onLogin: (profile: UserProfile) => void;
}

const STORAGE_KEY = 'fitcare_user_registry';

const Login: React.FC<Props> = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [registry, setRegistry] = useState<Record<string, UserProfile>>({});
  const [formData, setFormData] = useState<UserProfile>({
    id: '',
    name: '',
    age: 25,
    weight: 70,
    height: 175,
    fitnessGoal: '',
    logs: [],
    decisions: [],
    tasks: []
  });

  useEffect(() => {
    const savedRegistry = localStorage.getItem(STORAGE_KEY);
    if (savedRegistry) {
      setRegistry(JSON.parse(savedRegistry));
    }
  }, []);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const isStepValid = () => {
    if (step === 1) return formData.name.length >= 2;
    if (step === 2) return formData.age > 0 && formData.weight > 0 && formData.height > 0;
    if (step === 3) return formData.fitnessGoal.length >= 5;
    return false;
  };

  const handleProfileSelect = (profile: UserProfile) => {
    onLogin(profile);
  };

  const setStayHealthy = () => {
    setFormData({ ...formData, fitnessGoal: "Stay healthy and maintain current wellness levels." });
  };

  const completeOnboarding = () => {
    const newUser = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      logs: [],
      decisions: [],
      tasks: []
    };
    onLogin(newUser);
  };

  const existingUserNames = Object.values(registry);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#f8fafc] p-6">
      <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-xl border border-slate-50 space-y-10 animate-in fade-in zoom-in-95 duration-700 relative overflow-hidden">
        
        {/* Progress Header */}
        <div className="flex justify-center space-x-2 mb-2">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-1 rounded-full transition-all duration-500 ${step >= s ? 'w-8 bg-sky-500' : 'w-4 bg-slate-100'}`} 
            />
          ))}
        </div>

        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-sky-50 text-sky-500 rounded-3xl flex items-center justify-center mb-6">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">FitCare</h1>
          <p className="text-slate-400 font-medium leading-relaxed">Let's build your personalized wellness blueprint.</p>
        </div>

        <div className="min-h-[320px] flex flex-col justify-center">
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
                  <User className="w-3 h-3 mr-2" /> Start Your Journey
                </label>
                <input 
                  type="text" 
                  autoFocus
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-transparent rounded-[1.5rem] p-5 focus:bg-white focus:border-sky-100 outline-none transition-pastel text-slate-700 font-semibold text-lg"
                  placeholder="What is your name?"
                />
              </div>

              {existingUserNames.length > 0 && (
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Existing Profiles</p>
                  <div className="grid grid-cols-2 gap-3">
                    {existingUserNames.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => handleProfileSelect(profile)}
                        className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl hover:bg-sky-50 transition-pastel border border-transparent hover:border-sky-100 text-left group"
                      >
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sky-400 shadow-sm group-hover:bg-sky-500 group-hover:text-white transition-pastel">
                          <UserCircle className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-600 truncate">{profile.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
                    <Scale className="w-3 h-3 mr-2" /> Weight (kg)
                  </label>
                  <input 
                    type="number" 
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-transparent rounded-[1.25rem] p-4 focus:bg-white focus:border-sky-100 outline-none transition-pastel text-slate-700 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
                    <Ruler className="w-3 h-3 mr-2" /> Height (cm)
                  </label>
                  <input 
                    type="number" 
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-transparent rounded-[1.25rem] p-4 focus:bg-white focus:border-sky-100 outline-none transition-pastel text-slate-700 font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
                  <HeartPulse className="w-3 h-3 mr-2" /> Biological Age
                </label>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-transparent rounded-[1.25rem] p-4 focus:bg-white focus:border-sky-100 outline-none transition-pastel text-slate-700 font-bold"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
                  <Target className="w-3 h-3 mr-2" /> Your Primary Intent
                </label>
                <div className="flex justify-end">
                   <button 
                     onClick={setStayHealthy}
                     className="text-[10px] font-bold text-sky-500 bg-sky-50 px-3 py-1.5 rounded-full hover:bg-sky-100 transition-pastel flex items-center space-x-1"
                   >
                     <Sparkles className="w-3 h-3" />
                     <span>Option: Stay Healthy</span>
                   </button>
                </div>
                <textarea 
                  autoFocus
                  value={formData.fitnessGoal}
                  onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                  className="w-full bg-slate-50 border border-transparent rounded-[1.5rem] p-5 focus:bg-white focus:border-sky-100 outline-none transition-pastel text-slate-700 font-medium min-h-[120px]"
                  placeholder="e.g. Improve cardiovascular health and maintain high energy levels..."
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-4 pt-4">
          {step > 1 && (
            <button 
              onClick={prevStep}
              className="p-5 bg-slate-50 text-slate-400 rounded-[1.5rem] hover:bg-slate-100 transition-pastel"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <button 
            onClick={() => step < 3 ? nextStep() : completeOnboarding()}
            disabled={!isStepValid()}
            className="flex-1 bg-sky-500 text-white p-5 rounded-[1.5rem] font-bold text-lg hover:bg-sky-600 shadow-xl shadow-sky-100 transition-pastel flex items-center justify-center group disabled:opacity-50"
          >
            <span>{step === 3 ? "Complete Profile" : "Continue"}</span>
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-pastel" />
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Step {step} of 3</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
