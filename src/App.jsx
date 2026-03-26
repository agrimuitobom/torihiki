import { useState, useCallback, useEffect, useMemo } from 'react';
import { EMPTY_EXCHANGE, EMPTY_TEMPLATE } from './constants';
import { copyToClipboard } from './utils/clipboard';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useToast } from './hooks/useToast';
import { useConfirm } from './hooks/useConfirm';
import { Icon } from './components/Icon';
import { Toast } from './components/Toast';
import { SummarySection } from './components/SummarySection';
import { TabNav } from './components/TabNav';
import { ExchangeCard } from './components/ExchangeCard';
import { TemplateCard } from './components/TemplateCard';
import { Modal } from './components/Modal';

const App = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [exchanges, setExchanges] = useLocalStorage('exchanges', []);
  const [templates, setTemplates] = useLocalStorage('templates', []);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('exchange');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_EXCHANGE });
  const [templateData, setTemplateData] = useState({ ...EMPTY_TEMPLATE });
  const [errors, setErrors] = useState({});

  const { toast, showToast } = useToast();
  const { confirm, ConfirmUI } = useConfirm();

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  const stats = useMemo(
    () => ({
      ongoing: exchanges.filter((e) => e.category === 'ongoing').length,
      dm: exchanges.filter((e) => e.category === 'dm').length,
      waiting: exchanges.filter((e) => e.category === 'waiting').length,
      completed: exchanges.filter((e) => e.category === 'completed').length,
    }),
    [exchanges],
  );

  const openAddModal = useCallback(() => {
    setEditingItem(null);
    setErrors({});
    const type = activeTab === 'templates' ? 'template' : 'exchange';
    setModalType(type);
    setFormData({
      ...EMPTY_EXCHANGE,
      category: activeTab === 'templates' ? 'ongoing' : activeTab,
    });
    setTemplateData({ ...EMPTY_TEMPLATE });
    setShowModal(true);
  }, [activeTab]);

  const openEditExchange = useCallback((item) => {
    setEditingItem(item);
    setErrors({});
    setFormData({ ...item });
    setModalType('exchange');
    setShowModal(true);
  }, []);

  const openEditTemplate = useCallback((item) => {
    setEditingItem(item);
    setErrors({});
    setTemplateData({ ...item });
    setModalType('template');
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingItem(null);
    setErrors({});
  }, []);

  const validate = useCallback(() => {
    const errs = {};
    if (modalType === 'exchange') {
      if (!formData.accountName.trim())
        errs.accountName = '名前を入力してください';
    } else {
      if (!templateData.title.trim())
        errs.title = 'タイトルを入力してください';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [modalType, formData, templateData]);

  const handleSave = useCallback(() => {
    if (!validate()) return;
    if (modalType === 'exchange') {
      if (editingItem) {
        setExchanges((prev) =>
          prev.map((e) =>
            e.id === editingItem.id ? { ...formData, id: e.id } : e,
          ),
        );
      } else {
        setExchanges((prev) => [...prev, { ...formData, id: Date.now() }]);
      }
      showToast('取引データを保存しました');
    } else {
      if (editingItem) {
        setTemplates((prev) =>
          prev.map((t) =>
            t.id === editingItem.id ? { ...templateData, id: t.id } : t,
          ),
        );
      } else {
        setTemplates((prev) => [
          ...prev,
          { ...templateData, id: Date.now() },
        ]);
      }
      showToast('定型文を保存しました');
    }
    closeModal();
  }, [
    modalType,
    editingItem,
    formData,
    templateData,
    validate,
    closeModal,
    showToast,
  ]);

  const deleteExchange = useCallback(
    async (id) => {
      const ok = await confirm(
        'この取引データを削除しますか？\nこの操作は元に戻せません。',
      );
      if (!ok) return;
      setExchanges((prev) => prev.filter((e) => e.id !== id));
      showToast('削除しました');
    },
    [confirm, showToast],
  );

  const deleteTemplate = useCallback(
    async (id) => {
      const ok = await confirm(
        'この定型文を削除しますか？\nこの操作は元に戻せません。',
      );
      if (!ok) return;
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      showToast('削除しました');
    },
    [confirm, showToast],
  );

  const handleFormChange = useCallback(
    (patch) => {
      setFormData((prev) => ({ ...prev, ...patch }));
      const keys = Object.keys(patch);
      if (keys.some((k) => errors[k])) {
        setErrors((prev) => {
          const next = { ...prev };
          keys.forEach((k) => delete next[k]);
          return next;
        });
      }
    },
    [errors],
  );

  const handleTemplateChange = useCallback(
    (patch) => {
      setTemplateData((prev) => ({ ...prev, ...patch }));
      const keys = Object.keys(patch);
      if (keys.some((k) => errors[k])) {
        setErrors((prev) => {
          const next = { ...prev };
          keys.forEach((k) => delete next[k]);
          return next;
        });
      }
    },
    [errors],
  );

  const handleCopy = useCallback(
    async (text, label = 'コピーしました') => {
      await copyToClipboard(text);
      showToast(label);
    },
    [showToast],
  );

  const visibleExchanges = exchanges.filter((e) => e.category === activeTab);

  return (
    <div className="min-h-screen flex flex-col pb-20 overflow-x-hidden">
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-100 safe-top sticky top-0 z-30">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-black rounded-full" />
            <h1 className="text-sm font-black italic tracking-tighter">
              取引管理
            </h1>
          </div>
          <button
            onClick={openAddModal}
            className="bg-black text-white w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-black/10"
          >
            <Icon name="Plus" size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto w-full p-4 space-y-4">
        <SummarySection stats={stats} />
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="space-y-4">
          {activeTab === 'templates' ? (
            templates.length === 0 ? (
              <p className="text-center py-10 text-gray-300 text-[10px] font-bold italic">
                データがありません
              </p>
            ) : (
              templates.map((item) => (
                <TemplateCard
                  key={item.id}
                  item={item}
                  onEdit={openEditTemplate}
                  onDelete={deleteTemplate}
                  onCopy={handleCopy}
                />
              ))
            )
          ) : visibleExchanges.length === 0 ? (
            <p className="text-center py-10 text-gray-300 text-[10px] font-bold italic">
              データがありません
            </p>
          ) : (
            visibleExchanges.map((item) => (
              <ExchangeCard
                key={item.id}
                item={item}
                onEdit={openEditExchange}
                onDelete={deleteExchange}
                onCopy={handleCopy}
              />
            ))
          )}
        </div>
      </main>

      {showModal && (
        <Modal
          modalType={modalType}
          formData={formData}
          onFormChange={handleFormChange}
          templateData={templateData}
          onTemplateChange={handleTemplateChange}
          onSave={handleSave}
          onClose={closeModal}
          errors={errors}
        />
      )}

      {ConfirmUI}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
};

export default App;
