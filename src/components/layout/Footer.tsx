import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sun,
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Linkedin,
  MessageCircle,
  ShieldCheck,
  Lock,
  ArrowRight,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { siteData, openAdmin, setSelectedServiceForModal } = useApp();
  const { general, services } = siteData;

  const currentYear = new Date().getFullYear();

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(general.whatsappMessage);
    window.open(`https://wa.me/${general.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-900">
          {/* Column 1: Brand & Bio (Spans 2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
                <Sun className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white leading-tight">
                  {general.logoText}
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-amber-400 uppercase">
                  {general.logoSubtext}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {general.footerAbout || general.description}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={general.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                title="Instagram @globosolarenergiag"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <button
                onClick={handleWhatsApp}
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                title="WhatsApp Comercial"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              {general.facebookUrl && (
                <a
                  href={general.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-blue-600 hover:text-white text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {general.linkedinUrl && (
                <a
                  href={general.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-sky-600 hover:text-white text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Navegação Rápida
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleNavClick('#inicio')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#calculadora')}
                  className="text-amber-400 font-semibold hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Calculadora Solar
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#sobre')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Sobre a Empresa
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#projetos')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Projetos Realizados
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#depoimentos')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Depoimentos
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#faq')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Dúvidas Frequentes
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Solutions / Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Soluções Solares
            </h4>
            <ul className="space-y-2 text-sm">
              {services.slice(0, 5).map((srv) => (
                <li key={srv.id}>
                  <button
                    onClick={() => setSelectedServiceForModal(srv)}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                  >
                    {srv.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Atendimento & Contato
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  {general.address}
                  <br />
                  <span className="text-slate-400 text-xs">{general.cityState}</span>
                </span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${general.phone.replace(/\D/g, '')}`} className="hover:text-amber-400">
                  {general.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`mailto:${general.email}`} className="hover:text-amber-400 truncate">
                  {general.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-xs">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{general.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with mandatory WETA and Admin Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {currentYear} {general.companyName}. Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="font-semibold text-amber-500/90 tracking-wide">
              {general.developerCredit || 'Desenvolvido por WETA SISTEMAS'}
            </div>

            {/* Discrete Administrator Access Link */}
            <button
              onClick={openAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
              title="Acesso Administrativo ao Painel"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Administrador</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
