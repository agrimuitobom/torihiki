import { useEffect } from 'react';
import { ExchangeForm } from './ExchangeForm';
import { TemplateForm } from './TemplateForm';

export const Modal = ({
  modalType,
  formData,
  onFormChange,
  templateData,
  onTemplateChange,
  onSave,
  onClose,
  errors,
}) => {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end transition-all"
      onMouseDown={onClose}
    >
      <div
        className="bg-white w-full rounded-t-[2.5rem] p-8 pb-12 shadow-2xl overflow-y-auto max-h-[90vh] modal-up"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center mb-8 sticky top-0 bg-white z-10">
          <div className="w-12 h-1.5 bg-gray-100 rounded-full absolute -top-4 left-1/2 -translate-x-1/2" />
          <h2 className="text-sm font-black italic tracking-widest border-l-4 border-[#ffb8c6] pl-3 uppercase">
            {modalType === 'exchange' ? 'Trade Data' : 'Text Template'}
          </h2>
          <button
            onClick={onClose}
            className="text-[10px] font-black bg-gray-50 px-4 py-2 rounded-full text-gray-400 active:text-black transition-colors uppercase"
          >
            Cancel
          </button>
        </header>

        {modalType === 'exchange' ? (
          <ExchangeForm
            formData={formData}
            onChange={onFormChange}
            onSave={onSave}
            errors={errors}
          />
        ) : (
          <TemplateForm
            templateData={templateData}
            onChange={onTemplateChange}
            onSave={onSave}
            errors={errors}
          />
        )}
      </div>
    </div>
  );
};
