export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'NijiViewer',
  description: "Get addicted to Nijisanji's swamp.",
  navItems: [
    {
      label: 'Live Videos',
      href: '/live-videos/Nijisanji',
    },
    {
      label: 'Flow Sample',
      href: '/flow-sample',
    },
    {
      label: 'おしゃべり音声モデル',
      href: '/aivis-cloud-api',
    },
  ],
  navMenuItems: [
    {
      label: 'Live Videos',
      href: '/live-videos/Nijisanji',
    },
    {
      label: 'Flow Sample',
      href: '/flow-sample',
    },
    {
      label: 'おしゃべり音声モデル',
      href: '/aivis-cloud-api',
    },
  ],
  links: {
    github: 'https://github.com/MakotoUwaya/nijiviewer',
    docs: 'https://docs.mukwty.com',
  },
};
