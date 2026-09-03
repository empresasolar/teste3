import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  generateSupabaseSqlScript,
  runDatabaseDiagnostics,
  DiagnosticResult,
} from '../../../lib/supabaseClient';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  RefreshCw,
  UploadCloud,
  DownloadCloud,
  ExternalLink,
  Code2,
  KeyRound,
  Check,
  Globe,
  Activity,
  XCircle,
  AlertCircle,
} from 'lucide-react';

export const DatabaseTab: React.FC = () => {
  const {
    supabaseConfig,
    setSupabaseConfig,
    isSupabaseConnected,
    isSyncing,
    testSupabaseConnection,
    syncToSupabase,
    fetchFromSupabase,
    showToast,
  } = useApp();

  const [url, setUrl] = useState(supabaseConfig.url || '');
  const [anonKey, setAnonKey] = useState(supabaseConfig.anonKey || '');
  const [copiedSql, setCopiedSql] = useState(false);
  const [testing, setTesting] = useState(false);
  const [runningDiag, setRunningDiag] = useState(false);
  const [diagResults, setDiagResults] = useState<DiagnosticResult[] | null>(null);

  const handleRunDiagnostics = async () => {
    setRunningDiag(true);
    try {
      const results = await runDatabaseDiagnostics({
        url: url.trim(),
        anonKey: anonKey.trim(),
        isConnected: false,
      });
      setDiagResults(results);
      showToast('Diagnóstico do banco de dados concluído!', 'info');
    } catch (err: any) {
      showToast(`Erro ao executar diagnóstico: ${err.message}`, 'error');
    } finally {
      setRunningDiag(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupabaseConfig({
      url: url.trim(),
      anonKey: anonKey.trim(),
    });
    setTesting(true);
    const ok = await testSupabaseConnection();
    setTesting(false);
    if (ok) {
      showToast('Configurações salvas e conexão com Supabase validada!', 'success');
    } else {
      showToast('Configurações salvas no navegador. Execute o script SQL no Supabase caso ainda não tenha feito.', 'info');
    }
  };

  const handleCopySql = () => {
    const script = generateSupabaseSqlScript();
    navigator.clipboard.writeText(script);
    setCopiedSql(true);
    showToast('Script SQL copiado para a área de transferência!', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-500" />
            <span>Integração & Banco de Dados Supabase</span>
          </h3>
          <p className="text-xs text-slate-500">
            Gerencie as credenciais de conexão, tabelas e sincronização em nuvem do projeto.
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {isSupabaseConnected ? (
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Supabase Conectado</span>
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Armazenamento Local Ativo</span>
            </span>
          )}
        </div>
      </div>

      {/* Sync Actions Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Sincronização Bidirecional
          </h4>
          <p className="text-xs text-slate-500">
            Envie todos os dados e configurações para o Supabase ou puxe a versão mais recente da nuvem.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            disabled={isSyncing}
            onClick={fetchFromSupabase}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>Puxar da Nuvem</span>
          </button>

          <button
            type="button"
            disabled={isSyncing}
            onClick={syncToSupabase}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{isSyncing ? 'Sincronizando...' : 'Enviar para Supabase'}</span>
          </button>
        </div>
      </div>

      {/* Credentials Form */}
      <form onSubmit={handleSaveConfig} className="space-y-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-amber-500" />
          <span>Credenciais do Projeto Supabase</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Project URL (Ex: https://xyzcompany.supabase.co)
            </label>
            <input
              type="url"
              placeholder="https://xyzcompany.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              API Anon / Public Key (eyJhbGci...)
            </label>
            <input
              type="text"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={runningDiag}
            onClick={handleRunDiagnostics}
            className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{runningDiag ? 'Executando Rodada de Testes...' : 'Executar Diagnóstico do Banco'}</span>
          </button>
          <button
            type="button"
            disabled={testing}
            onClick={async () => {
              setTesting(true);
              await testSupabaseConnection();
              setTesting(false);
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 cursor-pointer"
          >
            {testing ? 'Testando...' : 'Testar Conexão'}
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-md cursor-pointer"
          >
            Salvar Credenciais
          </button>
        </div>
      </form>

      {/* Diagnostics Results Panel */}
      {diagResults && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-500" />
              <span>Relatório de Diagnóstico & Rodada de Testes</span>
            </h4>
            <span className="text-xs text-slate-500 font-mono">
              {diagResults.filter((r) => r.status === 'success').length}/{diagResults.length} testes aprovados
            </span>
          </div>

          <div className="space-y-2.5">
            {diagResults.map((res, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 ${
                  res.status === 'success'
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-950 dark:text-emerald-200'
                    : res.status === 'warning'
                    ? 'bg-amber-500/5 border-amber-500/20 text-amber-950 dark:text-amber-200'
                    : 'bg-red-500/5 border-red-500/20 text-red-950 dark:text-red-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="font-bold flex items-center gap-2">
                    {res.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    {res.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                    {res.status === 'error' && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                    <span>{res.step}</span>
                  </div>
                  <p className="font-medium pl-6">{res.message}</p>
                  {res.details && (
                    <p className="text-[11px] opacity-80 pl-6 font-mono break-all">{res.details}</p>
                  )}
                </div>

                <div className="shrink-0 self-end sm:self-center pl-6 sm:pl-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      res.status === 'success'
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                        : res.status === 'warning'
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                        : 'bg-red-500/20 text-red-700 dark:text-red-300'
                    }`}
                  >
                    {res.status === 'success' ? 'Aprovado' : res.status === 'warning' ? 'Atenção' : 'Falha'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vercel & Multi-Device Realtime Guide */}
      <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-900 dark:text-white space-y-3">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
          <Globe className="w-5 h-5 shrink-0" />
          <span>Como garantir que as alterações apareçam em todos os aparelhos (Vercel)</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Se você alterou um conteúdo e ele só apareceu no mesmo celular ou computador, significa que o aplicativo estava operando em modo offline/cache local. Para sincronizar instantaneamente em <strong>todos os celulares, computadores e visitantes</strong>:
        </p>
        <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pl-1">
          <li>
            <strong>Configure na Vercel (Recomendado)</strong>: No painel da sua aplicação na Vercel, acesse <em>Settings &gt; Environment Variables</em> e adicione <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>. Em seguida, clique em <em>Redeploy</em>.
          </li>
          <li>
            <strong>Execute o Script SQL no Supabase</strong>: Copie o código SQL abaixo, abra o <em>SQL Editor</em> no Supabase e clique em <em>Run</em> (isso cria as tabelas e ativa o Realtime WebSocket).
          </li>
          <li>
            <strong>Envie os Dados</strong>: Clique no botão <span className="font-bold text-amber-600 dark:text-amber-400">"Enviar para Supabase"</span> acima para salvar a versão atual na nuvem.
          </li>
        </ol>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
          ✓ Com o Supabase ativo, qualquer edição que você fizer no painel administrativo salvará automaticamente no banco e atualizará em tempo real em todas as telas abertas!
        </p>
      </div>

      {/* SQL Script Generator Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-amber-400" />
            <h4 className="text-sm font-bold text-white">
              Script SQL de Criação de Tabelas & Políticas RLS
            </h4>
          </div>

          <button
            onClick={handleCopySql}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSql ? 'Copiado!' : 'Copiar Código SQL'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Para criar todas as tabelas (<code>site_content</code>, <code>services</code>, <code>portfolio</code>, <code>testimonials</code>, <code>faqs</code>, <code>leads</code>, <code>themes</code>) no seu Supabase:
          abra o painel do seu projeto no Supabase, vá na aba <strong>SQL Editor</strong>, cole o script abaixo e clique em <strong>Run</strong>.
        </p>

        {/* Code Preview */}
        <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-amber-300 overflow-x-auto max-h-56 leading-relaxed">
          {generateSupabaseSqlScript()}
        </pre>
      </div>
    </div>
  );
};
