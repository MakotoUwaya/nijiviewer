'use client';

import { GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';

const GoogleAnalytics = () => {
  return (
    <>
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Google Analytics の初期化に必要
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
          `,
        }}
      />
      <GoogleTagManager
        gtmId={`${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER}`}
      />
    </>
  );
};

export default GoogleAnalytics;
