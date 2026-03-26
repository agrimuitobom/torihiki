const ICONS = {
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
};

export const Icon = ({ name, size = 16, className = '', filled = false }) => {
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
