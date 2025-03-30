'use client';

import Clarity from '@microsoft/clarity';
import { useEffect } from 'react';

const MicrosoftClarity = () => {
  useEffect(() => {
    const clarityProjectId = 'qwauaog0rs';
    
    if (clarityProjectId) {
      Clarity.init(clarityProjectId);
    }
  }, []);

  return null;
};

export default MicrosoftClarity;