import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { SolarCalculatorConfig } from '../../../types';
import { Save, Calculator, HelpCircle } from 'lucide-react';

export const CalculatorSettingsTab: React.FC = () => {
  const { siteData, updateCalculatorConfig } = useApp();
  const [formData, setFormData] = useState<SolarCalculatorConfig>(siteData.calculator);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCalculatorConfig(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Parâmetros da Calculadora & Engenharia Solar
          </h3>
          <p className="text-xs text-slate-500">
            Ajuste os valores de referência utilizados para calcular o kWp, economia e payback em tempo real.
          </p>
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Parâmetros</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Título da Seção da Calculadora
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Subtítulo Explicativo
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
          />
        </div>

        {/* Average kWh Price */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
          <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Tarifa Média de Energia (R$ / kWh)</span>
            <span className="text-amber-500 font-bold">R$ {formData.averageKwhPrice}</span>
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.averageKwhPrice}
            onChange={(e) => setFormData({ ...formData, averageKwhPrice: Number(e.target.value) })}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
          />
          <p className="text-[11px] text-slate-500">
            Média da concessionária local incluindo impostos (ICMS/PIS/COFINS). Ex: R$ 0.95.
          </p>
        </div>

        {/* Sun Hours Per Day */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
          <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Horas de Sol Pico Médias (HSP / dia)</span>
            <span className="text-amber-500 font-bold">{formData.averageSunHoursPerDay} hrs</span>
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.averageSunHoursPerDay}
            onChange={(e) => setFormData({ ...formData, averageSunHoursPerDay: Number(e.target.value) })}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
          />
          <p className="text-[11px] text-slate-500">
            Irradiação solar média diária da região. Brasil varia tipicamente entre 4.5 e 5.5 HSP.
          </p>
        </div>

        {/* Average Cost per kWp */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
          <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Custo Médio de Instalação (R$ / kWp)</span>
            <span className="text-amber-500 font-bold">R$ {formData.averageSystemCostPerKwp}</span>
          </label>
          <input
            type="number"
            step="100"
            value={formData.averageSystemCostPerKwp}
            onChange={(e) => setFormData({ ...formData, averageSystemCostPerKwp: Number(e.target.value) })}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
          />
          <p className="text-[11px] text-slate-500">
            Utilizado para a estimativa de Payback (retorno do investimento).
          </p>
        </div>

        {/* Default Bill Value */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
          <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Valor Inicial do Slider (R$)</span>
            <span className="text-amber-500 font-bold">R$ {formData.defaultMonthlyBill}</span>
          </label>
          <input
            type="number"
            step="50"
            value={formData.defaultMonthlyBill}
            onChange={(e) => setFormData({ ...formData, defaultMonthlyBill: Number(e.target.value) })}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
          />
          <p className="text-[11px] text-slate-500">
            Valor pré-selecionado quando o usuário entra na página inicial.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Aviso Legal / Disclaimer (Exibido no rodapé do simulador)
          </label>
          <textarea
            rows={2}
            value={formData.disclaimer}
            onChange={(e) => setFormData({ ...formData, disclaimer: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
          />
        </div>
      </div>
    </form>
  );
};
