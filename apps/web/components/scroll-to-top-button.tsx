'use client';

import { Button } from '@heroui/react';
import { useEffect, useState } from 'react';

interface ScrollToTopButtonProps {
  /** スクロール位置がこの値を超えたときにボタンを表示する (デフォルト: 200) */
  threshold?: number;
}

export default function ScrollToTopButton({
  threshold = 200,
}: ScrollToTopButtonProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY >= threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!showScrollTop) {
    return null;
  }

  return (
    <Button
      isIconOnly
      className="fixed bottom-24 right-6 z-50 rounded-full shadow-lg"
      onPress={scrollToTop}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <title>上矢印アイコン</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 15.75l7.5-7.5 7.5 7.5"
        />
      </svg>
    </Button>
  );
}
