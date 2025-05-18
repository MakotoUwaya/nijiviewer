'use client';

import Script from 'next/script';

const CookieBot = () => {
  return (
    <Script
      id="Cookiebot"
      src="https://consent.cookiebot.com/uc.js"
      data-cbid={process.env.NEXT_PUBLIC_COOKIEBOT_CBID}
      type="text/javascript"
      async
    />
  );
};

export default CookieBot;
