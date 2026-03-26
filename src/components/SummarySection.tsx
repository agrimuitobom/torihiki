import React from 'react';
import type { Stats } from '../types';

interface SummarySectionProps {
  stats: Stats;
}

export const SummarySection: React.FC<SummarySectionProps> = ({ stats }) => {
  const items = [
    { label: '進行', val: stats.ongoing, color: '#000' },
    { label: 'ＤＭ済', val: stats.dm, color: '#ff8da1' },
    { label: '待ち', val: stats.waiting, color: '#ffb8c6' },
    { label: '完了', val: stats.completed, color: '#ccc' },
  ];

  return (
    <section className="bg-white rounded-2xl p-4 flex justify-around items-center border border-gray-100 shadow-sm">
      {items.map((s) => (
        <div key={s.label} className="text-center px-2">
          <p
            className="text-xl font-black italic leading-none"
            style={{ color: s.color }}
          >
            {s.val}
          </p>
          <p className="text-[8px] font-bold text-gray-400 mt-1.5 uppercase tracking-wider">
            {s.label}
          </p>
        </div>
      ))}
    </section>
  );
};
