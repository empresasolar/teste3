import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FaqSection: React.FC = () => {
  const { siteData } = useApp();
  const { faqs, general } = siteData;

  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const activeFaqs = faqs.filter((f) => f.active);

  const categories = ['Todas', 'Economia', 'Instalação', 'Financiamento', 'Garantia e Manutenção', 'Geral'];

  const filteredFaqs = activeFaqs.filter((f) => {
    if (selectedCategory === 'Todas') return true;
    return f.category === selectedCategory;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent('Olá, equipe Globo Solar! Tenho uma dúvida sobre energia solar fotovoltaica.');
    window.open(`https://wa.me/${general.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <section id="faq" className="py-24 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white transition-colors relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Perguntas Frequentes (FAQ)
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Tudo o que você precisa saber sobre transição energética e economia solar.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-amber-500 text-slate-950 rotate-180'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Extra Help Card */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Ainda tem alguma dúvida específica?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Nossos especialistas em engenharia estão prontos para ajudar.
            </p>
          </div>
          <button
            onClick={handleWhatsApp}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-sm transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Falar com Especialista</span>
          </button>
        </div>
      </div>
    </section>
  );
};
