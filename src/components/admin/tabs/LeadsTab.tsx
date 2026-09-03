import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { LeadItem } from '../../../types';
import {
  Users,
  Search,
  MessageCircle,
  Trash2,
  Filter,
  Download,
  Calendar,
  Zap,
  Building,
  DollarSign,
  CheckCircle,
  Clock,
} from 'lucide-react';

export const LeadsTab: React.FC = () => {
  const { leads, updateLeadStatus, deleteLead, showToast, siteData } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'Todos' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenWhatsApp = (lead: LeadItem) => {
    const text = encodeURIComponent(
      `Olá, ${lead.name}! Tudo bem? Aqui é da engenharia da ${siteData.general.companyName}.\n` +
      `Recebemos sua solicitação para seu imóvel ${lead.propertyType} em ${lead.city} com conta média de R$ ${lead.averageBillValue}.\n` +
      `Gostaria de agendar uma apresentação da sua proposta personalizada?`
    );
    const cleanPhone = lead.phone.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank');
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      showToast('Nenhum lead para exportar', 'info');
      return;
    }

    const headers = ['ID', 'Data', 'Nome', 'Telefone', 'Email', 'Cidade', 'Tipo', 'Conta Media', 'kWp Estimado', 'Economia Estimada', 'Status', 'Observações'];
    const rows = leads.map((l) => [
      l.id,
      new Date(l.createdAt).toLocaleDateString('pt-BR'),
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${l.city}"`,
      `"${l.propertyType}"`,
      l.averageBillValue,
      l.estimatedKwp || '',
      l.estimatedEconomy || '',
      l.status,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_rc_solar_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Planilha CSV de leads exportada!', 'success');
  };

  const statusColors: Record<LeadItem['status'], string> = {
    Novo: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    'Em Atendimento': 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    'Proposta Enviada': 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    Fechado: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    Perdido: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            <span>CRM & Gestão de Leads ({leads.length})</span>
          </h3>
          <p className="text-xs text-slate-500">
            Contatos recebidos via simulador solar e formulário de orçamento.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Quick Status Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(['Novo', 'Em Atendimento', 'Proposta Enviada', 'Fechado', 'Perdido'] as LeadItem['status'][]).map((st) => {
          const count = leads.filter((l) => l.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setStatusFilter(statusFilter === st ? 'Todos' : st)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {st}
              </div>
              <div className="text-lg font-black mt-0.5">{count}</div>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 w-full sm:w-auto"
        >
          <option value="Todos">Todos os Status</option>
          <option value="Novo">Novo</option>
          <option value="Em Atendimento">Em Atendimento</option>
          <option value="Proposta Enviada">Proposta Enviada</option>
          <option value="Fechado">Fechado</option>
          <option value="Perdido">Perdido</option>
        </select>
      </div>

      {/* Leads List */}
      <div className="space-y-3">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-slate-400">
            Nenhum lead encontrado com os filtros atuais.
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm"
            >
              {/* Lead Information */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {lead.name}
                  </h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusColors[lead.status]}`}>
                    {lead.status}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(lead.createdAt).toLocaleDateString('pt-BR')} às {new Date(lead.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">WhatsApp</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{lead.phone}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Cidade</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{lead.city}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Conta Atual</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      R$ {lead.averageBillValue?.toLocaleString('pt-BR') || 0}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">Imóvel</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{lead.propertyType}</span>
                  </div>
                </div>

                {lead.notes && (
                  <p className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    {lead.notes}
                  </p>
                )}
              </div>

              {/* Actions & Status Changer */}
              <div className="flex items-center gap-2 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                <select
                  value={lead.status}
                  onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  <option value="Novo">Novo</option>
                  <option value="Em Atendimento">Em Atendimento</option>
                  <option value="Proposta Enviada">Proposta Enviada</option>
                  <option value="Fechado">Fechado</option>
                  <option value="Perdido">Perdido</option>
                </select>

                <button
                  onClick={() => handleOpenWhatsApp(lead)}
                  className="p-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                  title="Abrir conversa no WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => deleteLead(lead.id)}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Excluir Lead"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
