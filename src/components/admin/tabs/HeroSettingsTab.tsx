import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { HeroConfig, StatItem } from '../../../types';
import { ImageUploader } from '../ImageUploader';
import { Save, Plus, Trash2, Sparkles } from 'lucide-react';

export const HeroSettingsTab: React.FC = () => {
  const { siteData, updateHeroConfig, showToast } = useApp();
  const [formData, setFormData] = useState<HeroConfig>(siteData.hero);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroConfig(formData);
    showToast('Banner e cabeçalho principal atualizados!', 'success');
  };

  const handleStatChange = (id: string, field: keyof StatItem, value: string) => {
    setFormData({
      ...formData,
      stats: formData.stats.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    });
  };

  const handleAddStat = () => {
    const newStat: StatItem = {
      id: Date.now().toString(),
      value: '+100',
      label: 'Novo Destaque',
      iconName: 'Sun',
    };
    setFormData({ ...formData, stats: [...formData.stats, newStat] });
  };

  const handleRemoveStat = (id: string) => {
    setFormData({
      ...formData,
      stats: formData.stats.filter((s) => s.id !== id),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Banner Principal & Textos de Destaque
          </h3>
          <p className="text-xs text-slate-500">
            Configure o cabeçalho principal, chamadas para ação e números em destaque.
          </p>
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Alterações</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Badge Superior (Selo Flutuante)
          </label>
          <input
            type="text"
            value={formData.badge}
            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Título (Parte 1 - Antes do destaque)
          </label>
          <input
            type="text"
            value={formData.titlePart1}
            onChange={(e) => setFormData({ ...formData, titlePart1: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Texto Destacado (Gradiente Dourado)
          </label>
          <input
            type="text"
            value={formData.titleHighlight}
            onChange={(e) => setFormData({ ...formData, titleHighlight: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-bold text-amber-500"
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Título (Parte 2 - Conclusão da frase)
          </label>
          <input
            type="text"
            value={formData.titlePart2}
            onChange={(e) => setFormData({ ...formData, titlePart2: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Subtítulo Explicativo
          </label>
          <textarea
            rows={3}
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
          />
        </div>

        {/* Buttons CTA */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Texto do Botão Primário
          </label>
          <input
            type="text"
            value={formData.primaryCtaText}
            onChange={(e) => setFormData({ ...formData, primaryCtaText: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Destino do Botão Primário
          </label>
          <select
            value={formData.primaryCtaAction}
            onChange={(e) => setFormData({ ...formData, primaryCtaAction: e.target.value as any })}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
          >
            <option value="calculator">Calculadora Solar</option>
            <option value="contact">Formulário de Contato</option>
            <option value="whatsapp">WhatsApp Direto</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Texto do Botão Secundário
          </label>
          <input
            type="text"
            value={formData.secondaryCtaText}
            onChange={(e) => setFormData({ ...formData, secondaryCtaText: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Destino do Botão Secundário
          </label>
          <select
            value={formData.secondaryCtaAction}
            onChange={(e) => setFormData({ ...formData, secondaryCtaAction: e.target.value as any })}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
          >
            <option value="portfolio">Projetos Realizados</option>
            <option value="services">Serviços</option>
            <option value="calculator">Calculadora</option>
            <option value="contact">Contato</option>
          </select>
        </div>

        <div className="md:col-span-2 pt-2">
          <ImageUploader
            label="Foto de Fundo do Banner Principal (Hero Section)"
            value={formData.bannerImageUrl}
            onChange={(img) => setFormData({ ...formData, bannerImageUrl: img })}
            recommendedAspect="16:9 ou Panorâmica"
            helperText="Selecione ou arraste uma foto em alta definição com instalação fotovoltaica ou usina."
          />
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Estatísticas & Números de Impacto
          </h4>
          <button
            type="button"
            onClick={handleAddStat}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Card</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {formData.stats.map((stat) => (
            <div
              key={stat.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Card de Estatística</span>
                <button
                  type="button"
                  onClick={() => handleRemoveStat(stat.id)}
                  className="text-rose-500 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Valor / Número</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(stat.id, 'value', e.target.value)}
                    className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400">Ícone Lucide</label>
                  <input
                    type="text"
                    value={stat.iconName}
                    onChange={(e) => handleStatChange(stat.id, 'iconName', e.target.value)}
                    placeholder="Sun, Zap, Award..."
                    className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400">Rótulo / Descrição</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                    className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
