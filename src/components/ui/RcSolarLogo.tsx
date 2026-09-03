import React from 'react';

interface RcSolarLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'stacked';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const RcSolarLogo: React.FC<RcSolarLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  showTagline = true,
}) => {
  // Dimension definitions
  const sizeMap = {
    sm: { iconSize: 32, titleSize: 'text-sm', subSize: 'text-[9px]' },
    md: { iconSize: 42, titleSize: 'text-lg', subSize: 'text-[10px]' },
    lg: { iconSize: 52, titleSize: 'text-xl', subSize: 'text-xs' },
    xl: { iconSize: 64, titleSize: 'text-2xl', subSize: 'text-sm' },
  };

  const { iconSize, titleSize, subSize } = sizeMap[size];

  // SVG Icon Symbol for RC Engenharia Solar
  const SymbolIcon = (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: iconSize, height: iconSize }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="rcSunGlow" x1="50" y1="10" x2="50" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="rcSolarPanel" x1="20" y1="40" x2="80" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="50%" stopColor="#0369A1" />
            <stop offset="100%" stopColor="#0C4A6E" />
          </linearGradient>
          <linearGradient id="rcLetters" x1="15" y1="20" x2="85" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
        </defs>

        {/* Outer Radiant Sun Rays */}
        <g stroke="url(#rcSunGlow)" strokeWidth="3" strokeLinecap="round" opacity="0.95">
          <line x1="50" y1="6" x2="50" y2="15" />
          <line x1="26" y1="16" x2="32" y2="23" />
          <line x1="74" y1="16" x2="68" y2="23" />
          <line x1="12" y1="36" x2="21" y2="39" />
          <line x1="88" y1="36" x2="79" y2="39" />
        </g>

        {/* Radiant Half Sun */}
        <path
          d="M24 48 A26 26 0 0 1 76 48 Z"
          fill="url(#rcSunGlow)"
        />

        {/* Photovoltaic Solar Panel in Perspective */}
        <polygon
          points="20,54 80,54 88,86 12,86"
          fill="url(#rcSolarPanel)"
          stroke="#38BDF8"
          strokeWidth="1.5"
        />

        {/* Solar Panel Cells Grid (Lines) */}
        {/* Horizontal dividing wire */}
        <line x1="16" y1="70" x2="84" y2="70" stroke="#BAE6FD" strokeWidth="1.2" opacity="0.85" />
        {/* Vertical cells wires */}
        <line x1="38" y1="54" x2="34" y2="86" stroke="#BAE6FD" strokeWidth="1.2" opacity="0.85" />
        <line x1="50" y1="54" x2="50" y2="86" stroke="#BAE6FD" strokeWidth="1.4" opacity="0.9" />
        <line x1="62" y1="54" x2="66" y2="86" stroke="#BAE6FD" strokeWidth="1.2" opacity="0.85" />

        {/* Stylized RC Monogram Badge on the upper center */}
        <rect x="22" y="18" width="56" height="26" rx="6" fill="#0A2558" stroke="#F59E0B" strokeWidth="1.5" />
        
        {/* "R" and "C" custom path glyphs */}
        <text
          x="50"
          y="37"
          fill="#FFFFFF"
          textAnchor="middle"
          fontWeight="900"
          fontSize="18"
          fontFamily="system-ui, sans-serif"
          letterSpacing="1.5"
        >
          RC
        </text>
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {SymbolIcon}
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center gap-2 ${className}`}>
        {SymbolIcon}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 leading-tight">
            <span className={`font-black tracking-tight text-white ${titleSize}`}>
              RC ENGENHARIA
            </span>
          </div>
          <span className="font-extrabold tracking-[0.25em] text-amber-400 uppercase text-xs">
            SOLAR
          </span>
          {showTagline && (
            <span className="text-[10px] text-slate-400 tracking-wider uppercase mt-1">
              Energia que transforma
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {SymbolIcon}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1">
          <span className={`font-black tracking-tight text-slate-900 dark:text-white ${titleSize}`}>
            RC ENGENHARIA
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`font-extrabold tracking-[0.2em] text-amber-500 dark:text-amber-400 uppercase ${subSize}`}>
            SOLAR
          </span>
          {showTagline && (
            <>
              <span className="text-slate-400 text-[9px]">•</span>
              <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                Acre
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
