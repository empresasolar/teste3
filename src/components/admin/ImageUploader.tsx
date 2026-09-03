import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, RefreshCw, Check, Sparkles } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (base64OrUrl: string) => void;
  helperText?: string;
  recommendedAspect?: string;
}

// Curated high quality solar imagery presets
const SOLAR_PRESETS = [
  {
    name: 'Residência Solar Moderna',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Parque Solar Fotovoltaico',
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Módulos no Telhado',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Engenharia & Instalação',
    url: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Usina Comercial / Agro',
    url: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Avatar / Cliente',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  helperText = 'Arraste uma foto ou clique para selecionar do seu dispositivo (JPG, PNG, WebP).',
  recommendedAspect,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  // Resize and compress image using HTML Canvas
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WEBP).');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1400;
        const MAX_HEIGHT = 1400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onChange(compressedDataUrl);
        } else {
          onChange(e.target?.result as string);
        }
        setIsProcessing(false);
      };
      img.onerror = () => {
        setIsProcessing(false);
        alert('Erro ao carregar imagem.');
      };
      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {recommendedAspect && (
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
            Proporção ideal: {recommendedAspect}
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 group">
          <div className="relative h-44 sm:h-52 w-full flex items-center justify-center bg-slate-950/20">
            <img
              src={value}
              alt="Pré-visualização"
              className="w-full h-full object-cover"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                <span>Processando e otimizando imagem...</span>
              </div>
            )}
          </div>

          {/* Action Overlay */}
          <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500 truncate flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Foto carregada com sucesso</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Substituir Foto</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                title="Remover foto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? 'border-amber-500 bg-amber-500/10 scale-[0.99]'
              : 'border-slate-300 dark:border-slate-700 hover:border-amber-500/80 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            {isProcessing ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Clique para subir uma foto ou arraste o arquivo aqui
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{helperText}</p>
          </div>
        </div>
      )}

      {/* Suggested Quick Photos Drawer */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
        >
          <Sparkles className="w-3 h-3" />
          <span>{showPresets ? 'Ocultar fotos sugeridas' : 'Ver fotos solares sugeridas'}</span>
        </button>

        {showPresets && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2 animate-in fade-in duration-150">
            {SOLAR_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setShowPresets(false);
                }}
                className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-square group hover:ring-2 hover:ring-amber-500 cursor-pointer"
                title={preset.name}
              >
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 text-[9px] font-bold text-white text-center leading-tight">
                  Usar Esta
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
