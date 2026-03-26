import React from 'react';
import type { TemplateFormData } from '../types';

interface TemplateFormProps {
  templateData: TemplateFormData;
  onChange: (patch: Partial<TemplateFormData>) => void;
  onSave: () => void;
  errors?: Record<string, string>;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({ templateData, onChange, onSave, errors = {} }) => (
  <div className="space-y-5 pb-6">
    <div className="space-y-1.5">
      <p className="text-[8px] font-black text-gray-400 ml-1 uppercase">
        Template Title
      </p>
      <input
        placeholder="タイトル"
        className={`w-full bg-[#fafafa] rounded-2xl p-4 text-[14px] font-black outline-none border-2 transition-all ${
          errors.title
            ? 'border-red-400 bg-red-50'
            : 'border-transparent focus:border-black'
        }`}
        value={templateData.title}
        onChange={(e) => onChange({ title: e.target.value })}
      />
      {errors.title && (
        <p className="text-[9px] text-red-400 font-bold ml-1">
          {errors.title}
        </p>
      )}
    </div>
    <div className="space-y-1.5">
      <p className="text-[8px] font-black text-gray-400 ml-1 uppercase">
        Body Content
      </p>
      <textarea
        placeholder="定型文を入力..."
        rows={8}
        className="w-full bg-[#fafafa] rounded-2xl p-4 text-[13px] font-medium outline-none border-2 border-transparent focus:border-black transition-all"
        value={templateData.content}
        onChange={(e) => onChange({ content: e.target.value })}
      />
    </div>
    <button
      onClick={onSave}
      className="w-full bg-black text-white font-black py-5 rounded-[1.5rem] text-[15px] active:scale-95 transition-transform shadow-xl shadow-black/20"
    >
      定型文を保存
    </button>
  </div>
);
