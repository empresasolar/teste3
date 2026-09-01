import React from 'react';
import { useApp } from '../../context/AppContext';
import { DynamicIcon } from '../ui/DynamicIcon';
import { ArrowRight, Check, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const ServicesSection: React.FC = () => {
  const { siteData, setSelectedServiceForModal } = useApp();
  const { services } = siteData;

  const activeServices = services.filter((s) => s.active);

  return (
    <section id="servicos" className="py-24 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <Zap className="w-3.5 h-3.5" />
            <span>Nossas Soluções em Engenharia Solar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Projetos Fotovoltaicos Sob Medida
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Soluções completas com máxima eficiência, do planejamento à homologação na concessionária.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {activeServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top Image Preview */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg font-bold">
                  <DynamicIcon name={service.iconName} className="w-5 h-5" />
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Key Bullet Features */}
                {service.features && service.features.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Link */}
                <div className="pt-3">
                  <button
                    onClick={() => setSelectedServiceForModal(service)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-500 dark:hover:text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Ver Detalhes do Serviço</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
