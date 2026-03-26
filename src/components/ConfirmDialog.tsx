import React from 'react';

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center px-6">
    <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl space-y-4">
      <p className="text-xs font-bold text-center text-gray-600 leading-relaxed whitespace-pre-wrap">
        {message}
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-2xl text-[11px] font-black bg-gray-100 text-gray-400 active:bg-gray-200 transition-colors"
        >
          キャンセル
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3 rounded-2xl text-[11px] font-black bg-red-500 text-white active:bg-red-600 transition-colors"
        >
          削除する
        </button>
      </div>
    </div>
  </div>
);
