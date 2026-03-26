import React from 'react';
import { STATUS_OPTIONS } from '../constants';
import type { ExchangeFormData, Category, Status } from '../types';

interface ExchangeFormProps {
  formData: ExchangeFormData;
  onChange: (patch: Partial<ExchangeFormData>) => void;
  onSave: () => void;
  errors?: Record<string, string>;
}

export const ExchangeForm: React.FC<ExchangeFormProps> = ({ formData, onChange, onSave, errors = {} }) => (
  <div className="space-y-5 pb-6">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <p className="text-[8px] font-black text-gray-400 ml-1 uppercase">
          Name
        </p>
        <input
          type="text"
          placeholder="名前"
          className={`w-full bg-[#fafafa] rounded-2xl p-4 text-[14px] font-bold border-2 outline-none transition-all ${
            errors.accountName
              ? 'border-red-400 bg-red-50'
              : 'border-transparent focus:border-black'
          }`}
          value={formData.accountName}
          onChange={(e) => onChange({ accountName: e.target.value })}
        />
        {errors.accountName && (
          <p className="text-[9px] text-red-400 font-bold ml-1">
            {errors.accountName}
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <p className="text-[8px] font-black text-gray-400 ml-1 uppercase">
          Twitter ID
        </p>
        <input
          type="text"
          placeholder="@抜き"
          className="w-full bg-[#fafafa] rounded-2xl p-4 text-[14px] font-bold border-2 border-transparent focus:border-black outline-none transition-all"
          value={formData.twitterId}
          onChange={(e) => onChange({ twitterId: e.target.value })}
        />
      </div>
    </div>
    <div className="space-y-1.5">
      <p className="text-[8px] font-black text-gray-400 ml-1 uppercase">
        Full Name (Real)
      </p>
      <input
        type="text"
        placeholder="発送先氏名"
        className="w-full bg-[#fafafa] rounded-2xl p-4 text-[14px] font-bold border-2 border-transparent focus:border-black outline-none transition-all"
        value={formData.realName}
        onChange={(e) => onChange({ realName: e.target.value })}
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <p className="text-[8px] font-black text-[#ff8da1] ml-1 uppercase">
          Receiving (Get)
        </p>
        <input
          type="text"
          className="w-full bg-[#fffcfd] border-2 border-[#ffdce5] rounded-2xl p-4 text-[14px] font-bold outline-none"
          value={formData.receivingItem}
          onChange={(e) => onChange({ receivingItem: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <p className="text-[8px] font-black text-gray-400 ml-1 uppercase">
          Giving (Give)
        </p>
        <input
          type="text"
          className="w-full bg-[#fafafa] rounded-2xl p-4 text-[14px] font-bold border-2 border-transparent focus:border-black outline-none transition-all"
          value={formData.givingItem}
          onChange={(e) => onChange({ givingItem: e.target.value })}
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <p className="text-[8px] font-black text-black ml-1 uppercase">
          My Status
        </p>
        <select
          className="w-full bg-[#fafafa] rounded-2xl p-4 text-[14px] font-black appearance-none border-2 border-transparent outline-none focus:border-black transition-all"
          value={formData.myStatus}
          onChange={(e) => onChange({ myStatus: e.target.value as Status })}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <p className="text-[8px] font-black text-black ml-1 uppercase">
          Partner Status
        </p>
        <select
          className="w-full bg-[#fafafa] rounded-2xl p-4 text-[14px] font-black appearance-none border-2 border-transparent outline-none focus:border-black transition-all"
          value={formData.partnerStatus}
          onChange={(e) => onChange({ partnerStatus: e.target.value as Status })}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="space-y-1.5">
      <p className="text-[8px] font-black text-gray-400 ml-1 uppercase">
        Notes / Memo
      </p>
      <textarea
        className="w-full bg-[#fafafa] rounded-2xl p-4 text-[13px] font-medium border-2 border-transparent outline-none focus:border-black transition-all"
        rows={2}
        placeholder="予定など..."
        value={formData.notes}
        onChange={(e) => onChange({ notes: e.target.value })}
      />
    </div>
    <div className="flex flex-wrap gap-2 py-2">
      {([
        { id: 'ongoing' as Category, label: '進行中' },
        { id: 'dm' as Category, label: 'ＤＭ済' },
        { id: 'waiting' as Category, label: '待ち' },
        { id: 'completed' as Category, label: '完了' },
      ]).map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange({ category: cat.id })}
          className={`px-5 py-2.5 rounded-xl text-[10px] font-black border-2 transition-all ${
            formData.category === cat.id
              ? 'bg-black text-white border-black shadow-md'
              : 'bg-white text-gray-300 border-gray-100'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
    <button
      onClick={onSave}
      className="w-full bg-black text-white font-black py-5 rounded-[1.5rem] text-[15px] active:scale-95 transition-transform shadow-xl shadow-black/20"
    >
      データを保存
    </button>
  </div>
);
