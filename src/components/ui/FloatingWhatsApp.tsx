import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FloatingWhatsApp: React.FC = () => {
  const { siteData } = useApp();
  const { general } = siteData;
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    const text = encodeURIComponent(general.whatsappMessage);
    window.open(`https://wa.me/${general.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-3 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-xs text-xs relative flex items-start gap-2"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="absolute top-1.5 right-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1 animate-pulse" />
            <div>
              <span className="font-bold block text-slate-900 dark:text-white">Engenharia Online</span>
              <span>Deseja calcular sua economia de energia agora?</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/40 relative cursor-pointer group"
        aria-label="Atendimento no WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-slate-950 text-emerald-500" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-950 animate-ping" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-950" />
      </motion.button>
    </div>
  );
};
