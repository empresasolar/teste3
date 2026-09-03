import React from 'react';
import { useApp } from '../../context/AppContext';
import { DynamicIcon } from '../ui/DynamicIcon';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const BenefitsSection: React.FC = () => {
  const { siteData } = useApp();
  const { benefits, general } = siteData;

  const activeBenefits = benefits.filter((b) => b.active);

  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Diferenciais Inegociáveis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Por que Investir com a {general.companyName}?
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Garantias reais de longo prazo, homologação sem burocracia e retorno financeiro comprovado.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {activeBenefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="p-7 rounded-3xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition-all hover:bg-slate-950 flex flex-col justify-between group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                <DynamicIcon name={benefit.iconName} className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
