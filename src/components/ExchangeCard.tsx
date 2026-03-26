import React, { memo } from 'react';
import { Icon } from './Icon';
import type { Exchange } from '../types';

interface ExchangeCardProps {
  item: Exchange;
  onEdit: (item: Exchange) => void;
  onDelete: (id: string | number) => void;
  onCopy: (text: string, label: string) => void;
}

export const ExchangeCard: React.FC<ExchangeCardProps> = memo(({ item, onEdit, onDelete, onCopy }) => (
  <div className="bg-white rounded-[1.5rem] p-5 border border-gray-100 shadow-sm space-y-4">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center border border-[#ffdce5] shadow-inner">
          <Icon name="Twitter" size={18} />
        </div>
        <div>
          <h3 className="font-black text-sm text-black leading-tight tracking-tight">
            {item.accountName}
          </h3>
          <button
            onClick={() => onCopy(item.twitterId, 'IDをコピーしました')}
            className="text-[10px] font-bold text-[#ff8da1] flex items-center gap-1 mt-0.5"
          >
            @{item.twitterId} <Icon name="Clipboard" size={10} />
          </button>
        </div>
      </div>
      <div className="bg-[#fff9fa] px-3 py-1 rounded-full border border-[#ffdce5]">
        <span className="text-[8px] font-black text-black italic uppercase tracking-wider">
          {item.realName || 'NO NAME'}
        </span>
      </div>
    </div>

    <div className="flex gap-2">
      <div
        className={`flex-1 flex flex-col items-center py-3 rounded-2xl border transition-colors ${
          item.myStatus === '未発送'
            ? 'bg-black text-white border-black'
            : 'bg-[#ffdce5] text-[#ff4f81] border-[#ffdce5]'
        }`}
      >
        <span className="text-[7px] font-bold opacity-50 mb-0.5 tracking-tighter">
          MY STATUS
        </span>
        <span className="text-[13px] font-black italic">{item.myStatus}</span>
      </div>
      <div
        className={`flex-1 flex flex-col items-center py-3 rounded-2xl border transition-colors ${
          item.partnerStatus === '未発送'
            ? 'bg-white text-black border-[#ffdce5]'
            : 'bg-[#ffdce5] text-[#ff4f81] border-[#ffdce5]'
        }`}
      >
        <span className="text-[7px] font-bold opacity-50 mb-0.5 tracking-tighter">
          PARTNER
        </span>
        <span className="text-[13px] font-black italic">
          {item.partnerStatus}
        </span>
      </div>
    </div>

    <div className="bg-[#fafafa] rounded-2xl p-4 flex items-center justify-between border border-gray-50 relative overflow-hidden">
      <div className="text-center flex-1 relative z-10">
        <p className="text-[7px] font-black text-[#ff8da1] uppercase mb-1 tracking-widest">
          GET
        </p>
        <p className="font-black text-xs text-black italic">
          {item.receivingItem || '-'}
        </p>
      </div>
      <Icon name="ArrowRightLeft" size={12} className="text-gray-200 mx-2" />
      <div className="text-center flex-1 relative z-10">
        <p className="text-[7px] font-black text-gray-400 uppercase mb-1 tracking-widest">
          GIVE
        </p>
        <p className="font-black text-xs text-gray-400 italic">
          {item.givingItem || '-'}
        </p>
      </div>
    </div>

    {item.notes && (
      <div className="text-[9px] font-medium text-gray-400 italic pl-3 border-l-2 border-[#ffdce5] truncate">
        Memo: {item.notes}
      </div>
    )}

    <div className="flex justify-end gap-3 pt-2 border-t border-gray-50">
      <button
        onClick={() => onEdit(item)}
        className="text-[10px] font-black text-black px-6 py-2 border-2 border-black rounded-xl active:bg-black active:text-white transition-all"
      >
        編集
      </button>
      <button
        onClick={() => onDelete(item.id)}
        className="p-2 text-gray-200 active:text-red-400"
      >
        <Icon name="Trash2" size={18} />
      </button>
    </div>
  </div>
));
