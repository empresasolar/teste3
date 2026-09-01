import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { PortfolioItem } from '../../../types';
import { ImageUploader } from '../ImageUploader';
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X, ArrowUp, ArrowDown, MapPin, Zap } from 'lucide-react';

export const PortfolioTab: React.FC = () => {
  const { siteData, setPortfolio, showToast } = useApp();
  const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>(siteData.portfolio);
  const [editingProject, setEditingProject] = useState<PortfolioItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSaveList = (newList: PortfolioItem[]) => {
    setPortfolioList(newList);
    setPortfolio(newList);
    showToast('Portfólio atualizado com sucesso!', 'success');
  };

  const handleToggleActive = (id: string) => {
    const updated = portfolioList.map((p) => (p.id === id ? { ...p, active: !p.active } : p));
    handleSaveList(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      const updated = portfolioList.filter((p) => p.id !== id);
      handleSaveList(updated);
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    let updated: PortfolioItem[];
    if (isCreating) {
      updated = [...portfolioList, editingProject];
    } else {
      updated = portfolioList.map((p) => (p.id === editingProject.id ? editingProject : p));
    }

    handleSaveList(updated);
    setEditingProject(null);
    setIsCreating(false);
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingProject({
      id: 'port-' + Date.now(),
      title: 'Novo Projeto Solar',
      category: 'Residencial',
      powerKwp: 10.5,
      monthlyEconomyRs: 1100,
      location: 'São Paulo - SP',
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      description: 'Descrição técnica da usina e detalhes da homologação e economia gerada.',
      modulesCount: 20,
      featured: false,
      active: true,
      order: portfolioList.length + 1,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Portfólio de Obras & Projetos ({portfolioList.length})
          </h3>
          <p className="text-xs text-slate-500">
            Cadastre fotos, potência instalada e economia das obras realizadas pela Globo Solar.
          </p>
        </div>
        <button
          onClick={handleStartCreate}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Projeto</span>
        </button>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {portfolioList.map((project) => (
          <div
            key={project.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
              project.active
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                : 'bg-slate-100 dark:bg-slate-950/60 border-slate-300 dark:border-slate-800/50 opacity-60'
            }`}
          >
            <div className="flex gap-4">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-24 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div className="space-y-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-slate-950">
                    {project.category}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-amber-500" />
                    {project.location}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {project.title}
                </h4>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {project.powerKwp} kWp
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    R$ {project.monthlyEconomyRs}/mês
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">
                {project.modulesCount} módulos instalados
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(project.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  title={project.active ? 'Ocultar' : 'Exibir'}
                >
                  {project.active ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingProject({ ...project });
                  }}
                  className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-500/10"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-4 sm:p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {isCreating ? 'Cadastrar Projeto' : 'Editar Projeto'}
              </h4>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Título do Projeto
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Categoria
                  </label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                  >
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Rural">Rural</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Localização (Cidade - UF)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.location}
                    onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Potência (kWp)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editingProject.powerKwp}
                    onChange={(e) => setEditingProject({ ...editingProject, powerKwp: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Economia (R$/mês)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProject.monthlyEconomyRs}
                    onChange={(e) => setEditingProject({ ...editingProject, monthlyEconomyRs: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Qtd. Módulos
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProject.modulesCount}
                    onChange={(e) => setEditingProject({ ...editingProject, modulesCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>

              <div className="pt-1">
                <ImageUploader
                  label="Foto da Usina / Obra Solar Realizada"
                  value={editingProject.imageUrl}
                  onChange={(img) => setEditingProject({ ...editingProject, imageUrl: img })}
                  recommendedAspect="16:9 ou 4:3"
                  helperText="Selecione ou arraste uma foto real da obra concluída pela Globo Solar."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Descrição dos Detalhes Técnicos
                </label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Projeto</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
