import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FaqItem } from '../../../types';
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X, HelpCircle } from 'lucide-react';

export const FaqTab: React.FC = () => {
  const { siteData, setFaqs, showToast } = useApp();
  const [faqsList, setFaqsList] = useState<FaqItem[]>(siteData.faqs);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSaveList = (newList: FaqItem[]) => {
    setFaqsList(newList);
    setFaqs(newList);
    showToast('Perguntas frequentes atualizadas!', 'success');
  };

  const handleToggleActive = (id: string) => {
    const updated = faqsList.map((f) => (f.id === id ? { ...f, active: !f.active } : f));
    handleSaveList(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir esta pergunta?')) {
      const updated = faqsList.filter((f) => f.id !== id);
      handleSaveList(updated);
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;

    let updated: FaqItem[];
    if (isCreating) {
      updated = [...faqsList, editingFaq];
    } else {
      updated = faqsList.map((f) => (f.id === editingFaq.id ? editingFaq : f));
    }

    handleSaveList(updated);
    setEditingFaq(null);
    setIsCreating(false);
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingFaq({
      id: 'faq-' + Date.now(),
      question: 'Nova Pergunta Frequente?',
      answer: 'Resposta explicativa com termos claros para o cliente.',
      category: 'Geral',
      active: true,
      order: faqsList.length + 1,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Perguntas Frequentes - FAQ ({faqsList.length})
          </h3>
          <p className="text-xs text-slate-500">
            Cadastre e edite as respostas para as dúvidas comuns dos visitantes.
          </p>
        </div>
        <button
          onClick={handleStartCreate}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Pergunta</span>
        </button>
      </div>

      <div className="space-y-3">
        {faqsList.map((faq) => (
          <div
            key={faq.id}
            className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
              faq.active
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                : 'bg-slate-100 dark:bg-slate-950/60 border-slate-300 dark:border-slate-800/50 opacity-60'
            }`}
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {faq.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {faq.question}
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {faq.answer}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleToggleActive(faq.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                {faq.active ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingFaq({ ...faq });
                }}
                className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-500/10"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(faq.id)}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-4 sm:p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {isCreating ? 'Cadastrar Pergunta' : 'Editar Pergunta'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingFaq(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Pergunta
                </label>
                <input
                  type="text"
                  required
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Categoria
                </label>
                <select
                  value={editingFaq.category}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                >
                  <option value="Economia">Economia</option>
                  <option value="Instalação">Instalação</option>
                  <option value="Financiamento">Financiamento</option>
                  <option value="Garantia e Manutenção">Garantia e Manutenção</option>
                  <option value="Geral">Geral</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Resposta Detalhada
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Pergunta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
