import React from 'react';

interface IconDef {
  d: string;
  fill: boolean;
}

const ICONS: Record<string, IconDef> = {
  Plus: { d: 'M12 5v14M5 12h14', fill: false },
  Twitter: {
    d: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z',
    fill: false,
  },
  Clipboard: {
    d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 2h6v4H9z',
    fill: false,
  },
  Edit2: {
    d: 'M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z',
    fill: false,
  },
  Trash2: {
    d: 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6',
    fill: false,
  },
  ArrowRightLeft: {
    d: 'M20 7H4M20 7l-4-4M20 7l-4 4M4 17h16M4 17l4 4M4 17l4-4',
    fill: false,
  },
  Heart: {
    d: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
    fill: true,
  },
  ChevronRight: { d: 'm9 18 6-6-6-6', fill: false },
  Search: { d: 'M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', fill: false },
  Close: { d: 'M18 6 6 18M6 6l12 12', fill: false },
  GripVertical: { d: 'M9 4h.01M9 8h.01M9 12h.01M9 16h.01M9 20h.01M15 4h.01M15 8h.01M15 12h.01M15 16h.01M15 20h.01', fill: false },
  Check: { d: 'M20 6 9 17l-5-5', fill: false },
  CheckSquare: { d: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', fill: false },
  Square: { d: 'M3 3h18v18H3z', fill: false },
  ChevronDown: { d: 'm6 9 6 6 6-6', fill: false },
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  filled?: boolean;
}

export const Icon: React.FC<IconProps> = ({ name, size = 16, className = '', filled = false }) => {
  const icon = ICONS[name];
  if (!icon) return null;
  const useFill = icon.fill || filled;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={useFill ? 'currentColor' : 'none'}
      stroke={useFill ? 'none' : 'currentColor'}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={icon.d} />
    </svg>
  );
};
