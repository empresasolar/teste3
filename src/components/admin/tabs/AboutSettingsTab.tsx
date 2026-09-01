import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { AboutConfig } from '../../../types';
import { ImageUploader } from '../ImageUploader';
import { Save, Award, Info, Plus, Trash2 } from 'lucide-react';

export const AboutSettingsTab: React.FC = () => {
  const { siteData, updateAboutConfig, showToast } = useApp();
  const [formData, setFormData] = useState<AboutConfig>(siteData.about);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutConfig(formData);
    showToast('Seção Sobre Nós atualizada com sucesso!', 'success');
  };

  const handleAddFeature = () => {
    setFormData({
      ...formData,
      features: [
        ...formData.features,
        {
          id: 'feat-' + Date.now(),
          title: 'Novo Diferencial Técnico',
          description: 'Descreva a vantagem da engenharia própria da Globo Solar.',
          iconName: 'ShieldCheck',
        },
      ],
    });
  };

  const handleRemoveFeature = (id: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter((f) => f.id !== id),
    });
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const updated = [...formData.features];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, features: updated });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Seção Sobre Nós & Engenharia
          </h3>
          <p className="text-xs text-slate-500">
            Gerencie os textos institucionais, anos de experiência e a foto principal da empresa.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: Text Content */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Badge / Selo Superior
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
              Título Principal
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Subtítulo em Destaque
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Anos de Experiência (Destaque Flutuante)
            </label>
            <input
              type="number"
              value={formData.experienceYears}
              onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Parágrafo 1 da História
            </label>
            <textarea
              rows={3}
              value={formData.paragraph1}
              onChange={(e) => setFormData({ ...formData, paragraph1: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Parágrafo 2 da História
            </label>
            <textarea
              rows={3}
              value={formData.paragraph2}
              onChange={(e) => setFormData({ ...formData, paragraph2: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>
        </div>

        {/* Right column: Image Uploader & Technical Features */}
        <div className="space-y-6">
          <ImageUploader
            label="Foto Principal da Seção Sobre (Engenharia / Equipe)"
            value={formData.mainImageUrl}
            onChange={(img) => setFormData({ ...formData, mainImageUrl: img })}
            recommendedAspect="4:5 ou 3:4 (Vertical)"
            helperText="Suba uma foto da sede, engenheiros ou instalação técnica da Globo Solar."
          />

          {/* Features list */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Cards de Diferenciais da Empresa
              </label>
              <button
                type="button"
                onClick={handleAddFeature}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Card</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.features.map((feat, index) => (
                <div
                  key={feat.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      placeholder="Título do Diferencial"
                      value={feat.title}
                      onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                      className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feat.id)}
                      className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Descrição explicativa"
                    value={feat.description}
                    onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                    className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-medium">Ícone:</span>
                    <input
                      type="text"
                      placeholder="ShieldCheck, Award, Users, CheckCircle2..."
                      value={feat.iconName}
                      onChange={(e) => handleFeatureChange(index, 'iconName', e.target.value)}
                      className="w-full p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
