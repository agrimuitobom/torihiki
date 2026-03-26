import React, { memo } from 'react';
import { Icon } from './Icon';
import type { Template } from '../types';

interface TemplateCardProps {
  item: Template;
  onEdit: (item: Template) => void;
  onDelete: (id: string | number) => void;
  onCopy: (text: string, label: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = memo(({ item, onEdit, onDelete, onCopy }) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
    <div className="flex justify-between items-center">
      <h3 className="font-black text-xs flex items-center gap-1.5 italic">
        <Icon name="Heart" size={12} className="text-[#ffb8c6]" />
        {item.title}
      </h3>
      <div className="flex gap-2">
        <button
          onClick={() => onCopy(item.content, '定型文をコピーしました')}
          className="p-2.5 bg-[#fff5f7] text-[#ff8da1] rounded-xl active:scale-90"
        >
          <Icon name="Clipboard" size={16} />
        </button>
        <button
          onClick={() => onEdit(item)}
          className="p-2.5 text-gray-300 active:scale-90"
        >
          <Icon name="Edit2" size={16} />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2.5 text-gray-200 active:scale-90 active:text-red-400"
        >
          <Icon name="Trash2" size={16} />
        </button>
      </div>
    </div>
    <div className="text-[11px] font-medium text-gray-500 leading-relaxed bg-[#fafafa] p-4 rounded-xl border border-dashed border-[#ffdce5] whitespace-pre-wrap">
      {item.content}
    </div>
  </div>
));
