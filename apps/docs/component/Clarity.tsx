'use client';

import Clarity from '@microsoft/clarity';
import { useEffect } from 'react';

const MicrosoftClarity = () => {
  useEffect(() => {
    // cSpell:disable-next-line
    const clarityProjectId = 'qwauaog0rs';
    
    if (clarityProjectId) {
      Clarity.init(clarityProjectId);
    }
  }, []);

  return null;
};

export default MicrosoftClarity;