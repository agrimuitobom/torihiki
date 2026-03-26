import { TABS } from '../constants';

export const TabNav = ({ activeTab, onTabChange }) => (
  <nav className="flex w-full bg-white border border-[#ffdce5] rounded-xl p-1 shadow-sm sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-20">
    {TABS.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`flex-1 py-2 text-[10px] font-black transition-all rounded-lg ${
          activeTab === tab.id ? 'bg-black text-white' : 'bg-white text-gray-400'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </nav>
);
