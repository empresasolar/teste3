import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', size }) => {
  // Access icon component by name or fallback to Sun
  const IconComponent = (LucideIcons as Record<string, any>)[name] || LucideIcons.Sun;
  return <IconComponent className={className} size={size} />;
};
