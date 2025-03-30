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
  ],
  links: {
    github: 'https://github.com/MakotoUwaya/nijiviewer',
    docs: 'https://docs.mukwty.com',
  },
};
