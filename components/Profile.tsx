
import React from 'react';
import { UserProfile } from '../types';
import { ShieldCheck, Scale, Ruler, HeartPulse, Edit2 } from 'lucide-react';

interface Props {
  user: UserProfile;
}

const Profile: React.FC<Props> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center">
        <div className="relative inline-block">
          <img 
            src="https://picsum.photos/seed/user/200/200" 
            alt="Profile" 
            className="w-32 h-32 rounded-full border-4 border-white shadow-xl mb-4"
          />
          <button className="absolute bottom-4 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
        <p className="text-slate-500">Health Enthusiast • Joined Jan 2024</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-2">
            <Scale className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Weight</p>
          <p className="text-2xl font-black text-slate-800">{user.weight}kg</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-2">
            <Ruler className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Height</p>
          <p className="text-2xl font-black text-slate-800">{user.height}cm</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-2">
            <HeartPulse className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Age</p>
          <p className="text-2xl font-black text-slate-800">{user.age} yrs</p>
        </div>
      </div>

      <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl space-y-4">
        <h3 className="text-xl font-bold flex items-center">
          <ShieldCheck className="w-6 h-6 mr-2 text-indigo-400" />
          Current Wellness Goal
        </h3>
        <p className="text-indigo-100 text-lg leading-relaxed">
          "{user.fitnessGoal}"
        </p>
        <div className="pt-4 border-t border-indigo-800 flex justify-between items-center text-sm font-medium text-indigo-300">
          <span>Active Monitoring Enabled</span>
          <span className="bg-indigo-800 px-3 py-1 rounded-full text-indigo-100 text-xs">Standard Plan</span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold mb-6 text-slate-900">Privacy & Data Disclosure</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="p-2 bg-slate-200 text-slate-500 rounded-lg mt-1">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Non-Clinical Disclaimer</h4>
              <p className="text-sm text-slate-500 mt-1">This application is for wellness and motivational purposes only. It does not provide medical diagnosis, treatment, or professional clinical advice.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
