import React from 'react';
import { useApp } from '../../context/AppContext';
import { DynamicIcon } from '../ui/DynamicIcon';
import { ArrowRight, Calculator, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const HeroSection: React.FC = () => {
  const { siteData } = useApp();
  const { hero, general } = siteData;

  const handleAction = (action: string) => {
    if (action === 'calculator') {
      document.querySelector('#calculadora')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'portfolio') {
      document.querySelector('#projetos')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'services') {
      document.querySelector('#servicos')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'contact') {
      document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'whatsapp') {
      const text = encodeURIComponent(general.whatsappMessage);
      window.open(`https://wa.me/${general.whatsapp}?text=${text}`, '_blank');
    }
  };

  return (
    <section id="inicio" className="relative min-h-[90vh] pt-32 pb-20 overflow-hidden flex items-center bg-slate-950">
      {/* Background Graphic & Light Effects */}
      <div className="absolute inset-0 z-0">
        <img
          src={hero.bannerImageUrl}
          alt="Painéis Solares Globo Solar"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
        <div className="absolute -top-40 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Copy & CTA (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Badge */}
            {hero.badge && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{hero.badge}</span>
              </motion.div>
            )}

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]"
            >
              {hero.titlePart1}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">
                {hero.titleHighlight}
              </span>{' '}
              {hero.titlePart2}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal"
            >
              {hero.subtitle}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
            >
              <button
                onClick={() => handleAction(hero.primaryCtaAction)}
                className="px-7 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-extrabold text-base tracking-wide shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Calculator className="w-5 h-5" />
                <span>{hero.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleAction(hero.secondaryCtaAction)}
                className="px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{hero.secondaryCtaText}</span>
              </button>
            </motion.div>

            {/* Micro assurance */}
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Sem compromisso
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Estudo de viabilidade gratuito
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Homologação 100% garantida
              </span>
            </div>
          </div>

          {/* Right Column: Key Stats & Glass Highlight (5 cols) */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {hero.stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 * index }}
                  className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex flex-col justify-between group hover:border-amber-500/40 transition-all hover:bg-slate-900"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <DynamicIcon name={stat.iconName} className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
