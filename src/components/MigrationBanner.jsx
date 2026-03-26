export const MigrationBanner = ({ onMigrate, onDismiss }) => (
  <div className="bg-[#fff5f7] border border-[#ffdce5] rounded-2xl p-4 space-y-3">
    <p className="text-[11px] font-bold text-gray-600 leading-relaxed">
      このブラウザにローカルデータが見つかりました。クラウドに移行しますか？
    </p>
    <div className="flex gap-2">
      <button
        onClick={onMigrate}
        className="flex-1 py-2.5 rounded-xl text-[10px] font-black bg-black text-white active:scale-95 transition-transform"
      >
        移行する
      </button>
      <button
        onClick={onDismiss}
        className="flex-1 py-2.5 rounded-xl text-[10px] font-black bg-gray-100 text-gray-400 active:bg-gray-200 transition-colors"
      >
        あとで
      </button>
    </div>
  </div>
);
