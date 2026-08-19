import React from 'react';

interface BeninFlagProps {
  className?: string;
  width?: number;
  height?: number;
}

export const BeninFlag: React.FC<BeninFlagProps> = ({ className = 'w-6 h-4', width = 24, height = 16 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 200"
      className={`inline-block rounded-sm overflow-hidden shadow-xs border border-white/20 align-middle ${className}`}
      aria-label="Drapeau du Bénin"
    >
      {/* Green vertical stripe (left) */}
      <rect x="0" y="0" width="120" height="200" fill="#008751" />
      {/* Yellow horizontal stripe (top right) */}
      <rect x="120" y="0" width="180" height="100" fill="#FCD116" />
      {/* Red horizontal stripe (bottom right) */}
      <rect x="120" y="100" width="180" height="100" fill="#E8112D" />
    </svg>
  );
};
