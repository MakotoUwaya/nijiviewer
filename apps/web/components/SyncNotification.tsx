'use client';

import { useEffect, useState } from 'react';

interface SyncNotificationProps {
  show: boolean;
  message: string;
}

export function SyncNotification({ show, message }: SyncNotificationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
      {message}
    </div>
  );
}
