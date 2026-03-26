import { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

export const SearchBar = ({ value, onChange }) => {
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  const handleClose = () => {
    setExpanded(false);
    onChange('');
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="p-2 text-gray-400 active:text-black transition-colors"
      >
        <Icon name="Search" size={18} />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-[#fafafa] rounded-full px-3 py-1.5 border border-gray-200 flex-1 ml-2">
      <Icon name="Search" size={14} className="text-gray-300 shrink-0" />
      <input
        ref={inputRef}
        type="text"
        placeholder="名前・IDで検索..."
        className="bg-transparent text-[12px] font-bold outline-none w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        onClick={handleClose}
        className="text-gray-300 active:text-black shrink-0"
      >
        <Icon name="Close" size={14} />
      </button>
    </div>
  );
};
