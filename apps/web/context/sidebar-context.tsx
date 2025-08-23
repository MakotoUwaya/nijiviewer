'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface SidebarContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isMobile: boolean;
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320); // デフォルト320px
  useEffect(() => {
    // Tailwindのlgブレークポイント (1024px) を使用
    const lgMediaQuery = window.matchMedia('(min-width: 1024px)');

    const checkMobile = () => {
      const mobile = !lgMediaQuery.matches;
      setIsMobile(mobile);

      // レスポンシブな幅の設定
      if (mobile) {
        // モバイル: 画面幅の85%、最大320px、最小280px
        const mobileWidth = Math.min(
          320,
          Math.max(280, window.innerWidth * 0.85),
        );
        setSidebarWidth(mobileWidth);
      } else {
        // デスクトップ: 画面幅に応じて調整、最大400px、最小320px
        const desktopWidth = Math.min(
          400,
          Math.max(320, window.innerWidth * 0.2),
        );
        setSidebarWidth(desktopWidth);
      }
    };

    // debounceを使用してリサイズハンドラーを最適化
    let timeoutId: NodeJS.Timeout;
    const debouncedCheckMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };

    // 初期チェック
    checkMobile();

    // メディアクエリの変更を監視
    lgMediaQuery.addEventListener('change', checkMobile);

    // リサイズイベントも監視（幅の計算のため）- debounced
    window.addEventListener('resize', debouncedCheckMobile);

    return () => {
      lgMediaQuery.removeEventListener('change', checkMobile);
      window.removeEventListener('resize', debouncedCheckMobile);
      clearTimeout(timeoutId);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        isMobile,
        sidebarWidth,
        setSidebarWidth,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
