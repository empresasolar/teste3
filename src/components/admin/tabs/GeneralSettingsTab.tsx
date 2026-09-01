import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { SiteGeneralConfig } from '../../../types';
import { Save, Building2, Phone, Mail, MapPin, Instagram, Globe, Sparkles, KeyRound, ShieldCheck, Check, Lock } from 'lucide-react';

export const GeneralSettingsTab: React.FC = () => {
  const { siteData, updateGeneralConfig, changeAdminPassword, showToast } = useApp();
  const [formData, setFormData] = useState<SiteGeneralConfig>(siteData.general);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGeneralConfig(formData);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('A nova senha deve ter no mínimo 6 caracteres.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('As senhas digitadas não coincidem.', 'error');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await changeAdminPassword(newPassword);
      if (res.success) {
        setNewPassword('');
        setConfirmPassword('');
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Identidade da Empresa & Contatos Comerciais
            </h3>
            <p className="text-xs text-slate-500">
              Edite todos os dados da Globo Solar Energia exibidos no topo, formulários e rodapé.
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
          {/* Company Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Nome da Empresa
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          {/* Slogan */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Slogan Principal
            </label>
            <input
              type="text"
              value={formData.companySlogan}
              onChange={(e) => setFormData({ ...formData, companySlogan: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          {/* Logo Text */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Texto do Logotipo (Linha 1)
            </label>
            <input
              type="text"
              value={formData.logoText}
              onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          {/* Logo Subtext */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Subtexto do Logotipo (Linha 2)
            </label>
            <input
              type="text"
              value={formData.logoSubtext}
              onChange={(e) => setFormData({ ...formData, logoSubtext: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Telefone Comercial
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          {/* WhatsApp */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Número WhatsApp (com DDI e DDD, apenas números)
            </label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="5511987654321"
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              E-mail de Contato
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          {/* Working Hours */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Horário de Atendimento
            </label>
            <input
              type="text"
              value={formData.workingHours}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Endereço (Rua, Número, Bairro)
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          {/* City and State */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Cidade / Estado
            </label>
            <input
              type="text"
              value={formData.cityState}
              onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          {/* Instagram URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Link do Instagram (@globosolarenergiag)
            </label>
            <input
              type="url"
              value={formData.instagramUrl}
              onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          {/* WhatsApp Default Message */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Mensagem Padrão do WhatsApp
            </label>
            <input
              type="text"
              value={formData.whatsappMessage}
              onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>
        </div>

        {/* Footer Text & Developer Credit */}
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Texto Institucional do Rodapé
            </label>
            <textarea
              rows={3}
              value={formData.footerAbout}
              onChange={(e) => setFormData({ ...formData, footerAbout: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Assinatura do Desenvolvedor (Obrigatório: Desenvolvido por WETA SISTEMAS)
            </label>
            <input
              type="text"
              value={formData.developerCredit}
              onChange={(e) => setFormData({ ...formData, developerCredit: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
            />
          </div>
        </div>
      </form>

      {/* Admin Security & Password Management in Supabase Database */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Segurança & Senha Administrativa</h4>
              <p className="text-[11px] text-slate-400">
                Protegido por criptografia SHA-256 e sincronizado com a tabela <code className="text-amber-400 font-mono">admin_auth</code> do Supabase.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Credenciais Ativas</span>
          </span>
        </div>

        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Nova Senha</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Confirmar Nova Senha</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdatingPassword || !newPassword}
            className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isUpdatingPassword ? 'Salvando no Banco...' : 'Atualizar Senha'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
