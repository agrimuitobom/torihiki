import React, { useState, useRef, useEffect } from 'react';
import type { Status, Category } from '../types';
import { STATUS_OPTIONS } from '../constants';
import { Icon } from './Icon';

const CATEGORY_OPTIONS: { id: Category; label: string }[] = [
  { id: 'ongoing', label: '進行中' },
  { id: 'dm', label: 'ＤＭ済' },
  { id: 'waiting', label: '待機' },
  { id: 'completed', label: '完了済' },
];

interface BulkActionBarProps {
  selectedCount: number;
  onChangeMyStatus: (status: Status) => void;
  onChangePartnerStatus: (status: Status) => void;
  onChangeCategory: (category: Category) => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  onChangeMyStatus,
  onChangePartnerStatus,
  onChangeCategory,
  onBulkDelete,
  onClearSelection,
}) => {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowCategoryMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-gray-800 safe-bottom">
      <div className="max-w-md mx-auto px-4 py-3 space-y-2">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span className="text-white text-[11px] font-black italic">
            {selectedCount}件選択中
          </span>
          <button
            onClick={onClearSelection}
            className="text-gray-400 text-[10px] font-bold px-3 py-1 rounded-full border border-gray-700 active:bg-gray-800"
          >
            選択解除
          </button>
        </div>

        {/* My status row */}
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-bold text-gray-500 w-8 shrink-0">自分</span>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={`my-${s}`}
              onClick={() => onChangeMyStatus(s)}
              className="flex-1 text-[9px] font-bold text-white py-1.5 rounded-lg border border-gray-700 active:bg-[#ff8da1] active:border-[#ff8da1] active:text-black transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Partner status row */}
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-bold text-gray-500 w-8 shrink-0">相手</span>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={`partner-${s}`}
              onClick={() => onChangePartnerStatus(s)}
              className="flex-1 text-[9px] font-bold text-white py-1.5 rounded-lg border border-gray-700 active:bg-[#ff8da1] active:border-[#ff8da1] active:text-black transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Bottom actions */}
        <div className="flex items-center gap-2 pt-1">
          <div className="relative flex-1" ref={menuRef}>
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="w-full flex items-center justify-center gap-1 text-[10px] font-bold text-white py-2 rounded-xl border border-gray-700 active:bg-gray-800 transition-colors"
            >
              カテゴリ移動
              <Icon name="ChevronDown" size={12} className="text-gray-400" />
            </button>
            {showCategoryMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-lg">
                {CATEGORY_OPTIONS.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onChangeCategory(cat.id);
                      setShowCategoryMenu(false);
                    }}
                    className="w-full text-left text-[10px] font-bold text-white px-4 py-2.5 active:bg-gray-800 border-b border-gray-800 last:border-b-0"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={onBulkDelete}
            className="flex items-center justify-center gap-1 text-[10px] font-bold text-red-400 py-2 px-4 rounded-xl border border-red-900 active:bg-red-900/50 transition-colors"
          >
            <Icon name="Trash2" size={12} />
            一括削除
          </button>
        </div>
      </div>
    </div>
  );
};
