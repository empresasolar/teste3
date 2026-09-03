import React from 'react';
import { useApp } from '../../context/AppContext';
import { DynamicIcon } from '../ui/DynamicIcon';
import { ShieldCheck, Award, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutSection: React.FC = () => {
  const { siteData } = useApp();
  const { about, general } = siteData;

  const handleConsultancy = () => {
    document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="sobre" className="py-24 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Collages (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-900">
              <img
                src={about.mainImageUrl}
                alt={`Engenharia Solar ${general.companyName}`}
                className="w-full h-[380px] sm:h-[440px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>

            {/* Experience Floating Badge */}
            <div className="absolute -bottom-6 -right-2 sm:-right-6 z-20 p-5 rounded-2xl bg-amber-500 text-slate-950 shadow-xl border-4 border-white dark:border-slate-950 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-black text-2xl">
                {about.experienceYears}+
              </div>
              <div>
                <div className="text-sm font-extrabold uppercase tracking-tight">Anos de Mercado</div>
                <div className="text-xs font-medium text-slate-900/80">Solidez & Garantia Real</div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Features (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {about.badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                <Award className="w-3.5 h-3.5" />
                <span>{about.badge}</span>
              </div>
            )}

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {about.title}
            </h2>

            <p className="text-base sm:text-lg font-medium text-amber-700 dark:text-amber-400 leading-relaxed">
              {about.subtitle}
            </p>

            <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>{about.paragraph1}</p>
              <p>{about.paragraph2}</p>
            </div>

            {/* Core Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {about.features.map((feat) => (
                <div
                  key={feat.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <DynamicIcon name={feat.iconName} className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={handleConsultancy}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 text-white font-bold text-sm transition-all flex items-center gap-2"
              >
                <span>Falar com Nossa Equipe Técnica</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
