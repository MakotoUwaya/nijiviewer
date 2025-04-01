'use client';

import Clarity from '@microsoft/clarity';
import { useEffect } from 'react';

const MicrosoftClarity = () => {
  useEffect(() => {
    const clarityProjectId = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY;

    if (clarityProjectId) {
      Clarity.init(clarityProjectId);
    }
  }, []);

  return null;
};

export default MicrosoftClarity;
