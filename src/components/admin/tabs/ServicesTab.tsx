import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { ServiceItem } from '../../../types';
import { ImageUploader } from '../ImageUploader';
import { Plus, Edit2, Trash2, Check, Eye, EyeOff, Save, X, ArrowUp, ArrowDown } from 'lucide-react';

export const ServicesTab: React.FC = () => {
  const { siteData, setServices, deleteService, showToast } = useApp();
  const [servicesList, setServicesList] = useState<ServiceItem[]>(siteData.services);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setServicesList(siteData.services || []);
  }, [siteData.services]);

  const handleSaveList = (newList: ServiceItem[]) => {
    setServicesList(newList);
    setServices(newList);
    showToast('Lista de serviços atualizada com sucesso!', 'success');
  };

  const handleToggleActive = (id: string) => {
    const updated = servicesList.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
    handleSaveList(updated);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    await deleteService(deletingId);
    setDeletingId(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= servicesList.length) return;

    const copy = [...servicesList];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    handleSaveList(copy);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    let updated: ServiceItem[];
    if (isCreating) {
      updated = [...servicesList, editingService];
    } else {
      updated = servicesList.map((s) => (s.id === editingService.id ? editingService : s));
    }

    handleSaveList(updated);
    setEditingService(null);
    setIsCreating(false);
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingService({
      id: 'srv-' + Date.now(),
      title: 'Novo Serviço Solar',
      shortDescription: 'Descrição resumida para o card do site.',
      fullDescription: 'Descrição detalhada com todas as especificações técnicas da instalação.',
      iconName: 'Sun',
      imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
      features: ['Instalação rápida e normatizada', 'Garantia total de fábrica', 'Monitoramento inteligente via app'],
      active: true,
      order: servicesList.length + 1,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Gerenciamento de Serviços Solares ({servicesList.length})
          </h3>
          <p className="text-xs text-slate-500">
            Adicione, edite ou altere a visibilidade dos serviços exibidos no site.
          </p>
        </div>
        <button
          onClick={handleStartCreate}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Serviço</span>
        </button>
      </div>

      {/* Services List Table / Cards */}
      <div className="grid grid-cols-1 gap-4">
        {servicesList.map((service, index) => (
          <div
            key={service.id}
            className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              service.active
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                : 'bg-slate-100 dark:bg-slate-950/60 border-slate-300 dark:border-slate-800/50 opacity-60'
            }`}
          >
            <div className="flex items-center gap-4">
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {service.title}
                  </h4>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    Ícone: {service.iconName}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 max-w-md">
                  {service.shortDescription}
                </p>
                <div className="text-[11px] text-slate-400">
                  {service.features?.length || 0} diferenciais cadastrados
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
              {/* Move buttons */}
              <button
                disabled={index === 0}
                onClick={() => handleMove(index, 'up')}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 disabled:opacity-30"
                title="Mover para cima"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                disabled={index === servicesList.length - 1}
                onClick={() => handleMove(index, 'down')}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 disabled:opacity-30"
                title="Mover para baixo"
              >
                <ArrowDown className="w-4 h-4" />
              </button>

              {/* Toggle Active */}
              <button
                onClick={() => handleToggleActive(service.id)}
                className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 ${
                  service.active
                    ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
                title={service.active ? 'Desativar do site' : 'Ativar no site'}
              >
                {service.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              {/* Edit */}
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingService({ ...service });
                }}
                className="p-2 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                title="Editar"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              {/* Delete */}
              <button
                onClick={() => setDeletingId(service.id)}
                className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 cursor-pointer transition-colors"
                title="Excluir Serviço"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Excluir Serviço?
              </h4>
              <p className="text-xs text-slate-500">
                Esta ação removerá este serviço permanentemente do catálogo do site. Deseja continuar?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-colors"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Create Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {isCreating ? 'Cadastrar Novo Serviço' : 'Editar Serviço'}
              </h4>
              <button
                onClick={() => setEditingService(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Título do Serviço
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Ícone (Nome Lucide)
                  </label>
                  <input
                    type="text"
                    value={editingService.iconName}
                    onChange={(e) => setEditingService({ ...editingService, iconName: e.target.value })}
                    placeholder="Home, Building2, Tractor, Factory, Wrench..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Status de Exibição
                  </label>
                  <select
                    value={editingService.active ? 'true' : 'false'}
                    onChange={(e) => setEditingService({ ...editingService, active: e.target.value === 'true' })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                  >
                    <option value="true">Ativo no Site</option>
                    <option value="false">Oculto</option>
                  </select>
                </div>
              </div>

              <div className="pt-1">
                <ImageUploader
                  label="Foto Ilustrativa do Serviço"
                  value={editingService.imageUrl}
                  onChange={(img) => setEditingService({ ...editingService, imageUrl: img })}
                  recommendedAspect="16:10 ou 4:3"
                  helperText="Selecione uma foto da instalação, inversores ou painéis deste serviço."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Descrição Curta (Card)
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingService.shortDescription}
                  onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Descrição Completa (Modal de Detalhes)
                </label>
                <textarea
                  rows={3}
                  value={editingService.fullDescription}
                  onChange={(e) => setEditingService({ ...editingService, fullDescription: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Diferenciais (Um por linha)
                </label>
                <textarea
                  rows={3}
                  value={editingService.features?.join('\n') || ''}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    features: e.target.value.split('\n').filter((l) => l.trim()),
                  })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Serviço</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
