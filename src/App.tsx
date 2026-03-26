import { useState, useCallback, useEffect, useMemo } from 'react';
import type { Exchange, Template, ExchangeFormData, TemplateFormData, TabId, Category } from './types';
import { EMPTY_EXCHANGE, EMPTY_TEMPLATE } from './constants';
import { copyToClipboard } from './utils/clipboard';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useToast } from './hooks/useToast';
import { useConfirm } from './hooks/useConfirm';
import { useAuth } from './hooks/useAuth';
import { useFirestore } from './hooks/useFirestore';
import {
  addExchange,
  updateExchange,
  deleteExchangeDoc,
  addTemplate,
  updateTemplate,
  deleteTemplateDoc,
  migrateFromLocalStorage,
  reorderExchanges,
  reorderTemplates,
} from './services/firestore';
import { Icon } from './components/Icon';
import { Toast } from './components/Toast';
import { SummarySection } from './components/SummarySection';
import { TabNav } from './components/TabNav';
import { ExchangeCard } from './components/ExchangeCard';
import { TemplateCard } from './components/TemplateCard';
import { Modal } from './components/Modal';
import { LoginScreen } from './components/LoginScreen';
import { MigrationBanner } from './components/MigrationBanner';
import { SearchBar } from './components/SearchBar';
import { SortableList } from './components/SortableList';

const App = () => {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [skippedLogin, setSkippedLogin] = useState(
    () => localStorage.getItem('skippedLogin') === 'true',
  );

  // Firestore (cloud) data
  const {
    exchanges: cloudExchanges,
    templates: cloudTemplates,
    loading: firestoreLoading,
  } = useFirestore(user?.uid);

  // localStorage (local) data
  const [localExchanges, setLocalExchanges] = useLocalStorage<Exchange[]>('exchanges', []);
  const [localTemplates, setLocalTemplates] = useLocalStorage<Template[]>('templates', []);

  // Migration banner
  const [showMigration, setShowMigration] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  const isCloud = !!user;
  const exchanges = isCloud ? cloudExchanges : localExchanges;
  const templates = isCloud ? cloudTemplates : localTemplates;
  const dataLoading = isCloud && firestoreLoading;

  // Show migration banner when user logs in and has local data
  useEffect(() => {
    if (user && (localExchanges.length > 0 || localTemplates.length > 0)) {
      setShowMigration(true);
    }
  }, [user, localExchanges.length, localTemplates.length]);

  const [activeTab, setActiveTab] = useState<TabId>('ongoing');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'exchange' | 'template'>('exchange');
  const [editingItem, setEditingItem] = useState<Exchange | Template | null>(null);
  const [formData, setFormData] = useState<ExchangeFormData>({ ...EMPTY_EXCHANGE });
  const [templateData, setTemplateData] = useState<TemplateFormData>({ ...EMPTY_TEMPLATE });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toast, showToast } = useToast();
  const { confirm, ConfirmUI } = useConfirm();

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  // Clear search when switching tabs
  useEffect(() => {
    setSearchQuery('');
  }, [activeTab]);

  const stats = useMemo(
    () => ({
      ongoing: exchanges.filter((e) => e.category === 'ongoing').length,
      dm: exchanges.filter((e) => e.category === 'dm').length,
      waiting: exchanges.filter((e) => e.category === 'waiting').length,
      completed: exchanges.filter((e) => e.category === 'completed').length,
    }),
    [exchanges],
  );

  // Filter exchanges by tab + search
  const visibleExchanges = useMemo(() => {
    let filtered = exchanges.filter((e) => e.category === activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.accountName?.toLowerCase().includes(q) ||
          e.twitterId?.toLowerCase().includes(q) ||
          e.realName?.toLowerCase().includes(q) ||
          e.receivingItem?.toLowerCase().includes(q) ||
          e.givingItem?.toLowerCase().includes(q) ||
          e.notes?.toLowerCase().includes(q),
      );
    }
    return filtered;
  }, [exchanges, activeTab, searchQuery]);

  // Filter templates by search
  const visibleTemplates = useMemo(() => {
    if (!searchQuery.trim()) return templates;
    const q = searchQuery.toLowerCase();
    return templates.filter(
      (t) =>
        t.title?.toLowerCase().includes(q) ||
        t.content?.toLowerCase().includes(q),
    );
  }, [templates, searchQuery]);

  const openAddModal = useCallback(() => {
    setEditingItem(null);
    setErrors({});
    const type = activeTab === 'templates' ? 'template' : 'exchange';
    setModalType(type);
    setFormData({
      ...EMPTY_EXCHANGE,
      category: activeTab === 'templates' ? 'ongoing' : activeTab as Category,
    });
    setTemplateData({ ...EMPTY_TEMPLATE });
    setShowModal(true);
  }, [activeTab]);

  const openEditExchange = useCallback((item: Exchange) => {
    setEditingItem(item);
    setErrors({});
    setFormData({ ...item });
    setModalType('exchange');
    setShowModal(true);
  }, []);

  const openEditTemplate = useCallback((item: Template) => {
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
    const errs: Record<string, string> = {};
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

  const handleSave = useCallback(async () => {
    if (!validate()) return;
    if (modalType === 'exchange') {
      if (isCloud) {
        if (editingItem) {
          await updateExchange(user!.uid, editingItem.id, formData);
        } else {
          await addExchange(user!.uid, formData);
        }
      } else {
        if (editingItem) {
          setLocalExchanges((prev) =>
            prev.map((e) =>
              e.id === editingItem.id ? { ...formData, id: e.id } : e,
            ),
          );
        } else {
          setLocalExchanges((prev) => [
            ...prev,
            { ...formData, id: Date.now() },
          ]);
        }
      }
      showToast('取引データを保存しました');
    } else {
      if (isCloud) {
        if (editingItem) {
          await updateTemplate(user!.uid, editingItem.id, templateData);
        } else {
          await addTemplate(user!.uid, templateData);
        }
      } else {
        if (editingItem) {
          setLocalTemplates((prev) =>
            prev.map((t) =>
              t.id === editingItem.id ? { ...templateData, id: t.id } : t,
            ),
          );
        } else {
          setLocalTemplates((prev) => [
            ...prev,
            { ...templateData, id: Date.now() },
          ]);
        }
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
    isCloud,
    user,
  ]);

  const deleteExchange = useCallback(
    async (id: string | number) => {
      const ok = await confirm(
        'この取引データを削除しますか？\nこの操作は元に戻せません。',
      );
      if (!ok) return;
      if (isCloud) {
        await deleteExchangeDoc(user!.uid, id);
      } else {
        setLocalExchanges((prev) => prev.filter((e) => e.id !== id));
      }
      showToast('削除しました');
    },
    [confirm, showToast, isCloud, user],
  );

  const deleteTemplate = useCallback(
    async (id: string | number) => {
      const ok = await confirm(
        'この定型文を削除しますか？\nこの操作は元に戻せません。',
      );
      if (!ok) return;
      if (isCloud) {
        await deleteTemplateDoc(user!.uid, id);
      } else {
        setLocalTemplates((prev) => prev.filter((t) => t.id !== id));
      }
      showToast('削除しました');
    },
    [confirm, showToast, isCloud, user],
  );

  const handleFormChange = useCallback(
    (patch: Partial<ExchangeFormData>) => {
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
    (patch: Partial<TemplateFormData>) => {
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
    async (text: string, label = 'コピーしました') => {
      await copyToClipboard(text);
      showToast(label);
    },
    [showToast],
  );

  const handleMigrate = useCallback(async () => {
    const count = await migrateFromLocalStorage(user!.uid);
    setShowMigration(false);
    setLocalExchanges([]);
    setLocalTemplates([]);
    showToast(`${count}件のデータをクラウドに移行しました`);
  }, [user, showToast]);

  const handleSkipLogin = useCallback(() => {
    localStorage.setItem('skippedLogin', 'true');
    setSkippedLogin(true);
  }, []);

  const handleLogin = useCallback(async () => {
    localStorage.removeItem('skippedLogin');
    setSkippedLogin(false);
    await signInWithGoogle();
  }, [signInWithGoogle]);

  const handleLogout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  // Drag & drop reorder
  const handleReorderExchanges = useCallback(
    (reordered: Exchange[]) => {
      if (isCloud) {
        reorderExchanges(user!.uid, reordered);
      } else {
        // Rebuild full list with reordered items in the current tab
        setLocalExchanges((prev) => {
          const otherTabs = prev.filter((e) => e.category !== activeTab);
          return [...otherTabs, ...reordered];
        });
      }
    },
    [isCloud, user, activeTab],
  );

  const handleReorderTemplates = useCallback(
    (reordered: Template[]) => {
      if (isCloud) {
        reorderTemplates(user!.uid, reordered);
      } else {
        setLocalTemplates(reordered);
      }
    },
    [isCloud, user],
  );

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Login screen
  if (!user && !skippedLogin) {
    return (
      <LoginScreen onGoogleLogin={signInWithGoogle} onSkip={handleSkipLogin} />
    );
  }

  const isSearching = searchQuery.trim().length > 0;

  const renderExchangeCard = (item: Exchange) => (
    <ExchangeCard
      item={item}
      onEdit={openEditExchange}
      onDelete={deleteExchange}
      onCopy={handleCopy}
    />
  );

  const renderTemplateCard = (item: Template) => (
    <TemplateCard
      item={item}
      onEdit={openEditTemplate}
      onDelete={deleteTemplate}
      onCopy={handleCopy}
    />
  );

  return (
    <div className="min-h-screen flex flex-col pb-20 overflow-x-hidden">
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-100 safe-top sticky top-0 z-30">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-1.5 h-4 bg-black rounded-full" />
            <h1 className="text-sm font-black italic tracking-tighter">
              取引管理
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            {user ? (
              <button
                onClick={handleLogout}
                className="text-[9px] font-bold text-gray-400 px-3 py-1.5 rounded-full border border-gray-200 active:bg-gray-100 transition-colors shrink-0"
              >
                ログアウト
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="text-[9px] font-bold text-[#ff8da1] px-3 py-1.5 rounded-full border border-[#ffdce5] active:bg-[#fff5f7] transition-colors shrink-0"
              >
                ログイン
              </button>
            )}
            <button
              onClick={openAddModal}
              className="bg-black text-white w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-black/10 shrink-0"
            >
              <Icon name="Plus" size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto w-full p-4 space-y-4">
        {showMigration && (
          <MigrationBanner
            onMigrate={handleMigrate}
            onDismiss={() => setShowMigration(false)}
          />
        )}

        <SummarySection stats={stats} />
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

        {dataLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'templates' ? (
              visibleTemplates.length === 0 ? (
                <p className="text-center py-10 text-gray-300 text-[10px] font-bold italic">
                  {isSearching ? '検索結果がありません' : 'データがありません'}
                </p>
              ) : isSearching ? (
                visibleTemplates.map((item) => (
                  <div key={item.id}>{renderTemplateCard(item)}</div>
                ))
              ) : (
                <SortableList
                  items={visibleTemplates}
                  onReorder={handleReorderTemplates}
                  renderItem={renderTemplateCard}
                />
              )
            ) : visibleExchanges.length === 0 ? (
              <p className="text-center py-10 text-gray-300 text-[10px] font-bold italic">
                {isSearching ? '検索結果がありません' : 'データがありません'}
              </p>
            ) : isSearching ? (
              visibleExchanges.map((item) => (
                <div key={item.id}>{renderExchangeCard(item)}</div>
              ))
            ) : (
              <SortableList
                items={visibleExchanges}
                onReorder={handleReorderExchanges}
                renderItem={renderExchangeCard}
              />
            )}
          </div>
        )}
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
