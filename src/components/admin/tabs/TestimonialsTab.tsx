import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { TestimonialItem } from '../../../types';
import { ImageUploader } from '../ImageUploader';
import { Plus, Edit2, Trash2, Star, Eye, EyeOff, Save, X } from 'lucide-react';

export const TestimonialsTab: React.FC = () => {
  const { siteData, setTestimonials, showToast } = useApp();
  const [testimonialsList, setTestimonialsList] = useState<TestimonialItem[]>(siteData.testimonials);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSaveList = (newList: TestimonialItem[]) => {
    setTestimonialsList(newList);
    setTestimonials(newList);
    showToast('Depoimentos atualizados!', 'success');
  };

  const handleToggleActive = (id: string) => {
    const updated = testimonialsList.map((t) => (t.id === id ? { ...t, active: !t.active } : t));
    handleSaveList(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir este depoimento?')) {
      const updated = testimonialsList.filter((t) => t.id !== id);
      handleSaveList(updated);
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated: TestimonialItem[];
    if (isCreating) {
      updated = [...testimonialsList, editingItem];
    } else {
      updated = testimonialsList.map((t) => (t.id === editingItem.id ? editingItem : t));
    }

    handleSaveList(updated);
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingItem({
      id: 'test-' + Date.now(),
      clientName: 'Novo Cliente',
      roleOrType: 'Residência',
      city: 'São Paulo - SP',
      rating: 5,
      comment: 'Excelente atendimento da Globo Solar. Instalação rápida e economia comprovada desde o primeiro mês.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      powerKwp: 9.5,
      active: true,
      order: testimonialsList.length + 1,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Depoimentos & Avaliações ({testimonialsList.length})
          </h3>
          <p className="text-xs text-slate-500">
            Gerencie o que os clientes dizem sobre o atendimento da Globo Solar.
          </p>
        </div>
        <button
          onClick={handleStartCreate}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Depoimento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonialsList.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
              item.active
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                : 'bg-slate-100 dark:bg-slate-950/60 border-slate-300 dark:border-slate-800/50 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
                {item.powerKwp && (
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    {item.powerKwp} kWp
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-3">
                "{item.comment}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <img
                  src={item.avatarUrl}
                  alt={item.clientName}
                  className="w-8 h-8 rounded-full object-cover border border-amber-500"
                />
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                    {item.clientName}
                  </h5>
                  <p className="text-[10px] text-slate-500">
                    {item.roleOrType} • {item.city}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleActive(item.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  {item.active ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingItem({ ...item });
                  }}
                  className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-500/10"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-4 sm:p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {isCreating ? 'Cadastrar Depoimento' : 'Editar Depoimento'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.clientName}
                  onChange={(e) => setEditingItem({ ...editingItem, clientName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tipo / Ocupação
                  </label>
                  <input
                    type="text"
                    value={editingItem.roleOrType}
                    onChange={(e) => setEditingItem({ ...editingItem, roleOrType: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Cidade - UF
                  </label>
                  <input
                    type="text"
                    value={editingItem.city}
                    onChange={(e) => setEditingItem({ ...editingItem, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Avaliação (1 a 5 estrelas)
                  </label>
                  <select
                    value={editingItem.rating}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Estrelas)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Estrelas)</option>
                    <option value={3}>⭐⭐⭐ (3 Estrelas)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Potência da Usina (kWp opcional)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingItem.powerKwp || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, powerKwp: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>

              <div className="pt-1">
                <ImageUploader
                  label="Foto ou Avatar do Cliente"
                  value={editingItem.avatarUrl}
                  onChange={(img) => setEditingItem({ ...editingItem, avatarUrl: img })}
                  recommendedAspect="1:1 (Quadrado)"
                  helperText="Selecione ou arraste uma foto do cliente ou da fachada da residência."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Texto do Depoimento
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.comment}
                  onChange={(e) => setEditingItem({ ...editingItem, comment: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Depoimento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
