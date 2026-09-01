import React from 'react';
import { useApp } from '../../context/AppContext';
import { Star, MessageSquare, Quote, MapPin, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const TestimonialsSection: React.FC = () => {
  const { siteData } = useApp();
  const { testimonials } = siteData;

  const activeTestimonials = testimonials.filter((t) => t.active);

  return (
    <section id="depoimentos" className="py-24 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Satisfação Comprovada</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            O que Nossos Clientes Dizem
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Quem já produz a própria energia limpa conta como foi a experiência com a Globo Solar.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {activeTestimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-7 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow relative"
            >
              <div className="space-y-4">
                {/* Star Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-amber-500/20" />
                </div>

                {/* Comment */}
                <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{item.comment}"
                </p>
              </div>

              {/* Author & Specs */}
              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatarUrl}
                    alt={item.clientName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-amber-500/50"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.clientName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.roleOrType} • {item.city}
                    </p>
                  </div>
                </div>

                {item.powerKwp && (
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-slate-400 block">Usina</span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {item.powerKwp} kWp
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
