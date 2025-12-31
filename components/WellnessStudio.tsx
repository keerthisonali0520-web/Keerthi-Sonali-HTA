
import React, { useState } from 'react';
import { Sparkles, Dumbbell, Apple, Wind, Zap, BookOpen, Clock, Loader2, ChevronRight } from 'lucide-react';
import { generateWellnessContent } from '../services/gemini';
import { UserProfile, GeneratedContent } from '../types';

interface Props {
  user: UserProfile;
  library: GeneratedContent[];
  onAddToLibrary: (content: GeneratedContent) => void;
}

const WellnessStudio: React.FC<Props> = ({ user, library, onAddToLibrary }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);

  const handleGenerate = async (type: GeneratedContent['type']) => {
    setLoading(type);
    try {
      const content = await generateWellnessContent(type, JSON.stringify(user));
      const newItem: GeneratedContent = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        title: `${type} for ${user.name.split(' ')[0]}`,
        content,
        timestamp: new Date()
      };
      onAddToLibrary(newItem);
      setSelectedContent(newItem);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <header className="flex items-center space-x-6">
        <div className="p-5 bg-gradient-to-tr from-indigo-200 to-purple-200 rounded-[2rem] shadow-sm">
          <Sparkles className="w-8 h-8 text-white drop-shadow-sm" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">AI Wellness Studio</h1>
          <p className="text-slate-400 font-medium">Create bespoke routines and mindset tools instantly.</p>
        </div>
      </header>

      {/* Creation Grid - Pastel Soft Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CreationCard 
          icon={<Dumbbell/>} 
          title="Physical Plan" 
          desc="Custom home exercises"
          color="sky"
          isLoading={loading === 'Workout Plan'}
          onClick={() => handleGenerate('Workout Plan')}
        />
        <CreationCard 
          icon={<Apple/>} 
          title="Fuel Guide" 
          desc="Nourishing meal tips"
          color="teal"
          isLoading={loading === 'Nutrition Tips'}
          onClick={() => handleGenerate('Nutrition Tips')}
        />
        <CreationCard 
          icon={<Wind/>} 
          title="Peace Ritual" 
          desc="Breathing meditation"
          color="indigo"
          isLoading={loading === 'Mindfulness'}
          onClick={() => handleGenerate('Mindfulness')}
        />
        <CreationCard 
          icon={<Zap/>} 
          title="Daily Surge" 
          desc="Personalized affirmations"
          color="rose"
          isLoading={loading === 'Motivation'}
          onClick={() => handleGenerate('Motivation')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Content Viewer - Frosted Look */}
        <div className="lg:col-span-8">
          {selectedContent ? (
            <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-50 animate-in zoom-in-98 duration-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-300"></span>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                      {selectedContent.type}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 leading-tight">{selectedContent.title}</h2>
                </div>
                <div className="flex items-center bg-slate-50 px-5 py-2.5 rounded-2xl text-slate-400 text-[10px] font-black uppercase tracking-widest self-start sm:self-center">
                  <Clock className="w-3.5 h-3.5 mr-2 opacity-50" />
                  Generated {new Date(selectedContent.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="prose prose-slate max-w-none">
                {selectedContent.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-4 text-slate-600 leading-relaxed font-medium">
                    {line.startsWith('#') || line.startsWith('*') ? line.replace(/[*#]/g, '') : line}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] bg-white rounded-[3rem] border border-slate-50 flex flex-col items-center justify-center p-12 text-center shadow-sm">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                 <BookOpen className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Your AI Library</h3>
              <p className="text-slate-400 max-w-xs mt-3 font-medium leading-relaxed">
                Choose a category above to generate your first personalized piece of content.
              </p>
            </div>
          )}
        </div>

        {/* History / Library - Sidebar Look */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Studio History
            </h3>
            <span className="bg-indigo-50 text-indigo-400 text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest">{library.length} items</span>
          </div>
          
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-3 no-scrollbar">
            {library.length === 0 ? (
              <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-dashed border-slate-200 text-center">
                 <p className="text-sm font-bold text-slate-300">Studio is empty</p>
              </div>
            ) : (
              library.map(item => (
                <button 
                  key={item.id}
                  onClick={() => setSelectedContent(item)}
                  className={`w-full p-6 rounded-[1.75rem] transition-pastel text-left border flex items-center justify-between group ${
                    selectedContent?.id === item.id 
                    ? 'bg-indigo-50 border-indigo-100 shadow-sm' 
                    : 'bg-white border-slate-50 hover:border-slate-100 hover:bg-[#fafbfc]'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${selectedContent?.id === item.id ? 'text-indigo-400' : 'text-slate-300'}`}>
                      {item.type}
                    </p>
                    <p className={`font-bold truncate text-sm ${selectedContent?.id === item.id ? 'text-indigo-800' : 'text-slate-700'}`}>
                      {item.title}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-pastel ${selectedContent?.id === item.id ? 'text-indigo-400 translate-x-1' : 'text-slate-200 group-hover:text-slate-400'}`} />
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CreationCard = ({ icon, title, desc, onClick, isLoading, color }: any) => {
  const colors: any = {
    sky: 'bg-sky-50 text-sky-400 group-hover:bg-sky-100',
    teal: 'bg-teal-50 text-teal-400 group-hover:bg-teal-100',
    indigo: 'bg-indigo-50 text-indigo-400 group-hover:bg-indigo-100',
    rose: 'bg-rose-50 text-rose-400 group-hover:bg-rose-100'
  }
  return (
    <button 
      onClick={onClick}
      disabled={isLoading}
      className="group bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 text-left hover:shadow-md hover:-translate-y-1 transition-pastel relative overflow-hidden disabled:opacity-80"
    >
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rotate-12"></div>
      
      <div className={`w-14 h-14 ${colors[color]} rounded-[1.25rem] flex items-center justify-center mb-6 transition-pastel`}>
        {isLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : React.cloneElement(icon, { className: 'w-7 h-7' })}
      </div>
      
      <h4 className="font-bold text-slate-800 tracking-tight text-lg mb-1">
        {isLoading ? 'Creating...' : title}
      </h4>
      <p className="text-xs text-slate-400 font-medium leading-relaxed">{desc}</p>
    </button>
  );
};

export default WellnessStudio;
