import React from 'react';
import { useApp } from '../../context/AppContext';
import { DynamicIcon } from './DynamicIcon';
import { X, Check, ArrowRight, Zap, Shield, MapPin, Gauge, PiggyBank } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DetailModals: React.FC = () => {
  const {
    siteData,
    selectedServiceForModal,
    setSelectedServiceForModal,
    selectedProjectForModal,
    setSelectedProjectForModal,
    setIsAdminOpen,
  } = useApp();

  const handleWhatsAppContact = (subject: string) => {
    const text = encodeURIComponent(`Olá, Globo Solar Energia! Gostaria de saber mais sobre: ${subject}`);
    window.open(`https://wa.me/${siteData.general.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <>
      {/* Service Modal */}
      <AnimatePresence>
        {selectedServiceForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
            >
              <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-slate-950">
                <img
                  src={selectedServiceForModal.imageUrl}
                  alt={selectedServiceForModal.title}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <button
                  onClick={() => setSelectedServiceForModal(null)}
                  className="absolute top-4 right-4 p-2 bg-slate-900/80 text-white hover:bg-slate-800 rounded-full transition-all"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md mb-2">
                    <DynamicIcon name={selectedServiceForModal.iconName} className="w-3.5 h-3.5" />
                    <span>Serviço Especializado</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {selectedServiceForModal.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
                  {selectedServiceForModal.fullDescription || selectedServiceForModal.shortDescription}
                </p>

                {selectedServiceForModal.features && selectedServiceForModal.features.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-3">
                      Diferenciais & Vantagens Inclusas
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedServiceForModal.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-200"
                        >
                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    onClick={() => {
                      setSelectedServiceForModal(null);
                      const el = document.getElementById('calculadora');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-sm transition-colors text-center"
                  >
                    Simular Economia
                  </button>
                  <button
                    onClick={() => handleWhatsAppContact(selectedServiceForModal.title)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <span>Solicitar Orçamento Deste Serviço</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProjectForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
            >
              <div className="relative h-52 sm:h-72 w-full overflow-hidden bg-slate-950">
                <img
                  src={selectedProjectForModal.imageUrl}
                  alt={selectedProjectForModal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <button
                  onClick={() => setSelectedProjectForModal(null)}
                  className="absolute top-4 right-4 p-2 bg-slate-900/80 text-white hover:bg-slate-800 rounded-full transition-all"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 mb-2">
                    <span>{selectedProjectForModal.category}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {selectedProjectForModal.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                    <div className="text-xs text-slate-400 font-medium">Potência</div>
                    <div className="text-lg font-bold text-amber-500">{selectedProjectForModal.powerKwp} kWp</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                    <div className="text-xs text-slate-400 font-medium">Economia/mês</div>
                    <div className="text-lg font-bold text-emerald-500">R$ {selectedProjectForModal.monthlyEconomyRs}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                    <div className="text-xs text-slate-400 font-medium">Módulos</div>
                    <div className="text-lg font-bold text-slate-700 dark:text-slate-200">{selectedProjectForModal.modulesCount} un</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                    <div className="text-xs text-slate-400 font-medium">Localização</div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1 truncate">{selectedProjectForModal.location}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                    Detalhes da Instalação
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {selectedProjectForModal.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
                  <button
                    onClick={() => handleWhatsAppContact(`Projeto similar a: ${selectedProjectForModal.title}`)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <span>Quero um Projeto Como Este</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
