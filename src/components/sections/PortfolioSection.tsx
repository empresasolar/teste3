import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PortfolioItem } from '../../types';
import { Sun, MapPin, Zap, TrendingDown, ArrowRight, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PortfolioSection: React.FC = () => {
  const { siteData, setSelectedProjectForModal } = useApp();
  const { portfolio } = siteData;

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Residencial', 'Comercial', 'Rural', 'Industrial'];

  const filteredProjects = portfolio.filter((p) => {
    if (!p.active) return false;
    if (selectedCategory === 'Todos') return true;
    return p.category === selectedCategory;
  });

  return (
    <section id="projetos" className="py-24 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>Portfólio de Obras & Instalações</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Projetos Reais Entregues
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Conheça algumas das usinas e sistemas solares instalados e homologados pela Globo Solar.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onClick={() => setSelectedProjectForModal(project)}
                className="group bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Image Cover */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-md">
                      {project.category}
                    </span>
                  </div>

                  {/* Location Badge */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{project.location}</span>
                  </div>
                </div>

                {/* Project Specs */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {project.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/70 dark:border-slate-800">
                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        Potência Instalada
                      </div>
                      <div className="text-base font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
                        {project.powerKwp} kWp
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        Economia Média
                      </div>
                      <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        R$ {project.monthlyEconomyRs}/mês
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-amber-500 transition-colors">
                    <span>Ver detalhes técnicos</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
