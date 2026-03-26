interface Props {
  onGoogleLogin: () => void;
  onSkip: () => void;
}

export const LoginScreen = ({ onGoogleLogin, onSkip }: Props) => (
  <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#fffcfd]">
    <div className="w-full max-w-xs space-y-8 text-center">
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-2 h-6 bg-black rounded-full" />
          <h1 className="text-2xl font-black italic tracking-tighter">
            取引管理
          </h1>
        </div>
        <p className="text-[11px] font-bold text-gray-400">
          ログインするとクラウドにデータを保存できます
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={onGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-black text-white font-black py-4 rounded-2xl text-[13px] active:scale-95 transition-transform shadow-xl shadow-black/20"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Googleでログイン
        </button>

        <button
          onClick={onSkip}
          className="w-full py-3 text-[11px] font-black text-gray-400 active:text-black transition-colors"
        >
          ログインせずに使う（ローカル保存）
        </button>
      </div>

      <p className="text-[9px] text-gray-300 leading-relaxed">
        ログインせずに使う場合、データはこの端末のブラウザにのみ保存されます
      </p>
    </div>
  </div>
);
