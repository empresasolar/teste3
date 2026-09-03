import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ThemeConfig } from '../../../types';
import { PRESET_THEMES, applyThemeToDocument } from '../../../lib/themeEngine';
import {
  Palette,
  Check,
  Sparkles,
  Sliders,
  Sun,
  Moon,
  RotateCcw,
  Zap,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const ThemeTab: React.FC = () => {
  const { currentTheme, setTheme, isDarkMode, setIsDarkMode, showToast } = useApp();
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>(currentTheme);

  const handleSelectPreset = (preset: ThemeConfig) => {
    setActiveTheme(preset);
    setTheme(preset);
    setIsDarkMode(preset.mode === 'dark');
    applyThemeToDocument(preset);
    showToast(`Tema "${preset.name}" ativado com sucesso!`, 'success');
  };

  const handleCustomColorChange = (key: keyof ThemeConfig['colors'], value: string) => {
    const updated: ThemeConfig = {
      ...activeTheme,
      colors: {
        ...activeTheme.colors,
        [key]: value,
      },
    };
    setActiveTheme(updated);
    setTheme(updated);
    applyThemeToDocument(updated);
  };

  const handleRadiusChange = (radius: ThemeConfig['borderRadius']) => {
    const updated: ThemeConfig = {
      ...activeTheme,
      borderRadius: radius,
    };
    setActiveTheme(updated);
    setTheme(updated);
    applyThemeToDocument(updated);
    showToast('Arredondamento atualizado!', 'info');
  };

  const handleModeToggle = (mode: 'dark' | 'light') => {
    const updated: ThemeConfig = {
      ...activeTheme,
      mode,
    };
    setActiveTheme(updated);
    setTheme(updated);
    setIsDarkMode(mode === 'dark');
    applyThemeToDocument(updated);
    showToast(`Modo ${mode === 'dark' ? 'Escuro' : 'Claro'} ativado!`, 'info');
  };

  const handleResetToDefault = () => {
    const defaultTheme = PRESET_THEMES[0];
    setActiveTheme(defaultTheme);
    setTheme(defaultTheme);
    setIsDarkMode(true);
    applyThemeToDocument(defaultTheme);
    showToast('Tema padrão Solar Gold restaurado!', 'success');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-500" />
            <span>Personalização de Temas & Identidade Visual</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Altere instantaneamente as cores primárias, botões, contrastes, modo escuro/claro e arredondamentos do site.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            title="Restaurar Padrão"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>
        </div>
      </div>

      {/* Live Interactive Preview Box */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-white relative overflow-hidden shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Pré-visualização em Tempo Real ({activeTheme.name})
            </span>
          </div>
          <span className="text-[11px] text-amber-400 font-semibold">
            Modo {activeTheme.mode === 'dark' ? 'Escuro' : 'Claro'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 items-center">
          {/* Simulated CTA Button */}
          <div className="space-y-2">
            <span className="text-[11px] text-slate-400 block font-medium">Botão Principal (CTA)</span>
            <button
              type="button"
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-default"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Solicitar Estudo Solar</span>
            </button>
          </div>

          {/* Simulated Stat Card */}
          <div className="space-y-2">
            <span className="text-[11px] text-slate-400 block font-medium">Card de Destaque & Ícones</span>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center font-black">
                95%
              </div>
              <div>
                <div className="text-xs font-bold text-white">Até 95% de Economia</div>
                <div className="text-[10px] text-slate-400">Homologação Garantida</div>
              </div>
            </div>
          </div>

          {/* Simulated Badge & Tag */}
          <div className="space-y-2">
            <span className="text-[11px] text-slate-400 block font-medium">Selos & Badges</span>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Energia Própria</span>
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950">
                Engenharia Solar
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Themes Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Temas Profissionais Disponíveis (Clique para Aplicar)</span>
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRESET_THEMES.map((preset) => {
            const isSelected = activeTheme.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30 shadow-lg'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{preset.name}</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {preset.description}
                </div>

                {/* Color Swatch Circles */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div
                    className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: preset.colors.primary }}
                    title={`Primária: ${preset.colors.primary}`}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: preset.colors.secondary }}
                    title={`Secundária: ${preset.colors.secondary}`}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: preset.colors.accent }}
                    title={`Acento: ${preset.colors.accent}`}
                  />
                  <span className="text-[10px] text-slate-400 ml-auto font-mono">
                    {preset.colors.primary}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Controls: Custom Colors & Geometry */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-500" />
          <span>Ajuste Fino de Cores & Elementos Visuais</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Primary Color */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Cor Primária (Botões / Ícones / Destaques)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={activeTheme.colors.primary}
                onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0"
              />
              <input
                type="text"
                value={activeTheme.colors.primary}
                onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold"
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Cor Secundária (Fundo / Superfícies)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={activeTheme.colors.secondary}
                onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0"
              />
              <input
                type="text"
                value={activeTheme.colors.secondary}
                onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold"
              />
            </div>
          </div>

          {/* Accent Color */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Cor de Acento (Aura / Selos / Badges)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={activeTheme.colors.accent}
                onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0"
              />
              <input
                type="text"
                value={activeTheme.colors.accent}
                onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Mode & Border Radius */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mode switch */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Esquema de Luz Principal
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleModeToggle('dark')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border cursor-pointer ${
                  activeTheme.mode === 'dark'
                    ? 'bg-slate-950 text-white border-amber-500 shadow-xs'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-amber-400" />
                <span>Modo Escuro (Dark)</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeToggle('light')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border cursor-pointer ${
                  activeTheme.mode === 'light'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs font-black'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Modo Claro (Light)</span>
              </button>
            </div>
          </div>

          {/* Border Radius */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Arredondamento dos Cards (Border Radius)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRadiusChange('rounded-md')}
                className={`py-2 px-2 rounded-md text-xs font-medium border text-center cursor-pointer ${
                  activeTheme.borderRadius === 'rounded-md'
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Reto (6px)
              </button>
              <button
                type="button"
                onClick={() => handleRadiusChange('rounded-xl')}
                className={`py-2 px-2 rounded-xl text-xs font-medium border text-center cursor-pointer ${
                  activeTheme.borderRadius === 'rounded-xl'
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Médio (14px)
              </button>
              <button
                type="button"
                onClick={() => handleRadiusChange('rounded-2xl')}
                className={`py-2 px-2 rounded-2xl text-xs font-medium border text-center cursor-pointer ${
                  activeTheme.borderRadius === 'rounded-2xl'
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Amplo (20px)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

