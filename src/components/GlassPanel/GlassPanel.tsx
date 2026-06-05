import React from 'react';
import './GlassPanel.css';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  interactive = false,
  onClick
}) => {
  return (
    <div 
      className={`glass-panel ${interactive ? 'glass-panel--interactive' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};
