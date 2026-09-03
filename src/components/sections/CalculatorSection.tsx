import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calculator,
  Sun,
  TrendingDown,
  Trees,
  Home,
  Building2,
  Tractor,
  Factory,
  ArrowRight,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';

export const CalculatorSection: React.FC = () => {
  const { siteData, addLead } = useApp();
  const { calculator, general } = siteData;

  const [billValue, setBillValue] = useState<number>(calculator.defaultMonthlyBill || 650);
  const [propertyType, setPropertyType] = useState<'Residencial' | 'Comercial' | 'Rural' | 'Industrial'>('Residencial');
  
  // Lead submission state inside calculator
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Mathematical solar engineering estimates:
  const simulation = useMemo(() => {
    const kwhPrice = calculator.averageKwhPrice || 0.95;
    const sunHours = calculator.averageSunHoursPerDay || 4.8;
    const daysInMonth = 30;

    // Minimum network availability fee (taxa de disponibilidade)
    let minFee = 50; // Residencial monofásico/bifásico ~30-50 kWh
    if (propertyType === 'Comercial') minFee = 90;
    if (propertyType === 'Rural') minFee = 70;
    if (propertyType === 'Industrial') minFee = 150;

    const monthlyKwh = Math.max(0, billValue / kwhPrice);
    const monthlySavingsRs = Math.max(0, billValue - minFee);
    const monthlyGeneratedKwh = Math.max(0, monthlySavingsRs / kwhPrice);

    // kWp needed = monthlyGeneratedKwh / (sunHours * 30 * performanceRatio 0.78)
    const systemKwp = (monthlyGeneratedKwh / (sunHours * daysInMonth * 0.78));
    const formattedKwp = Number(Math.max(1.2, systemKwp).toFixed(2));

    // Area in m2 (~6.5 m2 per kWp for modern high-efficiency 560W+ panels)
    const roofAreaM2 = Math.ceil(formattedKwp * 6.2);

    // Number of panels (e.g. 565W modules = 0.565 kWp)
    const modulesCount = Math.ceil(formattedKwp / 0.565);

    // 25-year cumulative savings with conservative 4% energy tariff inflation
    let savings25Years = 0;
    let currentAnnualSavings = monthlySavingsRs * 12;
    for (let yr = 1; yr <= 25; yr++) {
      savings25Years += currentAnnualSavings;
      currentAnnualSavings *= 1.04;
    }

    // CO2 avoided (Kg per year)
    const annualCo2Kg = Math.round(monthlyGeneratedKwh * 12 * calculator.co2PerKwhKg);
    const treesEquivalent = Math.max(1, Math.round(annualCo2Kg / (1000 / calculator.treesPerTonCo2)));

    // Payback estimate in years
    const estimatedSystemCost = formattedKwp * calculator.averageSystemCostPerKwp;
    const annualSavingsInitial = monthlySavingsRs * 12;
    const paybackYears = (estimatedSystemCost / (annualSavingsInitial || 1)).toFixed(1);

    return {
      monthlySavingsRs: Math.round(monthlySavingsRs),
      formattedKwp,
      roofAreaM2,
      modulesCount,
      savings25Years: Math.round(savings25Years),
      annualCo2Kg,
      treesEquivalent,
      paybackYears,
      estimatedSystemCost: Math.round(estimatedSystemCost),
    };
  }, [billValue, propertyType, calculator]);

  const handleGenerateCustomProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !city.trim()) {
      return;
    }

    setIsSubmitting(true);
    await addLead({
      name,
      phone,
      city,
      propertyType,
      averageBillValue: billValue,
      estimatedKwp: simulation.formattedKwp,
      estimatedEconomy: simulation.monthlySavingsRs,
      notes: `Simulação de Economia Solar pelo Site: Sistema estimado de ${simulation.formattedKwp} kWp, economia de R$ ${simulation.monthlySavingsRs}/mês.`,
      status: 'Novo',
    });
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleWhatsAppWithSimulation = () => {
    const text = encodeURIComponent(
      `Olá, equipe da ${general.companyName}! Fiz uma simulação no site para meu imóvel ${propertyType} em ${city || 'minha cidade'}.\n` +
      `⚡ Conta média atual: R$ ${billValue.toLocaleString('pt-BR')}/mês\n` +
      `☀️ Potência estimada: ${simulation.formattedKwp} kWp (${simulation.modulesCount} placas)\n` +
      `💰 Economia estimada: R$ ${simulation.monthlySavingsRs.toLocaleString('pt-BR')}/mês\n` +
      `Gostaria de solicitar uma proposta técnica detalhada!`
    );
    window.open(`https://wa.me/${general.whatsapp}?text=${text}`, '_blank');
  };

  const propertyOptions = [
    { type: 'Residencial', label: 'Residência', icon: Home },
    { type: 'Comercial', label: 'Comércio / Empresa', icon: Building2 },
    { type: 'Rural', label: 'Propriedade Rural', icon: Tractor },
    { type: 'Industrial', label: 'Indústria / Galpão', icon: Factory },
  ] as const;

  return (
    <section id="calculadora" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative gradient aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulador Interativo em Tempo Real</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {calculator.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            {calculator.subtitle}
          </p>
        </div>

        {/* Main Calculator Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Controls (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-8">
            {/* Step 1: Select Property Type */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>1. Tipo de Imóvel</span>
                <span className="text-amber-400 font-semibold">{propertyType}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {propertyOptions.map((item) => {
                  const Icon = item.icon;
                  const isSelected = propertyType === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setPropertyType(item.type)}
                      className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Slider for Bill Amount */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  2. Valor Médio da sua Conta de Luz
                </label>
                <div className="text-2xl sm:text-3xl font-black text-amber-400">
                  R$ {billValue.toLocaleString('pt-BR')}
                  <span className="text-xs font-normal text-slate-400 ml-1">/mês</span>
                </div>
              </div>

              {/* Range slider */}
              <input
                type="range"
                min="200"
                max="15000"
                step="50"
                value={billValue}
                onChange={(e) => setBillValue(Number(e.target.value))}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
              />

              {/* Quick Select Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {[350, 650, 1200, 2500, 5000, 10000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBillValue(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      billValue === preset
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    R$ {preset.toLocaleString('pt-BR')}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Fast Proposal Submission Form */}
            <div className="pt-6 border-t border-slate-800/80 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Receber Estudo de Engenharia Completo</span>
              </h4>

              {submitted ? (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-sm flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Dados enviados! Nossa equipe entrará em contato em breve.</span>
                  </div>
                  <button
                    onClick={handleWhatsAppWithSimulation}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleGenerateCustomProposal} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Seu Nome Completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp (com DDD)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Sua Cidade / Estado"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                  <div className="sm:col-span-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{isSubmitting ? 'Registrando...' : 'Quero Minha Proposta Personalizada'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleWhatsAppWithSimulation}
                      className="py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Falar no WhatsApp</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Calculated Results & Financial Dashboard (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Primary Economy Highlight Card */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 sm:p-7 text-slate-950 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-900/80">
                  <span>Sua Economia Estimada</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-400 font-bold">
                    Até 95% Menos
                  </span>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
                    R$ {simulation.monthlySavingsRs.toLocaleString('pt-BR')}
                    <span className="text-sm font-bold text-slate-900/80 ml-1">/mês</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900/80 mt-1">
                    Economia acumulada em 25 anos: <strong>R$ {simulation.savings25Years.toLocaleString('pt-BR')}</strong>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-950/15 grid grid-cols-2 gap-3 text-left">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-900/70 block">Retorno Estimado</span>
                    <span className="text-base font-black text-slate-950">{simulation.paybackYears} anos</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-900/70 block">Potência Recomendada</span>
                    <span className="text-base font-black text-slate-950">{simulation.formattedKwp} kWp</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical & Environmental Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <Sun className="w-4 h-4" />
                  <span className="text-xs font-bold">Módulos Solares</span>
                </div>
                <div className="text-xl font-black text-white">~{simulation.modulesCount} un</div>
                <p className="text-[11px] text-slate-400 mt-0.5">Placas Tier 1 de 565W</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2 text-sky-400 mb-1">
                  <Home className="w-4 h-4" />
                  <span className="text-xs font-bold">Área de Telhado</span>
                </div>
                <div className="text-xl font-black text-white">~{simulation.roofAreaM2} m²</div>
                <p className="text-[11px] text-slate-400 mt-0.5">Espaço livre necessário</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Trees className="w-4 h-4" />
                  <span className="text-xs font-bold">Árvores Salvas</span>
                </div>
                <div className="text-xl font-black text-white">+{simulation.treesEquivalent}</div>
                <p className="text-[11px] text-slate-400 mt-0.5">Equivalente por ano</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400 mb-1">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-xs font-bold">CO₂ Evitado</span>
                </div>
                <div className="text-xl font-black text-white">~{simulation.annualCo2Kg} kg</div>
                <p className="text-[11px] text-slate-400 mt-0.5">Por ano na atmosfera</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              {calculator.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
